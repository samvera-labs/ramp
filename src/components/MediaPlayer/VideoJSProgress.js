import { getMediaFragment } from '@Services/iiif-parser';
import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import './VideoJSProgress.scss';

function ProgressBar({ player, updateTime, times }) {
  const [progress, setProgress] = React.useState(0);

  player.on('timeupdate', () => {
    const curTime = player.currentTime();
    let progress = 0;
    if (times) {
      progress = ((curTime - times.start) / (times.end - times.start)) * 100;
      setProgress(progress);
    }
    // else {
    //   progress = (curTime / player.duration()) * 100;
    //   setProgress(progress);
    // }
  });

  const updateProgress = (e) => {
    setProgress(e.target.value);
    updateTime(e.target.value);
  };

  return (
    <div className="vjs-progress-holder">
      <div className="block-stripes" id="left-block" style={{ width: '0%' }} />
      <input
        type="range"
        min="1"
        max="100"
        value={progress}
        className="myslider"
        onChange={updateProgress}
        id="sliderRange"
      ></input>
      <div className="block-stripes" id="right-block" style={{ width: '0%' }} />
    </div>
  );
}

const vjsComponent = videojs.getComponent('Component');

class VideoJSProgress extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-progress');
    this.mount = this.mount.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.initProgressBar = this.initProgressBar.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.player = player;
    this.options = options;

    this.state = {
      start: null,
      end: null,
    };

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    player.on('loadedmetadata', () => {
      this.updateState();
      this.initProgressBar();
    });

    player.on('timeupdate', (e) => {
      this.handleOnChange();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  updateState() {
    const timeFragment = getMediaFragment(this.player.src());
    if (timeFragment != undefined) {
      this.setState({ start: timeFragment.start, end: timeFragment.stop });
    } else {
      this.setState({ start: 0, end: this.player.duration() });
    }
    this.player.currentTime(this.state.start);
  }

  handleOnChange() {
    this.handleTimeUpdate(this.player);
  }

  initProgressBar() {
    const player = this.player;
    console.log(this.state);
    const { start, end } = this.state;
    const duration = player.duration();

    const leftBlock = (start * 100) / duration;
    const rightBlock = ((duration - end) * 100) / duration;

    const toPlay = 100 - leftBlock - rightBlock;

    document.getElementById('left-block').style.width = leftBlock + '%';
    document.getElementById('right-block').style.width = rightBlock + '%';
    document.getElementById('sliderRange').style.width = toPlay + '%';
  }

  handleTimeUpdate(player) {
    const { start, end } = this.state;
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
    const { start, end } = this.state;
    const currentTime = ((end - start) * value) / 100 + start;
    this.player.currentTime(currentTime);
  }

  mount() {
    ReactDOM.render(
      <ProgressBar
        handleOnChange={this.handleOnChange}
        player={this.player}
        updateTime={this.updateTime}
        timee={this.state}
      />,
      this.el()
    );
  }
}

vjsComponent.registerComponent('VideoJSProgress', VideoJSProgress);

export default VideoJSProgress;
