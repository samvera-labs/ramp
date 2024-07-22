import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSProgress.scss';
import { IS_MOBILE, IS_IPAD, IS_SAFARI, IS_IPHONE } from '@Services/browser';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

const vjsComponent = videojs.getComponent('Component');

/**
 * Custom component to show progress bar in the player, modified
 * to display multiple items in a single canvas
 * @param {Object} props
 * @param {Number} props.srcIndex index for current src when multiple sources are present
 * @param {Array} props.targets set of start and end times for items in the current canvas
 * @param {Number} props.currentTime initial current time set as needed, defaults to 0
 * @param {Function} props.nextItemClicked callback func to next source in Canvas
 */
class VideoJSProgress extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-custom-progress-bar');
    this.setAttribute('data-testid', 'videojs-custom-progressbar');
    this.setAttribute('tabindex', 0);

    this.mount = this.mount.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.initProgressBar = this.initProgressBar.bind(this);

    this.player = player;
    this.options = options;
    this.currentTime = options.currentTime;
    this.times = options.targets[options.srcIndex];

    player.on('loadstart', () => {
      this.options.currentTime = this.player.currentTime();
      this.options.srcIndex = this.player.srcIndex || 0;
      this.options.targets = this.player.targets?.length > 0
        ? this.player.targets
        : this.options.targets;
      this.mount();
      this.initProgressBar();
    });
  }

  /** Build progress bar elements from the options */
  initProgressBar() {
    const { targets, srcIndex } = this.options;
    const { start, end, duration } = targets[srcIndex];
    let startTime = start,
      endTime = end;

    const isMultiSourced = targets.length > 1 ? true : false;

    let toPlay;
    if (isMultiSourced) {
      let totalDuration = targets.reduce((acc, t) => acc + t.duration, 0);
      // Calculate the width of the playable range as a percentage of total
      // Canvas duration
      toPlay = Math.min(
        100,
        Math.max(0, 100 * ((end - start) / totalDuration))
      );
    } else {
      const leftBlock = (startTime * 100) / duration;
      const rightBlock = ((duration - endTime) * 100) / duration;

      toPlay = 100 - leftBlock - rightBlock;

      const leftDiv = document.getElementById('left-block');
      const rightDiv = document.getElementById('right-block');
      const dummySliders = document.getElementsByClassName(
        'vjs-custom-progress-inactive'
      );

      if (leftDiv) {
        leftDiv.style.width = leftBlock + '%';
      }
      if (rightDiv) {
        rightDiv.style.width = rightBlock + '%';
      }
      // Set the width of dummy slider ranges based on duration of each item
      for (let ds of dummySliders) {
        const dsIndex = ds.dataset.srcindex;
        let styleWidth = (targets[dsIndex].duration * 100) / duration;
        ds.style.width = styleWidth + '%';
      }
    }

    if (document.getElementById('slider-range')) {
      document.getElementById('slider-range').style.width = toPlay + '%';
    }
  }

  /**
   * Update CSS for the input range's track while the media
   * is playing
   * @param {Number} curTime current time of the player
   */
  handleTimeUpdate(curTime) {
    const { player, options, el_ } = this;
    const { srcIndex, targets } = options;
    const { start, end } = targets[srcIndex];

    // Avoid null player instance when Video.js is getting initialized
    if (!el_ || !player) {
      return;
    }

    const nextItems = targets.filter((_, index) => index > srcIndex);
    // Restrict access to the intended range in the media file
    if (curTime < start) {
      player.currentTime(start);
    }
    // Some items, particularly in playlists, were not having `player.ended()` properly
    // set by the 'ended' event. Providing a fallback check that the player is already
    // paused prevents undesirable behavior from excess state changes after play ending.
    if (curTime >= end && !player.paused() && !player.isDisposed()) {
      if (nextItems.length == 0) { options.nextItemClicked(0, targets[0].start); }
      player.pause();
      player.trigger('ended');


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

    // Mark the preceding dummy slider ranges as 'played'
    const dummySliders = document.getElementsByClassName(
      'vjs-custom-progress-inactive'
    );
    for (let slider of dummySliders) {
      const sliderIndex = slider.dataset.srcindex;
      if (sliderIndex < srcIndex) {
        slider.style.setProperty('background', '#2A5459');
      }
    }

    // Calculate the played percentage of the media file's duration
    let trackoffset = curTime - start;
    const played = Math.min(
      100,
      Math.max(0, 100 * trackoffset / (end - start))
    );

    document.documentElement.style.setProperty(
      '--range-progress',
      `calc(${played}%)`
    );
  }

  mount() {
    ReactDOM.render(
      <ProgressBar
        player={this.player}
        handleTimeUpdate={this.handleTimeUpdate}
        initCurrentTime={this.options.currentTime}
        times={this.times}
        srcIndex={this.options.srcIndex}
        targets={this.options.targets}
        nextItemClicked={this.options.nextItemClicked}
      />,
      this.el()
    );
  }
}

/**
 *
 * @param {Object} obj
 * @param {obj.player} - current VideoJS player instance
 * @param {obj.handleTimeUpdate} - callback function to update time
 * @param {obj.initCurrentTime} - initial current time of the player
 * @param {obj.times} - start and end times for the current source
 * @param {obj.srcIndex} - src index when multiple files are in a single Canvas
 * @param {obj.targets} - list target media in the Canvas
 * @param {obj.nextItemClicked} - callback function to update state when source changes
 * @returns
 */
function ProgressBar({
  player,
  handleTimeUpdate,
  initCurrentTime,
  times,
  srcIndex,
  targets,
  nextItemClicked,
}) {
  const [progress, _setProgress] = React.useState(initCurrentTime);
  const [currentTime, setCurrentTime] = React.useState(player.currentTime());
  const timeToolRef = React.useRef();
  const leftBlockRef = React.useRef();
  const sliderRangeRef = React.useRef();
  const [tLeft, setTLeft] = React.useState([]);
  const [tRight, setTRight] = React.useState([]);
  const isMultiSourced = targets.length > 1 ? true : false;

  let initTimeRef = React.useRef(initCurrentTime);
  const setInitTime = (t) => {
    initTimeRef.current = t;
  };
  let progressRef = React.useRef(progress);
  const setProgress = (p) => {
    progressRef.current = p;
    _setProgress(p);
  };
  let canvasTimesRef = React.useRef(times);
  const setCanvasTimes = (c) => {
    canvasTimesRef.current = c;
  };
  let activeSrcIndexRef = React.useRef(0);
  const setActiveSrcIndex = (i) => {
    activeSrcIndexRef.current = i;
  };
  let canvasTargetsRef = React.useRef(targets);
  const setCanvasTargets = (t) => {
    canvasTargetsRef.current = t;
  };

  let playerEventListener;

  React.useEffect(() => {
    if (player.targets?.length > 0) {
      setCanvasTargets(player.targets);
    }

    // Position the timetool tip at the first load
    if (timeToolRef.current && sliderRangeRef.current) {
      timeToolRef.current.style.top =
        -timeToolRef.current.offsetHeight -
        sliderRangeRef.current.offsetHeight * 6 + // deduct 6 x height of progress bar element
        'px';
    }
    const right = canvasTargetsRef.current.filter((_, index) => index > srcIndex);
    const left = canvasTargetsRef.current.filter((_, index) => index < srcIndex);
    setTRight(right);
    setTLeft(left);


    /**
     * By listening to parent container's events the update becomes smoother,
     * since currentTime in state is already updated through these event handlers.
     */
    const progressContainer = document.getElementsByClassName(
      'vjs-custom-progress'
    );
    if (progressContainer?.length > 0) {
      progressContainer[0].addEventListener('mouseenter', (e) => {
        handleMouseMove(e, false);
      });
      progressContainer[0].addEventListener('mouseleave', (e) => {
        handleMouseMove(e, false);
      });
    }

    // Clear event listeners
    return () => {
      const progressContainer = document.getElementsByClassName(
        'vjs-custom-progress'
      );
      if (progressContainer?.length > 0) {
        progressContainer[0].removeEventListener('mouseenter', (e) => {
          handleMouseMove(e, false);
        });
        progressContainer[0].removeEventListener('mouseleave', (e) => {
          handleMouseMove(e, false);
        });
      }
    };
  }, []);

  React.useEffect(() => {
    setCanvasTargets(targets);
    const cTimes = targets[srcIndex];
    setCanvasTimes(cTimes);
    setActiveSrcIndex(srcIndex);

    const right = canvasTargetsRef.current.filter((_, index) => index > srcIndex);
    const left = canvasTargetsRef.current.filter((_, index) => index < srcIndex);
    setTRight(right);
    setTLeft(left);

    setProgress(cTimes.start);
    setInitTime(cTimes.start);

    setCurrentTime(cTimes.start);
    player.currentTime(cTimes.start);

    player.on('play', () => {
      /**
       * Using a time interval instead of 'timeupdate event in VideoJS, because Safari
       * and other browsers in MacOS stops firing the 'timeupdate' event consistently 
       * after a while
       */
      playerEventListener = setInterval(() => {
        /**
         * Abortable inerval for Safari desktop browsers, for a smoother scrubbing 
         * experience.
         * Mobile devices are excluded since they use native iOS player.
         */
        if (IS_SAFARI && !IS_IPHONE) {
          abortableTimeupdateHandler();
        } else {
          timeUpdateHandler();
        }
      }, 100);
    });

    // Get the pixel ratio for the range
    const ratio = sliderRangeRef.current.offsetWidth /
      (canvasTimesRef.current.end - canvasTimesRef.current.start);

    // Convert current progress to pixel values
    let leftWidth = progressRef.current * ratio;

    // Add the length of the preceding dummy ranges
    const sliderRanges = document.getElementsByClassName(
      'vjs-custom-progress-inactive'
    );
    for (let slider of sliderRanges) {
      const sliderIndex = slider.dataset.srcindex;
      if (sliderIndex < srcIndex) leftWidth += slider.offsetWidth;
    }

    // Hide the timetooltip on mobile/tablet devices
    if (IS_IPAD || IS_MOBILE) {
      timeToolRef.current.style.display = 'none';
    }
    timeToolRef.current.style.left =
      leftWidth - timeToolRef.current.offsetWidth / 2 + 'px';
    timeToolRef.current.innerHTML = formatTooltipTime(currentTime);

    handleTimeUpdate(initTimeRef.current);
  }, [player.src(), player.canvasIndex, targets]);

  /**
   * A wrapper function around the time update interval, to cancel
   * intermediate updates via the time interval when player is 
   * waiting to fetch stream
   */
  const abortableTimeupdateHandler = () => {
    player.on('waiting', () => {
      cancelInterval();
    });

    let cancelInterval = () => {
      if (internalInterval) {
        clearInterval(internalInterval);
      }
    };

    let internalInterval = setInterval(() => {
      timeUpdateHandler();
    }, 100);
  };

  // Update progress bar with timeupdate in the player
  const timeUpdateHandler = () => {
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
    if (IS_SAFARI && !IS_MOBILE) {
      debounce(
        () => { onTimeUpdate(curTime); }
      );
    } else {
      onTimeUpdate(curTime);
    }
    setInitTime(0);
  };

  const onTimeUpdate = (curTime) => {
    // This state update caused weird lagging behaviors when using the iOS native
    // video player. iOS player handles its own progress bar, so we can skip the
    // update here only for video.
    const iOS = player.hasClass("vjs-ios-native-fs");
    if (!(iOS && !player.audioOnlyMode_) && !player.paused()) {
      setProgress(curTime);
    };
    handleTimeUpdate(curTime);
  };

  /* 
    In Safari browser, when player is paused selecting and clicking on a
    timepoint on the progress-bar doesn't update the UI immediately. This event
    handler fixes this issue.
  */
  player.on('seeked', () => {
    if (IS_SAFARI && !IS_MOBILE) {
      handleTimeUpdate(progressRef.current);
    }
  });

  player.on('dispose', () => {
    clearInterval(playerEventListener);
  });

  // Update our progress bar after the user leaves full screen
  player.on("fullscreenchange", (e) => {
    if (!player.isFullscreen()) {
      setProgress(player.currentTime());
    }
  });

  /**
   * Convert mouseover event to respective time in seconds
   * @param {Object} e mouseover event for input range
   * @param {Number} index src index of the input range
   * @returns time equvalent of the hovered position
   */
  const convertToTime = (e, offsetx, index) => {
    if (offsetx && offsetx != undefined) {
      let time =
        (offsetx / e.target.clientWidth) * (e.target.max - e.target.min)
        ;
      if (index != undefined) time += canvasTargetsRef.current[index].altStart;
      return time;
    }
  };

  /**
   * Set progress and player time when using the input range
   * (progress bar) to seek to a particular time point
   * @param {Object} e onChange event for input range
   */
  const updateProgress = throttle(
    () => {
      let time = currentTime;

      if (activeSrcIndexRef.current > 0) time -= targets[activeSrcIndexRef.current].altStart;

      const { start, end } = canvasTimesRef.current;
      if (time >= start && time <= end) {
        player.currentTime(time);
        setProgress(time);
      }
    }, 10);

  /**
   * Handle onMouseMove event for the progress bar, using the event
   * data to update the value of the time tooltip
   * @param {Object} e onMouseMove event over progress bar (input range)
   * @param {Boolean} isDummy flag indicating whether the hovered over range
   * is active or not
   */
  const handleMouseMove = (e, isDummy) => {
    let currentSrcIndex = srcIndex;
    if (isDummy) {
      currentSrcIndex = e.target.dataset.srcindex;
    }
    let offsetx = e.nativeEvent != undefined ? e.nativeEvent.offsetX : e.layerX;
    let time = convertToTime(e, offsetx, currentSrcIndex);

    setActiveSrcIndex(currentSrcIndex);
    setCurrentTime(time);

    // Set text in the tooltip as the time relevant to the pointer event's position
    timeToolRef.current.innerHTML = formatTooltipTime(time);

    // Calculate the horizontal position of the time tooltip
    // using the event's offsetX property
    let leftWidth = offsetx - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
    if (leftBlockRef.current) leftWidth += leftBlockRef.current.offsetWidth; // add the blocked off area width

    // Add the width of preceding dummy ranges
    const sliderRanges = document.querySelectorAll(
      'input[type=range][class^="vjs-custom-progress"]'
    );
    for (let slider of sliderRanges) {
      const sliderIndex = slider.dataset.srcindex;
      if (sliderIndex < currentSrcIndex) leftWidth += slider.offsetWidth;
    }
    if (e.pointerType != 'touch') {
      timeToolRef.current.style.left = leftWidth + 'px';
    }
  };

  /**
   * Initiate the switch of the src when clicked on an inactive
   * range. Update srcIndex in the parent components.
   * @param {Object} e onClick event on the dummy range
   */
  const handleClick = (e) => {
    const clickedSrcIndex = parseInt(e.target.dataset.srcindex);
    let time = currentTime;

    // Deduct the duration of the preceding ranges
    if (clickedSrcIndex > 0) {
      time -= canvasTargetsRef.current[clickedSrcIndex - 1].duration;
    }
    nextItemClicked(clickedSrcIndex, time);
  };

  const calculateTotalDuration = () => {
    // You could fetch real durations via the metadata of each video if needed
    let duration = canvasTargetsRef.current.reduce((acc, t) => acc + t.duration, 0);
    if (isNaN(duration)) { duration = canvasTargetsRef.current[0].end; }
    return duration;
  };

  const formatTooltipTime = (time) => {
    const { start, end } = canvasTimesRef.current;
    if (isMultiSourced) {
      return timeToHHmmss(time);
    } else {
      if (time >= start && time <= end) {
        return timeToHHmmss(time);
      } else if (time >= end) {
        return timeToHHmmss(end);
      } else if (time <= start) {
        return timeToHHmmss(start);
      }
    }
  };

  /**
   * Handle touch events on the progress bar
   * @param {Object} e touch event 
   */
  const handleTouchEvent = (e) => {
    handleMouseMove(e, false);
  };

  /**
   * Build input ranges for the inactive source segments
   * in the manifest
   * @param {Object} tInRange relevant time ranges
   * @returns list of inactive input ranges
   */
  const createRange = (tInRange) => {
    let elements = [];
    tInRange.map((t) => {
      let widthPercent = Math.min(
        100,
        Math.max(0, 100 * (t.duration / calculateTotalDuration()))
      );
      elements.push(
        <input
          type="range"
          aria-label="Progress bar"
          aria-valuemax={t.end} aria-valuemin={t.start}
          min={t.start}
          max={t.end}
          role="slider"
          data-srcindex={t.sIndex}
          className="vjs-custom-progress-inactive"
          onMouseMove={(e) => handleMouseMove(e, true)}
          onClick={handleClick}
          key={t.sIndex}
          tabIndex={0}
          style={{ width: `${widthPercent}%` }}
        ></input>
      );
    });
    return elements;
  };

  return (
    <div className="vjs-progress-holder vjs-slider vjs-slider-horizontal">
      <span className="tooltiptext" ref={timeToolRef} aria-hidden={true}>
      </span>
      <div className="vjs-custom-progress-container">
        {tLeft?.length > 0 ? (
          createRange(tLeft)
        ) : (
          <div
            className="block-stripes"
            role="presentation"
            ref={leftBlockRef}
            id="left-block"
            style={{ width: '0%' }}
          />
        )}
        <input
          type="range"
          aria-label="Progress bar"
          aria-valuemax={canvasTimesRef.current.end} aria-valuemin={canvasTimesRef.current.start}
          aria-valuenow={progress}
          max={canvasTimesRef.current.end} min={canvasTimesRef.current.start}
          value={progress}
          role="slider"
          data-srcindex={srcIndex}
          className="vjs-custom-progress"
          onChange={updateProgress}
          onClick={updateProgress}
          onTouchEnd={handleTouchEvent}
          onTouchStart={handleTouchEvent}
          onMouseDown={(e) => handleMouseMove(e, false)}
          onPointerMove={(e) => handleMouseMove(e, false)}
          id="slider-range"
          ref={sliderRangeRef}
        ></input>
        {tRight?.length > 0 ? (
          createRange(tRight)
        ) : (
          <div
            className="block-stripes"
            role="presentation"
            id="right-block"
            style={{ width: '0%' }}
          />
        )}
      </div>
    </div>
  );
}

vjsComponent.registerComponent('VideoJSProgress', VideoJSProgress);

export default VideoJSProgress;
