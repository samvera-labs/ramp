import { parseManifest, Annotation } from "manifesto.js";
import { getAnnotations, getLabelValue, timeToHHmmss } from "./utility-helpers";

export function getAnnotationService(manifest) {
  const service = parseManifest(manifest).getService();
  if (service && service.getProperty('type') === 'AnnotationService0') {
    return service.id;
  } else {
    return null;
  }
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
      const marker = parseMarkerAnnotation(a);
      if (marker) {
        markers.push(marker);
      }
    });
    return { markers, error: '' };
  }
}

export function parseMarkerAnnotation(a) {
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
    return marker;
  } else {
    return null;
  }
}

export function createNewAnnotation(annotationInfo) {
  const annotation = new Annotation(annotationInfo);
  return annotation;
}
