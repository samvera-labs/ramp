import { parseManifest, Annotation } from "manifesto.js";
import { getLabelValue, parseAnnotations, parseSequences, timeToHHmmss } from "./utility-helpers";

/**
 * Parse annotation service endpoint
 * @function PlaylistParser#getAnnotationService
 * @param {Object} service service property of Manifest
 * @returns {URL} Annotation service endpoint
 */
export function getAnnotationService(service) {
  if (service?.length > 0 && service[0]?.type === 'AnnotationService0') {
    return service[0].id;
  } else {
    return null;
  }
}

/**
 * Parses the manifest to identify whether it is a playlist manifest
 * or not
 * @function PlaylistParser#getIsPlaylist
 * @param {String} manifestTitle
 * @returns {Boolean}
 */
export function getIsPlaylist(manifestTitle) {
  if (manifestTitle) {
    let isPlaylist = getLabelValue(manifestTitle).includes('[Playlist]');
    return isPlaylist;
  } else {
    console.warn('playlist-parser -> getIsPlaylist() -> manifest.label not found');
    return false;
  }
}

/**
 * Parse `highlighting` annotations with TextualBody type as markers
 * for all the Canvases in the given Manifest
 * @param {Object} manifest
 * @returns {Array<Object>} JSON object array with markers information for each
 * Canvas in the given Manifest.
 * [{ canvasIndex: Number,
 *    canvasMarkers: [{
 *      id: String,
 *      time: Number,
 *      timeStr: String,
 *      canvasId: String,
 *      value: String
 *    }]
 * }]
 *
 */
export function parsePlaylistAnnotations(manifest) {
  try {
    let canvases = manifest.items;
    let allMarkers = [];

    if (canvases) {
      canvases.map((canvas, index) => {
        let annotations = canvas.annotations;

        if (!annotations || annotations[0]?.items.length === 0) {
          allMarkers.push({ canvasMarkers: [], canvasIndex: index });
        } else if (annotations[0]?.items.length > 0) {
          let canvasMarkers = [];
          const highlightingAnnotations = annotations[0].items.filter(
            (a) => a.motivation === 'highlighting');
          if (highlightingAnnotations?.length > 0) {
            highlightingAnnotations.map((a) => {
              const marker = parseMarkerAnnotation(a);
              if (marker) {
                canvasMarkers.push(marker);
              }
            });
          }
          allMarkers.push({ canvasMarkers, canvasIndex: index });
        } else {
          allMarkers.push({ canvasMarkers: [], canvasIndex: index });
        }
      });
    }
    return allMarkers;
  } catch (error) {
    throw error;
  }
}

/**
 * Parse a manifesto.js Annotation object for a marker annotation into
 * a JSON object with information required to display the annotation in
 * the UI
 * @param {Object} a manifesto.js Annotation object
 * @returns {Object} a json object for a marker
 * { id: String, time: Number, timeStr: String, canvasId: String, value: String}
 */
export function parseMarkerAnnotation(a) {
  if (!a) {
    return null;
  }
  let [canvasId, time] = a.target.split('#t=');
  let markerBody = a.body;
  if (Object.keys(markerBody).length === 0) {
    return null;
  } else if (markerBody?.type === 'TextualBody') {
    const marker = {
      id: a.id,
      time: parseFloat(time),
      timeStr: timeToHHmmss(parseFloat(time), true, true),
      canvasId: canvasId,
      value: markerBody?.value ?? '',
    };
    return marker;
  } else {
    return null;
  }
}

/**
 * Wrapper for manifesto.js Annotation constructor
 * @param {Object} annotationInfo JSON object with annotation information
 * @returns {Annotation}
 */
export function createNewAnnotation(annotationInfo) {
  const annotation = new Annotation(annotationInfo);
  return annotation;
}
