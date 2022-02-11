import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import './VideoJSProgress.scss';

function ProgressBar({ player, updateTime, options }) {
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const timeToolRef = React.useRef();
  const leftBlockRef = React.useRef();
  const sliderRangeRef = React.useRef();
  const times = options.times;

  player.on('timeupdate', () => {
    const curTime = player.currentTime();
    let progress = 0;
    if (times) {
      const duration = times.end - times.start;
      progress = ((curTime - times.start) / duration) * 100;
      // console.log('Progress: ', progress);
    } else {
      console.log('timeupdate event progressbar');
      progress = (curTime / player.duration()) * 100;
    }

    if (options.srcIndex > 0) {
      // console.log('NEXT ITEM');
    }
    setProgress(progress);
  });

  const convertToTime = (e) => {
    const max = parseInt(e.target.getAttribute('max'), 10);
    const v = Math.round((e.nativeEvent.offsetX / e.target.clientWidth) * max);
    const { start, end } = options.times;
    const time = ((end - start) * v) / max + start;
    setCurrentTime(time);
  };

  const updateProgress = (e) => {
    const p = e.target.value;
    setProgress(p);
    const time = updateTime(p);
    setCurrentTime(time);
  };

  const handleMouseMove = (e) => {
    convertToTime(e);
    timeToolRef.current.style.left =
      e.nativeEvent.offsetX -
      timeToolRef.current.offsetWidth / 2 + // deduct 0.5 x width of tooltip element
      leftBlockRef.current.offsetWidth + // add the blocked off area width
      'px';
    timeToolRef.current.style.top =
      e.nativeEvent.offsetY -
      timeToolRef.current.offsetHeight -
      sliderRangeRef.current.offsetHeight * 4 + // deduct 4 x height of progress bar element
      'px';
  };

  return (
    <div className="vjs-progress-holder vjs-slider vjs-slider-horizontal">
      <span className="tooltiptext" ref={timeToolRef}>
        {timeToHHmmss(currentTime)}
      </span>
      <div
        className="block-stripes"
        ref={leftBlockRef}
        id="left-block"
        style={{ width: '0%' }}
      />
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        className="vjs-custom-progress"
        onChange={updateProgress}
        onMouseMove={handleMouseMove}
        id="slider-range"
        ref={sliderRangeRef}
      ></input>
      <div className="block-stripes" id="right-block" style={{ width: '0%' }} />
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

    this.player = player;
    this.options = options;

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    player.on('loadedmetadata', () => {
      this.initProgressBar();
    });

    player.on('timeupdate', (e) => {
      this.handleTimeUpdate();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  initProgressBar() {
    const { start, end } = this.options.times;
    const { duration, srcIndex, targets } = this.options;
    let startTime = start,
      endTime = end;

    console.log(this.options);

    if (srcIndex > 0) {
      startTime = start + targets[srcIndex - 1].end;
      endTime = end + targets[srcIndex - 1].end;
    }
    // const duration = player.duration();
    let leftBlock = (startTime * 100) / duration;
    const rightBlock = ((duration - endTime) * 100) / duration;
    console.log(
      'left: ',
      leftBlock,
      ' | right: ',
      rightBlock,
      ' | duration: ',
      this.options.duration
    );
    const toPlay = 100 - leftBlock - rightBlock;

    document.getElementById('left-block').style.width = leftBlock + '%';
    document.getElementById('right-block').style.width = rightBlock + '%';
    document.getElementById('slider-range').style.width = toPlay + '%';
  }

  handleTimeUpdate() {
    const player = this.player;
    const { start, end } = this.options.times;
    const curTime = player.currentTime();

    if (curTime < start) {
      player.currentTime(start);
    }
    if (curTime > end) {
      player.currentTime(start);
      player.pause();
    }

    const played = Number(((curTime - start) * 100) / (end - start));
    // console.log('start: ', start, ' | end: ', end, ' | curTime: ', curTime);
    document.documentElement.style.setProperty(
      '--range-progress',
      `calc(${played}%)`
    );
  }

  updateTime(value) {
    const { start, end } = this.options.times;
    const currentTime = ((end - start) * value) / 100 + start;
    this.player.currentTime(currentTime);
    return currentTime;
  }

  mount() {
    ReactDOM.render(
      <ProgressBar
        handleOnChange={this.handleOnChange}
        player={this.player}
        updateTime={this.updateTime}
        options={this.options}
      />,
      this.el()
    );
  }
}

vjsComponent.registerComponent('VideoJSProgress', VideoJSProgress);

export default VideoJSProgress;
