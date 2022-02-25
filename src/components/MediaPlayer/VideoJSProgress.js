import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import './VideoJSProgress.scss';

function ProgressBar({ player, handleTimeUpdate, times, options }) {
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(player.currentTime());
  const timeToolRef = React.useRef();
  const leftBlockRef = React.useRef();
  const sliderRangeRef = React.useRef();
  const { targets, srcIndex } = options;
  const [tLeft, setTLeft] = React.useState([]);
  const [tRight, setTRight] = React.useState([]);

  React.useEffect(() => {
    const right = targets.filter((_, index) => index > srcIndex);
    const left = targets.filter((_, index) => index < srcIndex);
    setTRight(right);
    setTLeft(left);
  }, []);

  player.on('timeupdate', () => {
    const curTime = player.currentTime();
    setProgress(curTime);
    handleTimeUpdate(curTime);
  });

  const convertToTime = (e, index) => {
    let time = Math.round(
      (e.nativeEvent.offsetX / e.target.clientWidth) * e.target.max
    );
    if (index != undefined) time += targets[index].altStart;
    setCurrentTime(time);
    return time;
  };

  const updateProgress = (value, e = null) => {
    let time = parseFloat(value);
    setProgress(time);
    player.currentTime(time);

    if (srcIndex > 0) time = time + targets[srcIndex].altStart;
    setCurrentTime(time);
    // if (e) handleMouseMove(e, false);
  };

  const handleMouseMove = (e, isDummy) => {
    let currentSrcIndex = srcIndex;
    if (isDummy) {
      currentSrcIndex = e.target.dataset.srcindex;
    }
    convertToTime(e, currentSrcIndex);
    let leftWidth = e.nativeEvent.offsetX - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
    if (leftBlockRef.current) leftWidth += leftBlockRef.current.offsetWidth; // add the blocked off area width
    const sliderRanges = document.querySelectorAll(
      'input[type=range][class^="vjs-custom-progress"]'
    );
    for (let slider of sliderRanges) {
      const sliderIndex = slider.dataset.srcindex;
      if (sliderIndex < currentSrcIndex) leftWidth += slider.offsetWidth;
    }
    timeToolRef.current.style.left = leftWidth + 'px';
    timeToolRef.current.style.top =
      e.nativeEvent.offsetY -
      timeToolRef.current.offsetHeight -
      sliderRangeRef.current.offsetHeight * 4 + // deduct 4 x height of progress bar element
      'px';
  };

  const handleClick = (e) => {
    console.log('calling convertotime');
    const clickedSrcIndex = parseInt(e.target.dataset.srcindex);
    let time = convertToTime(e, clickedSrcIndex);
    // let time = currentTime;
    if (clickedSrcIndex > 0) {
      console.log(time, clickedSrcIndex, targets[clickedSrcIndex - 1].end);
      time -= targets[clickedSrcIndex - 1].end;
      console.log(time);
    }
    updateProgress(time);
    // handleTimeUpdate(time);
    options.nextItemClicked(e, time);
  };

  const createRange = (tInRange) => {
    let elements = [];
    tInRange.map((t) => {
      elements.push(
        <input
          type="range"
          min={t.start}
          max={t.end}
          value={progress}
          data-srcindex={t.sIndex}
          className="vjs-custom-progress-inactive"
          onChange={(e) => updateProgress(e.target.value, e)}
          onMouseMove={(e) => handleMouseMove(e, true)}
          onClick={handleClick}
          key={t.sIndex}
        ></input>
      );
    });
    return elements;
  };

  return (
    <div className="vjs-progress-holder vjs-slider vjs-slider-horizontal">
      <span className="tooltiptext" ref={timeToolRef}>
        {timeToHHmmss(currentTime)}
      </span>
      {tLeft.length > 0 ? (
        createRange(tLeft)
      ) : (
        <div
          className="block-stripes"
          ref={leftBlockRef}
          id="left-block"
          style={{ width: '0%' }}
        />
      )}
      <input
        type="range"
        min={times.start}
        max={times.end}
        value={progress}
        data-srcindex={srcIndex}
        className="vjs-custom-progress"
        onChange={(e) => updateProgress(e.target.value, e)}
        onMouseMove={(e) => handleMouseMove(e, false)}
        id="slider-range"
        ref={sliderRangeRef}
      ></input>
      {tRight.length > 0 ? (
        createRange(tRight)
      ) : (
        <div
          className="block-stripes"
          id="right-block"
          style={{ width: '0%' }}
        />
      )}
    </div>
  );
}

const vjsComponent = videojs.getComponent('Component');

class VideoJSProgress extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-custom-progress-bar');

    this.mount = this.mount.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.initProgressBar = this.initProgressBar.bind(this);
    this.setTimes = this.setTimes.bind(this);

    this.player = player;
    this.options = options;
    this.state = { startTime: null, endTime: null };
    this.times = options.targets[options.srcIndex];

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    player.on('loadedmetadata', () => {
      this.setTimes();
      this.initProgressBar();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  // Adjust start, end times of the targeted track based
  // on the previous items on canvas
  setTimes() {
    const { start, end } = this.times;
    const { srcIndex, targets } = this.options;
    let startTime = start,
      endTime = end;

    if (targets.length > 1) {
      startTime = start + targets[srcIndex].altStart;
      endTime = end + targets[srcIndex].altStart;
    }
    this.setState({ startTime, endTime });
  }

  initProgressBar() {
    const { duration, targets } = this.options;
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
    // Set the width of dummy slider ranges based on duration of each
    // item
    for (let ds of dummySliders) {
      const dsIndex = ds.dataset.srcindex;
      let styleWidth = (targets[dsIndex].duration * 100) / duration;
      ds.style.width = styleWidth + '%';
    }

    document.getElementById('slider-range').style.width = toPlay + '%';
  }

  handleTimeUpdate(curTime) {
    const player = this.player;
    const { start, end } = this.times;

    if (curTime < start) {
      player.currentTime(start);
    }
    if (curTime > end) {
      player.currentTime(start);
      player.pause();
    }

    // Mark the preceding dummy slider ranges as 'played'
    const dummySliders = document.getElementsByClassName(
      'vjs-custom-progress-inactive'
    );
    for (let slider of dummySliders) {
      const sliderIndex = slider.dataset.srcindex;
      if (sliderIndex < this.options.srcIndex) {
        slider.style.setProperty('background', '#477076');
      }
    }

    const played = Number(((curTime - start) * 100) / (end - start));

    document.documentElement.style.setProperty(
      '--range-progress',
      `calc(${played}%)`
    );
  }

  mount() {
    ReactDOM.render(
      <ProgressBar
        handleOnChange={this.handleOnChange}
        player={this.player}
        handleTimeUpdate={this.handleTimeUpdate}
        times={this.times}
        options={this.options}
      />,
      this.el()
    );
  }
}

vjsComponent.registerComponent('VideoJSProgress', VideoJSProgress);

export default VideoJSProgress;
