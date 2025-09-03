import mammoth from 'mammoth';
import { decode } from 'html-entities';
import {
  timeToS,
  handleFetchErrors,
  getLabelValue,
  identifyMachineGen,
  identifySupplementingAnnotation,
  getAnnotations,
} from '@Services/utility-helpers';
import { parseAnnotationSets } from '@Services/annotations-parser';

// ENum for supported transcript MIME types
export const TRANSCRIPT_MIME_TYPES = {
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
  nonTimedLine: 'NON_TIMED_LINE',
  metadata: 'METADATA'
};

export const TRANSCRIPT_MOTIVATION = 'supplementing';

/**
 * Parse the transcript information in the Manifest presented as supplementing annotations
 * @param {String} manifestURL IIIF Presentation 3.0 manifest URL
 * @param {String} title optional title given in the transcripts list in props
 * @param {AbortSignal} signal AbortSignal to cancel the fetch request
 * @returns {Array<Object>} array of supplementing annotations for transcripts for all
 * canvases in the Manifest
 */
export async function readSupplementingAnnotations(manifestURL, title = '', signal) {
  if (manifestURL === undefined) {
    return [];
  }
  let data = await fetch(manifestURL, { signal })
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
      // Parse supplementing annotations at Manifest level and display for each Canvas
      const manifestAnnotations = getAnnotations(manifest.annotations, TRANSCRIPT_MOTIVATION) ?? [];
      const manifestTranscripts =
        buildTranscriptAnnotation(manifestAnnotations, 0, manifestURL, manifest, title);

      let newTranscriptsList = [];
      if (manifest.items?.length > 0) {
        manifest.items.map((canvas, index) => {
          let annotations = getAnnotations(canvas.annotations, TRANSCRIPT_MOTIVATION);
          const canvasTranscripts =
            buildTranscriptAnnotation(annotations, index, manifestURL, canvas, title);
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
      if (error.name === 'AbortError') {
        console.warn('transcript-parser -> readSupplementingAnnotations() -> fetch aborted');
      } else {
        console.error(
          'transcript-parser -> readSupplementingAnnotations() -> error fetching transcript resource at, '
          , manifestURL
        );
      }
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
 * @param {Object} obj
 * @param {String} obj.url URL of the transcript file selected
 * @param {String} obj.format transcript file format read from Annotation
 * @param {Number} obj.canvasIndex Current canvas rendered in the player
 * @param {Boolean} obj.parseMetadata parse metadata in the transcript
 * @param {Boolean} obj.parseNotes parse notes in the transcript
 * @param {Array} obj.inlineAnnotations inline annotations in Canvas if they exist
 * @returns {Object}  Array of trancript data objects with download URL
 */
export async function parseTranscriptData({
  url, format, canvasIndex = 0, parseMetadata = false, parseNotes = false, inlineAnnotations = []
}) {
  let tData = [];
  let tUrl = url;

  // Validate given URL
  if (url === undefined) {
    return { tData, tUrl, tType: TRANSCRIPT_TYPES.invalid };
  }

  // Use parsed inline annotations instead of reading the Manifest again
  if (inlineAnnotations.length > 0) {
    tData = createTData(inlineAnnotations);
    if (tData.length === 0) {
      return { tData, tUrl: url, tType: TRANSCRIPT_TYPES.noTranscript, tFileExt: 'json' };
    }
    return { tData, tUrl: url, tType: TRANSCRIPT_TYPES.timedText, tFileExt: 'json' };
  }

  let contentType = null;
  let fileData = null;

  // Get file type
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
      if (jsonData?.type === 'Manifest') {
        const { _, annotationSets } = parseAnnotationSets(jsonData, canvasIndex);
        if (annotationSets?.length) {
          const { url, format, items } = annotationSets[0];
          // Create transcript data from parsed annotation items
          if (items != undefined) {
            tData = createTData(items);
            return { tData, tUrl, tType: TRANSCRIPT_TYPES.timedText, tFileExt: fileType };
          } else {
            // Recursively parse the linked annotation content using its url
            return parseTranscriptData({ url, format, canvasIndex, parseMetadata, parseNotes });
          }
        } else {
          return { tData, tUrl, tType: TRANSCRIPT_TYPES.noTranscript, tFileExt: fileType };
        }
      } else {
        let json = parseJSONData(jsonData);
        return { tData: json.tData, tUrl, tType: json.tType, tFileExt: fileType };
      }
    case 'txt':
      textData = await fileData.text();
      textLines = textData?.split('\n') ?? [];

      if (textData == null || textData == '' || textLines.length == 0) {
        return { tData: [], tUrl: url, tType: TRANSCRIPT_TYPES.noTranscript };
      } else {
        const parsedText = buildNonTimedText(textLines);
        return { tData: parsedText, tUrl: url, tType: TRANSCRIPT_TYPES.plainText, tFileExt: fileType };
      };
    // for timed text with WebVTT/SRT files
    case 'srt':
    case 'vtt':
      textData = await fileData.text();
      textLines = textData.split(/\r\n|\r|\n/);

      if (textData == null || textData == '' || textLines.length == 0) {
        return { tData: [], tUrl: url, tType: TRANSCRIPT_TYPES.noTranscript };
      } else {
        let { tData, tType } = parseTimedText(textData, parseMetadata, parseNotes, fileType === 'srt');
        return { tData: tData, tUrl: url, tType: tType, tFileExt: fileType };
      }
    // for .docx files
    case 'docx':
      tData = await parseWordFile(fileData);
      if (tData == null) {
        return { tData: [], tUrl: url, tType: TRANSCRIPT_TYPES.invalid };
      } else {
        return { tData: splitIntoElements(tData), tUrl: url, tType: TRANSCRIPT_TYPES.docx, tFileExt: fileType };
      }
    default:
      return { tData: [], tUrl: url, tType: TRANSCRIPT_TYPES.noSupport };
  }
}

/**
 * Convert a list of TextualBody annotations for a Canvas in a given IIIF Manifest,
 * into a format that supports the transcript component cue display
 * @param {Array} annotations 
 * @returns {Array}
 */
function createTData(annotations) {
  if (annotations?.length === 0) return [];
  let tData = [];

  // Build text from an array of TextualBody in an annotation
  let buildText = (texts) => {
    let annotationText = [];
    texts.forEach((text) => {
      // Use all text values except those with purpose 'tagging'
      if (!text?.purpose.includes('tagging')) {
        annotationText.push(text.value);
      }
    });
    return annotationText.join('<br>');
  };

  annotations.map((a) => {
    if (a.motivation.includes(TRANSCRIPT_MOTIVATION)) {
      const { time, value } = a;
      // Only get the text values with purpose 'supplementing'
      const texts = value.filter(v => v?.purpose.includes(TRANSCRIPT_MOTIVATION));
      const text = buildText(texts);
      const format = value?.length > 0 ? value[0].format : 'text/plain';
      // Only add if there is text
      if (text.length > 0) {
        tData.push({
          text, format,
          begin: parseFloat(time?.start ?? 0),
          end: parseFloat(time?.end ?? 0),
          tag: TRANSCRIPT_CUE_TYPES.timedCue
        });
      }
    }
  });
  return tData;
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
  if (jsonData.length == 0 || !Array.isArray(jsonData)) {
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
 * @param {Boolean} parseMetadata parse metadata in the transcript
 * @param {Boolean} parseNotes parse notes in the transcript
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
export function parseTimedText(fileData, parseMetadata, parseNotes, isSRT = false) {
  let tData = [];
  let noteLines = [];
  let metadataLines = [];
  // split file content into lines
  const lines = fileData.split('\n');

  // For SRT files all of the file content is considered as cues
  let cueLines = lines;

  if (!isSRT) {
    const { valid, cue_lines, notes, metadata } = validateWebVTT(lines, parseMetadata, parseNotes);
    if (!valid) {
      console.error('Invalid WebVTT file');
      return { tData: [], tType: TRANSCRIPT_TYPES.invalidVTT };
    }
    cueLines = cue_lines;
    noteLines = notes;
    metadataLines = metadata;
  }

  const groups = groupTimedTextLines(cueLines, parseNotes);

  // Add back the NOTE(s) and metadata in the header block
  groups.unshift(...noteLines);
  groups.unshift(...metadataLines);

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
 * @param {Boolean} parseMetadata parse metadata in the transcript
 * @param {Boolean} parseNotes parse notes in the transcript
 * @returns {Object}
 */
function validateWebVTT(lines, parseMetadata, parseNotes) {
  let linePointer = 0;

  // Trim whitespace from the start and end of the signature
  const signature = lines[0].trim();
  // Validate the signature
  if (signature.length === 6 && signature === 'WEBVTT') {
    linePointer++;
    const { valid, cue_lines, notes, metadata } = validateWebVTTHeaders(lines, linePointer, parseMetadata, parseNotes);
    return { valid, cue_lines, notes, metadata };
  } else {
    return { valid: false, cue_lines: [], notes: [], metadata: [] };
  }
}

/**
 * Validate the text between 'WEBVTT' at the start and start of
 * VTT cues. It looks for REGION and STYLE blocks and skips over these
 * blocks. This doesn't validate the content within these blocks.
 * When there's text in the header not followed by the keywords REGION and
 * STYLE the WebVTT file is marked invalid.
 * @param {Array<String>} lines WebVTT file content split into lines
 * @param {Number} linePointer pointer to the line number in the WebVTT file
 * @param {Boolean} parseMetadata parse metadata in the transcript
 * @param {Boolean} parseNotes parse notes in the transcript
 * @returns 
 */
function validateWebVTTHeaders(lines, linePointer, parseMetadata, parseNotes) {
  let endOfHeadersIndex = 0;
  let firstCueIndex = 0;
  let notesInHeader = [];
  let metadataInHeader = [];

  // Remove line numbers for vtt cues
  lines = lines.filter((l) => (Number(l) ? false : true));
  // Check if the line is an empty line
  const notAnEmptyLine = (line) => (!line == '\r' || !line == '\n' || !line == '\r\n');

  /**
   * Logic for validating and identifying different blocks in the header is that,
   * each block is separated by zero or more empty lines according to the WebVTT specification.
   * https://www.w3.org/TR/webvtt1/#file-structure
   */
  for (let i = linePointer; i < lines.length; i++) {
    const line = lines[i].trim();
    // Skip REGION and STYLE blocks as these are related to displaying cues as overlays
    if ((/^REGION$/).test(line.toUpperCase())
      || (/^STYLE$/).test(line.toUpperCase())) {
      // Increment until an empty line is encountered within the header block
      i++;
      while (i < lines.length && notAnEmptyLine(lines[i])) {
        i++;
      }
      endOfHeadersIndex = i;
    }
    // Gather comments presented as NOTE(s) in the header block to be displayed as transcript
    else if ((/^NOTE$/).test(line.toUpperCase())) {
      let noteText = line;
      // Increment until an empty line is encountered within the NOTE block
      while (i < lines.length && notAnEmptyLine(lines[i])) {
        i++;
        noteText = `${noteText}<br />${lines[i].trim()}`;
      }
      if (parseNotes) {
        notesInHeader.push({ times: '', line: noteText, tag: TRANSCRIPT_CUE_TYPES.note });
      }
      endOfHeadersIndex = i;
    }
    // Terminate validation once the first cue is reached, need to check this before checking for metadata
    else if (line.includes('-->')) {
      // Break the loop when it reaches the first vtt cue
      firstCueIndex = i;
      break;
    }
    // Check for metadata in the header block without block prefix
    else if (typeof line === 'string' && line.trim().length != 0) {
      let metadataText = line.trim();
      while (i < lines.length && notAnEmptyLine(lines[i])) {
        i++;
        metadataText = `${metadataText}<br />${lines[i].trim()}`;
      }
      if (parseMetadata && metadataText.length > 0) {
        metadataInHeader.push({ times: '', line: metadataText, tag: TRANSCRIPT_CUE_TYPES.metadata });
      }
      endOfHeadersIndex = i;
    }
  }

  // Return the cues and comments in the header block when the given WebVTT is valid
  if (firstCueIndex > endOfHeadersIndex) {
    return {
      valid: true,
      cue_lines: lines.slice(firstCueIndex),
      notes: notesInHeader,
      metadata: metadataInHeader,
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
 * @param {Boolean} parseNotes
 * @returns {Array<Object>}
 */
function groupTimedTextLines(lines, parseNotes = false) {
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
      // If the cue text is a note and notes are not displayed in the UI, skip it
      if (!isNote || parseNotes) {
        groups.push(t);
      }
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
    case TRANSCRIPT_CUE_TYPES.metadata:
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
