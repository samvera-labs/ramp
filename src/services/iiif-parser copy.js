import { parseManifest, PropertyValue } from 'manifesto.js';
import mimeDb from 'mime-db';
import sanitizeHtml from 'sanitize-html';
import {
  GENERIC_EMPTY_MANIFEST_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  getLabelValue,
  getMediaFragment,
  parseResourceAnnotations,
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
    const canvases = manifest.items;
    if (canvases === undefined) {
      console.error(
        'iiif-parser -> canvasesInManifest() -> no canvases were found in Manifest'
      );
      throw new Error(GENERIC_ERROR_MESSAGE);
    } else {
      canvases.map((canvas, index) => {
        let summary = undefined;
        if (canvas.summary && canvas.summary != undefined) {
          summary = PropertyValue.parse(canvas.summary).getValue();
        }
        let homepage = undefined;
        if (canvas.homepage && canvas.homepage.length > 0) {
          homepage = canvas.homepage[0].id;
        }
        try {
          let sources = canvas
            .items[0].body.items
            .map((source) => source.id);
          const canvasDuration = Number(canvas.duration);
          let timeFragment;
          if (sources?.length > 0) {
            timeFragment = getMediaFragment(sources[0], canvasDuration);
          }
          canvasesInfo.push({
            canvasIndex: index,
            canvasId: canvas.id,
            canvasURI: canvas.id.split('#t=')[0],
            range: timeFragment === undefined ? { start: 0, end: canvasDuration } : timeFragment,
            isEmpty: sources.length === 0 ? true : false,
            summary: summary,
            homepage: homepage || ''
          });
        } catch (error) {
          canvasesInfo.push({
            canvasIndex: index,
            canvasId: canvas.id,
            canvasURI: canvas.id.split('#t=')[0],
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
    let isMultiCanvas = false;
    let lastIndex = 0;
    if (manifest.items?.length > 0) {
      isMultiCanvas = true;
      lastIndex = manifest.items.length;
    }
    return { isMultiCanvas, lastIndex };
  } catch (error) {
    throw error;
  }
}

// USE INDEX IN canvasesInManifest
// /**
//  * Get canvas index by using the canvas id
//  * @param {Object} manifest
//  * @param {String} canvasId
//  * @returns {Number} canvasindex
//  */
// export function getCanvasIndex(manifest, canvasId) {
//   try {
//     const sequences = parseSequences(manifest);
//     let canvasindex = sequences[0].getCanvasIndexById(canvasId);
//     if (canvasindex || canvasindex === 0) {
//       return canvasindex;
//     } else {
//       console.log('Canvas not found in Manifest, ', canvasId);
//       return 0;
//     }
//   } catch (error) {
//     throw error;
//   }
// }

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
  let canvas = null;
  let sources, tracks = [];
  let info = {
    canvas: null,
    sources: [],
    tracks: [],
    canvasTargets: []
  };

  // return empty object when canvasIndex is undefined
  if (canvasIndex === undefined || canvasIndex < 0) {
    return {
      ...info,
      error: 'Error fetching content'
    };
  }

  // return an error when the given Manifest doesn't have any Canvas(es)
  const canvases = manifest.items;
  if (canvases?.length == 0) {
    return {
      ...info,
      error: GENERIC_EMPTY_MANIFEST_MESSAGE,
    };
  }

  // Get the canvas with the given canvasIndex
  try {
    canvas = canvases[canvasIndex];
    const annotations = canvas.annotations;

    if (canvas === undefined) {
      console.error(
        'iiif-parser -> getMediaInfo() -> canvas undefined  -> ', canvasIndex
      );
      throw new Error(GENERIC_ERROR_MESSAGE);
    }
    const duration = Number(canvas.duration);

    // If manifest has a start, set canvas sources' time fragments to match
    let manifestStart = getCustomStart(manifest);
    let canvasStart = manifestStart.type === 'SR' && manifestStart.canvas === canvasIndex
      ? manifestStart.item
      : 0;

    // Read painting resources from annotations
    const { resources, canvasTargets, isMultiSource, error } = parseResourceAnnotations(canvas, duration, 'painting', canvasStart);

    // Set default src to auto
    sources = setDefaultSrc(resources, isMultiSource, srcIndex);

    // Read supplementing resources fom annotations
    const supplementingRes = parseResourceAnnotations(annotations, duration, 'supplementing');

    tracks = supplementingRes ? supplementingRes.resources : [];

    const mediaInfo = {
      sources,
      tracks,
      canvasTargets,
      isMultiSource,
      error,
      canvas: {
        duration: duration,
        height: canvas.height,
        width: canvas.width,
        id: canvas.id,
        label: getLabelValue(canvas.label),
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
  let manifestStartProp = manifest.start;
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
    startProp = manifestStartProp;
  }

  const canvases = canvasesInManifest(manifest);
  // Map given information in start property or user props to
  // Canvas information in the given Manifest
  let getCanvasInfo = (canvasId, type, time) => {
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
        if (currentCanvas.range != undefined && type === 'SpecificResource') {
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
        let canvasInfo = getCanvasInfo(startProp.id, startProp.type, 0);
        return { type: 'C', canvas: canvasInfo.currentIndex, time: canvasInfo.startTime };
      case 'SpecificResource':
        let customStart = startProp.selector.t;
        canvasInfo = getCanvasInfo(startProp.source, startProp.type, customStart);
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
 * Read metadata from both Manifest and Canvas levels as needed
 * @param {Object} manifest
 * @param {Boolean} readCanvasMetadata read metadata from Canvas level
 * @return {Array} list of key value pairs for each metadata item in the manifest
 */
export function getMetadata(manifest, readCanvasMetadata) {
  try {
    let canvasMetadata = [];
    let allMetadata = { canvasMetadata: canvasMetadata, manifestMetadata: [] };
    const parsedManifest = parseManifest(manifest);
    // Parse Canvas-level metadata blocks for each Canvas
    if (readCanvasMetadata) {
      let canvases = parseSequences(manifest)[0].getCanvases();
      for (const i in canvases) {
        let canvasindex = parseInt(i);
        const rightsMetadata = parseRightsAsMetadata(canvases[canvasindex], 'Canvas');
        canvasMetadata.push({
          canvasindex: canvasindex,
          metadata: parseMetadata(
            canvases[canvasindex].getMetadata(), 'Canvas'
          ),
          rights: rightsMetadata
        });
      };
      allMetadata.canvasMetadata = canvasMetadata;
    }
    // Parse Manifest-level metadata block
    const manifestMetadata = parsedManifest.getMetadata();
    const parsedManifestMetadata = parseMetadata(manifestMetadata, 'Manifest');
    const rightsMetadata = parseRightsAsMetadata(parsedManifest, 'Manifest');
    allMetadata.manifestMetadata = parsedManifestMetadata;
    allMetadata.rights = rightsMetadata;
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
 * Parse requiredStatement and rights information as metadata
 * @param {Object} resource Canvas or Manifest JSON-ld
 * @param {String} resourceType resource type (Manifest/Canvas) for metadata
 * @returns {Array<JSON Object>}
 */
function parseRightsAsMetadata(resource, resourceType) {
  let otherMetadata = [];
  const requiredStatement = resource.getRequiredStatement();
  if (requiredStatement != undefined && requiredStatement.value?.length > 0) {
    otherMetadata = parseMetadata([requiredStatement], resourceType);
  }
  const rights = resource.getProperty('rights') || undefined;
  if (rights != undefined) {
    const isURL = (/^(https?:\/\/[^\s]+)|(www\.[^\s]+)/).test(rights);
    otherMetadata.push({
      label: 'License',
      value: isURL ? `<a href=${rights}>${rights}</a>` : rights
    });
  }
  return otherMetadata;
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
 * @param {Boolean} isPlaylist
 * @returns {Object}
 *  obj.structures: a nested json object structure derived from
 *    'structures' property in the given Manifest
 *  obj.timespans: timespan items linking to Canvas
 *  obj.markRoot: display root Range in the UI
 */
export function getStructureRanges(manifest, isPlaylist = false) {
  const canvasesInfo = canvasesInManifest(manifest);
  let timespans = [];
  let manifestDuration = 0;
  let hasRoot = false;
  let cIndex = 0;
  // Initialize the subIndex for tracking indices for timespans in structure
  let subIndex = 0;
  let parseItem = (range, rootNode) => {
    let behavior = range.getBehavior();
    if (behavior != 'no-nav') {
      let label = getLabelValue(range.getLabel().getValue());
      let canvases = range.getCanvasIds();

      let duration = manifestDuration; let canvasDuration = manifestDuration;

      let isRoot = rootNode == range && cIndex == 0;
      let isCanvas;
      let isClickable = false; let isEmpty = false;
      let summary = undefined; let homepage = undefined;

      if (hasRoot) {
        // When parsing the root Range in structures, treat it as a Canvas
        isCanvas = isRoot || (canvasesInfo.length > 1 && rootNode == range.parentRange);
        if (canvasesInfo.length > 1 && rootNode == range.parentRange) {
          cIndex = cIndex + 1;
        } else if (canvasesInfo.length == 1) {
          // When only one Canvas is in the items list
          cIndex = 1;
        }
      } else {
        isCanvas = rootNode == range.parentRange && canvasesInfo[cIndex - 1] != undefined;
      }

      let rangeDuration = range.getDuration();
      if (rangeDuration != undefined && !isRoot) {
        let { start, end } = rangeDuration;
        duration = end - start;
        if (isCanvas) { canvasDuration = duration; }
      }
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
        isRoot: isRoot,
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
          ? range.getRanges().map(r => parseItem(r, rootNode))
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
  };

  const allRanges = parseManifest(manifest).getAllRanges();
  if (allRanges?.length === 0) {
    return { structures: [], timespans: [], markRoot: false };
  } else {
    const rootNode = allRanges[0];
    let structures = [];
    const rootBehavior = rootNode.getBehavior();
    if (rootBehavior && rootBehavior == 'no-nav') {
      return { structures: [], timespans: [] };
    } else {
      if (isPlaylist || rootBehavior === 'top') {
        let canvasRanges = rootNode.getRanges();
        if (canvasRanges?.length > 0) {
          canvasRanges.map((range, index) => {
            const behavior = range.getBehavior();
            if (behavior != 'no-nav') {
              // Reset the index for timespans in structure for each Canvas
              subIndex = 0;
              cIndex = index + 1;
              structures.push(parseItem(range, rootNode));
            }
          });
        }
      } else {
        hasRoot = true;
        // Total duration for all resources in the Manifest
        manifestDuration = canvasesInfo.reduce(
          (duration, canvas) => duration + canvas.range.end, 0
        );
        structures.push(parseItem(rootNode, rootNode, cIndex));
      }
    }
    // Mark root Range for a single-canvased Manifest
    const markRoot = hasRoot && canvasesInfo?.length > 1;
    return { structures, timespans, markRoot };
  }
}

/**
 * Read 'services' block in the Manifest or in relevant Canvas. Services listed
 * at the manifest-level takes precedence.
 * Returns the id of the service typed 'SearchService2' to enable content 
 * search 
 * @param {Object} manifest 
 * @param {Number} canvasIndex index of the current Canvas
 * @returns 
 */
export function getSearchService(manifest, canvasIndex) {
  let searchService = null;
  const manifestServices = parseManifest(manifest).getServices();
  if (manifestServices && manifestServices?.length > 0) {
    let searchServices = manifestServices.filter(
      s => s.getProperty('type') === 'SearchService2'
    );
    searchService = searchServices?.length > 0 ? searchServices[0].id : null;
  } else {
    let canvases = parseSequences(manifest)[0].getCanvases();
    if (canvases === undefined || canvases[canvasIndex] === undefined) return null;

    const canvas = canvases[canvasIndex];
    const services = canvas.getServices();
    if (services && services.length > 0) {
      const searchServices = services.filter(
        s => s.getProperty('type') === 'SearchService2'
      );
      searchService = searchServices?.length > 0
        ? searchServices[0].id
        : null;
    }
  }
  return searchService;
}
