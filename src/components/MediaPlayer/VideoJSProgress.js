import { timeToHHmmss } from '@Services/utility-helpers';
import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import './VideoJSProgress.scss';

function ProgressBar({ player, updateTime, times }) {
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const timeToolRef = React.useRef();
  const leftBlockRef = React.useRef();
  const sliderRangeRef = React.useRef();

  player.on('timeupdate', () => {
    const curTime = player.currentTime();
    let progress = 0;
    if (times) {
      const duration = times.end - times.start;
      progress = ((curTime - times.start) / duration) * 100;
    } else {
      progress = (curTime / player.duration()) * 100;
    }
    setProgress(progress);
  });

  const convertToTime = (e) => {
    const max = parseInt(e.target.getAttribute('max'), 10);
    const v = Math.round((e.nativeEvent.offsetX / e.target.clientWidth) * max);
    const { start, end } = times;
    const time = ((end - start) * v) / max + start;
    setCurrentTime(time);
  };

  const updateProgress = (e) => {
    const p = e.target.value;
    setProgress(p);
    const time = updateTime(p);
    console.log('setting progress: ', time, player.currentTime());
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
      <span class="tooltiptext" ref={timeToolRef}>
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
    const player = this.player;
    const { start, end } = this.options;

    player.currentTime(start);
    const duration = player.duration();

    const leftBlock = (start * 100) / duration;
    const rightBlock = ((duration - end) * 100) / duration;

    const toPlay = 100 - leftBlock - rightBlock;

    document.getElementById('left-block').style.width = leftBlock + '%';
    document.getElementById('right-block').style.width = rightBlock + '%';
    document.getElementById('slider-range').style.width = toPlay + '%';
  }

  handleTimeUpdate() {
    const player = this.player;
    const { start, end } = this.options;
    const curTime = player.currentTime();

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
    const { start, end } = this.options;
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
        times={this.options}
      />,
      this.el()
    );
  }
}

vjsComponent.registerComponent('VideoJSProgress', VideoJSProgress);

export default VideoJSProgress;
