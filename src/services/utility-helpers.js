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

export function refineTargets(targets) {
  targets.map((t, i) => {
    if (i == 0 && t.altStart > 0) t.start = t.altStart;
    if (i > 0 && t.altStart > targets[i - 1].end)
      t.start = t.altStart - targets[i - 1].end;
  });

  return targets;
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

// Handled file types for downloads
const validFileExtensions = [
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

export function fileDownload(fileUrl, fileName) {
  const extension = fileUrl.split('.').reverse()[0];
  // If unhandled file type use .doc
  const fileExtension = validFileExtensions.includes(extension)
    ? extension
    : 'doc';
  fetch(fileUrl)
    .then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${fileExtension}`;
        a.click();
      });
    })
    .catch((error) => {
      console.log(error);
    });
};