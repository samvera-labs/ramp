import {
  parseManifest,
  AnnotationPage,
  Annotation,
  getProperty,
} from 'manifesto.js';

/**
 * When timed text transcript is fed from JSON blob,
 * Assumes the following format for each JSON object;
 * {
 *      "start": 0.0,
 *      "end": 0.20,
 *      "value": "This is the transcript text"
 * }
 * @param {Object} transcript JSON object with transcript data
 * @param {String} canvasId URL of the canvas
 */
export function parseTranscriptData(transcriptData, canvasId) {
  let tData = [];
  transcriptData.map((transcript) => {
    const { start, end, value } = transcript;
    tData.push({
      tValue: value,
      tMediaFragment: canvasId + '#t=' + start + ',' + end,
      tFormat: 'text/plain',
    });
  });
  console.log('Transcript from an external JSON blob: ', tData);
  return tData;
}

/* Parsing annotations when transcript data is fed from a IIIF manifest */

/**
 * Parse a IIIF manifest and extracts the transcript data.
 * IIIF manifests can present transcript data in a couple of different ways.
 *  1. Using 'rendering' prop to link to an external file
 *      a. when the external file contains only text
 *      b. when the external file contains annotations
 *  2. Using IIIF 'annotations' within the manifest
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF manifest
 * @param {Number} obj.canvasIndex current canvas's index
 * @returns {Array<Object>}
 */
export function parseManifestTranscript({ manifest, canvasIndex }) {
  let tData = [];
  let rendering = parseManifest(manifest).getRenderings();
  if (rendering.length == 0) {
    rendering = parseManifest(manifest)
      .getSequences()[0]
      .getCanvases()
      [canvasIndex].getRenderings();
  }
  if (rendering.length != 0) {
    /** Scenario: Transcript data is presented using 'rendering' prop */
    const tFormat = rendering[0].getProperty('type');
    const tUrl = rendering[0].getProperty('id');

    if (tFormat === 'Text') {
      /** When external file contains only text data */
      fetch(tUrl)
        .then((response) => response.text())
        .then((data) => {
          tData.push({
            tValue: data,
            tFormat: 'text/plain',
            tMediaFragment: null,
          });
          console.log(
            "Using 'rendering' prop for text transcript at manifest level: ",
            tData
          );
        });
    } else if (tFormat === 'AnnotationPage') {
      /** When external file contains timed-text as annotations */
      fetch(tUrl)
        .then((response) => response.json())
        .then((data) => {
          const annotations = parseAnnotations([data]);
          tData = createTData(annotations);
          console.log(
            "Using 'rendering' prop for annotated transcript at canvas level: ",
            tData
          );
        });
    }
  } else {
    /** Scenario: Transcript data is presented as annotations within
     *  the IIIF manifest */
    tData = getAnnotationPage({ manifest, canvasIndex });
    console.log("Using 'annotations' within IIIF manifest: ", tData);
  }
  return tData;
}

/**
 * Extract `annotations` property from manifest
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF manifest
 * @param {Number} obj.canvasIndex curent canvas's index
 * @returns {Array} array of JSON objects
 */
export function getAnnotationPage({ manifest, canvasIndex }) {
  // When annotations are at canvas level
  const annotations = parseAnnotations(
    parseManifest(manifest).getSequences()[0].getCanvases()[canvasIndex]
      .__jsonld.annotations
  );
  const tData = createTData(annotations);
  return tData;
}

/**
 * Parse json objects in the manifest into Annotations
 * @param {Array<Object>} annotations array of json objects from manifest
 * @returns {Array<Object>} Array of Annotations
 */
function parseAnnotations(annotations) {
  let content = [];
  if (!annotations) return content;
  // should be contained in an AnnotationPage
  let annotationPage = null;
  if (annotations.length) {
    annotationPage = new AnnotationPage(annotations[0], {});
  }
  if (!annotationPage) {
    return content;
  }
  let items = annotationPage.__jsonld.items;
  for (let i = 0; i < items.length; i++) {
    let a = items[i];
    let annotation = new Annotation(a, {});
    content.push(annotation);
  }
  return content;
}

/**
 * Converts Annotation to the common format that the
 * transcripts component expects
 * @param {Array<Object>} annotations array of Annotations
 * @returns {Array<Object>} array of JSON objects
 * Structure of the JSON object is as follows;
 * {
 *    tValue: 'Transcript text',
 *    tFormat: 'text/plain',
 *    tMediaFragment: 'http://example.com/canvas#t=2.0,3.0'
 * }
 */
function createTData(annotations) {
  let tData = [];
  annotations.map((a) => {
    if (a.id != null) {
      const tBody = a.getBody()[0];
      tData.push({
        tValue: tBody.getProperty('value'),
        tFormat: tBody.getFormat(),
        tMediaFragment: a.getProperty('target'),
      });
    }
  });
  return tData;
}
