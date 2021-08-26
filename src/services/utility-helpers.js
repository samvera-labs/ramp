/**
 * Convert time string from hh:mm:ss.ms format to user-friendly
 * time formats.
 * Ex: 01:34:43.34 -> 01:34:43 / 00:54:56.34 -> 00:54:56
 * @param {String} time time in hh:mm:ss.ms
 */
export function createTimestamp(time) {
  let [hours, minutes, seconds] = time.split(':');
  let secondsRounded = Math.round(seconds);
  let secStr = secondsRounded < 10 ? `0${secondsRounded}` : `${secondsRounded}`;
  return `${hours}:${minutes}:${secStr}`;
}

/**
 * Convert time from hh:mm:ss.ms string format to int
 * @param {String} time convert time from string to int
 */
export function timeToS(time) {
  let [seconds, minutes, hours] = time.split(':').reverse();
  let hoursInS = hours ? parseInt(hours) * 3600 : 0;
  let minutesInS = minutes ? parseInt(minutes) * 60 : 0;
  let secondsNum = seconds === '' ? 0.0 : parseFloat(seconds);
  let timeSeconds = hoursInS + minutesInS + secondsNum;
  // console.log('in: ', time, ' | out: ', timeSeconds);
  return timeSeconds;
}
