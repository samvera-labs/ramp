import { Annotation } from 'manifesto.js';
import mammoth from 'mammoth';
import { decode } from 'html-entities';
import {
  timeToS,
  handleFetchErrors,
  getLabelValue,
  getMediaFragment,
  identifyMachineGen,
  identifySupplementingAnnotation,
  groupBy,
  getAnnotations,
} from '@Services/utility-helpers';
import { getCanvasId } from '@Services/iiif-parser';

// ENum for supported transcript MIME types
const TRANSCRIPT_MIME_TYPES = {
  webvtt: ['text/vtt'],
  srt: ['application/x-subrip', 'text/srt'],
  text: ['text/plain'],
  json: ['application/json'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

export const VTT_TIMESTAMP_REGEX = /^(?:\d{2}:)?\d{2}:\d{2}(?:\.\d+)/g;
// SRT allows using comma for milliseconds while WebVTT does not
export const SRT_TIMESTAMP_REGEX = /^(?:\d{2}:)?\d{2}:\d{2}(?:[.,]\d+)/g;

const TRANSCRIPT_MIME_EXTENSIONS = [
  { type: TRANSCRIPT_MIME_TYPES.json, ext: 'json' },
  { type: TRANSCRIPT_MIME_TYPES.webvtt, ext: 'vtt' },
  { type: TRANSCRIPT_MIME_TYPES.text, ext: 'txt' },
  { type: TRANSCRIPT_MIME_TYPES.docx, ext: 'docx' },
  { type: TRANSCRIPT_MIME_TYPES.srt, ext: 'srt' }
];

// ENum for describing transcript types include invalid and no transcript info
export const TRANSCRIPT_TYPES = {
  invalidTimestamp: -4,
  invalidVTT: -3,
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
  if (manifestURL === undefined) {
    return [];
  }
  let data = await fetch(manifestURL)
    .then(function (response) {
      const fileType = response.headers.get('Content-Type');
      if (fileType.includes('application/json')) {
        const jsonData = response.json();
        return jsonData;
      } else {
        // Avoid throwing an error when fetched file is not a JSON
        return {};
      }
    }).then((manifest) => {
      const manifestAnnotations = getAnnotations(manifest.annotations, 'supplementing') ?? [];
      const manifestTranscripts = buildTranscriptAnnotation(manifestAnnotations, 0, manifestURL, manifest, title);

      let newTranscriptsList = [];
      if (manifest.items?.length > 0) {
        manifest.items.map((canvas, index) => {
          let annotations = getAnnotations(canvas.annotations, 'supplementing');
          const canvasTranscripts = buildTranscriptAnnotation(annotations, index, manifestURL, canvas, title);
          newTranscriptsList.push({
            canvasId: index,
            // Merge canvas and manifest transcripts
            items: [...canvasTranscripts, ...manifestTranscripts]
          });
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

function buildTranscriptAnnotation(annotations, index, manifestURL, resource, title) {
  // Get AnnotationPage label if it is available
  let annotationLabel = resource.annotations?.length > 0 && resource.annotations[0].label
    ? getLabelValue(resource.annotations[0].label) : title;
  let canvasTranscripts = [];
  if (annotations.length > 0) {
    // Check if 'body' property is an array
    let annotBody = annotations[0].body?.length > 0
      ? annotations[0].body[0] : annotations[0].body;
    if (annotBody.type === 'TextualBody') {
      let label = title.length > 0
        ? title
        : (annotationLabel ? annotationLabel : `${resource.type}-${index}`);
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
        let annotBody = annotation.body;
        let label = '';
        let filename = '';
        if (annotBody.label && Object.keys(annotBody.label).length > 0) {
          const languages = Object.keys(annotBody.label);
          if (languages?.length > 1) {
            // If there are multiple labels for an annotation assume the first
            // is the one intended for default display.
            label = getLabelValue(annotBody.label);
            // Assume that an unassigned language is meant to be the downloadable filename
            filename = annotBody.label.hasOwnProperty('none') ? getLabelValue(annotBody.label.none[0]) : label;
          } else {
            // If there is a single label, use for both label and downloadable filename
            label = getLabelValue(annotBody.label);
          }
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
            format: annotBody.format || '',
          });
        }
      });
    }
  }
  return canvasTranscripts;
};

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
export function groupByIndex(objectArray, indexKey, selectKey) {
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
 * @param {String} format transcript file format read from Annotation
 * @param {Number} canvasIndex Current canvas rendered in the player
 * @returns {Object}  Array of trancript data objects with download URL
 */
export async function parseTranscriptData(url, format, canvasIndex) {
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

  let textData, textLines;
  switch (fileType) {
    case 'json':
      let jsonData = await fileData.json();
      if (jsonData?.type === 'AnnotationPage') {
        // TODO:: parse AnnotationPage
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
        const parsedText = buildNonTimedText(textLines);
        return { tData: parsedText, tUrl: url, tType: TRANSCRIPT_TYPES.plainText, tFileExt: fileType };
      };
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
      return { tData: splitIntoElements(tData), tUrl: url, tType: TRANSCRIPT_TYPES.docx, tFileExt: fileType };
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
        span.format = 'text/plain';
        span.tag = TRANSCRIPT_CUE_TYPES.timedCue;
        tData.push(span);
      }
    }
  }
  return { tData, tType: TRANSCRIPT_TYPES.timedText };
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
      return { tData: [], tType: TRANSCRIPT_TYPES.invalidVTT };
    }
    cueLines = cue_lines;
    noteLines = notes;
  }

  const groups = groupTimedTextLines(cueLines);

  // Add back the NOTE(s) in the header block
  groups.unshift(...noteLines);

  let hasInvalidTimestamp = false;
  for (let i = 0; i < groups.length;) {
    let line = parseTimedTextLine(groups[i], isSRT);
    if (!line) {
      hasInvalidTimestamp ||= true;
      break;
    } else {
      tData.push(line);
      i++;
    }
  }

  return {
    tData: hasInvalidTimestamp ? null : tData,
    tType: hasInvalidTimestamp
      ? TRANSCRIPT_TYPES.invalidTimestamp
      : TRANSCRIPT_TYPES.timedText
  };
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

      // Counter to keep track of lines within a cue
      let cueLineCount = 0;
      // Increment until an empty line is encountered marking the end of the block
      while (i < lines.length
        && !(lines[i] == '\r' || lines[i] == '\n' || lines[i] == '\r\n' || lines[i] == '')) {
        // Add a line break only between lines within a cue, omit start and end of cue
        if (cueLineCount > 0) t.line += '<br>';
        t.line += lines[i].endsWith('-') ? lines[i] : lines[i].replace(/\s*$/, ' ');
        cueLineCount++;
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
    timestampRegex = SRT_TIMESTAMP_REGEX;
  } else {
    timestampRegex = VTT_TIMESTAMP_REGEX;
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
      const hitCount = getHitCountForCue(value, query, true);
      searchHits.push({ target, targetURI, value, hitCount });
    });
  }
  // Group search responses by transcript
  const allSearchHits = groupBy(searchHits, 'targetURI');

  // Calculate search hit count for each transcript in the Canvas
  for (const [key, value] of Object.entries(allSearchHits)) {
    hitCounts.push({
      transcriptURL: key,
      numberOfHits: value.reduce((acc, a) => acc + a.hitCount, 0)
    });
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

  let traversedIds = [];

  searchHits.map((item, index) => {
    let { target, value } = item;
    // Read time offsets and text of the search hit
    const timeRange = getMediaFragment(target);

    // Replace all HTML tags
    const mappedText = value.replace(/<\/?[^>]+>/gi, '');

    let start = 0, end = 0;
    let transcriptId = undefined;
    if (timeRange != undefined) {
      // For timed-text
      start = timeRange.start; end = timeRange.end;
      transcriptId = transcripts.findIndex((t) => t.begin == start && t.end == end);

      const queryText = qStr.match((/[a-zA-Z]+/gi))
        ? qStr.match((/[a-zA-Z]+/gi))[0]
        : qStr;
      const matchOffset = mappedText.toLocaleLowerCase().indexOf(queryText);

      if (matchOffset !== -1 && transcriptId != undefined) {
        const match = markMatchedParts(value, qStr, item.hitCount, true);

        transcriptLines.push({
          tag: TRANSCRIPT_CUE_TYPES.timedCue,
          begin: start,
          end: end,
          id: transcriptId,
          match,
          matchCount: item.hitCount,
          text: value,
        });
      }
    } else {
      /**
       * For non timed text, there's no unique id to match the search response to the transcript
       * lines in the UI. So use filter() method instead of findIndex() method to get all matching
       * transcript lines in the display.
       * Use traversedIds array to remember the ids of already processed transcript lines in the list
       * to avoid duplication in the matches.
       */
      const hitsInfo = matchPartsInUntimedText(transcripts, mappedText, qStr, traversedIds);
      traversedIds = hitsInfo.traversedIds;
      transcriptLines = [...transcriptLines, ...hitsInfo.hits];

      /**
       * When backend has a single block of text which is chuncked in the UI this helps to
       * traverse all transcript cues. 
       */
      while (index === searchHits.length - 1 && traversedIds?.length < transcripts.length) {
        const hitsInfo = matchPartsInUntimedText(transcripts, mappedText, qStr, traversedIds);
        traversedIds = hitsInfo.traversedIds;
        transcriptLines = [...transcriptLines, ...hitsInfo.hits];
      }
    }
  });
  return transcriptLines;
};

/**
 * Build a list of matched indexed transcript lines from content search response.
 * In Avalon, docx and plain text files are chunked by paragraphs seperated by 2 or
 * more new line characters. So, depending on the way the file is formatted the search
 * response could include chunks of the text or the full text.
 * In the library (mammoth) used in Transcript component to display docx files; the text is chunked
 * into paragraphs seperated by one or more new line characters.
 * And the search response doesn't include any text styling in the docx files. Therefore the 
 * text with style information is reformatted to include text highlights from the search response.
 * This function uses the search response to calculate the hit counts and mark them for each indexed transcript
 * line in the front-end to get the correct counts.
 * @param {Array} transcripts indexed transcript text in UI
 * @param {String} mappedText matched text from content search
 * @param {String} query search query entered by the user
 * @param {Array} traversedIds already included transcript indices
 * @returns a list of matched transcript lines
 */
const matchPartsInUntimedText = (transcripts, mappedText, query, traversedIds) => {
  const escapedQ = buildRegexReadyText(query, true, false);
  // Get hit counts for the current text, ignore matches with query preceded by - or '
  let qRegex = new RegExp(String.raw`\b${escapedQ}\b`, 'gi');
  let matched = [];
  // Start from the next cue after the last traveresed cue in the transcript
  let lastTraversedId = traversedIds[traversedIds.length - 1] + 1 || 0;

  /**
   * For untimed text the search response text could be either,
   * - mapped one to one with the cue text in Transcript component
   * - include a part of the cue text in Transcript component
   * When none of these work check if the cue text contains the search query
   */
  for (let i = lastTraversedId; i < transcripts.length; i++) {
    const t = transcripts[i];
    const cleanedText = t.text.replace(/<\/?[^>]+>/gi, '').trim();
    const matches = [...cleanedText.matchAll(qRegex)];
    const mappedTextCleaned = mappedText.trim();

    if (mappedTextCleaned == cleanedText
      || (mappedTextCleaned.includes(cleanedText) && matches?.length > 0)) {
      t.matchCount = matches?.length;
      matched.push(t);
      traversedIds.push(t.id);
      break;
    } else if (matches?.length > 0) {
      t.matchCount = [...mappedTextCleaned.matchAll(qRegex)]?.length;
      matched.push(t);
      traversedIds.push(t.id);
      break;
    } else {
      traversedIds.push(t.id);
    }
  }

  let hits = [];
  matched.map((m) => {
    const value = addStyledHighlights(m.textDisplayed, query);
    const match = markMatchedParts(value, query, m.matchCount, true);
    hits.push({
      tag: TRANSCRIPT_CUE_TYPES.nonTimedLine,
      begin: undefined,
      end: undefined,
      id: m.id,
      match,
      matchCount: m.matchCount,
      text: value
    });
  });
  return { hits, traversedIds };
};

/**
 * Generic function to mark the matched transcript text in the cue where the output has
 * <span class="ramp--transcript_highlight"></span> surrounding the matched parts
 * within the cue.
 * @param {String} text matched transcript text/cue
 * @param {String} query current search query
 * @param {Numner} hitCount number of hits returned in the search response
 * @param {Boolean} hasHighlight boolean flag to indicate text has <em> tags
 * @returns matched cue with HTML tags added for marking the hightlight 
 */
export const markMatchedParts = (text, query, hitCount, hasHighlight = false) => {
  if (text === undefined || !text) return;
  let count = 0;
  let replacerFn = (match) => {
    const cleanedMatch = match.replace(/<\/?[^>]+>/gi, '');
    // Only add highlights to search hits in the search response
    if (count < hitCount) {
      count++;
      return `<span class="ramp--transcript_highlight">${cleanedMatch}</span>`;
    } else {
      return cleanedMatch;
    }
  };
  let queryFormatted = query;
  /**
   * Content search response for a phrase search like 'Mr. Bungle' gives the response
   * with highlights in the matched text as <em>Mr</em>. <em>Bungle</em>.
   * So reconstruct the search query in the UI to match this phrase in the response.
   */
  if (hasHighlight) {
    queryFormatted = buildRegexReadyText(query);
  }

  /**
   * Content search API returns cues including "Mr. Bungle" as matches for both search queries
   * "mr bungle" and "mr. bungle".
   * When "mr bungle" is searched this function handles highlighting since the regex fails to
   * identify the matches in the cues.
   */
  let altReplace = () => {
    const matches = [...text.matchAll(/<\/?[^>]+>/gi)];
    if (matches?.length === 0) return;
    let startIndex = 0;
    let newStr = '';
    for (let j = 0; j < matches.length && count < hitCount;) {
      // Set offset to count matches based on the # of words in the phrase search query
      const splitQ = query.split(/[\s-,\?]/);
      const offset = splitQ?.length > 0
        ? (splitQ?.length * 2) - 1 : 1;

      if (matches[j] === undefined && matches[j + offset] === undefined) return;

      // Indices of start and end of the highlighted text including <em> tags
      const firstIndex = matches[j].index;
      const lastIndex = matches[j + offset].index + matches[j + offset][0].length;
      const prefix = text.slice(startIndex, firstIndex);
      const cleanedMatch = text.slice(firstIndex, lastIndex).replace(/<\/?[^>]+>/gi, '');
      newStr = `${newStr}${prefix}<span class="ramp--transcript_highlight">${cleanedMatch}</span>`;
      startIndex = lastIndex;
      j = +(offset + 1);
      count++;
      if (j == matches.length) {
        newStr = `${newStr}${text.slice(startIndex)}`;
      }
    }
    return newStr;
  };

  try {
    const queryRegex = new RegExp(String.raw`${queryFormatted}`, 'gi');
    if ([...text.matchAll(queryRegex)]?.length === 0) {
      const highlighted = altReplace();
      return highlighted;
    } else {
      return text.replace(queryRegex, replacerFn);
    }
  } catch (e) {
    console.log('Error building RegExp for query: ', query);
  }

};

/**
 * For docx files the content search response text doesn't have the formatted
 * styles in the Word document (e.g. bold text wrapped in <strong> tags). So,
 * use the styled text formatted with mammoth in the UI to add highlights from
 * the content search response.
 * @param {String} text string to be formatted
 * @param {String} query string to find and replace with <em> tags
 * @returns a string formatted with highlights
 */
export const addStyledHighlights = (text, query) => {
  if (text === undefined || !text) return;
  let replacerFn = (match) => {
    const cleanedMatch = buildRegexReadyText(match, false, true);
    return cleanedMatch;
  };

  // Regex to get matches in the text while ignoring matches with query preceded by - or '
  let queryregex = new RegExp(String.raw`\b${buildRegexReadyText(query, true, false)}\b`, 'gi');
  const styled = text.replace(queryregex, replacerFn);
  return styled;
};

/**
 * Format a given string by escaping punctuations characters and grouping 
 * punctuations and text, to make it feasible to be used to build a regular
 * expression accurately.
 * @param {String} text string to be formatted with hightlights
 * @param {Boolean} regExpReady flag to indicate the usage of the output as a regular exp
 * @param {Boolean} addHightlight flag to indicate to/not to add <em> tags
 * @returns string with <em> tags
 */
const buildRegexReadyText = (text, regExpReady = true, addHightlight = true) => {
  // Text matches in the string
  const matches = [...text.matchAll(/[a-zA-Z']+/gi)];
  // Punctuation matches in the string
  const punctuationMatches = [...text.matchAll(/([.+?"^${}\-|[\]\\])/g)];

  /**
   * If no punctuations are found within the text return text with highlights
   * For RegExp ready strings: ignore matches followed by - or '
   * e.g. omit matches as "Bungle's" when search query is "bungle"
   */
  if (punctuationMatches?.length === 0) {
    const textFormatted = addHightlight ? text.split(' ').map(t => `<em>${t}</em>`).join(' ') : text;
    const textRegex = regExpReady ? `${textFormatted}(?!['\w*])` : textFormatted;
    return textRegex;
  }

  let highlighted = '';
  let startIndex = 0;
  let i = 0;
  while (i < matches.length) {
    const match = matches[i];
    let textMatch = addHightlight ? `<em>${match[0]}</em>` : match[0];
    /**
     * When build RegExp ready string with punctuation blocks in the given string;
     * - use * quantifier for blocks either at the start/end of the string to match zero or more times
     * - use + quantifier for blocks in the middle of the string to match one or more times
     * This pattern is build according the response from the content search API results.
     */
    let punctMatch = startIndex === 0
      ? `(${text.slice(startIndex, match.index)})*`
      : `(${text.slice(startIndex, match.index)})+`;
    highlighted = regExpReady
      ? `${highlighted}${punctMatch}(${textMatch})`
      : `${highlighted}${text.slice(startIndex, match.index)}${textMatch}`;
    startIndex = match.index + match[0].length;
    if (i === matches?.length - 1) {
      highlighted = regExpReady
        ? `${highlighted}(${text.slice(startIndex)})*`
        : `${highlighted}${text.slice(startIndex)}`;
    }
    i++;
  }

  // Escape punctuation characters in string for RegExp ready strings
  let escapePunctuation = (str) => {
    const punctuationRegex = /([.?^${}|[\]\\])/g;
    return str.replace(punctuationRegex, '\\$1');
  };
  return regExpReady ? escapePunctuation(highlighted) : highlighted;
};

/**
 * Calculate hit counts for each matched transcript cue
 * @param {String} text matched transcript cue text
 * @param {String} query search query from UI
 * @param {Boolean} hasHighlight flag indicating has <em> tags or not
 * @returns 
 */
export const getHitCountForCue = (text, query, hasHighlight = false) => {
  /*
    Content search API highlights each word in the given phrase in the response.
    Threfore, use first word in the query seperated by a white space to get the hit
    counts for each cue.
    Use regex with any punctuation followed by a white space to split the query.
    e.g. query: Mr. bungle => search response: <em>Mr</em>. <em>Bungle</em>
  */
  const partialQ = query.split(/[\s.,!?;:]/)[0];
  const cleanedPartialQ = partialQ.replace(/[\[\]\-]/gi, '');
  const hitTerm = hasHighlight ? buildRegexReadyText(partialQ) : cleanedPartialQ;
  const highlightedTerm = new RegExp(String.raw`${hitTerm}`, 'gi');
  const hitCount = [...text.matchAll(highlightedTerm)]?.length;
  return hitCount;
};

// TODO:: Could be used for marking search hits in Word Doc transcripts?
export const splitIntoElements = (htmlContent) => {
  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Convert child nodes into an array
  const elements = buildNonTimedText(Array.from(tempDiv.childNodes), true);
  return elements;
};

/**
 * Build non-timed transcript text content chunks into a JSON array
 * with relevant information for display. These are then used by
 * search module to convert the transcript content into an index.
 * @param {Array} cues a list of trascript cues
 * @param {Boolean} isHTML flag to detect inlined HTML in cues
 * @returns a list of JSON objects for each cue
 */
const buildNonTimedText = (cues, isHTML = false) => {
  let indexedCues = [];
  cues.map((c) => {
    indexedCues.push({
      text: isHTML ? c.innerText : c,
      tag: TRANSCRIPT_CUE_TYPES.nonTimedLine,
      textDisplayed: isHTML ? decode(c.innerHTML) : c,
    });
  });
  return indexedCues;
};
