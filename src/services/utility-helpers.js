import { decode } from 'html-entities';
import isEmpty from 'lodash/isEmpty';
import { getPlaceholderCanvas } from './iiif-parser';

const S_ANNOTATION_TYPE = { transcript: 1, caption: 2, both: 3 };

const DEFAULT_ERROR_MESSAGE = "Error encountered. Please check your Manifest.";
export let GENERIC_ERROR_MESSAGE = DEFAULT_ERROR_MESSAGE;

const DEFAULT_EMPTY_MANIFEST_MESSAGE = "No media resource(s). Please check your Manifest.";
export let GENERIC_EMPTY_MANIFEST_MESSAGE = DEFAULT_EMPTY_MANIFEST_MESSAGE;

// Timer for displaying placeholderCanvas text when a Canvas is empty
const DEFAULT_TIMEOUT = 10000;
export let CANVAS_MESSAGE_TIMEOUT = DEFAULT_TIMEOUT;

/**
 * Sets the timer for displaying the placeholderCanvas text in the player
 * for an empty Canvas. This value defaults to 3 seconds, if the `duration`
 * property of the placeholderCanvas is undefined
 * @function Utils#setCanvasMessageTimeout
 * @param {Number} timeout duration of the placeholderCanvas if given
 */
export function setCanvasMessageTimeout(timeout) {
  CANVAS_MESSAGE_TIMEOUT = timeout || DEFAULT_TIMEOUT;
}

/**
 * Sets the generic error message in the ErrorBoundary when the
 * components fail with critical error. This defaults to the given
 * value when a custom message is not specified in the `customErrorMessage`
 * prop of the IIIFPlayer component
 * @function Utils#setAppErrorMessage
 * @param {String} message custom error message from props
 */
export function setAppErrorMessage(message) {
  GENERIC_ERROR_MESSAGE = message || DEFAULT_ERROR_MESSAGE;
}

/**
 * Sets a generic error message when the given IIIF Manifest has not
 * items in it yet. Example scenario: empty playlist. This defaults to the given
 * value when a custom message is not specified in the `emptyManifestMessage`
 * prop of the IIIFPlayer component
 * @function Utils#setAppEmptyManifestMessage
 * @param {String} message custom error message from props
 */
export function setAppEmptyManifestMessage(message) {
  GENERIC_EMPTY_MANIFEST_MESSAGE = message || DEFAULT_EMPTY_MANIFEST_MESSAGE;
}

/**
 * Convert the time in seconds to hh:mm:ss.ms format.
 * Ex: timeToHHmmss(2.836, showHrs=true, showMs=true) => 00:00:02.836
 * timeToHHmmss(362.836, showHrs=true, showMs=true) => 01:00:02.836
 * timeToHHmmss(362.836, showHrs=true) => 01:00:02
 * @function Utils#timeToHHmmss
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
 * @function Utils#timeToS
 * @param {String} time convert time from string to int
 */
export function timeToS(time) {
  let [seconds, minutes, hours] = time.split(':').reverse();

  let hoursInS = hours != undefined ? parseInt(hours) * 3600 : 0;
  let minutesInS = minutes != undefined ? parseInt(minutes) * 60 : 0;
  // Replace decimal separator if it is a comma
  let secondsNum = seconds === '' ? 0.0 : parseFloat(seconds.replace(',', '.'));
  let timeSeconds = hoursInS + minutesInS + secondsNum;
  return timeSeconds;
}

/**
 * Set error message when an error is encountered in a fetch request
 * @function Utils#handleFetchErrors
 * @param {Object} response response from fetch request
 * @returns {Object}
 */
export function handleFetchErrors(response) {
  if (!response.ok) {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  return response;
}

/**
 * Identify a segment is within the given playable range. 
 * If BOTH start and end times of the segment is outside of the given range => false
 * @function Utils#checkSrcRange
 * @param {Object} segmentRange JSON with start, end times of segment
 * @param {Object} range JSON with end time of media/media-fragment in player
 * @returns 
 */
export function checkSrcRange(segmentRange, range) {
  if (segmentRange === undefined) {
    return false;
  } else if (range === undefined) {
    return true;
  } else if (segmentRange.start > range.end
    && segmentRange.end > range.end) {
    return false;
  } else {
    return true;
  }
}

/**
 * Get the target range when multiple items are rendered from a
 * single canvas.
 * @function Utils#getCanvasTarget
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
 * @function Utils#fileDownload
 * @param {String} fileUrl url of file
 * @param {String} fileName name of the file to download
 * @param {String} fileExt file extension
 * @param {Boolean} machineGenerated flag to indicate file is machine generated/not
 */
export function fileDownload(fileUrl, fileName, fileExt = '', machineGenerated = false) {
  // Check input filename for extension
  let extension = fileExt === ''
    ? fileName.split('.').reverse()[0]
    : fileExt;

  // If no extension present in fileName, check for the extension in the fileUrl
  if (extension.length > 4 || extension.length < 3 || extension === fileName) {
    extension = fileUrl.split('.').reverse()[0];
  } else {
    extension;
  }

  // Final validation that extension is in the right form
  // We assume that file extension will be 3 or 4 characters long. Extensions are
  // allowed to be longer or shorter but the most common ones we would expect to
  // encounter should be within these limits.
  const fileExtension = extension.length > 4 || extension.length < 3
    ? ''
    : extension;

  // Remove file extension from filename if it contains it
  let fileNameNoExt = fileName.endsWith(fileExtension)
    ? fileName.split(`.${fileExtension}`)[0]
    : fileName;

  if (machineGenerated) {
    //  Add "machine-generated" to filename of the file getting downloaded
    fileNameNoExt = `${fileNameNoExt} (machine generated)`;
  }

  // Rely on browser to generate proper file extension in cases where
  // extension is undetermined.
  let downloadName = fileExtension != ''
    ? `${fileNameNoExt}.${fileExtension}`
    : fileNameNoExt;

  // Handle download based on the URL format
  // TODO:: research for a better way to handle this
  if (fileUrl.endsWith(extension)) {
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
    link.setAttribute('download', `${downloadName}`);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Takes a uri with a media fragment that looks like #=120,134 and returns an object
 * with start/end in seconds and the duration in milliseconds
 * @function Utils#getMediaFragment
 * @param {string} uri - Uri value
 * @param {number} duration - duration of the current canvas
 * @return {Object} - Representing the media fragment ie. { start: 3287.0, end: 3590.0 }, or undefined
 */
export function getMediaFragment(uri, duration = 0) {
  if (uri !== undefined) {
    const fragment = uri.split('#t=')[1];
    if (fragment !== undefined) {
      let start, end;
      /**
       * If the times are in a string format (hh:mm:ss) check for comma seperated decimals.
       * Some SRT captions use comma to seperate milliseconds.
       */
      const timestampRegex = /([0-9]*:){1,2}([0-9]{2})(?:((\.|\,)[0-9]{2,3})?)/g;
      if (fragment.includes(':') && [...fragment.matchAll(/\,/g)]?.length > 1) {
        const times = [...fragment.matchAll(timestampRegex)];
        [start, end] = times?.length == 2 ? [times[0][0], times[1][0]] : [0, 0];
      } else {
        [start, end] = fragment.split(',');
      }
      if (end === undefined) {
        end = duration.toString();
      }
      return {
        start: start.match(timestampRegex) ? timeToS(start) : Number(start),
        end: end.match(timestampRegex) ? timeToS(end) : Number(end)
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

/**
 * Extract list of resources from given annotation with a given motivation
 * @function Utils#getAnnotations
 * @param {Object/Array} annotation
 * @param {String} motivation
 * @returns {Array} array of AnnotationPage
 */
export function getAnnotations(annotation, motivation = '') {
  let content = [];
  if (!annotation) return content;

  if (annotation.type === 'Canvas') {
    content = annotation.items[0].items;
  } else if (Array.isArray(annotation) && annotation?.length > 0) {
    content = annotation[0].items;
  }
  // Filter the annotations if a motivation is given
  if (content && motivation != '') {
    const relevantAnnotations = content.filter(
      (a) => a.motivation === motivation);
    content = relevantAnnotations;
  }
  return content;
}

/**
 * Parse a list of annotations or a single annotation to extract information related to
 * a given Canvas. Assumes the annotation type as either 'painting' or 'supplementing'.
 * @function Utils#parseResourceAnnotations
 * @param {Array} annotation list of painting/supplementing annotations to be parsed
 * @param {Number} duration duration of the current canvas
 * @param {String} motivation motivation type
 * @param {Number} start custom start time from props or Manifest's start property
 * @param {Boolean} isPlaylist
 * @returns {Object} { resources, canvasTargets, isMultiSource, poster, error }
 */
export function parseResourceAnnotations(annotation, duration, motivation, start = 0, isPlaylist = false) {
  let resources = [],
    canvasTargets = [],
    isMultiSource = false,
    poster = '',
    error = 'No resources found in Canvas';

  const parseAnnotation = (a) => {
    const source = getResourceInfo(a, start, duration, motivation);
    // Check if the parsed sources has a resource URL
    (source && source.src) && resources.push(source);
  };

  if (annotation && annotation != undefined) {
    const items = getAnnotations(annotation);
    if (!items) { return { resources, canvasTargets, error }; }
    if (items.length === 0) {
      return {
        resources, canvasTargets, isMultiSource,
        poster: getPlaceholderCanvas(annotation)
      };
    }
    // When multiple resources are in a single Canvas
    else if (items?.length > 1) {
      items.map((p, index) => {
        if (p.motivation === motivation) {
          parseAnnotation(p.body);
          if (motivation === 'painting') {
            isMultiSource = true;
            const target = parseCanvasTarget(p, duration, index);
            canvasTargets.push(target);
          }
        }
      });
    }
    // When multiple qualities/sources are given for the resource in the Canvas => choice
    else if (items[0].body.items?.length > 0 && items[0]?.motivation === motivation) {
      items[0].body.items.map((p) => {
        parseAnnotation(p);
      });
    }
    // When a singe source is given for the resource in the Canvas
    else if (!isEmpty(items[0].body) && items[0].body?.id != '' && items[0]?.motivation === motivation) {
      parseAnnotation(items[0].body);
    } else if (motivation === 'painting') {
      return { resources, error, poster: getPlaceholderCanvas(annotation), canvasTargets };
    }

    // Set canvasTargets for non-multisource Canvases to use when building progressbar
    if (!isMultiSource && resources?.length > 0 && motivation === 'painting') {
      let target = getMediaFragment(resources[0].src, duration);
      if (target === undefined) {
        target = { start: 0, end: duration };
      }
      target.altStart = target.start;
      target.duration = duration;
      /*
       * This is necessary to ensure expected progress bar behavior when
       * there is a start defined at the manifest level
       */
      if (!isPlaylist) {
        target = { ...target, customStart: target.start, start: 0, altStart: 0 };
      }
      canvasTargets.push(target);
    }

    // Read image placeholder
    poster = getPlaceholderCanvas(annotation, true);
    return { canvasTargets, isMultiSource, resources, poster };
  } else {
    return { canvasTargets, isMultiSource, resources, poster, error };
  }
}

/**
 * Parse source/track information related to given resource
 * in a Canvas
 * @param {Object} item AnnotationBody object from Canvas
 * @param {Number} start custom start either from user props/Manifest start prop
 * @param {Number} duration duration of the media file
 * @param {String} motivation Annotation motivation
 * @returns parsed source/track information
 */
function getResourceInfo(item, start, duration, motivation) {
  let source = null;
  let aType = S_ANNOTATION_TYPE.both;
  // If there are multiple labels, assume the first one
  // is the one intended for default display
  let label = getLabelValue(item.label);
  if (motivation === 'supplementing') {
    aType = identifySupplementingAnnotation(item.id);
  }
  if (aType != S_ANNOTATION_TYPE.transcript) {
    source = {
      src: start > 0 ? `${item.id}#t=${start},${duration}` : item.id,
      key: item.id,
      type: item.format,
      kind: item.type,
      label: label || 'auto',
    };
    if (motivation === 'supplementing') {
      // Set language for captions/subtitles
      source.srclang = item.language ?? 'en';
      // Specify kind to subtitles for VTT annotations. Without this VideoJS
      // resolves the kind to metadata for subtitles file, resulting in empty
      // subtitles lists in iOS devices' native palyers
      source.kind = item.format.toLowerCase().includes('text/vtt')
        ? 'subtitles'
        : 'metadata';
    }
  }
  return source;
}

function parseCanvasTarget(annotation, duration, i) {
  const target = getMediaFragment(annotation.target, duration);
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
 * Identify a string contains "machine-generated" text in different
 * variations using a regular expression
 * @function Utils#identifyMachineGen
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
 * @function Utils#identifySupplementingAnnotation
 * @param {String} uri id from supplementing annotation
 * @returns {Number} a value from S_ANNOTATION_TYPE ENum
 */
export function identifySupplementingAnnotation(uri) {
  if (!uri) { return; }
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
 * @function Utils#getLabelValue
 * @param {Object} label
 * @param {Boolean} readAll read all values in the selected language
 */
export function getLabelValue(label, readAll = false) {
  if (label && typeof label === 'object') {
    const labelKeys = Object.keys(label);
    if (labelKeys && labelKeys.length > 0) {
      // FIXME: select application language when implementing i18n
      // Get the first key's first value
      const firstKey = labelKeys[0];
      const value = readAll
        ? label[firstKey].join('\n')
        : label[firstKey][0] ?? '';
      return decode(value);
    }
  } else if (typeof label === 'string') {
    return decode(label);
  }
  return '';
}

/**
 * Validate time input from user against the hh:mm:ss.ms format
 * @function Utils#validateTimeInput
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
 * @function Utils#autoScroll
 * @param {Object} currentItem React ref to the active element
 * @param {Object} containerRef React ref to the parent container
 * @param {Boolean} toTop boolean flag to scroll active item to the top
 */
export function autoScroll(currentItem, containerRef, toTop = false) {
  /*
    Get the difference of distances between the outer border of the active
    element and its container(parent) element to the top padding edge of
    their offsetParent element(body)
  */
  let scrollHeight = currentItem.offsetTop - containerRef.current.offsetTop;
  /*
    Scroll the current active item to into view within the parent container.
    For transcript active cues => toTop is set to `true`
    For structure active items => toTop has the default `false` value
  */
  if (toTop) {
    containerRef.current.scrollTop = scrollHeight;
  } else {
    // Height of the content in view within the parent container
    let inViewHeight = containerRef.current.clientHeight - currentItem.clientHeight;
    // Only scroll current item when it is further down from the 
    // mid-height point of the container
    if (scrollHeight > inViewHeight) {
      containerRef.current.scrollTop = scrollHeight - containerRef.current.clientHeight / 2;
    } else if (inViewHeight / 2 > scrollHeight) {
      containerRef.current.scrollTop = 0;
    } else {
      containerRef.current.scrollTop = scrollHeight / 2;
    }
  }
};

/**
 * Bind default hotkeys for VideoJS player
 * @function Utils#playerHotKeys
 * @param {Object} event keydown event
 * @param {String} id player instance ID in VideoJS
 * @param {Boolean} canvasIsEmpty flag to indicate empty Canvas
 * @returns 
 */
export function playerHotKeys(event, player, canvasIsEmpty) {
  let playerInst = player?.player();

  let inputs = ['input', 'textarea'];
  let activeElement = document.activeElement;
  // Check if the active element is within the player
  let focusedWithinPlayer = activeElement.className.includes('vjs') || activeElement.className.includes('videojs');

  let pressedKey = event.which;

  // Check if ctrl/cmd/alt/shift keys are pressed when using key combinations
  let isCombKeyPress = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

  /*
   Trigger player hotkeys when;
   - focus is not on an input, textarea field on the page
   - focus is on a navigation tab AND the key pressed is one of left/right arrow keys
      this specific combination of keys with a focused navigation tab is avoided to allow
      keyboard navigation between tabbed UI components, instead of triggering player hotkeys
   - key combinations are not in use with a key associated with hotkeys
   - current Canvas is empty
  */
  if (
    (activeElement &&
      (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 ||
        (activeElement.role === "tab" && (pressedKey === 37 || pressedKey === 39))) &&
      !focusedWithinPlayer)
    || isCombKeyPress || canvasIsEmpty
  ) {
    return;
  } else if (playerInst === null || playerInst === undefined) {
    return;
  } else {
    // event.which key code values found at: https://css-tricks.com/snippets/javascript/javascript-keycodes/
    switch (pressedKey) {
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
          playerInst.muted(false);
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
    /*
      This function gets invoked by 2 different 'keydown' event listeners;
      Document's 'keydown' event listener => when player is out of focus on 
        first load and when user is interacting with other elements on the page
      Video.js' native controls' 'keydown' event listeners => when a native player control is in focus
        when using the pointer
      Therefore, once a 'keydown' event is passed throught this function to invoke a hotkey function, 
      event propogation needs to be stopped. Otherwise the hotkeys functionality gets called twice,
      undoing the action performed in the initial call.
    */
    event.stopPropagation();
  }
}

/**
 * Group a JSON object array by a given property
 * @function Utils#groupBy
 * @param {Array} arry array of JSON objects to be grouped
 * @param {String} key property name used for grouping
 * @returns a map of grouped JSON objects
 */
export const groupBy = (arry, key) => {
  return arry.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
