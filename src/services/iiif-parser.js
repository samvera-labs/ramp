import { parseManifest } from 'manifesto.js';
import { parseAnnotations } from '@Services/transcript-parser';

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
    console.log('error fetching range canvases');
  }

  return rangeCanvases;
}

function getAnnotations({ manifest, canvasIndex }) {
  let annotations = [];
  // When annotations are at canvas level
  const annotationPage = parseManifest(manifest)
    .getSequences()[0]
    .getCanvases()[canvasIndex];

  if (annotationPage) {
    annotations = parseAnnotations(annotationPage.__jsonld.items, 'painting');
  }
  return annotations;
}

/**
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @returns {Array.<Object>} array of objects
 */
export function getMediaInfo({ manifest, canvasIndex, srcIndex }) {
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

  // Canvas properties
  const canvasProps = {
    duration: canvas.getDuration(),
    height: canvas.getHeight(),
    width: canvas.getWidth(),
  };

  const annotations = getAnnotations({
    manifest,
    canvasIndex,
  });

  const mediaInfo = getResourceItems(
    annotations,
    srcIndex,
    canvasProps.duration
  );

  mediaInfo.canvas = canvasProps;

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

function getResourceItems(annotations, srcIndex, duration) {
  let sources = [],
    tracks = [],
    canvasTargets = [],
    isMultiSource = false;

  if (annotations.length === 0) {
    return { error: 'No resources found in Manifest' };
  } else if (annotations.length > 1) {
    isMultiSource = true;
    annotations.map((a, index) => {
      const { source, track } = getResourceInfo(a.getBody()[0]);
      const target = parseCanvasTarget(a, duration, index);
      canvasTargets.push(target);
      source.length > 0 && sources.push(source[0]);
      track.length > 0 && tracks.push(track[0]);
    });
  } else if (annotations[0].getBody()?.length > 0) {
    const annoQuals = annotations[0].getBody();
    annoQuals.map((a) => {
      const { source, track } = getResourceInfo(a);
      source.length > 0 && sources.push(source[0]);
      track.length > 0 && tracks.push(track[0]);
    });
  } else {
    return { error: 'No media sources found' };
  }
  // Set default src to auto
  sources = setDefaultSrc(sources, isMultiSource, srcIndex);
  return { canvasTargets, isMultiSource, sources, tracks };
}

function parseCanvasTarget(annotation, duration, i) {
  const target = getMediaFragment(annotation.getTarget());
  if (isNaN(target.end)) target.end = duration;
  target.end = target.end - target.start;
  target.duration = target.end;
  // Start time for continuous playback
  target.altStart = target.start;
  target.start = 0;
  target.sIndex = i;
  return target;
}

/**
 * Parse source and track information related to media
 * resources in a Canvas
 * @param {Object} item AnnotationBody object from Canvas
 * @returns parsed source and track information
 */
function getResourceInfo(item) {
  let source = [],
    track = [];
  let rType = item.getProperty('type');
  if (rType.toLowerCase() == 'text') {
    let t = {
      src: item.id,
      kind: item.getProperty('format'),
      label: item.getLabel()[0] ? item.getLabel()[0].value : '',
      srclang: item.getProperty('language'),
    };
    track.push(t);
  } else {
    let s = {
      src: item.id,
      // TODO: make type more generic, possibly use mime-db
      type: item.getProperty('format')
        ? item.getProperty('format')
        : 'application/x-mpegurl',
      kind: item.getProperty('type'),
      label: item.getLabel()[0] ? item.getLabel()[0].value : 'auto',
    };
    source.push(s);
  }
  return { source, track };
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
    console.log(srcIndex);
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
 * Takes a uri with a media fragment that looks like #=120,134 and returns an object
 * with start/end in seconds and the duration in milliseconds
 * @function IIIFParser#getMediaFragment
 * @param {string} uri - Uri value
 * @return {Object} - Representing the media fragment ie. { start: 3287.0, end: 3590.0 }, or undefined
 */
export function getMediaFragment(uri) {
  if (uri !== undefined) {
    const fragment = uri.split('#t=')[1];
    if (fragment !== undefined) {
      const splitFragment = fragment.split(',');
      return { start: Number(splitFragment[0]), end: Number(splitFragment[1]) };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
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
 * @param {Number} obj.canvasIndex
 * @returns {Array} array of media fragments in a given section
 */
export function getSegmentMap({ manifest, canvasIndex }) {
  if (!manifest.structures || manifest.structures.length < 1) {
    return [];
  }
  const section = manifest.structures[0]['items'][canvasIndex];
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
  if (section) {
    getSegments(section);
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

export function getCanvasTarget(targets, timeFragment, duration) {
  let srcIndex, fragmentStart;
  targets.map((t, i) => {
    let previousEnd = 0;
    // Get the previous item endtime for multi-item canvases
    i > 0 ? (previousEnd = targets[i].altStart) : (previousEnd = 0);
    // Fill in missing end time
    if (isNaN(end)) end = duration;

    let { start, end } = t;
    // Adjust times for multi-item canvases
    let startTime = previousEnd + start;
    let endTime = previousEnd + end;

    if (timeFragment.start >= startTime && timeFragment.start < endTime) {
      srcIndex = i;
      // Adjust time fragment start time for multi-item canvases
      fragmentStart = timeFragment.start - previousEnd;
    }
  });
  return { srcIndex, fragmentStart };
}
