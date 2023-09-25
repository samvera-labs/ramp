import { parseManifest } from 'manifesto.js';
import mimeDb from 'mime-db';
import sanitizeHtml from 'sanitize-html';
import { checkSrcRange, getAnnotations, getLabelValue, getMediaFragment, getResourceItems, parseAnnotations, timeToHHmmss } from './utility-helpers';

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
  const canvases = parseManifest(manifest)
    .getSequences()[0]
    .getCanvases()
    .map((canvas) => {
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
        return {
          canvasId: canvas.id,
          range: timeFragment === undefined ? { start: 0, end: canvasDuration } : timeFragment,
          isEmpty: sources.length === 0 ? true : false
        };
      } catch (error) {
        return {
          canvasId: canvas.id,
          range: undefined, // set range to undefined, use this check to set duration in UI
          isEmpty: true
        };
      }
    });
  return canvases;
}

/**
 * Get isMultiCanvas and last canvas index information from the
 * given Manifest
 * @param {Object} manifest 
 * @returns {Object} { isMultiCanvas: Boolean, lastIndex: Number }
 */
export function manifestCanvasesInfo(manifest) {
  try {
    const sequences = parseManifest(manifest).getSequences();
    if (sequences && sequences != undefined) {
      let isMultiCanvas = sequences[0].isMultiCanvas();
      let lastIndex = sequences[0].getLastPageIndex();
      return { isMultiCanvas, lastIndex };
    }
  } catch (e) {
    console.error('Manifest parsing error: ', e);
    return { isMultiCanvas: false, lastIndex: 0 };
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
    const sequences = parseManifest(manifest).getSequences();
    if (sequences && sequences != undefined) {
      let canvasindex = sequences[0].getCanvasIndexById(canvasId);
      if (canvasindex) {
        return canvasindex;
      } else {
        console.log('Canvas not found in Manifest, ', canvasId);
        return 0;
      }
    }
  } catch (e) {
    console.error('Manifest parsing error: ', e);
    return 0;
  }
}

/**
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @param {Number} obj.srcIndex Index of the resource in active canvas
 * @returns {Object} { soures, tracks, targets, isMultiSource, error, canvas }
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
    canvas = parseManifest(manifest)
      .getSequences()[0]
      .getCanvasByIndex(canvasIndex);
  } catch (e) {
    console.log('Error fetching resources: ', e);
    return { error: 'Error fetching resources' };
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
 * Get poster image for video resources
 * @param {Object} manifest
 * @param {Number} canvasIndex
 */
export function getPoster(manifest, canvasIndex) {
  let posterUrl;
  let placeholderCanvas = parseManifest(manifest)
    .getSequences()[0]
    .getCanvasByIndex(canvasIndex)
    .__jsonld['placeholderCanvas'];
  if (placeholderCanvas) {
    let annotations = placeholderCanvas['items'];
    let items = parseAnnotations(annotations, 'painting');
    if (items.length > 0) {
      const item = items[0].getBody()[0];
      posterUrl = item.getType() == 'image' ? item.id : null;
    }
    return posterUrl;
  } else {
    return null;
  }
}

/**
 * Get Inaccessible item message for empty canvas
 * @param {Object} manifest
 * @param {Number} canvasIndex
 */
export function inaccessibleItemMessage(manifest, canvasIndex) {
  let itemMessage;
  let placeholderCanvas = parseManifest(manifest)
    .getSequences()[0]
    .getCanvasByIndex(canvasIndex)
    .__jsonld['placeholderCanvas'];
  if (placeholderCanvas) {
    let annotations = placeholderCanvas['items'];
    let items = parseAnnotations(annotations, 'painting');
    if (items.length > 0) {
      const item = items[0].getBody()[0];
      itemMessage = item.getLabel().getValue()
        ? getLabelValue(item.getLabel().getValue())
        : 'No associated media source(s) in the Canvas';
    }
    return itemMessage;
  } else {
    return null;
  }
}

/**
 * Parse 'start' property in manifest if it is given
 * In the spec there are 2 ways to specify 'start' property:
 * https://iiif.io/api/presentation/3.0/#start
 * Cookbook recipe for reference: https://iiif.io/api/cookbook/recipe/0015-start/
 * @param {Object} manifest
 * @returns {Object}
 */
export function getCustomStart(manifest) {
  if (!parseManifest(manifest).getProperty('start')) {
    return null;
  }
  let currentCanvasIndex = null;
  let startProp = parseManifest(manifest).getProperty('start');

  let getCanvasIndex = (canvasId) => {
    const currentCanvasIndex = canvasesInManifest(manifest)
      .findIndex((c) => {
        return c.canvasId === canvasId;
      });
    return currentCanvasIndex;
  };
  if (startProp) {
    switch (startProp.type) {
      case 'Canvas':
        currentCanvasIndex = getCanvasIndex(startProp.id);
        return { type: 'C', canvas: currentCanvasIndex, time: 0 };
      case 'SpecificResource':
        currentCanvasIndex = getCanvasIndex(startProp.source);
        let customStart = startProp.selector.t;
        return { type: 'SR', canvas: currentCanvasIndex, time: customStart };
    }
  }
}

/**
 * Retrieve the list of alternative representation files in manifest or canvas
 * level to make available to download
 * @param {Object} manifest
 * @returns {Object} List of files under `rendering` property in manifest and canvases
 */
export function getRenderingFiles(manifest) {
  let manifestFiles = [];
  let canvasFiles = [];
  const manifestParsed = parseManifest(manifest);
  let manifestRendering = manifestParsed.getRenderings();

  let canvases = manifestParsed.getSequences()[0]
    .getCanvases();

  let buildFileInfo = (format, label, id) => {
    const mime = mimeDb[format];
    const extension = mime ? mime.extensions[0] : format;
    const filename = getLabelValue(label);
    const file = {
      id: id,
      label: `${filename} (.${extension})`,
      filename: filename,
      fileExt: extension,
    };
    return file;
  };

  manifestRendering.map((r) => {
    const file = buildFileInfo(r.getFormat(), r.getProperty('label'), r.id);
    manifestFiles.push(file);
  });

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

  return { manifest: manifestFiles, canvas: canvasFiles };
}

export function getSupplementingFiles(manifest) {
  let canvasFiles = [];
  const manifestParsed = parseManifest(manifest);
  let canvases = manifestParsed.getSequences()[0]
    .getCanvases();
  let buildFileInfo = (format, label, id) => {
    const mime = mimeDb[format];
    const extension = mime ? mime.extensions[0] : format;
    const filename = getLabelValue(label);
    const file = {
      id: id,
      label: `${filename} (.${extension})`,
      filename: filename,
      fileExt: extension,
    };
    return file;
  };

  canvases.map((canvas, index) => {
    let files = [];
    let annotationJSON = canvas.__jsonld["annotations"];
    let annotations = [];
    if (annotationJSON?.length) {
      const annotationPage = annotationJSON[0];
      if (annotationPage) {
        annotations = annotationPage.items.filter(annotation => annotation.motivation == "supplementing" && annotation.body.id);
      }
    }

    annotations.map((anno) => {
      const r = anno.body;
      const file = buildFileInfo(r.format, r.label, r.id);
      files.push(file);
    });

    // Use label of canvas or fallback to canvas id
    let canvasLabel = canvas.getLabel().getValue() || "Section " + (index + 1);
    canvasFiles.push({ label: getLabelValue(canvasLabel), files: files });
  });

  return canvasFiles;
}

/**
 * @param {Object} manifest
 * @return {Array} list of key value pairs for each metadata item in the manifest
 */
export function parseMetadata(manifest) {
  try {
    const metadata = parseManifest(manifest).getMetadata();
    let parsedMetadata = [];
    if (metadata) {
      metadata.map(md => {
        // get value and replace /n characters with <br/> to display new lines in UI
        let value = md.getValue().replace(/\n/g, "<br />");
        let sanitizedValue = sanitizeHtml(value, { ...HTML_SANITIZE_CONFIG });
        parsedMetadata.push({
          label: md.getLabel(),
          value: sanitizedValue
        });
      });
    }
    return parsedMetadata;
  } catch (e) {
    console.error('Cannot parse manifest, ', e);
  }
}

/**
 * Parse manifest to see if auto-advance behavior present at manifest level
 * @param {Object} manifest
 * @return {Boolean}
 */
export function parseAutoAdvance(manifest) {
  const autoAdvanceBehavior = parseManifest(manifest).getProperty("behavior")?.includes("auto-advance");
  return (autoAdvanceBehavior === undefined) ? false : autoAdvanceBehavior;
}

/**
 * Parses the manifest to identify whether it is a playlist manifest
 * or not
 * @param {Object} manifest
 * @returns {Boolean}
 */
export function getIsPlaylist(manifest) {
  try {
    const manifestTitle = manifest.label;
    let isPlaylist = getLabelValue(manifestTitle).includes('[Playlist]');
    return isPlaylist;
  } catch (err) {
    console.error('Cannot parse manfiest, ', err);
    return false;
  }
}

/**
 * Parse `highlighting` annotations with TextualBody type as markers
 * @param {Object} manifest
 * @param {Number} canvasIndex current canvas index
 * @returns {Array<Object>} JSON object array with the following format,
 * [{ id: String, time: Number, timeStr: String, canvasId: String, value: String}]
 */
export function parsePlaylistAnnotations(manifest, canvasIndex) {
  const annotations = getAnnotations({
    manifest,
    canvasIndex,
    key: 'annotations',
    motivation: 'highlighting'
  });
  let markers = [];

  if (!annotations || annotations.length === 0) {
    return { error: 'No markers were found in the Canvas', markers: [] };
  } else if (annotations.length > 0) {
    annotations.map((a) => {
      let [canvasId, time] = a.getTarget().split('#t=');
      let markerBody = a.getBody();
      if (markerBody?.length > 0 && markerBody[0].getProperty('type') === 'TextualBody') {
        const marker = {
          id: a.id,
          time: parseFloat(time),
          timeStr: timeToHHmmss(parseFloat(time), true, true),
          canvasId: canvasId,
          value: markerBody[0].getProperty('value') ? markerBody[0].getProperty('value') : '',
        };
        markers.push(marker);
      }
    });
    return { markers, error: '' };
  }
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

    let duration = 0;
    let rangeDuration = range.getDuration();
    if (rangeDuration != undefined) {
      let { start, end } = rangeDuration;
      duration = end - start;
    }

    let isCanvas = rootNode == range.parentRange;
    let isClickable = false;
    let isEmpty = false;
    if (canvases.length > 0) {
      let canvasInfo = canvasesInfo
        .filter((c) => c.canvasId === getCanvasId(canvases[0]))[0];
      isEmpty = canvasInfo.isEmpty;
      isClickable = checkSrcRange(range.getDuration(), canvasInfo.range);
      if (isCanvas && canvasInfo.range != undefined) {
        duration = canvasInfo.range.end - canvasInfo.range.start;
      }
    }
    let item = {
      label: label,
      isTitle: canvases.length === 0 ? true : false,
      rangeId: range.id,
      id: canvases.length > 0 ? canvases[0] : undefined,
      isEmpty: isEmpty,
      isCanvas: isCanvas,
      itemIndex: isCanvas ? cIndex : undefined,
      items: range.getRanges()?.length > 0
        ? range.getRanges().map(r => parseItem(r, rootNode, cIndex))
        : [],
      duration: timeToHHmmss(duration),
      isClickable: isClickable,
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
