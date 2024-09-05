import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import videojs from 'video.js';
import '../styles/VideoJSProgress.scss';
import { IS_MOBILE, IS_IPAD, IS_SAFARI, IS_IPHONE } from '@Services/browser';
import debounce from 'lodash/debounce';

const ProgressControl = videojs.getComponent('SeekBar');

class NewProgress extends ProgressControl {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-custom-progress-bar');
    this.setAttribute('data-testid', 'videojs-custom-progressbar');
    this.setAttribute('tabindex', 0);

    this.player = player;
    this.options = options;
    this.playerEventListener;

    this.initTimeRef = React.createRef();
    this.progressRef = React.createRef();
    this.canvasTargetsRef = React.createRef();
    this.srcIndexRef = React.createRef();
    this.isMultiSourceRef = React.createRef();

    this.playProgress = this.getChild('PlayProgressBar');
    console.log(this.el().children);

    this.player.on('ready', () => {
      this.createBlockedProgress();
      /**
       * Using a time interval instead of 'timeupdate event in VideoJS, because Safari
       * and other browsers in MacOS stops firing the 'timeupdate' event consistently 
       * after a while
       */
      this.playerEventListener = setInterval(() => {
        /**
         * Abortable inerval for Safari desktop browsers, for a smoother scrubbing 
         * experience.
         * Mobile devices are excluded since they use native iOS player.
         */
        if (IS_SAFARI && !IS_IPHONE) {
          this.abortableTimeupdateHandler();
        } else {
          this.timeUpdateHandler();
        }
      }, 100);
    });

    this.player.on('loadstart', () => {
      const { srcIndex, targets } = this.player;
      this.setSrcIndex(srcIndex);
      this.setCanvasTargets(targets);
      const cTimes = targets[srcIndex];
      if (cTimes.customStart > cTimes.start) {
        this.initializeProgress(cTimes.customStart);
      } else {
        this.initializeProgress(cTimes.start);
      }
      this.setIsMultiSource(targets?.length > 1 ? true : false);
      this.buildProgressBar();
    });

    /* 
      In Safari browser, when player is paused selecting and clicking on a
      timepoint on the progress-bar doesn't update the UI immediately. This event
      handler fixes this issue.
    */
    this.player.on('seeked', () => {
      if (IS_SAFARI && !IS_MOBILE) {
        this.handleTimeUpdate(progressRef.current);
      }
    });

    // Update our progress bar after the user leaves full screen
    this.player.on("fullscreenchange", (e) => {
      if (!this.player.isFullscreen()) {
        this.setProgress(this.player.currentTime());
      }
    });

    this.player.on('dispose', () => {
      clearInterval(this.playerEventListener);
    });
  }

  setInitTime(t) { this.initTimeRef.current = t; };
  setSrcIndex(i) { this.srcIndexRef.current = i; };
  setProgress(p) { this.progressRef.current = p; };
  setCanvasTargets(t) { this.canvasTargetsRef.current = t; };
  setIsMultiSource(m) { this.isMultiSourceRef.current = m; };

  /**
   * Set start values for progress bar
   * @param {Number} start canvas start time
   */
  initializeProgress = (start) => {
    this.setProgress(start);
    this.setInitTime(start);

    // setCurrentTime(start);
    this.player.currentTime(start);
  };

  createBlockedProgress() {
    const leftBlock = videojs.dom.createEl('div', {
      className: 'block-stripes',
      role: 'presentation',
      id: 'left-block'
    });
    const rightBlock = videojs.dom.createEl('div', {
      className: 'block-stripes',
      role: 'presentation',
      id: 'right-block'
    });
    const timeTooltip = videojs.dom.createEl('span', {
      className: 'tooltiptext',
      ariaHidden: true
    });
    this.el().appendChild(leftBlock);
    this.el().appendChild(rightBlock);
    this.el().appendChild(timeTooltip);
    this.el().on('mouseover', () => {
      console.log('MOUSE OVER');
    });
  }

  buildProgressBar() {
    const { canvasTargetsRef, isMultiSourceRef, srcIndexRef } = this;

    if (canvasTargetsRef.current?.length > 0) {
      const { altStart, start, end, duration } = canvasTargetsRef.current[srcIndexRef.current];

      const leftBlockEl = document.getElementById('left-block');
      const rightBlockEl = document.getElementById('right-block');
      let toPlay;

      if (!isMultiSourceRef.current) {
        const leftBlock = (start * 100) / duration;
        const rightBlock = ((duration - end) * 100) / duration;
        toPlay = 100 - leftBlock - rightBlock;

        if (leftBlockEl) leftBlockEl.style.width = leftBlock + '%';
        if (rightBlockEl) {
          rightBlockEl.style.width = rightBlock + '%';
          rightBlockEl.style.left = `${100 - rightBlock - leftBlock}%`;
        }
      } else {
        let totalDuration = canvasTargetsRef.current.reduce((acc, t) => acc + t.duration, 0);
        // Calculate offset of the duration of the current source
        let leftOffset = Math.min(100,
          Math.max(0, 100 * (altStart / totalDuration))
        );
        this.playProgress.el_.style.left = `${leftOffset}%`;
      }
    }
  }

  /**
   * A wrapper function around the time update interval, to cancel
   * intermediate updates via the time interval when player is 
   * waiting to fetch stream
   */
  abortableTimeupdateHandler() {
    const { player, progressRef } = this;
    player.on('waiting', () => {
      if (IS_SAFARI && !IS_MOBILE) {
        player.currentTime(progressRef.current);
      }
      cancelInterval();
    });

    let cancelInterval = () => {
      if (internalInterval) {
        clearInterval(internalInterval);
      }
    };

    let internalInterval = setInterval(() => {
      this.timeUpdateHandler();
    }, 100);
  };

  // Update progress bar with timeupdate in the player
  timeUpdateHandler() {
    const { initTimeRef, player } = this;
    if (player.isDisposed() || player.ended() || player == null) { return; }
    let curTime;
    // Initially update progress from the prop passed from Ramp,
    // this accounts for structured navigation when switching canvases
    if ((initTimeRef.current > 0 && player.currentTime() == 0)) {
      curTime = initTimeRef.current;
      player.currentTime(initTimeRef.current);
    } else {
      curTime = player.currentTime();
    }
    // Use debounced updates since, Safari desktop browsers need the extra 
    // update on 'seeked' event to timely update the progress bar.
    if (IS_SAFARI && !IS_MOBILE && player.paused()) {
      debounce(
        () => { this.onTimeUpdate(curTime); }
      );
    } else {
      this.onTimeUpdate(curTime);
    }
    this.setInitTime(0);
  };

  onTimeUpdate(curTime) {
    // This state update caused weird lagging behaviors when using the iOS native
    // video player. iOS player handles its own progress bar, so we can skip the
    // update here only for video.
    const iOS = this.player.hasClass("vjs-ios-native-fs");
    if (!(iOS && !this.player.audioOnlyMode_)) {
      this.setProgress(curTime);
    };
    this.handleTimeUpdate(curTime);
  };

  /**
   * Update CSS for the input range's track while the media
   * is playing
   * @param {Number} curTime current time of the player
   */
  handleTimeUpdate(curTime) {
    const { player, el_, canvasTargetsRef, srcIndexRef } = this;
    const { start, end, duration } = canvasTargetsRef.current[srcIndexRef.current];

    // Avoid null player instance when Video.js is getting initialized
    if (!el_ || !player) {
      return;
    }

    // Restrict access to the intended range in the media file
    if (curTime < start) {
      player.currentTime(start);
    }
    if (curTime >= end && !player.paused() && !player.isDisposed()) {
      // Pause when playable range < duration of the full media. e.g. clipped playlist items
      if (end < duration) player.pause();
      // Delay ended event so that, it fires after pause and display replay icon instead of play/pause
      this.setTimeout(() => { player.trigger('ended'); }, 10);

      // On the next play event set the time to start or a seeked time
      // in between the 'ended' event and 'play' event
      // Reference: https://github.com/videojs/video.js/blob/main/src/js/control-bar/play-toggle.js#L128
      player.one('play', () => {
        let time = player.currentTime();
        if (time < end) {
          player.currentTime(time);
        } else {
          player.currentTime(start);
        }
      });
    }
  }
}

videojs.registerComponent('NewProgress', NewProgress);

export default NewProgress;
