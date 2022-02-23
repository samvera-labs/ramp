import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import './VideoJSProgress.scss';

function ProgressBar({ player, handleTimeUpdate, times, options }) {
  const [progress, setProgress] = React.useState(0);
  const [progress2, setProgress2] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(player.currentTime());
  const timeToolRef = React.useRef();
  const leftBlockRef = React.useRef();
  const sliderRangeRef = React.useRef();
  const dummySliderRef = React.useRef();
  const { targets, srcIndex } = options;
  const [tLeft, setTLeft] = React.useState({});
  const [tRight, setTRight] = React.useState({});

  React.useEffect(() => {
    accumulateTime();
  }, []);
  player.on('timeupdate', () => {
    const curTime = player.currentTime();
    setProgress(curTime);
    handleTimeUpdate(curTime);
  });

  const convertToTime = (e, altMax = 0, hasAltStart = false) => {
    const v = Math.round(
      (e.nativeEvent.offsetX / e.target.clientWidth) * e.target.max
    );
    let time = v + parseFloat(altMax);
    if (hasAltStart) time += targets[srcIndex].altStart;
    setCurrentTime(time);
  };

  const updateProgress = (e) => {
    let time = parseFloat(e.target.value);
    setProgress(time);
    player.currentTime(time);

    if (srcIndex > 0) time = time + targets[srcIndex].altStart;
    console.log(time, currentTime);
    setCurrentTime(time);
  };

  const handleMouseMove = (e) => {
    convertToTime(e);
    let leftWidth = e.nativeEvent.offsetX - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
    if (leftBlockRef.current) leftWidth += leftBlockRef.current.offsetWidth; // add the blocked off area width
    if (dummySliderRef.current) {
      convertToTime(e, 0, true);
      leftWidth += dummySliderRef.current.offsetWidth;
    }
    timeToolRef.current.style.left = leftWidth + 'px';
    timeToolRef.current.style.top =
      e.nativeEvent.offsetY -
      timeToolRef.current.offsetHeight -
      sliderRangeRef.current.offsetHeight * 4 + // deduct 4 x height of progress bar element
      'px';
  };

  const handleDummyMouseMove = (e) => {
    // console.log(e.target.id);
    let left = e.nativeEvent.offsetX - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
    if (leftBlockRef.current) left += leftBlockRef.current.offsetWidth;
    if (e.target.id == 'slider-range-dummy-right') {
      convertToTime(e, sliderRangeRef.current.max, true);
      left = left + sliderRangeRef.current.offsetWidth; // add the previous slider range width
    } else {
      convertToTime(e);
    }
    timeToolRef.current.style.left = left + 'px';
    timeToolRef.current.style.top =
      e.nativeEvent.offsetY -
      timeToolRef.current.offsetHeight -
      sliderRangeRef.current.offsetHeight * 4 + // deduct 4 x height of progress bar element
      'px';
  };

  const showProgress = (e) => {
    setProgress2(e.target.value);
  };

  const handleClick = (e) => {
    options.nextItemClicked(e);
    updateProgress(e);
  };

  const accumulateTime = () => {
    console.log(targets);
    let sl = 0,
      el = 0,
      sr = 0,
      er = 0;
    targets.map((t, i) => {
      if (i < srcIndex) {
        sl += t.altStart;
        el += t.end;
      } else if (i > srcIndex) {
        sr += t.altStart;
        er += t.end;
      }
    });
    setTRight({ ...tRight, start: sr, end: er });
    setTLeft({ ...tLeft, start: sl, end: el });
  };

  // console.log(tLeft, tRight);
  const createRange = (t, side) => {
    const i = side === 'left' ? srcIndex - 1 : srcIndex + 1;
    return (
      <input
        type="range"
        min={t.start}
        max={t.end}
        value={progress2}
        data-srcindex={i}
        className="vjs-custom-progress-inactive"
        onChange={updateProgress}
        onMouseMove={handleDummyMouseMove}
        onClick={handleClick}
        id={`slider-range-dummy-${side}`}
        ref={side === 'left' ? dummySliderRef : null}
      ></input>
    );
  };

  return (
    <div className="vjs-progress-holder vjs-slider vjs-slider-horizontal">
      <span className="tooltiptext" ref={timeToolRef}>
        {timeToHHmmss(currentTime)}
      </span>
      {tLeft.start > 0 || tLeft.end > 0 ? (
        createRange(tLeft, 'left')
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
        data-srcindex={0}
        className="vjs-custom-progress"
        onChange={updateProgress}
        onMouseMove={handleMouseMove}
        id="slider-range"
        ref={sliderRangeRef}
      ></input>
      {tRight.start > 0 ? (
        createRange(tRight, 'right')
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
    this.updateTime = this.updateTime.bind(this);
    this.setTimes = this.setTimes.bind(this);

    this.player = player;
    this.options = options;
    this.state = {
      startTime: null,
      endTime: null,
      isLastItem: false,
    };
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
    const { duration, targets, srcIndex } = this.options;
    const { startTime, endTime } = this.state;

    const leftBlock = (startTime * 100) / duration;
    const rightBlock = ((duration - endTime) * 100) / duration;

    const toPlay = 100 - leftBlock - rightBlock;

    const leftDiv = document.getElementById('left-block');
    const rightDiv = document.getElementById('right-block');

    // for left-hand side
    if (leftDiv) {
      leftDiv.style.width = leftBlock + '%';
    } else {
      document.getElementById('slider-range-dummy-left').style.width =
        leftBlock + '%';
    }
    if (rightDiv) {
      rightDiv.style.width = rightBlock + '%';
    } else {
      document.getElementById('slider-range-dummy-right').style.width =
        rightBlock + '%';
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

    const played = Number(((curTime - start) * 100) / (end - start));

    document.documentElement.style.setProperty(
      '--range-progress',
      `calc(${played}%)`
    );
  }

  updateTime(value) {
    const { start, end } = this.times;
    const currentTime = ((end - start) * value) / 100 + start;
    this.player.currentTime(currentTime);
    return currentTime;
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
