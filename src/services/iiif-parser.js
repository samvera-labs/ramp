import { parseManifest, PropertyValue } from 'manifesto.js';
import mimeDb from 'mime-db';
import sanitizeHtml from 'sanitize-html';
import {
  GENERIC_ERROR_MESSAGE,
  checkSrcRange,
  getAnnotations,
  getLabelValue,
  getMediaFragment,
  getResourceItems,
  parseAnnotations,
  parseSequences,
  setCanvasMessageTimeout,
  timeToHHmmss
} from './utility-helpers';

// HTML tags and attributes allowed in IIIF
const HTML_SANITIZE_CONFIG = {
  allowedTags: ['a', 'b', 'br', 'i', 'img', 'p', 'small', 'span', 'sub', 'sup'],
  allowedAttributes: { 'a': ['href'], 'img': ['src', 'alt'] },
  allowedSchemesByTag: { 'a': ['http', 'https', 'mailto'] }
};

/**
 * Get all the canvases in manifest
 * @function IIIFParser#canvasesInManifest
 * @return {Array} array of canvas IDs in manifest
 **/
export function canvasesInManifest(manifest) {
  let canvasesInfo = [];
  try {
    const canvases = parseSequences(manifest)[0].getCanvases();
    if (canvases === undefined) {
      console.error(
        'iiif-parser -> canvasesInManifest() -> no canvases were found in Manifest'
      );
      throw new Error(GENERIC_ERROR_MESSAGE);
    } else {
      canvases.map((canvas) => {
        let summary = undefined;
        let summaryProperty = canvas.getProperty('summary');
        if (summaryProperty) {
          summary = PropertyValue.parse(summaryProperty).getValue();
        }
        let homepage = undefined;
        let homepageProperty = canvas.getProperty('homepage');
        if (homepageProperty && homepageProperty?.length > 0) {
          homepage = homepageProperty[0].id;
        }
        try {
          let sources = canvas
            .getContent()[0]
            .getBody()
            .map((source) => source.id);
          const canvasDuration = Number(canvas.getDuration());
          let timeFragment;
          if (sources?.length > 0) {
            timeFragment = getMediaFragment(sources[0], canvasDuration);
          }
          canvasesInfo.push({
            canvasId: canvas.id,
            range: timeFragment === undefined ? { start: 0, end: canvasDuration } : timeFragment,
            isEmpty: sources.length === 0 ? true : false,
            summary: summary,
            homepage: homepage || ''
          });
        } catch (error) {
          canvasesInfo.push({
            canvasId: canvas.id,
            range: undefined, // set range to undefined, use this check to set duration in UI
            isEmpty: true,
            summary: summary,
            homepage: homepage || ''
          });
        }
      });
      return canvasesInfo;
    }
  }
  catch (error) {
    throw error;
  }
}

/**
 * Get isMultiCanvas and last canvas index information from the
 * given Manifest
 * @param {Object} manifest
 * @returns {Object} { isMultiCanvas: Boolean, lastIndex: Number }
 */
export function manifestCanvasesInfo(manifest) {
  try {
    const sequences = parseSequences(manifest);
    let isMultiCanvas = false;
    let lastPageIndex = 0;
    if (sequences.length > 0) {
      isMultiCanvas = sequences[0].isMultiCanvas();
      lastPageIndex = sequences[0].getLastPageIndex();
    }
    return {
      isMultiCanvas,
      lastIndex: lastPageIndex > -1 ? lastPageIndex : 0
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get canvas index by using the canvas id
 * @param {Object} manifest
 * @param {String} canvasId
 * @returns {Number} canvasindex
 */
export function getCanvasIndex(manifest, canvasId) {
  try {
    const sequences = parseSequences(manifest);
    let canvasindex = sequences[0].getCanvasIndexById(canvasId);
    if (canvasindex || canvasindex === 0) {
      return canvasindex;
    } else {
      console.log('Canvas not found in Manifest, ', canvasId);
      return 0;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @param {Number} obj.srcIndex Index of the resource in active canvas
 * @returns {Object} { soures, tracks, targets, isMultiSource, error, canvas, mediaType }
 */
export function getMediaInfo({ manifest, canvasIndex, srcIndex = 0 }) {
  let canvas = [];
  let sources, tracks = [];

  // return empty object when canvasIndex is undefined
  if (canvasIndex === undefined || canvasIndex < 0) {
    return { error: 'Error fetching content' };
  }

  // Get the canvas with the given canvasIndex
  try {
    canvas = parseSequences(manifest)[0]
      .getCanvasByIndex(canvasIndex);

    if (canvas === undefined) {
      console.error(
        'iiif-parser -> getMediaInfo() -> canvas undefined  -> ', canvasIndex
      );
      throw new Error(GENERIC_ERROR_MESSAGE);
    }
    const duration = Number(canvas.getDuration());

    // Read painting resources from annotations
    const { resources, canvasTargets, isMultiSource, error } = readAnnotations({
      manifest,
      canvasIndex,
      key: 'items',
      motivation: 'painting',
      duration
    });
    // Set default src to auto
    sources = setDefaultSrc(resources, isMultiSource, srcIndex);

    // Read supplementing resources fom annotations
    const supplementingRes = readAnnotations({
      manifest,
      canvasIndex,
      key: 'annotations',
      motivation: 'supplementing',
      duration
    });
    tracks = supplementingRes ? supplementingRes.resources : [];

    const mediaInfo = {
      sources,
      tracks,
      canvasTargets,
      isMultiSource,
      error,
      canvas: {
        duration: duration,
        height: canvas.getHeight(),
        width: canvas.getWidth(),
      },
    };

    if (mediaInfo.error) {
      return { ...mediaInfo };
    } else {
      // Get media type
      let allTypes = mediaInfo.sources.map((q) => q.kind);
      const mediaType = setMediaType(allTypes);
      return {
        ...mediaInfo,
        error: null,
        mediaType,
      };
    }
  } catch (error) {
    throw error;
  }
}

function readAnnotations({ manifest, canvasIndex, key, motivation, duration }) {
  const annotations = getAnnotations({
    manifest,
    canvasIndex,
    key,
    motivation
  });
  return getResourceItems(annotations, duration, motivation);
}

/**
 * Mark the default src file when multiple src files are present
 * @param {Array} sources source file information in canvas
 * @returns source file information with one marked as default
 */
function setDefaultSrc(sources, isMultiSource, srcIndex) {
  let isSelected = false;
  if (sources.length === 0) {
    return [];
  }
  // Mark source with quality label 'auto' as selected source
  if (!isMultiSource) {
    for (let s of sources) {
      if (s.label == 'auto' && !isSelected) {
        isSelected = true;
        s.selected = true;
      }
    }
    // Mark first source as selected when 'auto' quality is not present
    if (!isSelected) {
      sources[0].selected = true;
    }
  } else {
    sources[srcIndex].selected = true;
  }

  return sources;
}

function setMediaType(types) {
  let uniqueTypes = types.filter((t, index) => {
    return types.indexOf(t) === index;
  });
  // Default type if there are different types
  const mediaType =
    uniqueTypes.length === 1 ? uniqueTypes[0].toLowerCase() : 'video';
  return mediaType;
}

/**
 * Get the canvas ID from the URI of the clicked structure item
 * @param {String} uri URI of the item clicked in structure
 */
export function getCanvasId(uri) {
  if (uri !== undefined) {
    return uri.split('#t=')[0];
  }
}

/**
 * Get placeholderCanvas value for images and text messages
 * @param {Object} manifest
 * @param {Number} canvasIndex
 * @param {Boolean} isPoster
 */
export function getPlaceholderCanvas(manifest, canvasIndex, isPoster = false) {
  let placeholder;
  try {
    let canvases = parseSequences(manifest);
    if (canvases?.length > 0) {
      let canvas = canvases[0].getCanvasByIndex(canvasIndex);
      let placeholderCanvas = canvas.__jsonld['placeholderCanvas'];
      if (placeholderCanvas) {
        let annotations = placeholderCanvas['items'];
        let items = parseAnnotations(annotations, 'painting');
        if (items.length > 0) {
          const item = items[0].getBody()[0];
          if (isPoster) {
            placeholder = item.getType() == 'image' ? item.id : null;
          } else {
            placeholder = item.getLabel().getValue()
              ? getLabelValue(item.getLabel().getValue())
              : 'This item cannot be played.';
            setCanvasMessageTimeout(placeholderCanvas['duration']);
          }
          return placeholder;
        }
      } else if (!isPoster) {
        console.error(
          'iiif-parser -> getPlaceholderCanvas() -> placeholderCanvas property not defined'
        );
        return 'This item cannot be played.';
      } else {
        return null;
      }
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Parse 'start' property in manifest if it is given, or use
 * startCanvasId and startCanvasTime props in IIIFPlayer component
 * to set the starting Canvas and time in Ramp on initialization
 * In the spec there are 2 ways to specify 'start' property:
 * https://iiif.io/api/presentation/3.0/#start
 * Cookbook recipe for reference: https://iiif.io/api/cookbook/recipe/0015-start/
 * @param {Object} manifest
 * @param {String} startCanvasId from IIIFPlayer props
 * @param {Number} startCanvasTime from IIIFPlayer props
 * @returns {Object}
 */
export function getCustomStart(manifest, startCanvasId, startCanvasTime) {
  let manifestStartProp = parseManifest(manifest).getProperty('start');
  let startProp = {};
  let currentCanvasIndex = 0;
  // When none of the variable are set, return default values all set to zero
  if (!manifestStartProp && startCanvasId === undefined && startCanvasTime === undefined) {
    return { type: 'C', canvas: currentCanvasIndex, time: 0 };
  } else if (startCanvasId != undefined || startCanvasTime != undefined) {
    // Read user specified props from IIIFPlayer component
    startProp = {
      id: startCanvasId,
      selector: { type: 'PointSelector', t: startCanvasTime === undefined ? 0 : startCanvasTime },
      type: startCanvasTime === undefined ? 'Canvas' : 'SpecificResource'
    };
    // Set source property in the object for SpecificResource type
    if (startCanvasTime != undefined) startProp.source = startCanvasId;
  } else if (manifestStartProp) {
    // Read 'start' property in Manifest when it exitsts
    startProp = parseManifest(manifest).getProperty('start');
  }

  const canvases = canvasesInManifest(manifest);
  // Map given information in start property or user props to
  // Canvas information in the given Manifest
  let getCanvasInfo = (canvasId, time) => {
    let startTime = time;
    let currentIndex;

    if (canvases != undefined && canvases?.length > 0) {
      if (canvasId === undefined) {
        currentIndex = 0;
      } else {
        currentIndex = canvases.findIndex((c) => {
          return c.canvasId === canvasId;
        });
      }
      if (currentIndex === undefined || currentIndex < 0) {
        console.error(
          'iiif-parser -> getCustomStart() -> given canvas ID was not in Manifest, '
          , startCanvasId
        );
        return { currentIndex: 0, startTime: 0 };
      } else {
        const currentCanvas = canvases[currentIndex];
        if (currentCanvas.range != undefined) {
          const { start, end } = currentCanvas.range;
          if (!(time >= start && time <= end)) {
            console.error(
              'iiif-parser -> getCustomStart() -> given canvas start time is not within Canvas duration, '
              , startCanvasTime
            );
            startTime = 0;
          }
        }
        return { currentIndex, startTime };
      }
    } else {
      console.error(
        'iiif-parser -> getCustomStart() -> no Canvases in given Manifest'
      );
      return { currentIndex: 0, startTime: 0 };
    }
  };
  if (startProp != undefined) {
    switch (startProp.type) {
      case 'Canvas':
        let canvasInfo = getCanvasInfo(startProp.id, 0);
        return { type: 'C', canvas: canvasInfo.currentIndex, time: canvasInfo.startTime };
      case 'SpecificResource':
        let customStart = startProp.selector.t;
        canvasInfo = getCanvasInfo(startProp.source, customStart);
        return { type: 'SR', canvas: canvasInfo.currentIndex, time: canvasInfo.startTime };
    }
  }
}

function buildFileInfo(format, labelInput, id) {
  const mime = mimeDb[format];
  const extension = mime ? mime.extensions[0] : format;
  let label = '';
  let filename = '';
  if (Object.keys(labelInput).length > 1) {
    label = labelInput[Object.keys(labelInput)[0]][0];
    filename = labelInput['none'][0];
  } else {
    label = getLabelValue(labelInput);
    filename = label;
  }
  const isMachineGen = label.includes('(machine generated)');
  const file = {
    id: id,
    label: `${label} (.${extension})`,
    filename: filename,
    fileExt: extension,
    isMachineGen: isMachineGen,
  };
  return file;
};

/**
 * Retrieve the list of alternative representation files in manifest or canvas
 * level to make available to download
 * @param {Object} manifest
 * @returns {Object} List of files under `rendering` property in manifest and canvases
 */
export function getRenderingFiles(manifest) {
  try {
    let manifestFiles = [];
    let canvasFiles = [];
    const manifestParsed = parseManifest(manifest);
    let manifestRendering = manifestParsed.getRenderings();

    let canvases = parseSequences(manifest)[0]
      .getCanvases();

    if (manifestRendering != undefined && manifestRendering != null) {
      manifestRendering.map((r) => {
        const file = buildFileInfo(r.getFormat(), r.getProperty('label'), r.id);
        manifestFiles.push(file);
      });
    }

    if (canvases != undefined && canvases != null) {
      canvases.map((canvas, index) => {
        let canvasRendering = canvas.__jsonld.rendering;
        let files = [];
        if (canvasRendering) {
          canvasRendering.map((r) => {
            const file = buildFileInfo(r.format, r.label, r.id);
            files.push(file);
          });
        }
        // Use label of canvas or fallback to canvas id
        let canvasLabel = canvas.getLabel().getValue() || "Section " + (index + 1);
        canvasFiles.push({ label: getLabelValue(canvasLabel), files: files });
      });
    }
    return { manifest: manifestFiles, canvas: canvasFiles };
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Object} manifest
 * @param {Boolean} readCanvasMetadata read metadata from Canvas level
 * @return {Array} list of key value pairs for each metadata item in the manifest
 */
export function getMetadata(manifest, readCanvasMetadata) {
  try {
    let canvasMetadata = [];
    let allMetadata = { canvasMetadata: canvasMetadata, manifestMetadata: [] };
    const manifestMetadata = parseManifest(manifest).getMetadata();
    if (readCanvasMetadata) {
      let canvases = parseSequences(manifest)[0].getCanvases();
      for (const i in canvases) {
        let canvasindex = parseInt(i);
        canvasMetadata.push({
          canvasindex: canvasindex,
          metadata: parseMetadata(
            canvases[canvasindex].getMetadata(), 'Canvas'
          )
        });
      };
      allMetadata.canvasMetadata = canvasMetadata;
    }
    allMetadata.manifestMetadata = parseMetadata(manifestMetadata, 'Manifest');
    return allMetadata;
  } catch (e) {
    console.error('iiif-parser -> getMetadata() -> cannot parse manifest, ', e);
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

/**
 * Parse metadata in the Manifest/Canvas into an array of key value pairs
 * @param {Array} metadata list of metadata in Manifest
 * @param {String} resourceType resource type which the metadata belongs to
 * @returns {Array} an array with key value pairs for the metadata 
 */
export function parseMetadata(metadata, resourceType) {
  let parsedMetadata = [];
  if (metadata?.length > 0) {
    metadata.map(md => {
      // get value and replace /n characters with <br/> to display new lines in UI
      let value = md.getValue()?.replace(/\n/g, "<br />");
      let sanitizedValue = sanitizeHtml(value, { ...HTML_SANITIZE_CONFIG });
      parsedMetadata.push({
        label: md.getLabel(),
        value: sanitizedValue
      });
    });
    return parsedMetadata;
  } else {
    console.log('iiif-parser -> parseMetadata() -> no metadata in ', resourceType);
    return parsedMetadata;
  }
}

/**
 * Parse manifest to see if auto-advance behavior present at manifest level
 * @param {Object} manifest
 * @return {Boolean}
 */
export function parseAutoAdvance(manifest) {
  const autoAdvanceBehavior = parseManifest(manifest)
    .getProperty("behavior")?.includes("auto-advance");
  return (autoAdvanceBehavior === undefined) ? false : autoAdvanceBehavior;
}

/**
 * Parse 'structures' into an array of nested JSON objects with
 * required information for structured navigation UI rendering
 * @param {Object} manifest
 * @returns {Object}
 *  obj.structures: a nested json object structure derived from
 * 'structures' property in the given Manifest
 *  obj.timespans: timespan items linking to Canvas
 */
export function getStructureRanges(manifest) {
  const canvasesInfo = canvasesInManifest(manifest);
  let timespans = [];
  // Initialize the subIndex for tracking indices for timespans in structure
  let subIndex = 0;
  let parseItem = (range, rootNode, cIndex) => {
    let label = getLabelValue(range.getLabel().getValue());
    let canvases = range.getCanvasIds();

    let duration = 0; let canvasDuration = 0;
    let rangeDuration = range.getDuration();
    if (rangeDuration != undefined) {
      let { start, end } = rangeDuration;
      duration = end - start;
    }

    let isCanvas = rootNode == range.parentRange;
    let isClickable = false; let isEmpty = false;
    let summary = undefined; let homepage = undefined;
    if (canvases.length > 0 && canvasesInfo?.length > 0) {
      let canvasInfo = canvasesInfo
        .filter((c) => c.canvasId === getCanvasId(canvases[0]))[0];
      isEmpty = canvasInfo.isEmpty;
      summary = canvasInfo.summary;
      homepage = canvasInfo.homepage;
      // Mark all timespans as clickable, and provide desired behavior in ListItem component
      isClickable = true;
      if (canvasInfo.range != undefined) {
        const { start, end } = canvasInfo.range;
        canvasDuration = end - start;
        if (isCanvas) { duration = end - start; }
      }
    }
    let item = {
      label: label,
      summary: summary,
      isTitle: canvases.length === 0 ? true : false,
      rangeId: range.id,
      id: canvases.length > 0
        ? isCanvas ? `${canvases[0].split(',')[0]},` : canvases[0]
        : undefined,
      isEmpty: isEmpty,
      isCanvas: isCanvas,
      itemIndex: isCanvas ? cIndex : undefined,
      canvasIndex: cIndex,
      items: range.getRanges()?.length > 0
        ? range.getRanges().map(r => parseItem(r, rootNode, cIndex))
        : [],
      duration: timeToHHmmss(duration),
      isClickable: isClickable,
      homepage: homepage,
      canvasDuration: canvasDuration
    };
    if (canvases.length > 0) {
      // Increment the index for each timespan
      subIndex++;
      if (!isCanvas) { item.itemIndex = subIndex; }
      timespans.push(item);
    }
    return item;
  };

  const allRanges = parseManifest(manifest).getAllRanges();
  if (allRanges?.length === 0) {
    return { structures: [], timespans: [] };
  } else {
    const rootNode = allRanges[0];
    let structures = [];
    let canvasRanges = rootNode.getRanges();
    if (canvasRanges?.length > 0) {
      canvasRanges.map((range, index) => {
        const behavior = range.getBehavior();
        if (behavior != 'no-nav') {
          // Reset the index for timespans in structure for each Canvas
          subIndex = 0;
          structures.push(parseItem(range, rootNode, index + 1));
        }
      });
    }
    return { structures, timespans };
  }
}
