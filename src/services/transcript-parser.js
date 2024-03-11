import { parseManifest, Annotation } from 'manifesto.js';
import mammoth from 'mammoth';
import {
  timeToS,
  handleFetchErrors,
  getLabelValue,
  getMediaFragment,
  getAnnotations,
  parseAnnotations,
  identifyMachineGen,
  identifySupplementingAnnotation,
  parseSequences,
} from './utility-helpers';

// ENum for supported transcript MIME types
const TRANSCRIPT_MIME_TYPES = {
  webvtt: 'text/vtt',
  srt: 'application/x-subrip',
  text: 'text/plain',
  json: 'application/json',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

const TRANSCRIPT_MIME_EXTENSIONS = [
  { type: TRANSCRIPT_MIME_TYPES.json, ext: 'json' },
  { type: TRANSCRIPT_MIME_TYPES.webvtt, ext: 'vtt' },
  { type: TRANSCRIPT_MIME_TYPES.text, ext: 'txt' },
  { type: TRANSCRIPT_MIME_TYPES.docx, ext: 'docx' },
  { type: TRANSCRIPT_MIME_TYPES.srt, ext: 'srt' }
];

// ENum for describing transcript types include invalid and no transcript info
export const TRANSCRIPT_TYPES = { noSupport: -2, invalid: -1, noTranscript: 0, timedText: 1, plainText: 2, docx: 3 };

/**
 * Parse the transcript information in the Manifest presented as supplementing annotations
 * @param {String} manifestURL IIIF Presentation 3.0 manifest URL
 * @param {String} title optional title given in the transcripts list in props
 * @returns {Array<Object>} array of supplementing annotations for transcripts for all
 * canvases in the Manifest
 */
export async function readSupplementingAnnotations(manifestURL, title = '') {
  let data = await fetch(manifestURL)
    .then(function (response) {
      const fileType = response.headers.get('Content-Type');
      if (fileType.includes('application/json')) {
        const jsonData = response.json();
        return jsonData;
      }
    }).then((data) => {
      const canvases = parseSequences(data)[0]
        .getCanvases();
      let newTranscriptsList = [];
      if (canvases?.length > 0) {
        canvases.map((canvas, index) => {
          let annotations = parseAnnotations(canvas.__jsonld['annotations'], 'supplementing');
          let canvasTranscripts = [];
          if (annotations.length > 0) {
            let annotBody = annotations[0].getBody()[0];
            if (annotBody.getProperty('type') === 'TextualBody') {
              let label = title.length > 0
                ? title
                : (annotBody.getLabel().getValue()
                  ? getLabelValue(annotBody.getLabel().getValue())
                  : `Canvas-${index}`
                );
              let { isMachineGen, labelText } = identifyMachineGen(label);
              canvasTranscripts.push({
                url: annotBody.id === undefined ? manifestURL : annotBody.id,
                title: labelText,
                isMachineGen: isMachineGen,
                id: `${labelText}-${index}`,
              });
            } else {
              annotations.forEach((annotation, i) => {
                let annotBody = annotation.getBody()[0];
                let label = '';
                let filename = '';
                if (annotBody.getLabel() != undefined && annotBody.getLabel().length > 1) {
                  // If there are multiple labels for an annotation assume the first
                  // is the one intended for default display.
                  label = getLabelValue(annotBody.getLabel()[0]._value);
                  // Assume that an unassigned language is meant to be the downloadable filename
                  filename = getLabelValue(annotBody.getLabel().getValue('none'));
                } else if (annotBody.getLabel() != undefined && annotBody.getLabel().length === 1) {
                  // If there is a single label, use for both label and downloadable filename
                  label = getLabelValue(annotBody.getLabel().getValue());
                } else {
                  label = `${i}`;
                }
                let id = annotBody.id;
                let sType = identifySupplementingAnnotation(id);
                let { isMachineGen, labelText } = identifyMachineGen(label);
                if (filename === '') { filename = labelText; };
                if (sType === 1 || sType === 3) {
                  canvasTranscripts.push({
                    title: labelText,
                    filename: filename,
                    url: id,
                    isMachineGen: isMachineGen,
                    id: `${labelText}-${index}-${i}`
                  });
                }
              });
            }
          }
          newTranscriptsList.push({ canvasId: index, items: canvasTranscripts });
        });
      }
      return newTranscriptsList;
    })
    .catch(error => {
      console.error(
        'transcript-parser -> readSupplementingAnnotations() -> error fetching transcript resource at, '
        , manifestURL
      );
      return [];
    });
  return data;
}

/**
 * Refine and sanitize the user provided transcripts list in the props. If there are manifests
 * in the given array process them to find supplementing annotations in the manifest and
 * them to the transcripts array to be displayed in the component.
 * @param {Array} transcripts list of transcripts from Transcript component's props
 * @returns {Array} a refined transcripts array for each canvas with the following json
 * structure;
 * { canvasId: <canvas index>, items: [{ title, filename, url, isMachineGen, id }]}
 */
export async function sanitizeTranscripts(transcripts) {
  // When transcripts list is empty in the props
  if (!transcripts || transcripts == undefined || transcripts.length == 0) {
    console.error('No transcripts given as input');
    return [];
  } else {
    let allTranscripts = [];

    // Build an empty list for each canvasId from the given transcripts prop
    transcripts.map((trs => allTranscripts.push({ canvasId: trs.canvasId, items: [] })));

    // Process the async function to resolve manifest URLs in the given transcripts array
    // parallely to extract supplementing annotations in the manifests
    let sanitizedTrs = await Promise.all(
      transcripts.map(async (transcript) => {
        const { canvasId, items } = transcript;
        let sanitizedItems = await Promise.all(
          items.map(async (item, index) => {
            const { title, url } = item;
            // For each item in the list check if it is a manifest and parse
            // the it to identify any supplementing annotations in the
            // manifest for each canvas
            const manifestTranscripts = await readSupplementingAnnotations(url, title);
            let { isMachineGen, labelText } = identifyMachineGen(title);
            let manifestItems = [];
            if (manifestTranscripts?.length > 0) {
              manifestItems = manifestTranscripts.map(mt => mt.items).flat();

              // Concat the existing transcripts list and transcripts from the manifest and
              // group them by canvasId
              let groupedTrs = groupByIndex(allTranscripts.concat(manifestTranscripts), 'canvasId', 'items');
              allTranscripts = groupedTrs;
            }

            // if manifest doesn't have canvases or
            // supplementing annotations add original transcript from props
            if (manifestTranscripts.length === 0 || manifestItems.length === 0) {
              return {
                title: labelText,
                filename: labelText,
                url: url,
                isMachineGen: isMachineGen,
                id: `${labelText}-${canvasId}-${index}`,
              };
            } else {
              return null;
            }
          })
        );
        return { canvasId, items: sanitizedItems.filter(i => i != null) };
      })
    );
    // Group all the transcripts by canvasId one last time to eliminate duplicate canvasIds
    let newTranscripts = groupByIndex(allTranscripts.concat(sanitizedTrs), 'canvasId', 'items');
    return newTranscripts;
  }
}

/**
 * Group a nested JSON object array by a given property name
 * @param {Array} objectArray nested array to reduced
 * @param {String} indexKey property name to be used to group elements in the array
 * @param {String} selectKey property to be selected from the objects to accumulated
 * @returns {Array}
 */
function groupByIndex(objectArray, indexKey, selectKey) {
  return objectArray.reduce((acc, obj) => {
    const existing = acc.filter(a => a[indexKey] == obj[indexKey]);
    if (existing?.length > 0) {
      let current = existing[0];
      current[selectKey] = current[selectKey].concat(obj[selectKey]);
    } else {
      acc.push(obj);
    }
    return acc;
  }, []);
}

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

  // Validate given URL
  if (url === undefined) {
    return { tData, tUrl, tType: TRANSCRIPT_TYPES.invalid };
  }

  let contentType = null;
  let fileData = null;

  // get file type
  await fetch(url)
    .then(handleFetchErrors)
    .then(function (response) {
      contentType = response.headers.get('Content-Type');
      fileData = response;
    })
    .catch((error) => {
      console.error(
        'transcript-parser -> parseTranscriptData() -> fetching transcript -> ',
        error
      );
    });

  if (contentType == null) {
    return { tData: [], tUrl, tType: TRANSCRIPT_TYPES.invalid };
  }

  // Use combination of the file extension and the Content-Type of
  // the fetch request to determine the file type
  let type = TRANSCRIPT_MIME_EXTENSIONS.filter(tt => tt.type == contentType.split(';')[0]);
  let fileType = '';
  if (type.length > 0) {
    fileType = type[0].ext;
  } else {
    let urlExt = url.split('.').reverse()[0];
    // Only use this if it exists in the supported list of file types for the component
    let filteredExt = TRANSCRIPT_MIME_EXTENSIONS.filter(tt => tt.ext === urlExt);
    fileType = filteredExt.length > 0 ? urlExt : '';
  }

  // Return empty array to display an error message
  if (canvasIndex === undefined) {
    return { tData, tUrl, tType: TRANSCRIPT_TYPES.noTranscript };
  }

  let textData, textLines;
  switch (fileType) {
    case 'json':
      let jsonData = await fileData.json();
      let manifest = parseManifest(jsonData);
      if (manifest) {
        return parseManifestTranscript(jsonData, url, canvasIndex);
      } else {
        let json = parseJSONData(jsonData);
        return { tData: json.tData, tUrl, tType: json.tType, tFileExt: fileType };
      }
    case 'txt':
      textData = await fileData.text();
      textLines = textData.split('\n');

      if (textLines.length == 0) {
        return { tData: [], tUrl: url, tType: TRANSCRIPT_TYPES.noTranscript };
      } else {
        let parsedText = textData.replace(/\n/g, "<br />");
        return { tData: [parsedText], tUrl: url, tType: TRANSCRIPT_TYPES.plainText, tFileExt: fileType };
      }
    // for timed text with WebVTT/SRT files
    case 'srt':
    case 'vtt':
      textData = await fileData.text();
      textLines = textData.split('\n');

      if (textLines.length == 0) {
        return { tData: [], tUrl: url, tType: TRANSCRIPT_TYPES.noTranscript };
      } else {
        tData = parseTimedText(textData, fileType === 'srt');
        return { tData: tData, tUrl: url, tType: TRANSCRIPT_TYPES.timedText, tFileExt: fileType };
      }
    // for .docx files
    case 'docx':
      tData = await parseWordFile(fileData);
      return { tData: [tData], tUrl: url, tType: TRANSCRIPT_TYPES.docx, tFileExt: fileType };
    default:
      return { tData: [], tUrl: url, tType: TRANSCRIPT_TYPES.noSupport };
  }
}

/**
 * Parse MS word documents into HTML markdown using mammoth.js
 * https://www.npmjs.com/package/mammoth
 * @param {Object} response response from the fetch request
 * @returns {Array} html markdown for the word document contents
 */
async function parseWordFile(response) {
  let tData = null;
  const data = await response.blob();
  let arrayBuffer = new File([data], name, {
    type: response.headers.get('content-type'),
  });
  await mammoth
    .convertToHtml({ arrayBuffer: arrayBuffer })
    .then(function (result) {
      tData = result.value;
    });
  return tData;
}

/**
 * Parse json data into Transcript component friendly
 * format
 * @param {Object} jsonData array of JSON objects
 * @returns {Object}
 */
function parseJSONData(jsonData) {
  if (jsonData.length == 0) {
    return { tData: [], tType: TRANSCRIPT_TYPES.noTranscript };
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
  return { tData, tType: TRANSCRIPT_TYPES.timedText };
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
    annotations = parseAnnotations(manifest.annotations, 'supplementing');
  } else {
    annotations = getAnnotations({
      manifest,
      canvasIndex,
      key: 'annotations',
      motivation: 'supplementing'
    });
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
    return { tData: [], tUrl, tType: TRANSCRIPT_TYPES.noTranscript };
  }

  if (isExternalAnnotation) {
    const annotation = annotations[0];
    return parseExternalAnnotations(annotation);
  } else {
    tData = createTData(annotations);
    return { tData, tUrl, tType: TRANSCRIPT_TYPES.timedText, tFileExt: 'json' };
  }
}

/**
 * Parse annotation linking to external resources like WebVTT, SRT, Text, and
 * AnnotationPage .json files
 * @param {Annotation} annotation Annotation from the manifest
 * @returns {Object} object with the structure { tData: [], tUrl: '', tType: '' }
 */
async function parseExternalAnnotations(annotation) {
  let tData = [];
  let type = '';
  let tBody = annotation.getBody()[0];
  let tUrl = tBody.getProperty('id');
  let tType = tBody.getProperty('type');
  let tFormat = tBody.getFormat();
  let tFileExt = '';

  /** When external file contains text data */
  if (tType === 'Text') {
    await fetch(tUrl)
      .then(handleFetchErrors)
      .then((response) => response.text())
      .then((data) => {
        if (tFormat === TRANSCRIPT_MIME_TYPES.webvtt || tFormat === TRANSCRIPT_MIME_TYPES.srt) {
          tData = parseTimedText(data, tFormat === TRANSCRIPT_MIME_TYPES.srt);
          type = TRANSCRIPT_TYPES.timedText;
          tFileExt = TRANSCRIPT_MIME_EXTENSIONS.filter(tm => tm.type === tFormat)[0].ext;
        } else {
          tData = data.replace(/\n/g, "<br />");
          type = TRANSCRIPT_TYPES.plainText;
          tFileExt = 'txt';
        }
      })
      .catch((error) => {
        console.error(
          'transcript-parser -> parseExternalAnnotations() -> fetching external transcript -> ',
          error
        );
        throw error;
      });
    /** When external file contains timed-text as annotations */
  } else if (tType === 'AnnotationPage') {
    await fetch(tUrl)
      .then(handleFetchErrors)
      .then((response) => response.json())
      .then((data) => {
        const annotations = parseAnnotations([data], 'supplementing');
        tData = createTData(annotations);
        type = TRANSCRIPT_TYPES.timedText;
        tFileExt = 'json';
      })
      .catch((error) => {
        console.error(
          'transcript-parser -> parseExternalAnnotations() -> fetching annotations -> ',
          error
        );
        throw error;
      });
  }
  return { tData, tUrl, tType: type, tFileExt };
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
      const { start, end } = getMediaFragment(a.getProperty('target'));
      tData.push({
        text: tBody.getProperty('value'),
        format: tBody.getFormat(),
        begin: parseFloat(start),
        end: parseFloat(end),
      });
    }
  });
  return tData;
}

/**
 * Parsing transcript data from a given file with timed text
 * @param {Object} fileData content in the transcript file
 * @param {Boolean} isSRT given transcript file is an SRT
 * @returns {Array<Object>} array of JSON objects of the following
 * structure;
 * {
 *    begin: '00:00:00.000',
 *    end: '00:01:00.000',
 *    text: 'Transcript text sample'
 * }
 */
export function parseTimedText(fileData, isSRT = false) {
  let tData = [];

  const lines = cleanTimedText(fileData);

  if (!isSRT) {
    const firstLine = lines.shift();
    const valid = validateWebVTT(firstLine);
    if (!valid) {
      console.error('Invalid WebVTT file');
      return [];
    }
  }
  const groups = groupTimedTextLines(lines);
  groups.map((t) => {
    let line = parseTimedTextLine(t, isSRT);
    if (line) {
      tData.push(line);
    }
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
function cleanTimedText(data) {
  // split into lines
  let lines = data.split('\n');
  // remove empty lines
  let text_lines = lines.filter((l) => l.length > 0);
  // remove line numbers
  text_lines = text_lines.filter((l) => (Number(l) ? false : true));
  // strip white spaces and lines with index
  let stripped = text_lines.filter((l) => !/^[0-9]*[\r]/gm.test(l));
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
function groupTimedTextLines(lines) {
  let groups = [];
  let i;
  for (i = 0; i < lines.length;) {
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
function parseTimedTextLine({ times, line }, isSRT) {
  let timestampRegex;
  if (isSRT) {
    // SRT allows using comma for milliseconds while WebVTT does not
    timestampRegex = /([0-9]*:){1,2}([0-9]{2})(\.|\,)[0-9]{2,3}/g;
  } else {
    timestampRegex = /([0-9]*:){1,2}([0-9]{2})\.[0-9]{2,3}/g;
  }

  let [start, end] = times.split(' --> ');
  // FIXME:: remove any styles for now, refine this
  end = end.split(' ')[0];
  if (!start.match(timestampRegex) || !end.match(timestampRegex)) {
    console.error('Invalid timestamp in line with text; ', line);
    return null;
  }
  let transcriptText = { begin: timeToS(start), end: timeToS(end), text: line };
  return transcriptText;
}
