import { parseManifest, AnnotationPage, Annotation } from 'manifesto.js';
import { getMediaFragment } from './iiif-parser';
import { fetchJSONFile, fetchTextFile, timeToS } from './utility-helpers';

/**
 * Parse a given transcript file into a format the Transcript component
 * can render on the UI. E.g.: text file -> returns null, so that the Google
 * doc viewer is rendered, IIIF manifest -> extract and parse transcript data
 * within the manifest.
 * @param {String} url URL of the transcript file selected
 * @param {Number} canvasIndex Current canvas rendered in the player
 * @returns {Object}  Array of trancript data objects with download URL
 */
export async function parseTranscriptData(url, canvasIndex) {
  let tData = [];
  let tUrl = url;

  if (!url) {
    return null;
  }
  const isValid =
    url.match(
      /(http(s)?:\/\/.)[-a-zA-Z0-9.:]*\/(.*\/\.html|.*\.txt|.*\.json|.*\.vtt|.*\.[a-zA-z])/g
    ) !== null;

  if (!isValid) {
    return null;
  }

  let extension = url.split('.').reverse()[0];
  // Use .doc extension for both .docx and .doc for each of understanding
  extension = extension == 'docx' || extension == 'doc' ? 'doc' : extension;

  switch (extension) {
    case 'json':
      let jsonData = await fetchJSONFile(tUrl);
      let manifest = parseManifest(jsonData);
      if (manifest) {
        return parseManifestTranscript(jsonData, url, canvasIndex);
      } else {
        tData = parseJSONData(jsonData);
        return { tData, tUrl };
      }
    case 'vtt':
      tData = await parseWebVTT(url);
      return { tData, tUrl: url };
    case 'txt':
      tData = fetchTextFile(url);
      return { tData: null, tUrl: url };
    case 'doc':
      return { tData: null, tUrl: url };
    default:
      return { tData: [], tUrl: url };
  }
}

/**
 * Parse json data into Transcript component friendly
 * format
 * @param {Object} jsonData array of JSON objects
 * @returns {Array}
 */
function parseJSONData(jsonData) {
  if (jsonData.length == 0) {
    return null;
  }

  let tData = [];
  for (let jd of jsonData) {
    if (jd.speaker) {
      const { speaker, spans } = jd;
      for (let span of spans) {
        span.speaker = speaker;
        tData.push(span);
      }
    } else {
      for (let span of jd.spans) {
        tData.push(span);
      }
    }
  }
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
 * @param {Object} manifest IIIF manifest data
 * @param {String} manifestURL IIIF manifest URL
 * @param {Number} canvasIndex Current canvas index
 * @returns {Object} object with the structure;
 * { tData: transcript data, tUrl: file url }
 */
export function parseManifestTranscript(manifest, manifestURL, canvasIndex) {
  let tData = [];
  let tUrl = manifestURL;
  let isExternalAnnotation = false;

  let annotations = [];

  if (manifest.annotations) {
    annotations = parseAnnotations(manifest.annotations);
  } else {
    annotations = getAnnotations({ manifest, canvasIndex });
  }

  // determine whether annotations point to an external resource or
  // a list of transcript fragments
  if (annotations.length > 0) {
    let annotation = annotations[0];
    let tType = annotation.getBody()[0].getProperty('type');
    if (tType == 'TextualBody') {
      isExternalAnnotation = false;
    } else {
      isExternalAnnotation = true;
    }
  } else {
    return { tData: [], tUrl };
  }

  if (isExternalAnnotation) {
    const annotation = annotations[0];
    return parseExternalAnnotations(annotation);
  } else {
    tData = createTData(annotations);
    return { tData, tUrl };
  }
}

/**
 * Parse annotation linking to external resources like WebVTT, Text, and
 * AnnotationPage .json files
 * @param {Annotation} annotation Annotation from the manifest
 * @returns {Object} object with the structure { tData: [], tUrl: '' }
 */
async function parseExternalAnnotations(annotation) {
  let tData = [];
  let tBody = annotation.getBody()[0];
  let tUrl = tBody.getProperty('id');
  let tType = tBody.getProperty('type');

  /** When external file contains text data */
  if (tType === 'Text') {
    if (tBody.getFormat() === 'text/vtt') {
      tData = await parseWebVTT(tUrl);
    } else {
      await fetch(tUrl)
        .then((response) => response.text())
        .then((data) => {
          // Keeping data = null prompts plain text view
          // in the transcript component
          tData = null;
        });
    }
    /** When external file contains timed-text as annotations */
  } else if (tType === 'AnnotationPage') {
    await fetch(tUrl)
      .then((response) => response.json())
      .then((data) => {
        const annotations = parseAnnotations([data]);
        tData = createTData(annotations);
      });
  }
  return { tData, tUrl };
}

/**
 * Extract list of Annotation from manifest from `annotations` prop
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF manifest
 * @param {Number} obj.canvasIndex curent canvas's index
 * @returns {Array} array of AnnotationPage
 */
function getAnnotations({ manifest, canvasIndex }) {
  let annotations = [];
  // When annotations are at canvas level
  const annotationPage = parseManifest(manifest)
    .getSequences()[0]
    .getCanvases()[canvasIndex];

  if (annotationPage) {
    annotations = parseAnnotations(annotationPage.__jsonld.annotations);
  }
  return annotations;
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
  let items = annotationPage.getItems();
  for (let i = 0; i < items.length; i++) {
    let a = items[i];
    let annotation = new Annotation(a, {});
    let motivation = annotation.getMotivation();
    if (motivation == 'supplementing') {
      content.push(annotation);
    }
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
 *    begin: 0,
 *    end: 60,
 *    text: 'Transcript text',
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
        text: tBody.getProperty('value'),
        format: tBody.getFormat(),
        begin: parseFloat(start),
        end: parseFloat(stop),
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
 *    begin: '00:00:00.000',
 *    end: '00:01:00.000',
 *    text: 'Transcript text sample'
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
 *    begin: 0,
 *    end: 60,
 *    text: 'Transcript text sample'
 * }
 */
function parseWebVTTLine({ times, line }) {
  const timestampRegex = /([0-9]*:){2}([0-9]{2})\.[0-9]{2,3}/g;

  let [start, end] = times.split(' --> ');
  if (!start.match(timestampRegex) || !end.match(timestampRegex)) {
    console.error('Invalid timestamp in line with text; ', line);
    return null;
  }
  let transcriptText = { begin: timeToS(start), end: timeToS(end), text: line };
  return transcriptText;
}
