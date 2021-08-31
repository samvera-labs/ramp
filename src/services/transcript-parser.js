import {
  parseManifest,
  AnnotationPage,
  Annotation,
  getProperty,
} from 'manifesto.js';
import { getMediaFragment } from './iiif-parser';
import { timeToHHmmss, fetchManifest } from './utility-helpers';

/* Parsing annotations when transcript data is fed from a IIIF manifest */
/**
 * Parse a IIIF manifest and extracts the transcript data.
 * IIIF manifests can present transcript data in a couple of different ways.
 *  1. Using 'rendering' prop to link to an external file
 *      a. when the external file contains only text
 *      b. when the external file contains annotations
 *  2. Using IIIF 'annotations' within the manifest
 * @param {Object} obj
 * @param {Object} obj.manifestURL IIIF manifest URL
 * @param {Number} obj.canvasIndex current canvas's index
 * @returns {Array<Object>}
 */
export async function parseManifestTranscript({ manifestURL, canvasIndex }) {
  let tData = [];
  let manifest = await fetchManifest(manifestURL);

  // Get 'rendering' prop at manifest level
  let rendering = parseManifest(manifest).getRenderings();
  // Get 'rendering' prop at canvas level
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
      await fetch(tUrl)
        .then((response) => response.text())
        .then((data) => {
          // FIXME::fix this to show text file using GDrive preview
          tData = null;
        });
    } else if (tFormat === 'AnnotationPage') {
      /** When external file contains timed-text as annotations */
      await fetch(tUrl)
        .then((response) => response.json())
        .then((data) => {
          const annotations = parseAnnotations([data]);
          tData = createTData(annotations);
        });
    }
  } else {
    /** Scenario: Transcript data is presented as annotations within
     *  the IIIF manifest */
    tData = getAnnotationPage({ manifest, canvasIndex });
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
function getAnnotationPage({ manifest, canvasIndex }) {
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
 *    start: '00:00:00.000',
 *    end: '00:01:00.000',
 *    value: 'Transcript text',
 *    format: 'text/plain',
 * }
 */
function createTData(annotations) {
  let tData = [];
  annotations.map((a) => {
    if (a.id != null) {
      const tBody = a.getBody()[0];
      const { start, stop } = getMediaFragment(a.getProperty('target'));
      tData.push({
        value: tBody.getProperty('value'),
        format: tBody.getFormat(),
        start: timeToHHmmss(parseFloat(start)),
        end: timeToHHmmss(parseFloat(stop)),
      });
    }
  });
  return tData;
}

/**
 * Parsing transcript data from a given WebVTT file
 * @param {String} fileURL url of the given WebVTT file
 * @returns {Array<Object>} array of JSON objects of the following
 * structure;
 * {
 *    start: '00:00:00.000',
 *    end: '00:01:00.000',
 *    value: 'Transcript text sample'
 * }
 */
export async function parseWebVTT(fileURL) {
  let tData = [];
  await fetch(fileURL)
    .then((response) => response.text())
    .then((data) => {
      const lines = cleanWebVTT(data);
      let firstLine = lines.shift();
      const valid = validateWebVTT(firstLine);
      if (!valid) {
        console.error('Invalid WebVTT file');
        return;
      }
      const groups = groupWebVTTLines(lines);
      groups.map((t) => {
        let line = parseWebVTTLine(t);
        if (line) {
          tData.push(line);
        }
      });
    });
  return tData;
}

/**
 * Validate WebVTT file with its header
 * @param {String} line header line of the WebVTT file
 * @returns {Boolean}
 */
function validateWebVTT(line) {
  if (line.includes('WEBVTT')) {
    return true;
  } else {
    return false;
  }
}

/**
 * Clean escape characters and white spaces from the data
 * and split the text into lines
 * @param {String} data WebVTT data as a blob of text
 * @returns {Array<String>}
 */
function cleanWebVTT(data) {
  // split into lines
  let lines = data.split('\n');
  // strip white spaces and lines with index
  let stripped = lines.filter((l) => !/^[0-9]*[\r]/gm.test(l));
  return stripped;
}

/**
 * Group multi line transcript text values alongside the relevant
 * timestamp values. E.g. converts,
 * ["00:00:00.000 --> 00:01:00.000", "Transcript text", " from multiple lines",
 * "00:03:00.000 --> 00:04:00.000", "Next transcript text"]
 * into
 * [
 * { times: "00:00:00.000 --> 00:01:00.000", line: "Transcript text from multiple lines" },
 * { times: "00:03:00.000 --> 00:04:00.000", line: "Next transcript text" },
 * ]
 * @param {Array<String>} lines array of lines in the WebVTT file
 * @returns {Array<Object>}
 */
function groupWebVTTLines(lines) {
  let groups = [];
  let i;
  for (i = 0; i < lines.length; ) {
    const line = lines[i];
    let t = { times: '', line: '' };
    if (line.includes('-->')) {
      t.times = line;
      i++;
      while (i < lines.length && !lines[i].includes('-->')) {
        t.line += lines[i];
        i++;
      }
      groups.push(t);
    }
  }
  return groups;
}

/**
 * Create a JSON object from the transcript data
 * @param {Object} obj
 * @param {String} obj.times string with time information
 * @param {String} obj.line string with transcript text
 * @returns {Object} of the format;
 * {
 *    start: '00:00:00.000',
 *    end: '00:01:00.000',
 *    value: 'Transcript text sample'
 * }
 */
function parseWebVTTLine({ times, line }) {
  const timestampRegex = /([0-9]*:){2}([0-9]{2})\.[0-9]{2,3}/g;

  let [start, end] = times.split(' --> ');
  if (!start.match(timestampRegex) || !end.match(timestampRegex)) {
    console.error('Invalid timestamp in line with text; ', line);
    return null;
  }
  let transcriptText = { start: start, end: end, value: line };
  return transcriptText;
}
