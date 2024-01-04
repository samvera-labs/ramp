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

const S_ANNOTATION_TYPE = { transcript: 1, caption: 2, both: 3 };

const DEFAULT_ERROR_MESSAGE = "Error encountered. Please check your Manifest.";
export let GENERIC_ERROR_MESSAGE = DEFAULT_ERROR_MESSAGE;

// Timer for displaying placeholderCanvas text when a Canvas is empty
const DEFAULT_TIMEOUT = 10000;
export let CANVAS_MESSAGE_TIMEOUT = DEFAULT_TIMEOUT;

/**
 * Sets the timer for displaying the placeholderCanvas text in the player
 * for an empty Canvas. This value defaults to 3 seconds, if the `duration`
 * property of the placeholderCanvas is undefined
 * @param {Number} timeout duration of the placeholderCanvas if given
 */
export function setCanvasMessageTimeout(timeout) {
  CANVAS_MESSAGE_TIMEOUT = timeout || DEFAULT_TIMEOUT;
}

/**
 * Sets the generic error message in the ErrorBoundary when the
 * components fail with critical error. This defaults to the given
 * vaule when a custom message is not specified in the `customErrorMessage`
 * prop of the IIIFPlayer component
 * @param {String} message custom error message from props
 */
export function setAppErrorMessage(message) {
  GENERIC_ERROR_MESSAGE = message || DEFAULT_ERROR_MESSAGE;
}

export function parseSequences(manifest) {
  let sequences = parseManifest(manifest).getSequences();
  if (sequences != undefined && sequences[0] != undefined) {
    return sequences;
  } else {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

/**
 * Convert the time in seconds to hh:mm:ss.ms format.
 * Ex: timeToHHmmss(2.836, showHrs=true, showMs=true) => 00:00:02.836
 * timeToHHmmss(362.836, showHrs=true, showMs=true) => 01:00:02.836
 * timeToHHmmss(362.836, showHrs=true) => 01:00:02
 * @param {Number} secTime time in seconds
 * @param {Boolean} showHrs to/not to display hours
 * @param {Boolean} showMs to/not to display .ms
 * @returns {String} time as a string
 */
export function timeToHHmmss(secTime, showHrs = false, showMs = false) {
  if (isNaN(secTime)) {
    return '';
  }
  let hours = Math.floor(secTime / 3600);
  let minutes = Math.floor((secTime % 3600) / 60);
  let seconds = secTime - minutes * 60 - hours * 3600;
  let timeStr = '';
  let hourStr = hours < 10 ? `0${hours}` : `${hours}`;
  timeStr = (showHrs || hours > 0) ? timeStr + `${hourStr}:` : timeStr;
  let minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  timeStr = timeStr + `${minStr}:`;
  let secStr = showMs ? seconds.toFixed(3) : parseInt(seconds);
  secStr = seconds < 10 ? `0${secStr}` : `${secStr}`;
  timeStr = timeStr + `${secStr}`;
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

export function handleFetchErrors(response) {
  if (!response.ok) {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  return response;
}

export function checkSrcRange(segmentRange, range) {
  if (segmentRange === undefined) {
    return false;
  } else if (range === undefined) {
    return true;
  } else if (segmentRange.end > range.end || segmentRange.start < range.start) {
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
 * @param {String} fileExt file extension
 * @param {Boolean} machineGenerated flag to indicate file is machine generated/not
 */
export function fileDownload(fileUrl, fileName, fileExt = '', machineGenerated = false) {
  // Avalon transcripts do not include file extensions in the fileUrl.
  // Check fileName for extension before further processing.
  let extension = fileExt === ''
    ? fileName.split('.').reverse()[0]
    : fileExt;

  // If no extension present in fileName, check for the extension in the fileUrl
  if (extension.length > 4 || extension.length < 3) {
    extension = fileUrl.split('.').reverse()[0]
  } else {
    extension
  }

  // If unhandled file type use .doc
  const fileExtension = VALID_FILE_EXTENSIONS.includes(extension)
    ? extension
    : 'doc';

  // Remove file extension from filename if it contains it
  let fileNameNoExt = fileName.endsWith(extension)
    ? fileName.split(`.${extension}`)[0]
    : fileName;

  if (machineGenerated) {
    //  Add "machine-generated" to filename of the file getting downloaded
    fileNameNoExt = `${fileNameNoExt} (machine generated)`;
  }

  // For Avalon style downloads, rely on the browser to properly determine file
  // extension unless it is an unsupported format, then we provide a '.doc'
  // extension. If extension is included in download name the browser does not
  // try to insert its own, preventing duplication or multiple extensions.
  let downloadName = fileExtension === 'doc'
    ? `${fileNameNoExt}.${fileExtension}`
    : fileNameNoExt;

  // Handle download based on the URL format
  // TODO:: research for a better way to handle this
  if (fileUrl.endsWith('transcripts') || fileUrl.endsWith('captions')) {
    // For URLs of format: http://.../<filename>.<file_extension>
    fetch(fileUrl)
      .then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = `${downloadName}`;
          a.click();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    // For URLs of format: http://.../<filename>
    const link = document.createElement('a');
    link.setAttribute('href', fileUrl);
    link.setAttribute('download', `${fileNameNoExt}.${fileExtension}`);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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
  if (items === undefined) return content;
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
  try {
    const annotationPage = parseSequences(manifest)[0]
      .getCanvases()[canvasIndex];

    if (annotationPage) {
      annotations = parseAnnotations(annotationPage.__jsonld[key], motivation);
    }
    return annotations;
  } catch (error) {
    throw error;
  }
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
    return {
      error: 'No resources found in Manifest',
      canvasTargets, resources, isMultiSource
    };
  }
  // Multiple resource files on a single canvas
  else if (annotations.length > 1) {
    isMultiSource = true;
    annotations.map((a, index) => {
      const source = getResourceInfo(a.getBody()[0], motivation);
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
      const source = getResourceInfo(a, motivation);
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
 * @param {String} motivation
 * @returns parsed source and track information
 */
function getResourceInfo(item, motivation) {
  let source = [];
  let aType = S_ANNOTATION_TYPE.both;
  if (motivation === 'supplementing') {
    aType = identifySupplementingAnnotation(item.id);
  }
  if (aType != S_ANNOTATION_TYPE.transcript) {
    let s = {
      src: item.id,
      type: item.getProperty('format'),
      kind: item.getProperty('type'),
      label: item.getLabel().getValue() || 'auto',
      value: item.getProperty('value') ? item.getProperty('value') : '',
    };
    source.push(s);
  }
  return source;
}

/**
 * Identify a string contains "machine-generated" text in different
 * variations using a regular expression
 * @param {String} label
 * @returns {Object} with the keys indicating label contains
 * "machine-generated" text and label with "machine-generated"
 * text removed
 * { isMachineGen, labelText }
 */
export function identifyMachineGen(label) {
  const regex = /(\(machine(\s|\-)generated\))/gi;
  const isMachineGen = regex.test(label);
  const labelStripped = label.replace(regex, '').trim();
  return { isMachineGen, labelText: labelStripped };
}

/**
 * Resolve captions and transcripts in supplementing annotations.
 * This is specific for Avalon's usecase, where Avalon generates
 * adds 'transcripts' and 'captions' to the URI to distinguish them.
 * In other cases supplementing annotations are displayed as both
 * captions and transcripts in Ramp.
 * @param {String} uri id from supplementing annotation
 * @returns
 */
export function identifySupplementingAnnotation(uri) {
  let identifier = uri.split('/').reverse()[0];
  if (identifier === 'transcripts') {
    return S_ANNOTATION_TYPE.transcript;
  } else if (identifier === 'captions') {
    return S_ANNOTATION_TYPE.caption;
  } else {
    return S_ANNOTATION_TYPE.both;
  }
}

/**
 * Parse the label value from a manifest item
 * See https://iiif.io/api/presentation/3.0/#label
 * @param {Object} label
 */
export function getLabelValue(label) {
  let decodeHTML = (labelText) => {
    return labelText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  };
  if (label && typeof label === 'object') {
    const labelKeys = Object.keys(label);
    if (labelKeys && labelKeys.length > 0) {
      // Get the first key's first value
      const firstKey = labelKeys[0];
      return label[firstKey].length > 0 ? decodeHTML(label[firstKey][0]) : '';
    }
  } else if (typeof label === 'string') {
    return decodeHTML(label);
  }
  return 'Label could not be parsed';
}

/**
 * Validate time input from user against the hh:mm:ss.ms format
 * @param {String} time user input time string
 * @returns {Boolean}
 */
export function validateTimeInput(time) {
  const timeRegex = /^(([0-1][0-9])|([2][0-3])):([0-5][0-9])(:[0-5][0-9](?:[.]\d{1,3})?)?$/;
  let isValid = timeRegex.test(time);
  return isValid;
}

/**
 * Scroll an active element into the view within its parent element
 * @param {Object} currentItem React ref to the active element
 * @param {Object} containerRef React ref to the parent container
 */
export function autoScroll(currentItem, containerRef) {
  // Get the difference of distances between the outer border of the active
  // element and its container(parent) element to the top padding edge of
  // their offsetParent element(body)
  let scrollHeight = currentItem.offsetTop - containerRef.current.offsetTop;
  // Height of the content in view within the parent container
  let inViewHeight = containerRef.current.clientHeight - currentItem.clientHeight;
  // Scroll the current active item into the view within its container
  containerRef.current.scrollTop = scrollHeight > inViewHeight
    ? scrollHeight - containerRef.current.clientHeight / 2 : 0;
};

export function playerHotKeys() {
  let player = document.getElementById('iiif-media-player');
  let playerInst = player?.player;
  var inputs = ['input', 'textarea'];
  var activeElement = document.activeElement;

  /** Trigger player hotkeys when focus is not on an input, textarea, or navigation tab */
  if(activeElement && (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 || activeElement.role === "tab")) {
    return;
  } else {
    var pressedKey = event.which
    // event.which key code values found at: https://css-tricks.com/snippets/javascript/javascript-keycodes/
    switch(pressedKey) {
      // Space and k toggle play/pause
      case 32:
      case 75:
        // Prevent default browser actions so that page does not react when hotkeys are used.
        // e.g. pressing space will pause/play without scrolling the page down.
        event.preventDefault();
        if (playerInst.paused()) {
          playerInst.play();
        } else {
          playerInst.pause();
        }
        break;
      // f toggles fullscreen
      case 70:
        event.preventDefault();
        // Fullscreen should only be available for videos
        if (!playerInst.isAudio()) {
          if (!playerInst.isFullscreen()) {
            playerInst.requestFullscreen();
          } else {
            playerInst.exitFullscreen();
          }
        }
        break;
      // Adapted from https://github.com/videojs/video.js/blob/bad086dad68d3ff16dbe12e434c15e1ee7ac2875/src/js/control-bar/mute-toggle.js#L56
      // m toggles mute
      case 77:
        event.preventDefault();

        const vol = playerInst.volume();
        const lastVolume = playerInst.lastVolume_();

        if (vol === 0) {
          const volumeToSet = lastVolume < 0.1 ? 0.1 : lastVolume;

          playerInst.volume(volumeToSet);
          playerInst.muted(false);
        } else {
          playerInst.muted(playerInst.muted() ? false : true);
        }
        break;
      // Left arrow seeks 5 seconds back
      case 37:
        event.preventDefault();
        playerInst.currentTime(playerInst.currentTime() - 5);
        break;
      // Right arrow seeks 5 seconds ahead
      case 39:
        event.preventDefault();
        playerInst.currentTime(playerInst.currentTime() + 5);
        break;
      // Up arrow raises volume by 0.1
      case 38:
        event.preventDefault();
        if (playerInst.muted()) {
          playerInst.muted(false)
        }
        playerInst.volume(playerInst.volume() + 0.1);
        break;
      // Down arrow lowers volume by 0.1
      case 40:
        event.preventDefault();
        playerInst.volume(playerInst.volume() - 0.1);
        break;
      default:
        return;
    }
  }
}
