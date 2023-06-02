import { parseManifest, Annotation, AnnotationPage } from 'manifesto.js';


// Handled file types for downloads
const VALID_FILE_EXTENSIONS = [
  'doc',
  'docx',
  'json',
  'js',
  'srt',
  'txt',
  'vtt',
  'png',
  'jpeg',
  'jpg',
  'pdf',
];


/**
 * Convert time string from hh:mm:ss.ms format to user-friendly
 * time formats.
 * Ex: 01:34:43.34 -> 01:34:43 / 00:54:56.34 -> 00:54:56
 * @param {String} time time in hh:mm:ss.ms
 * @param {Boolean} showHrs to/not to display hrs in timestamp
 * when the hour mark is not passed
 */
export function createTimestamp(secTime, showHrs) {
  let hours = Math.floor(secTime / 3600);
  let minutes = Math.floor((secTime % 3600) / 60);
  let seconds = secTime - minutes * 60 - hours * 3600;
  if (seconds > 59.9) {
    minutes = minutes + 1;
    seconds = 0;
  }
  seconds = parseInt(seconds);

  let hourStr = hours < 10 ? `0${hours}` : `${hours}`;
  let minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  let secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  let timeStr = `${minStr}:${secStr}`;
  if (showHrs || hours > 0) {
    timeStr = `${hourStr}:${timeStr}`;
  }
  return timeStr;
}

/**
 * Convert time from hh:mm:ss.ms/mm:ss.ms string format to int
 * @param {String} time convert time from string to int
 */
export function timeToS(time) {
  let [seconds, minutes, hours] = time.split(':').reverse();

  let hoursInS = hours != undefined ? parseInt(hours) * 3600 : 0;
  let minutesInS = minutes != undefined ? parseInt(minutes) * 60 : 0;
  let secondsNum = seconds === '' ? 0.0 : parseFloat(seconds);
  let timeSeconds = hoursInS + minutesInS + secondsNum;
  return timeSeconds;
}

/**
 * Convert the time in seconds to hh:mm:ss.ms format
 * @param {Number} secTime time in seconds
 * @returns {String} time as a string
 */
export function timeToHHmmss(secTime) {
  let hours = Math.floor(secTime / 3600);
  let minutes = Math.floor((secTime % 3600) / 60);
  let seconds = secTime - minutes * 60 - hours * 3600;

  let timeStr = '';
  let hourStr = hours < 10 ? `0${hours}` : `${hours}`;
  timeStr = hours > 0 ? timeStr + `${hourStr}:` : timeStr;
  let minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  timeStr = timeStr + `${minStr}:`;
  let secStr = Math.floor(seconds);
  secStr = seconds < 10 ? `0${secStr}` : `${secStr}`;
  timeStr = timeStr + `${secStr}`;
  return timeStr;
}

export function handleFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function checkSrcRange(segmentRange, range) {
  if (segmentRange.end > range.end || segmentRange.start < range.start) {
    return false;
  } else {
    return true;
  }
}

/**
 * Get the target range when multiple items are rendered from a
 * single canvas.
 * @param {Array} targets set of ranges painted on the canvas as items
 * @param {Object} timeFragment current time fragment displayed in player
 * @param {Number} duration duration of the current item
 * @returns {Object}
 */
export function getCanvasTarget(targets, timeFragment, duration) {
  let srcIndex, fragmentStart;
  targets.map((t, i) => {
    // Get the previous item endtime for multi-item canvases
    let previousEnd = i > 0 ? targets[i].altStart : 0;
    // Fill in missing end time
    if (isNaN(end)) end = duration;

    let { start, end } = t;
    // Adjust times for multi-item canvases
    let startTime = previousEnd + start;
    let endTime = previousEnd + end;

    if (timeFragment.start >= startTime && timeFragment.start < endTime) {
      srcIndex = i;
      // Adjust time fragment start time for multi-item canvases
      fragmentStart = timeFragment.start - previousEnd;
    }
  });
  return { srcIndex, fragmentStart };
}

/**
 * Facilitate file download
 * @param {String} fileUrl url of file
 * @param {String} fileName name of the file to download
 * @param {Boolean} machineGenerated flag to indicate file is machine generated/not
 */
export function fileDownload(fileUrl, fileName, machineGenerated = false) {
  const extension = fileUrl.split('.').reverse()[0];
  // If unhandled file type use .doc
  const fileExtension = VALID_FILE_EXTENSIONS.includes(extension)
    ? extension
    : 'doc';

  // If the filename doesn't include machine generated text add it to the
  // name of the file getting downloaded
  if (machineGenerated) {
    const inFilename = identifyMachineGen(fileName);
    fileName = inFilename ? fileName : `${fileName} (machine generated)`;
  }

  const link = document.createElement('a');
  link.setAttribute('href', fileUrl);
  link.setAttribute('download', `${fileName}.${fileExtension}`);
  link.style.display = 'none';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

/**
 * Takes a uri with a media fragment that looks like #=120,134 and returns an object
 * with start/end in seconds and the duration in milliseconds
 * @param {string} uri - Uri value
 * @param {number} duration - duration of the current canvas
 * @return {Object} - Representing the media fragment ie. { start: 3287.0, end: 3590.0 }, or undefined
 */
export function getMediaFragment(uri, duration) {
  if (uri !== undefined) {
    const fragment = uri.split('#t=')[1];
    if (fragment !== undefined) {
      const splitFragment = fragment.split(',');
      if (splitFragment[1] == undefined) {
        splitFragment[1] = duration;
      }
      return { start: Number(splitFragment[0]), end: Number(splitFragment[1]) };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}


/**
 * Parse json objects in the manifest into Annotations
 * @param {Array<Object>} annotations array of json objects from manifest
 * @param {String} motivation of the resources need to be parsed
 * @returns {Array<Object>} Array of Annotations
 */
export function parseAnnotations(annotations, motivation) {
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
    let annoMotivation = annotation.getMotivation();
    if (annoMotivation == motivation) {
      content.push(annotation);
    }
  }
  return content;
}

/**
 * Extract list of Annotations from `annotations`/`items`
 * under the canvas with the given motivation
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF manifest
 * @param {Number} obj.canvasIndex curent canvas's index
 * @param {String} obj.key property key to pick
 * @param {String} obj.motivation
 * @returns {Array} array of AnnotationPage
 */
export function getAnnotations({ manifest, canvasIndex, key, motivation }) {
  let annotations = [];
  // When annotations are at canvas level
  const annotationPage = parseManifest(manifest)
    .getSequences()[0]
    .getCanvases()[canvasIndex];

  if (annotationPage) {
    annotations = parseAnnotations(annotationPage.__jsonld[key], motivation);
  }
  return annotations;
}

/**
 * Parse a list of annotations or a single annotation to extract details of a
 * given a Canvas. Assumes the annotation type as either painting or supplementing
 * @param {Array} annotations list of painting/supplementing annotations to be parsed
 * @param {Number} duration duration of the current canvas
 * @param {String} motivation motivation type
 * @returns {Object} containing source, canvas targets
 */
export function getResourceItems(annotations, duration, motivation) {
  let resources = [],
    canvasTargets = [],
    isMultiSource = false;

  if (!annotations || annotations.length === 0) {
    return { error: 'No resources found in Manifest', resources };
  }
  // Multiple resource files on a single canvas
  else if (annotations.length > 1) {
    isMultiSource = true;
    annotations.map((a, index) => {
      const source = getResourceInfo(a.getBody()[0]);
      if (motivation === 'painting') {
        const target = parseCanvasTarget(a, duration, index);
        canvasTargets.push(target);
      }
      /**
       * TODO::
       * Is this pattern safe if only one of `source.length` or `track.length` is > 0?
       * For example, if `source.length` > 0 is true and `track.length` > 0 is false,
       * then sources and tracks would end up with different numbers of entries.
       * Is that okay or would that mess things up?
       * Maybe this is an impossible edge case that doesn't need to be worried about?
       */
      source.length > 0 && resources.push(source[0]);
    });
  }
  // Multiple Choices avalibale
  else if (annotations[0].getBody()?.length > 0) {
    const annoQuals = annotations[0].getBody();
    annoQuals.map((a) => {
      const source = getResourceInfo(a);
      source.length > 0 && resources.push(source[0]);
    });
  }
  // No resources
  else {
    return { resources, error: 'No resources found' };
  }
  return { canvasTargets, isMultiSource, resources };
}

function parseCanvasTarget(annotation, duration, i) {
  const target = getMediaFragment(annotation.getTarget(), duration);
  if (target != undefined || !target) {
    target.id = annotation.id;
    if (isNaN(target.end)) target.end = duration;
    target.end = Number((target.end - target.start).toFixed(2));
    target.duration = target.end;
    // Start time for continuous playback
    target.altStart = target.start;
    target.start = 0;
    target.sIndex = i;
    return target;
  }
}

/**
 * Parse source and track information related to media
 * resources in a Canvas
 * @param {Object} item AnnotationBody object from Canvas
 * @returns parsed source and track information
 */
function getResourceInfo(item) {
  let source = [];
  let s = {
    src: item.id,
    type: item.getProperty('format'),
    kind: item.getProperty('type'),
    label: item.getLabel()[0] ? item.getLabel()[0].value : 'auto',
    value: item.getProperty('value') ? item.getProperty('value') : '',
  };
  source.push(s);
  return source;
}

export function identifyMachineGen(label) {
  const regex = /(\(machine(\s|\-)generated\))/gi;
  return regex.test(label);
}
