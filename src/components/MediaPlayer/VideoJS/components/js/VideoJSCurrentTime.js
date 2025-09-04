import { createRef } from 'react';
import videojs from 'video.js';
import { IS_MOBILE, IS_SAFARI } from '@Services/browser';

const TimeDisplay = videojs.getComponent('TimeDisplay');

/**
 * Custom component to display the current time of the player
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} options
 * @param {Number} options.currentTime
 */
class VideoJSCurrentTime extends TimeDisplay {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-time-control vjs-current-time-display');
    this.setAttribute('role', 'presentation');

    this.player = player;
    this.options = options;

    this.initTimeRef = createRef();
    this.initTimeRef.current = options.currentTime;
    this.playerInterval;

    this.player.on('loadstart', () => {
      this.playerInterval = setInterval(() => {
        this.handleTimeUpdate();
      }, 100);
    });

    this.player.on('seeked', () => {
      if (IS_SAFARI && !IS_MOBILE) {
        this.updateTextNode_(player.currentTime());
      }
    });

    // Update our timer after the user leaves full screen
    this.player.on('fullscreenchange', () => {
      if (!player.isFullscreen()) {
        this.updateTextNode_(player.currentTime());
      }
    });

    // Clean interval upon player dispose
    this.player.on('dispose', () => {
      clearInterval(this.playerInterval);
    });
  }

  buildCSSClass() {
    return 'current-time';
  }

  setInitTime(t) {
    this.initTimeRef.current = t;
  }

  handleTimeUpdate() {
    const { player, initTimeRef } = this;
    const { targets, srcIndex } = player;
    if (!player || player.isDisposed() || !targets) { return; }
    const iOS = player.hasClass('vjs-ios-native-fs');
    let time;
    // Update time from the given initial time if it is not zero
    if (initTimeRef.current > 0 && player.currentTime() == 0) {
      time = initTimeRef.current;
    } else {
      time = player.currentTime();
    }
    const { start, altStart } = targets[srcIndex ?? 0];

    if (altStart != start && srcIndex > 0) {
      time = time + altStart;
    }
    // This state update caused weird lagging behaviors when using the iOS native
    // video player. iOS player handles its own time, so we can skip the update here
    // video items.
    if (!(iOS && !player.audioOnlyMode_)) { this.updateTextNode_(time); }
    this.setInitTime(0);
  }
}

videojs.registerComponent('VideoJSCurrentTime', VideoJSCurrentTime);

export default VideoJSCurrentTime;
