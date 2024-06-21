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
import { getCanvasId } from './iiif-parser';

// ENum for supported transcript MIME types
const TRANSCRIPT_MIME_TYPES = {
  webvtt: ['text/vtt'],
  srt: ['application/x-subrip', 'text/srt'],
  text: ['text/plain'],
  json: ['application/json'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

const TRANSCRIPT_MIME_EXTENSIONS = [
  { type: TRANSCRIPT_MIME_TYPES.json, ext: 'json' },
  { type: TRANSCRIPT_MIME_TYPES.webvtt, ext: 'vtt' },
  { type: TRANSCRIPT_MIME_TYPES.text, ext: 'txt' },
  { type: TRANSCRIPT_MIME_TYPES.docx, ext: 'docx' },
  { type: TRANSCRIPT_MIME_TYPES.srt, ext: 'srt' }
];

// ENum for describing transcript types include invalid and no transcript info
export const TRANSCRIPT_TYPES = {
  invalidTimedText: -3,
  noSupport: -2,
  invalid: -1,
  noTranscript: 0,
  timedText: 1,
  plainText: 2,
  docx: 3
};

// ENum for types transcript text lines in a time-synced transcript
export const TRANSCRIPT_CUE_TYPES = {
  note: 'NOTE',
  timedCue: 'TIMED_CUE',
  nonTimedLine: 'NON_TIMED_LINE'
};

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
                format: ''
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
                    id: `${labelText}-${index}-${i}`,
                    format: annotBody.getFormat() || '',
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
                format: ''
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
 * @param {String} format transcript file format read from Annotation
 * @returns {Object}  Array of trancript data objects with download URL
 */
export async function parseTranscriptData(url, canvasIndex, format) {
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

  /* 
    Use the Annotation format in the IIIF Manifest, file extension, and the 
    Content-Type in headers of the fetch request to determine the file type.
    These are checked with priority descending in the order of Annotation format,
    Content-Type in headers, and file extension in the resource URI.
  */
  let fromContentType = TRANSCRIPT_MIME_EXTENSIONS.filter(tm => tm.type.includes(contentType.split(';')[0]));
  let fromAnnotFormat = TRANSCRIPT_MIME_EXTENSIONS.filter(tm => tm.type.includes(format));
  let fileType = '';
  if (fromAnnotFormat?.length > 0) {
    fileType = fromAnnotFormat[0].ext;
  } else if (fromContentType.length > 0) {
    fileType = fromContentType[0].ext;
  } else {
    let urlExt = url.split('.').reverse()[0];
    // Only use this if it exists in the supported list of file types for the component
    let filteredExt = TRANSCRIPT_MIME_EXTENSIONS.filter(tm => tm.ext === urlExt);
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
        let { tData, tType } = parseTimedText(textData, fileType === 'srt');
        return { tData: tData, tUrl: url, tType: tType, tFileExt: fileType };
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
    }).catch(err => {
      console.error(err);
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
        if (TRANSCRIPT_MIME_TYPES.webvtt.includes(tFormat) || TRANSCRIPT_MIME_TYPES.srt.includes(tFormat)) {
          let parsed = parseTimedText(data, TRANSCRIPT_MIME_TYPES.srt.includes(tFormat));
          tData = parsed.tData;
          type = parsed.tType;
          tFileExt = TRANSCRIPT_MIME_EXTENSIONS.filter(tm => tm.type.includes(tFormat))[0].ext;
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
        tag: TRANSCRIPT_CUE_TYPES.timedCue
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
 *    tag: NOTE || TIMED_CUE
 * }
 */
export function parseTimedText(fileData, isSRT = false) {
  let tData = [];
  let noteLines = [];

  // split file content into lines
  const lines = fileData.split('\n');

  // For SRT files all of the file content is considered as cues
  let cueLines = lines;

  if (!isSRT) {
    const { valid, cue_lines, notes } = validateWebVTT(lines);
    if (!valid) {
      console.error('Invalid WebVTT file');
      return { tData: [], tType: TRANSCRIPT_TYPES.invalidTimedText };
    }
    cueLines = cue_lines;
    noteLines = notes;
  }

  const groups = groupTimedTextLines(cueLines);
  // Add back the NOTE(s) in the header block
  groups.unshift(...noteLines);
  groups.map((t) => {
    let line = parseTimedTextLine(t, isSRT);
    if (line) {
      tData.push(line);
    }
  });

  return { tData, tType: TRANSCRIPT_TYPES.timedText };
}

/**
 * Validate WebVTT file with its header content
 * @param {Array<String>} lines  WebVTT file content split into lines
 * @returns {Boolean}
 */
function validateWebVTT(lines) {
  const firstLine = lines.shift().trim();
  if (firstLine?.length == 6 && firstLine === 'WEBVTT') {
    const { valid, cue_lines, notes } = validateWebVTTHeaders(lines);
    return { valid, cue_lines, notes };
  } else {
    return { valid: false, cue_lines: [], notes: [] };
  }
}

/**
 * Validate the text between 'WEBVTT' at the start and start of
 * VTT cues. It looks for REGION and STYLE blocks and skips over these
 * blocks. This doesn't validate the content within these blocks.
 * When there's text in the header not followed by the keywords REGION and
 * STYLE the WebVTT file is marked invalid.
 * @param {Array<String>} lines WebVTT file content split into lines
 * @returns 
 */
function validateWebVTTHeaders(lines) {
  let endOfHeadersIndex = 0;
  let firstCueIndex = 0;
  let hasTextBeforeCues = false;
  let notesInHeader = [];

  // Remove line numbers for vtt cues
  lines = lines.filter((l) => (Number(l) ? false : true));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip REGION and STYLE blocks as these are related to displaying cues as overlays
    if ((/^REGION$/).test(line.toUpperCase())
      || (/^STYLE$/).test(line.toUpperCase())) {
      // Increment until an empty line is encountered within the header block
      i++;
      while (i < lines.length
        && (!lines[i] == '\r' || !lines[i] == '\n' || !lines[i] == '\r\n')) {
        i++;
      }
      endOfHeadersIndex = i;
    }
    // Gather comments presented as NOTE(s) in the header block to be displayed as transcript
    else if ((/^NOTE$/).test(line.toUpperCase())) {
      let noteText = line;
      i++;
      // Increment until an empty line is encountered within the NOTE block
      while (i < lines.length
        && (!lines[i] == '\r' || !lines[i] == '\n' || !lines[i] == '\r\n')) {
        noteText = `${noteText}<br />${lines[i].trim()}`;
        i++;
      }
      notesInHeader.push({ times: '', line: noteText, tag: TRANSCRIPT_CUE_TYPES.note });
    }
    // Terminate validation once the first cue is reached
    else if (line.includes('-->')) {
      // Break the loop when it reaches the first vtt cue
      firstCueIndex = i;
      break;
    }
    // Flag to check for invalid text before cue lines
    else if (typeof line === 'string' && line.trim().length != 0) {
      hasTextBeforeCues = true;
    }
  }

  // Return the cues and comments in the header block when the given WebVTT is valid
  if (firstCueIndex > endOfHeadersIndex && !hasTextBeforeCues) {
    return {
      valid: true,
      cue_lines: lines.slice(firstCueIndex),
      notes: notesInHeader
    };
  } else {
    return { valid: false };
  }
}

/**
 * Group multi line transcript text values alongside the relevant
 * timestamp values. E.g. converts,
 * [ 
 *  "00:00:00.000 --> 00:01:00.000", "Transcript", " from multiple lines",
 *  "00:03:00.000 --> 00:04:00.000", "Next transcript text",
 *  "NOTE This is a comment" 
 * ]
 * into
 * [
 *  { times: "00:00:00.000 --> 00:01:00.000", line: "Transcript from multiple lines", tag: "TIMED_CUE" },
 *  { times: "00:03:00.000 --> 00:04:00.000", line: "Next transcript text", tag: "TIMED_CUE" },
 *  { times: "", line: "NOTE This is a comment", tag: "NOTE" }
 * ]
 * @param {Array<String>} lines array of lines in the WebVTT file
 * @returns {Array<Object>}
 */
function groupTimedTextLines(lines) {
  let groups = [];
  let i;
  for (i = 0; i < lines.length; i++) {
    const line = lines[i];
    let t = {};
    if (line.includes('-->') || (/^NOTE/).test(line)) {
      const isNote = (/^NOTE/).test(line);
      t.times = isNote ? "" : line;
      t.tag = isNote ? TRANSCRIPT_CUE_TYPES.note : TRANSCRIPT_CUE_TYPES.timedCue;
      // Make sure there is a single space separating NOTE from the comment for single or multi-line comments
      t.line = isNote ? line.replace(/^NOTE\s*/, 'NOTE ') : '';
      i++;

      // Increment until an empty line is encountered marking the end of the block
      while (i < lines.length
        && !(lines[i] == '\r' || lines[i] == '\n' || lines[i] == '\r\n' || lines[i] == '')) {
        t.line += lines[i].endsWith('-') ? lines[i] : lines[i].replace(/\s*$/, ' ');
        i++;
      }
      t.line = t.line.trimEnd();
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
 *    text: 'Transcript text sample',
 *    tag: NOTE || TIMED_CUE
 * }
 */
function parseTimedTextLine({ times, line, tag }, isSRT) {
  let timestampRegex;
  if (isSRT) {
    // SRT allows using comma for milliseconds while WebVTT does not
    timestampRegex = /([0-9]*:){1,2}([0-9]{2})(\.|\,)[0-9]{2,3}/g;
  } else {
    timestampRegex = /([0-9]*:){1,2}([0-9]{2})\.[0-9]{2,3}/g;
  }

  switch (tag) {
    case TRANSCRIPT_CUE_TYPES.note:
      return {
        begin: 0,
        end: 0,
        text: line,
        tag
      };
    case TRANSCRIPT_CUE_TYPES.timedCue:
      let [start, end] = times.split(' --> ');
      // FIXME:: remove any styles for now, refine this
      end = end.split(' ')[0];
      if (!start.match(timestampRegex) || !end.match(timestampRegex)) {
        console.error('Invalid timestamp in line with text; ', line);
        return null;
      }
      return {
        begin: timeToS(start),
        end: timeToS(end),
        text: line,
        tag
      };
    default:
      return null;
  }
}

/**
 * Parse the content search response from the search service, and then use it to calculate
 * number of search hits for each transcripts, and create a list of matched transcript
 * lines for the search in the current transcript
 * @param {Object} response JSON response from content search API
 * @param {String} query search query from transcript search
 * @param {Array} trancripts content of the displayed transcript with ids
 * @param {String} selectedTranscript url of the selected transcript
 * @returns a list of matched transcript lines for the current search
 */
export const parseContentSearchResponse = (response, query, trancripts, selectedTranscript) => {
  if (!response || response === undefined) return [];

  let hitCounts = [];
  let searchHits = [];
  if (response.items?.length > 0) {
    let items = response.items;
    items.map((item) => {
      const anno = new Annotation(item);
      // Exclude annotations without supplementing motivation
      if (anno.getMotivation() != 'supplementing') return;

      const target = anno.getTarget();
      const targetURI = getCanvasId(target);
      const value = anno.getBody()[0].getProperty('value');
      searchHits.push({ target, targetURI, value });
    });
  }
  // Group search responses by transcript
  const allSearchHits = Object.groupBy(searchHits, ({ targetURI }) => targetURI);

  // Calculate search hit count for each transcript in the Canvas
  for (const [key, value] of Object.entries(allSearchHits)) {
    hitCounts.push({ transcriptURL: key, numberOfHits: value.length });
  }

  // Get all the matching transcript lines with the query in the current transcript
  const matchedTranscriptLines = getMatchedTranscriptLines(allSearchHits[selectedTranscript], query, trancripts);
  return { matchedTranscriptLines, hitCounts, allSearchHits };
};

/**
 * Create a list matched transcript lines for the current search for the displayed transcript
 * @param {Array} searchHits a list of matched transcript lines with ids from the current transcript
 * @param {String} query search query
 * @param {Array} transcripts list of all the transcript lines from the current transcript
 * @returns a list of matched transcrip lines in the current transcript
 */
export const getMatchedTranscriptLines = (searchHits, query, transcripts) => {
  const qStr = query.trim().toLocaleLowerCase();
  let transcriptLines = [];

  if (searchHits === undefined) return;

  searchHits.map((item) => {
    const { target, value } = item;
    // Read time offsets and text of the search hit
    const timeRange = getMediaFragment(target);

    // Replace all HTML tags
    const mappedText = value.replace(/<\/?[^>]+>/gi, '');

    let start = 0, end = 0;
    let transcirptId = undefined;
    let hit = {};
    if (timeRange != undefined) {
      // For timed-text
      start = timeRange.start; end = timeRange.end;
      transcirptId = transcripts.findIndex((t) => t.begin == start && t.end == end);
      hit.tag = TRANSCRIPT_CUE_TYPES.timedCue;
    } else {
      // For non timed-text
      transcirptId = transcripts.findIndex((t) => t.text === mappedText);
      hit.tag = TRANSCRIPT_CUE_TYPES.nonTimedLine;
    }
    const matchOffset = mappedText.toLocaleLowerCase().indexOf(qStr);
    if (matchOffset !== -1 && transcirptId != undefined) {
      const matchParts = getMatchedParts(matchOffset, mappedText, qStr);

      transcriptLines.push({
        ...hit,
        begin: start,
        end: end,
        id: transcirptId,
        match: matchParts,
        text: value,
      });
    }
  });
  return transcriptLines;
};

// FIXME:: When there are 2 hits in the same transcript text/cue, only the first
// match is highlighted.
/**
 * Generic function to split the matched transcript text into 3 parts where the output is in
 * the format [text before search query, search query, text after search query]
 * @param {Number} offset character offset to the query string in the matched transcript text/cue
 * @param {String} text matched transcript text/cue
 * @param {String} query current search query
 * @returns a list of parts of the given matched transcript text/cue
 */
export const getMatchedParts = (offset, text, query) => {
  return [
    text.slice(0, offset),
    text.slice(offset, offset + query.length),
    text.slice(offset + query.length)
  ];
};

// TODO:: Could be used for marking search hits in Word Doc transcripts?
// export const splitIntoElements = (htmlContent) => {
//   // Create a temporary DOM element to parse the HTML
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = htmlContent;
//   console.log(tempDiv);

//   // Convert child nodes into an array
//   const elements = Array.from(tempDiv.childNodes);
//   return elements;
// };
