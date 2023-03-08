import { parseManifest } from 'manifesto.js';
import mimeDb from 'mime-db';
import { getAnnotations, getResourceItems } from './utility-helpers';

/**
 * Get all the canvases in manifest
 * @function IIIFParser#canvasesInManifest
 * @return {Object} array of canvases in manifest
 **/
export function canvasesInManifest(manifest) {
  const canvases = parseManifest(manifest)
    .getSequences()[0]
    .getCanvases()
    .map((canvas) => {
      let sources = canvas
        .getContent()[0]
        .getBody()
        .map((source) => source.id);
      return {
        canvasId: canvas.id,
        canvasSources: sources,
      };
    });
  return canvases;
}

/**
 * Check if item's behavior is set to a value which should hide it
 * @param {Object} item
 */
export function filterVisibleRangeItem({ item, manifest }) {
  const itemInManifest = parseManifest(manifest).getRangeById(item.id);
  if (itemInManifest) {
    const behavior = itemInManifest.getBehavior();
    if (behavior && behavior === 'no-nav') {
      return null;
    }
    return item;
  }
}

export function getChildCanvases({ rangeId, manifest }) {
  let rangeCanvases = [];

  try {
    rangeCanvases = parseManifest(manifest)
      .getRangeById(rangeId)
      .getCanvasIds();
  } catch (e) {
    console.log('Error fetching range canvases');
  }

  return rangeCanvases;
}

/**
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @param {Number} obj.srcIndex Index of the resource in active canvas
 * @returns {Array.<Object>} array of objects
 */
export function getMediaInfo({ manifest, canvasIndex, srcIndex = 0 }) {
  let canvas = [];

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
  const sources = setDefaultSrc(resources, isMultiSource, srcIndex);

  // Read supplementing resources fom annotations
  const supplementingRes = readAnnotations({
    manifest,
    canvasIndex,
    key: 'annotations',
    motivation: 'supplementing',
    duration
  });
  const tracks = supplementingRes ? supplementingRes.resources : [];

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
    }
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

  return getResourceItems(annotations, duration);
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
 * Parse the label value from a manifest item
 * See https://iiif.io/api/presentation/3.0/#label
 * @param {Object} label
 */
export function getLabelValue(label) {
  let decodeHTML = (labelText) => {
    return labelText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  };
  if (label && typeof label === 'object') {
    const labelKeys = Object.keys(label);
    if (labelKeys && labelKeys.length > 0) {
      // Get the first key's first value
      const firstKey = labelKeys[0];
      return label[firstKey].length > 0 ? decodeHTML(label[firstKey][0]) : '';
    }
  } else if (typeof label === 'string') {
    return decodeHTML(label);
  }
  return 'Label could not be parsed';
}

/**
 * Get the canvas ID from the URI of the clicked structure item
 * @param {String} uri URI of the item clicked in structure
 */
export function getCanvasId(uri) {
  if (uri !== undefined) {
    return uri.split('#t=')[0].split('/').reverse()[0];
  }
}

/**
 * Get the duration of a selected canvas in the manifest
 * @param {Object} manifest
 * @param {Number} canvasId index of the selected canvas
 * @returns duration of the selected canvas
 */
export function getCanvasDuration(manifest, canvasId) {
  try {
    let canvas = parseManifest(manifest).getSequences()[0].getCanvases()[
      canvasId
    ];
    if (canvas) {
      return canvas.getDuration();
    }
  } catch (e) {
    console.error('Cannot parse manifest, ', e);
  }
}

/* Determine there is a next section to play when the current section ends
 * @param { Object } obj
 * @param { Number } obj.canvasIndex index of the canvas in manifest
 * @param { Object } obj.manifest
 * @return {Boolean}
 */
export function hasNextSection({ canvasIndex, manifest }) {
  let canvasIDs = parseManifest(manifest)
    .getSequences()[0]
    .getCanvases()
    .map((canvas) => canvas.id);
  return canvasIDs.length - 1 > canvasIndex ? true : false;
}

/**
 * Retrieve the next item in the structure to be played when advancing from
 * canvas to next when media ends playing
 * @param {Object} obj
 * @param {Number} obj.canvasIndex index of the current canvas in manifets
 * @param {Object} obj.manifest
 * @return {Object} next item in the structure
 */
export function getNextItem({ canvasIndex, manifest }) {
  if (hasNextSection({ canvasIndex, manifest }) && manifest.structures) {
    const nextSection = manifest.structures[0].items[canvasIndex + 1];
    if (nextSection.items) {
      return nextSection.items[0];
    }
  }
  return null;
}

/**
 * Get the id (url with the media fragment) from a given item
 * @param {Object} item an item in the structure
 */
export function getItemId(item) {
  if (!item) {
    return;
  }
  if (item['items']) {
    return item['items'][0]['id'];
  }
}

/**
 * Get the all the media fragments in the current canvas's structure
 * @param {Object} obj
 * @param {Object} obj.manifest
 * @returns {Array} array of media fragments in a given section
 */
export function getSegmentMap({ manifest }) {
  if (!manifest.structures || manifest.structures.length < 1) {
    return [];
  }
  const structItems = manifest.structures[0]['items'];
  let segments = [];

  let getSegments = (item) => {
    const childCanvases = getChildCanvases({ rangeId: item.id, manifest });
    if (childCanvases.length == 1) {
      segments.push(item);
      return;
    } else {
      const items = item['items'];
      for (let i of items) {
        if (i['items']) {
          if (i['items'].length == 1 && i['items'][0]['type'] === 'Canvas') {
            segments.push(i);
          } else {
            getSegments(i);
          }
        }
      }
    }
  };
  // check for empty structural metadata within structures
  if (structItems.length > 0) {
    structItems.map((item) => getSegments(item));
    return segments;
  } else {
    return [];
  }
}

/**
 * Get poster image for video resources
 * @param {Object} manifest
 */
export function getPoster(manifest) {
  if (!parseManifest(manifest).getThumbnail()) {
    return null;
  }
  let posterUrl = parseManifest(manifest).getThumbnail()['id'];
  return posterUrl;
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
    const canvases = canvasesInManifest(manifest);
    const currentCanvasIndex = canvases
      .map(function (c) {
        return c.canvasId;
      })
      .indexOf(canvasId);
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
 * @param {Number} canvasIndex
 * @returns List of files under `rendering` property in manifest
 */
export function getRenderingFiles(manifest, canvasIndex) {
  let files = [];
  const manifestParsed = parseManifest(manifest);
  let manifestRendering = manifestParsed.getRenderings();

  let canvas = manifestParsed.getSequences()[0]
    .getCanvasByIndex(canvasIndex);
  let canvasRendering = canvas.__jsonld.rendering;

  let buildFileInfo = (format, label, id) => {
    const mime = mimeDb[format];
    const extension = mime ? mime.extensions[0] : format;
    const filename = getLabelValue(label);
    const file = {
      id: id,
      label: `${filename} (.${extension})`,
      filename: filename,
    };
    return file;
  };

  manifestRendering.map((r) => {
    const file = buildFileInfo(r.getFormat(), r.getProperty('label'), r.id);
    files.push(file);
  });

  if (canvasRendering) {
    canvasRendering.map((r) => {
      const file = buildFileInfo(r.format, r.label, r.id);
      files.push(file);
    });
  }
  return files;
}
