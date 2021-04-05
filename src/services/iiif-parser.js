import { parseManifest } from 'manifesto.js';

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

/**
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @returns {Array.<Object>} array of file choice objects
 */
export function getMediaInfo({ manifest, canvasIndex }) {
  let choiceItems,
    sources = [];
  let isSelected = false;

  try {
    choiceItems = parseManifest(manifest)
      .getSequences()[0]
      .getCanvases()
      [canvasIndex].getContent()[0]
      .getBody();
  } catch (e) {
    console.log('error fetching content', e);
    return { error: 'Error fetching content' };
  }

  if (choiceItems.length === 0) {
    return {
      error: 'No media sources found',
    };
  } else {
    try {
      sources = choiceItems.map((item) => {
        let source = {
          src: item.id,
          // TODO: make type more generic, possibly use mime-db
          type: item.getFormat() ? item.getFormat() : 'application/x-mpegurl',
          label: item.getLabel()[0] ? item.getLabel()[0].value : 'auto',
        };
        return source;
      });

      // Mark source with quality label 'auto' as selected source
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

      let allTypes = choiceItems.map((item) => item.getType());
      let uniqueTypes = allTypes.filter((t, index) => {
        return allTypes.indexOf(t) === index;
      });
      // Default type if there are different types
      const mediaType = uniqueTypes.length === 1 ? uniqueTypes[0] : 'video';
      return { sources, mediaType, error: null };
    } catch (e) {
      return {
        error: 'Manifest cannot be parsed.',
      };
    }
  }
}

/**
 * Get captions in manifest
 */
export function getTracks({ manifest }) {
  const seeAlso = parseManifest(manifest).getSeeAlso();
  if (seeAlso !== undefined) {
    return seeAlso;
  }
  return [];
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
 * with start/stop in seconds and the duration in milliseconds
 * @function IIIFParser#getMediaFragment
 * @param {string} uri - Uri value
 * @return {Object} - Representing the media fragment ie. { start: "3287.0", stop: "3590.0" }, or undefined
 */
export function getMediaFragment(uri) {
  if (uri !== undefined) {
    const fragment = uri.split('#t=')[1];
    if (fragment !== undefined) {
      const splitFragment = fragment.split(',');
      return {
        start: splitFragment[0],
        stop: splitFragment[1],
      };
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
 *
 * @param { Object } manifest
 */
export function getStartTime(manifest) {
  // https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/ for reference
  if (manifest.start) {
    const { selector } = manifest.start;
    if (selector && selector.t) {
      return selector.t;
    }
  }
  return null;
}

/**
 * Determine there is a next section to play when the current section ends
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
  if (!manifest.structures) {
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
  getSegments(section);
  return segments;
}
