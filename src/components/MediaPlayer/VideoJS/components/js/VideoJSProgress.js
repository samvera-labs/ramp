import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSProgress.scss';
import { IS_MOBILE, IS_IPAD } from '@Services/browser';

const vjsComponent = videojs.getComponent('Component');

/**
 * Custom component to show progress bar in the player, modified
 * to display multiple items in a single canvas
 * @param {Object} props
 * @param {Number} props.duration canvas duration
 * @param {Array} props.targets set of start and end times for
 * items in the current canvas
 * @param {Function} nextItemClicked callback func to trigger state
 * changes in the parent component
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
    this.setTimes = this.setTimes.bind(this);

    this.player = player;
    this.options = options;
    this.currentTime = options.currentTime;
    this.state = { startTime: null, endTime: null };
    this.times = options.targets[options.srcIndex];

    player.on('loadstart', () => {
      this.options.currentTime = this.player.currentTime();
      this.options.srcIndex = this.player.srcIndex || 0;
      this.options.targets = this.player.targets?.length > 0
        ? this.player.targets
        : this.options.targets;
      this.mount();
      this.setTimes();
    });

    player.on('canplay', () => {
      this.options.duration = this.player.duration();
      this.initProgressBar();
    });
  }

  /**
   * Adjust start, end times of the targeted track based
   * on the previous items on canvas
   */
  setTimes() {
    const { srcIndex, targets } = this.options;
    const { start, end, altStart } = targets[srcIndex];
    let startTime = start,
      endTime = end;

    if (targets.length > 1) {
      startTime = start + altStart;
      endTime = end + altStart;
    }
    this.setState({ startTime, endTime });
  }

  /** Build progress bar elements from the options */
  initProgressBar() {
    const { targets, duration } = this.options;
    const { startTime, endTime } = this.state;

    const leftBlock = (startTime * 100) / duration;
    const rightBlock = ((duration - endTime) * 100) / duration;

    const toPlay = 100 - leftBlock - rightBlock;

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

    document.getElementById('slider-range').style.width = toPlay + '%';
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
    if (!el_) {
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
    if (curTime >= end && player && !player.paused()) {
      if (nextItems.length == 0) options.nextItemClicked(0, targets[0].start);
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
        slider.style.setProperty('background', '#477076');
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
 * @param {obj.options} - options passed when initilizing the component
 * @returns
 */
function ProgressBar({
  player,
  handleTimeUpdate,
  initCurrentTime,
  times,
  srcIndex,
  targets,
  nextItemClicked
}) {
  const [progress, _setProgress] = React.useState(initCurrentTime);
  const [currentTime, setCurrentTime] = React.useState(player.currentTime());
  const timeToolRef = React.useRef();
  const leftBlockRef = React.useRef();
  const sliderRangeRef = React.useRef();
  const [tLeft, setTLeft] = React.useState([]);
  const [tRight, setTRight] = React.useState([]);
  const [canvasTimes, setCanvasTimes] = React.useState(times);
  const [activeSrcIndex, setActiveSrcIndex] = React.useState(0);
  const [canvasTargets, setCanvasTargets] = React.useState(targets);

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

  let playerEventListener;

  React.useEffect(() => {
    if (player.targets?.length > 0) {
      setCanvasTargets(player.targets);
      setCanvasTimes(player.targets[srcIndex]);
    }

    const right = canvasTargets.filter((_, index) => index > srcIndex);
    const left = canvasTargets.filter((_, index) => index < srcIndex);
    setTRight(right);
    setTLeft(left);

    // Position the timetool tip at the first load
    if (timeToolRef.current && sliderRangeRef.current) {
      timeToolRef.current.style.top =
        -timeToolRef.current.offsetHeight -
        sliderRangeRef.current.offsetHeight * 3 + // deduct 3 x height of progress bar element
        'px';
    }
    const curTime = player.currentTime();
    setProgress(curTime);
    setCurrentTime(curTime + canvasTimes.altStart);

    /**
     * Using a time interval instead of 'timeupdate event in VideoJS, because Safari
     * and other browsers in MacOS stops firing the 'timeupdate' event consistently 
     * after a while
     */
    playerEventListener = setInterval(() => {
      timeUpdateHandler();
    }, 100);

    // Get the pixel ratio for the range
    const ratio = sliderRangeRef.current.offsetWidth / (canvasTimes.end - canvasTimes.start);

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
  }, [player.src()]);

  // Clean up interval on component unmount
  React.useEffect(() => {
    return () => {
      clearInterval(playerEventListener);
    };
  }, []);

  // Update progress bar with timeupdate in the player
  const timeUpdateHandler = () => {
    if (player.isDisposed() || player.ended()) { return; }
    const iOS = player.hasClass("vjs-ios-native-fs");
    let curTime;
    // Initially update progress from the prop passed from Ramp,
    // this accounts for structured navigation when switching canvases
    if ((initTimeRef.current > 0 && player.currentTime() == 0)) {
      curTime = initTimeRef.current;
      player.currentTime(initTimeRef.current);
    } else {
      curTime = player.currentTime();
    }
    // This state update caused weird lagging behaviors when using the iOS native
    // player. iOS player handles its own progress bar, so we can skip the
    // update here.
    if (!iOS) { setProgress(curTime); }
    handleTimeUpdate(curTime);
    setInitTime(0);
  };

  player.on('canplay', () => {
    /*
     Set playable duration and alternate start as player properties to use in
     track scrubber component, when displaying playlist manifests
    */
    player.playableDuration = (canvasTimes.end - canvasTimes.start) || player.duration();
    player.altStart = canvasTimes.start;
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
  const convertToTime = (e, index) => {
    let time =
      (e.nativeEvent.offsetX / e.target.clientWidth) * (e.target.max - e.target.min)
      ;
    if (index != undefined) time += canvasTimes.altStart;
    return time;
  };

  /**
   * Set progress and player time when using the input range
   * (progress bar) to seek to a particular time point
   * @param {Object} e onChange event for input range
   */
  const updateProgress = (e) => {
    let time = currentTime;
    const { start, end, altStart } = canvasTimes;
    if (activeSrcIndex > 0) time -= altStart;

    if (time >= start && time <= end) {
      player.currentTime(time);
      setProgress(time);
    }
  };

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
    setActiveSrcIndex(currentSrcIndex);
    setCurrentTime(convertToTime(e, currentSrcIndex));

    // Calculate the horizontal position of the time tooltip
    // using the event's offsetX property
    let leftWidth = e.nativeEvent.offsetX - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
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
      time -= canvasTargets[clickedSrcIndex - 1].duration;
    }
    nextItemClicked(clickedSrcIndex, time);
  };

  const formatTooltipTime = (time) => {
    const { start, end } = canvasTimes;
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
        ></input>
      );
    });
    return elements;
  };

  return (
    <div className="vjs-progress-holder vjs-slider vjs-slider-horizontal">
      <span className="tooltiptext" ref={timeToolRef} aria-hidden={true}>
        {formatTooltipTime(currentTime)}
      </span>
      {tLeft.length > 0 ? (
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
        aria-valuemax={canvasTimes.end} aria-valuemin={canvasTimes.start}
        aria-valuenow={progress}
        max={canvasTimes.end} min={canvasTimes.start}
        value={progress}
        role="slider"
        data-srcindex={srcIndex}
        className="vjs-custom-progress"
        onChange={updateProgress}
        onTouchEnd={handleTouchEvent}
        onTouchStart={handleTouchEvent}
        onMouseDown={(e) => handleMouseMove(e, false)}
        onPointerMove={(e) => handleMouseMove(e, false)}
        id="slider-range"
        ref={sliderRangeRef}
      ></input>
      {tRight.length > 0 ? (
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
  );
}

vjsComponent.registerComponent('VideoJSProgress', VideoJSProgress);

export default VideoJSProgress;
