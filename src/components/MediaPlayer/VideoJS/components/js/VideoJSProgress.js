import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import videojs from 'video.js';
import '../styles/VideoJSProgress.scss';
import { IS_MOBILE, IS_SAFARI, IS_IPHONE, IS_IOS, IS_ANDROID } from '@Services/browser';
import debounce from 'lodash/debounce';

const SeekBar = videojs.getComponent('SeekBar');

class VideoJSProgress extends SeekBar {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-custom-progress-bar');
    this.setAttribute('data-testid', 'videojs-custom-progressbar');
    this.setAttribute('tabindex', 0);

    this.player = player;
    this.options = options;
    this.selectSource = this.options.nextItemClicked;
    this.playerEventListener;

    this.initTimeRef = React.createRef();
    this.progressRef = React.createRef();
    this.canvasTargetsRef = React.createRef();
    this.srcIndexRef = React.createRef();
    this.isMultiSourceRef = React.createRef();
    this.totalDuration;

    this.playProgress = this.getChild('PlayProgressBar');
    this.loadProgress = this.getChild('LoadProgressBar');

    this.player.on('ready', () => {
      this.initializeEl();
      this.updateComponent();
    });

    this.player.on('loadstart', () => {
      this.updateComponent();
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
    this.player.on('fullscreenchange', (e) => {
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
  setCanvasTargets(t) {
    this.canvasTargetsRef.current = t;
    this.totalDuration = t.reduce((acc, c) => acc + c.duration, 0);
  };
  setIsMultiSource(m) { this.isMultiSourceRef.current = m; };

  updateComponent() {
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

    if (!this.playerEventListener) {
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
    }
  }

  /**
   * Set start values for progress bar
   * @param {Number} start canvas start time
   */
  initializeProgress = (start) => {
    this.setProgress(start);
    this.setInitTime(start);
    this.player.currentTime(start);
  };

  initializeEl() {
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
    this.el().appendChild(leftBlock);
    this.el().appendChild(rightBlock);

    // Eventlisteners to handle time tool-tip display and progress updates
    this.el().addEventListener('pointermove', (e) => { this.handleMouseMove(e); });
    this.el().addEventListener('pointerup', (e) => { this.handleMouseUp(e); });
    this.el().addEventListener('pointerdown', (e) => { this.handleMouseDown(e); });
  }

  handleMouseMove(e) {
    if (!IS_IOS && !IS_ANDROID) {
      const { currentTime, offsetx } = this.convertToTime(e);
      const mouseTimeDisplay = this.getChild('MouseTimeDisplay');
      const timeTooltip = mouseTimeDisplay.getChild('TimeTooltip');
      const toolTipEl = timeTooltip.el_;
      if (currentTime) {
        toolTipEl.innerHTML = timeToHHmmss(currentTime);
      }
      const pullTooltip = toolTipEl.clientWidth / 2;
      toolTipEl.style.left = `${offsetx - pullTooltip}px`;
    }
  }

  handleMouseDown(e) {
    const { currentTime, _ } = this.convertToTime(e);
    // Do nothing on right-click or undefined time
    if (e.button === 2 || !currentTime) { return; }
    // Get the clicked src when Canvas has mutliple sources
    let clickedSrc;
    if (this.isMultiSourceRef.current) {
      clickedSrc = this.canvasTargetsRef.current.find((t) => {
        const virtualEnd = t.altStart + t.duration;
        if (currentTime >= t.altStart && currentTime <= virtualEnd) {
          return t;
        }
      });
    }
    if (clickedSrc) {
      const clickedIndex = clickedSrc?.sIndex ?? 0;
      if (clickedIndex != this.srcIndexRef.current) {
        this.selectSource(clickedSrc.sIndex, currentTime - clickedSrc.altStart);
        this.setSrcIndex(clickedIndex);
      } else {
        this.player.currentTime(currentTime - clickedSrc.altStart);
      }
    } else {
      this.player.currentTime(currentTime);
    }
  }

  handleMouseUp(e) {
    this.handleMouseDown(e);
  }

  buildProgressBar() {
    const { canvasTargetsRef, isMultiSourceRef, player, srcIndexRef, totalDuration } = this;
    if (canvasTargetsRef.current?.length > 0) {
      const { altStart, start, end, duration } = canvasTargetsRef.current[srcIndexRef.current];

      const leftBlockEl = document.getElementById('left-block');
      const rightBlockEl = document.getElementById('right-block');

      if (!isMultiSourceRef.current) {
        const leftBlock = (start * 100) / duration;
        const rightBlock = ((duration - end) * 100) / duration;

        // Set player.isClipped to use in the ended event to decide to advance to next
        rightBlock > 0 ? player.isClipped = true : player.isClipped = false;

        if (leftBlockEl) leftBlockEl.style.width = `${leftBlock}%`;
        if (rightBlockEl) {
          rightBlockEl.style.width = rightBlock + '%';
          rightBlockEl.style.left = `${100 - rightBlock - leftBlock}%`;
        }
      } else {
        // Calculate offset of the duration of the current source
        let leftOffset = Math.min(100,
          Math.max(0, 100 * (altStart / totalDuration))
        );
        this.playProgress.el_.style.left = `${leftOffset}%`;
        this.loadProgress.el_.style.left = `${leftOffset}%`;
        // Add CSS class to mark the range from zero as played
        this.addClass('preceeding-inactive-range');
        document.documentElement.style.setProperty(
          '--range-progress',
          `calc(${leftOffset}%)`
        );
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

    // Avoid null player instance when Video.js is getting initialized
    if (!el_ || !player || !canvasTargetsRef.current) {
      return;
    }
    const { start, end, duration } = canvasTargetsRef.current[srcIndexRef.current ?? 0];

    // Restrict access to the intended range in the media file
    if (curTime < start) {
      player.currentTime(start);
    }
    if (curTime >= end && !player.paused() && !player.isDisposed()) {
      // Pause when playable range < duration of the full media. e.g. clipped playlist items
      if (end < duration) {
        /**
         * Set player.faultPause to indicate player.pause() event handler to not
         * update global state's isPlaying status in this particular use-case.
         * This pause is triggered only for clipped playlist items, when auto-advance
         * is turned ON.
         */
        player.faultPause = true;
        player.pause();
      }
      // Delay ended event so that, it fires after pause and display replay icon instead of play/pause
      setTimeout(() => { player.trigger('ended'); }, 10);

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

  convertToTime(e) {
    const eSrcElement = e.srcElement;
    // When clicked on blocked time point
    if (eSrcElement.classList.contains('block-stripes')) {
      const { altStart, end, duration } = this.canvasTargetsRef.current[0];
      if (eSrcElement.id === 'right-block') {
        // For right-block: place time tool-tip at the end of playable range
        return { currentTime: end, offsetx: (end / duration) * this.el().clientWidth };
      } else {
        // For left-block: place time tool-tip at the start of playable range
        return { currentTime: altStart, offsetx: (altStart / duration) * this.el().clientWidth };
      }
    }
    let targetX = e.target.getBoundingClientRect().x;
    let offsetx = e.nativeEvent != undefined
      ? e.nativeEvent.offsetX != undefined
        ? e.nativeEvent.offsetX // iOS and desktop events
        : (e.nativeEvent.targetTouches[0]?.clientX - targetX) // Android event
      : e.offsetX; // fallback in desktop browsers when nativeEvent is undefined
    let currentTime;
    if (offsetx && offsetx != undefined) {
      if (this.isMultiSourceRef.current) {
        /**
         * Check if the mouse event occurred on the same src range. 
         * If so, adjust the offset to support altStart for the current src.
         */
        const leftOffset = ((parseFloat(this.playProgress.el_.style.left)) / 100) * this.el().clientWidth;
        const elClassList = eSrcElement.classList;
        const sameSrc = elClassList?.length > 0 ? elClassList.contains('vjs-play-progress') : true;
        if (leftOffset > offsetx && sameSrc) {
          offsetx = offsetx + leftOffset;
        }
      }
      currentTime = (offsetx / this.el().clientWidth) * this.totalDuration;
    }
    /**
     * Parts of LoadProgress element is broken into segments as media loads, and displayed
     * as separate div elements with `data-start` and `data-end` attributes respectively.
     * When mouse event occurs on top of such element, add the segment start time to calculated
     * current time from event.
     */
    if (e.target.hasAttribute('data-start')) {
      const { start, _ } = e.target.dataset;
      currentTime = currentTime + parseFloat(start);
      offsetx = (currentTime * this.el().clientWidth) / this.totalDuration;
    }
    return { currentTime, offsetx };
  };
}

videojs.registerComponent('VideoJSProgress', VideoJSProgress);

export default VideoJSProgress;
