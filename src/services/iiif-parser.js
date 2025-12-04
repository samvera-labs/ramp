import { parseManifest, PropertyValue } from 'manifesto.js';
import mimeTypes from 'mime-types';
import sanitizeHtml from 'sanitize-html';
import {
  GENERIC_EMPTY_MANIFEST_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  getLabelValue,
  getMediaFragment,
  parseResourceAnnotations,
  setCanvasMessageTimeout,
  timeToHHmmss,
  identifyMachineGen
} from './utility-helpers';

// HTML tags and attributes allowed in IIIF
const HTML_SANITIZE_CONFIG = {
  allowedTags: ['a', 'b', 'br', 'i', 'img', 'p', 'small', 'span', 'sub', 'sup'],
  allowedAttributes: { 'a': ['href'], 'img': ['src', 'alt'] },
  allowedSchemesByTag: { 'a': ['http', 'https', 'mailto'] }
};

// Do not build structures for the following 'Range' behaviors:
// Reference: https://iiif.io/api/presentation/3.0/#behavior
const NO_DISPLAY_STRUCTURE_BEHAVIORS = ['no-nav', 'thumbnail-nav'];

/**
 * Get all the canvases in manifest with related information
 * @function IIIFParser#canvasesInManifest
 * @return {Array} array of canvas IDs in manifest
 **/
export function canvasesInManifest(manifest) {
  let canvasesInfo = [];
  try {
    if (!manifest?.items) {
      console.error(
        'iiif-parser -> canvasesInManifest() -> no canvases were found in Manifest'
      );
      throw new Error(GENERIC_ERROR_MESSAGE);
    } else {
      const canvases = manifest.items;
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
          let isEmpty = true;
          const canvasItems = canvas.items[0]?.items;
          let source = '';
          if (canvasItems?.length > 0) {
            const body = canvasItems[0].body;
            if (body.items?.length > 0) {
              source = body.items[0].id;
            } else if (Object.keys(body)?.length != 0 && body.id) {
              source = body.id;
            }
          }
          const canvasDuration = Number(canvas.duration);
          let timeFragment;
          if (source != '') {
            timeFragment = getMediaFragment(source, canvasDuration);
            isEmpty = false;
          }
          const canvasLabel = getLabelValue(canvas.label) || `Section ${index + 1}`;
          canvasesInfo.push({
            canvasIndex: index,
            canvasId: canvas.id,
            canvasURL: canvas.id.split('#t=')[0],
            duration: canvasDuration,
            range: timeFragment === undefined ? { start: 0, end: canvasDuration } : timeFragment,
            isEmpty: isEmpty,
            summary: summary,
            homepage: homepage || '',
            label: canvasLabel,
            searchService: getSearchService(canvas)
          });
        } catch (error) {
          canvasesInfo.push({
            canvasIndex: index,
            canvasId: canvas.id,
            canvasURL: canvas.id.split('#t=')[0],
            duration: canvas.duration || 0,
            range: undefined, // set range to undefined, use this check to set duration in UI
            isEmpty: true,
            summary: summary,
            homepage: homepage || '',
            label: getLabelValue(canvas.label) || `Section ${index + 1}`,
            searchService: getSearchService(canvas)
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
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @function IIIFParser#getMediaInfo
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @param {Number} obj.startTime Custom start time if exists, defaulted to 0
 * @param {Number} obj.srcIndex Index of the resource in active canvas
 * @param {Boolean} obj.isPlaylist 
 * @returns {Object} { sources, tracks, targets, isMultiSource, error, mediaType }
 */
export function getMediaInfo({ manifest, canvasIndex, startTime, srcIndex = 0, isPlaylist = false }) {
  let canvas = null;
  let sources, tracks = [];
  let info = {
    sources: [],
    tracks: [],
    canvasTargets: [],
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
      poster: GENERIC_EMPTY_MANIFEST_MESSAGE,
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

    // Read painting resources from annotations
    const {
      resources, canvasTargets, isMultiSource, error, poster
    } = parseResourceAnnotations(canvas, duration, 'painting', startTime, isPlaylist);

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
      poster,
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
 * @function IIIFParser#setDefaultSrc
 * @param {Array} sources source file information in canvas
 * @returns {Array} source information with one src marked as default
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
 * Get the canvas ID from the URI by stripping away the timefragment
 * information
 * @function IIIFParser#getCanvasId
 * @param {String} uri URI of the item clicked in structure
 * @return {String}
 */
export function getCanvasId(uri) {
  if (uri) {
    return uri.split('#t=')[0];
  }
}

/**
 * Get placeholderCanvas value for images and text messages
 * @function IIIFParser#getPlaceholderCanvas
 * @param {Object} annotation
 * @param {Boolean} isPoster
 * @return {String} 
 */
export function getPlaceholderCanvas(annotation, isPoster = false) {
  let placeholder;
  try {
    let placeholderCanvas = annotation.placeholderCanvas;
    if (placeholderCanvas && placeholderCanvas != undefined) {
      let items = placeholderCanvas.items[0].items;
      if (items?.length > 0 && items[0].body != undefined
        && items[0].motivation === 'painting') {
        const body = items[0].body;
        if (isPoster) {
          placeholder = body.id;
        } else {
          placeholder = getLabelValue(body.label) || 'This item cannot be played.';
          setCanvasMessageTimeout(placeholderCanvas.duration);
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
 * @function IIIFParser#getCustomStart
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
    let currentIndex = 0;

    if (canvases && canvases?.length > 0) {
      if (canvasId) {
        currentIndex = canvases.findIndex((c) => c.canvasId === canvasId);
        if (currentIndex === undefined || currentIndex < 0) {
          console.warn('Given Canvas was not found in Manifest, ', startCanvasId);
          startTime = 0;
          currentIndex = 0;
        } else {
          const currentCanvas = canvases[currentIndex];
          if (currentCanvas.range != undefined && type === 'SpecificResource') {
            const { start, end } = currentCanvas.range;
            if (!(time >= start && time <= end)) {
              console.warn('Given start time is not within Canvas duration, ', startCanvasTime);
              startTime = 0;
            }
          }
        }
      }
    } else {
      console.warn('No Canvases in given Manifest');
      startTime = 0;
    }
    return { currentIndex, startTime };
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

/**
 * Build a JSON object with file information parsed from Manifest
 * @param {String} format file format
 * @param {Object} labelInput language map from Manifest for file label
 * @param {String} id 
 * @returns {Object} { id, label, filename, fileExt, isMachineGen }
 */
function buildFileInfo(format, labelInput, id) {
  /**
   * Convert 'text/srt' => 'application/x-subrip' for mime-types lookup for
   * valid extension, as mime-types doesn't support 'text/srt'
   */
  format = format === 'text/srt' ? 'application/x-subrip' : format;
  const extension = mimeTypes.extension(format) || format;
  let label = getLabelValue(labelInput) || 'Untitled';
  let filename = label;
  if (Object.keys(labelInput).length > 1) {
    label = labelInput[Object.keys(labelInput)[0]][0];
    filename = labelInput['none'][0];
  }
  const { isMachineGen, _ } = identifyMachineGen(label);
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
 * @function IIIFParser#getRenderingFiles
 * @param {Object} manifest
 * @returns {Object} List of files under `rendering` property in manifest and canvases
 */
export function getRenderingFiles(manifest) {
  let manifestFiles = [];
  let canvasFiles = [];
  let manifestRendering = manifest.rendering;

  const canvases = manifest.items;

  if (manifestRendering) {
    manifestRendering.map((r) => {
      const file = buildFileInfo(r.format, r.label, r.id);
      manifestFiles.push(file);
    });
  }

  if (canvases) {
    canvases.map((canvas, index) => {
      let canvasRendering = canvas.rendering;
      let files = [];
      if (canvasRendering) {
        canvasRendering.map((r) => {
          const file = buildFileInfo(r.format, r.label, r.id);
          files.push(file);
        });
      }
      // Use label of canvas or fallback to canvas id
      canvasFiles.push({
        label: getLabelValue(canvas.label) || `Section ${(index + 1)}`,
        files: files
      });
    });
  }
  return { manifest: manifestFiles, canvas: canvasFiles };
}

/**
 * Read metadata from both Manifest and Canvas levels as needed
 * @function IIIFParser#getMetadata
 * @param {Object} manifest
 * @param {Boolean} readCanvasMetadata read metadata from Canvas level
 * @return {Array} list of key value pairs for each metadata item in the manifest
 */
export function getMetadata(manifest, readCanvasMetadata) {
  let canvasMetadata = [];
  let allMetadata = { canvasMetadata: canvasMetadata, manifestMetadata: [], rights: [] };

  // Parse Canvas-level metadata blocks for each Canvas
  let canvases = manifest.items;
  if (readCanvasMetadata && canvases) {
    for (const i in canvases) {
      let canvasindex = parseInt(i);
      const rightsMetadata = parseRightsAndReqStatement(canvases[canvasindex], 'Canvas');
      canvasMetadata.push({
        canvasindex: canvasindex,
        metadata: parseMetadata(
          canvases[canvasindex].metadata, 'Canvas'
        ),
        rights: rightsMetadata
      });
    };
    allMetadata.canvasMetadata = canvasMetadata;
  }
  // Parse Manifest-level metadata block
  const manifestMetadata = manifest.metadata;
  const parsedManifestMetadata = parseMetadata(manifestMetadata, 'Manifest');
  allMetadata.manifestMetadata = parsedManifestMetadata;
  const rightsMetadata = parseRightsAndReqStatement(manifest, 'Manifest');
  allMetadata.rights = rightsMetadata;

  return allMetadata;
}

/**
 * Parse metadata in the Manifest/Canvas into an array of key value pairs
 * @function IIIFParser#parseMetadata
 * @param {Array} metadata list of metadata in Manifest
 * @param {String} resourceType resource type which the metadata belongs to
 * @returns {Array} an array with key value pairs for the metadata 
 */
export function parseMetadata(metadata, resourceType) {
  let parsedMetadata = [];
  if (metadata && metadata?.length > 0) {
    metadata.map(md => {
      // get value and replace \n characters with <br/> to display new lines in UI
      let value = getLabelValue(md.value, true)?.replace(/\n/g, "<br />");
      let sanitizedValue = sanitizeHtml(value, { ...HTML_SANITIZE_CONFIG });
      parsedMetadata.push({
        label: getLabelValue(md.label),
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
 * @function IIIFParser#parseRightsAndReqStatement
 * @param {Object} resource Canvas or Manifest JSON-ld
 * @param {String} resourceType resource type (Manifest/Canvas) for metadata
 * @returns {Array<JSON Object>}
 */
function parseRightsAndReqStatement(resource, resourceType) {
  let otherMetadata = [];
  const requiredStatement = resource.requiredStatement;
  if (requiredStatement) {
    otherMetadata = parseMetadata([requiredStatement], resourceType);
  }
  const rights = resource.rights;
  if (rights) {
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
 * @function IIIFParser#parseAutoAdvance
 * @param {Array} behavior behavior array from Manifest
 * @return {Boolean}
 */
export function parseAutoAdvance(behavior) {
  return !behavior ? false : behavior?.includes("auto-advance");
}

/**
 * Parse 'structures' into an array of nested JSON objects with
 * required information for structured navigation UI rendering
 * @param {Object} manifest
 * @param {Array} canvasesInfo info relevant to each Canvas in the Manifest
 * @param {Boolean} isPlaylist
 * @returns {Object}
 *  obj.structures: a nested json object structure derived from
 *    'structures' property in the given Manifest
 *  obj.timespans: timespan items linking to Canvas
 *  obj.markRoot: display root Range in the UI
 *  obj.hasCollapsibleStructure: has timespans/children in at least one Canvas
 */
export function getStructureRanges(manifest, canvasesInfo, isPlaylist = false) {
  let timespans = [];
  let manifestDuration = 0;
  let hasRoot = false;
  let cIndex = 0;
  let hasCollapsibleStructure = false;
  // Initialize the subIndex for tracking indices for timespans in structure
  let subIndex = 0;

  let parseItem = (range, rootNode) => {
    let behavior = range.getBehavior();
    if (!NO_DISPLAY_STRUCTURE_BEHAVIORS.includes(behavior)) {
      let label = getLabelValue(range.getLabel().getValue());
      let canvases = range.getCanvasIds();

      let duration = manifestDuration; let canvasDuration = manifestDuration;

      let isRoot = rootNode == range && cIndex == 0;
      let isCanvas;
      let isClickable = false; let isEmpty = false;
      let summary = undefined; let homepage = undefined;
      let id = undefined;

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

      // Consider collapsible structure only for ranges non-equivalent to root-level items
      if (range.getRanges()?.length > 0 && !isRoot && isCanvas) hasCollapsibleStructure = true;
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
        // Mark all timespans as clickable, and provide desired behavior in TreeNode component
        isClickable = true;
        if (canvasInfo.range != undefined) {
          const { start, end } = canvasInfo.range;
          canvasDuration = end - start;
          if (isCanvas) { duration = end - start; }
        }
      }

      // Increment index for children timespans within a Canvas
      if (!isCanvas && canvases.length > 0) subIndex++;

      // Set 'id' in the form of a mediafragment
      if (canvases.length > 0) {
        if (isCanvas) {
          const [uri, mediafragment] = canvases[0].split('#');
          if (mediafragment) {
            // Example: http://example.com/manifest/canvas#t=0,duration
            id = `${canvases[0].split(',')[0]},`;
          } else {
            // Build mediafragment when it is not given in the Canvas id for the Range
            // Example: http://example.com/manifest/canvas
            id = `${uri}#t=0,`;
          }
        } else {
          id = canvases[0];
        }
      }

      // Parse start and end times from media-fragment URI
      // For Canvas-level timespans returns { start: 0, end: 0 }: to avoid full time-rail highligting
      let times = id ? getMediaFragment(id, canvasDuration) : { start: 0, end: 0 };

      let item = {
        label, summary, isRoot, homepage, canvasDuration, id, times,
        isTitle: canvases.length === 0 ? true : false,
        rangeId: range.id,
        isEmpty: isEmpty,
        isCanvas: isCanvas,
        itemIndex: isCanvas ? cIndex : subIndex,
        canvasIndex: cIndex,
        items: range.getRanges()?.length > 0 ? range.getRanges().map(r => parseItem(r, rootNode)) : [],
        duration: timeToHHmmss(duration),
        isClickable: isClickable,
      };
      // Collect timespans in a separate array
      if (canvases.length > 0) {
        timespans.push(item);
      }
      return item;
    };
  };

  try {
    const allRanges = parseManifest(manifest).getAllRanges();
    if (allRanges?.length === 0) {
      return { structures: [], timespans: [], markRoot: false, hasCollapsibleStructure };
    } else {
      const rootNode = allRanges[0];
      let structures = [];
      const rootBehavior = rootNode.getBehavior();
      if (rootBehavior && NO_DISPLAY_STRUCTURE_BEHAVIORS.includes(rootBehavior)) {
        return { structures: [], timespans: [], hasCollapsibleStructure };
      } else {
        if (isPlaylist || rootBehavior === 'top') {
          let canvasRanges = rootNode.getRanges();
          if (canvasRanges?.length > 0) {
            canvasRanges.map((range, index) => {
              const behavior = range.getBehavior();
              if (!NO_DISPLAY_STRUCTURE_BEHAVIORS.includes(behavior)) {
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
      return { structures, timespans, markRoot, hasCollapsibleStructure };
    }
  } catch (e) {
    console.error('iiif-parser -> getStructureRanges() -> error parsing structures');
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

/**
 * Read 'services' block in the Manifest or in relevant Canvas. Services listed
 * at the manifest-level takes precedence.
 * Returns the id of the service typed 'SearchService2' to enable content 
 * search 
 * @function IIIFParser#getSearchService
 * @param {Object} resource a Manifest/Canvas to read searchService endpoint
 * @returns 
 */
export function getSearchService(resource) {
  let searchService = null;
  if (resource) {
    const services = resource.service;
    if (services && services.length > 0) {
      const searchServices = services.filter(
        s => s.type === 'SearchService2'
      );
      searchService = searchServices?.length > 0
        ? searchServices[0].id
        : null;
    }
  }
  return searchService;
}
