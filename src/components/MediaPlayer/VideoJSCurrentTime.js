import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import { createTimestamp } from '../../services/utility-helpers';

function CurrentTimeDisplay({ player, options }) {
  const { srcIndex, targets } = options;

  const [currTime, setCurrTime] = React.useState(player.currentTime());

  player.on('timeupdate', () => {
    let time = player.currentTime();
    if (srcIndex > 0) {
      time = targets[srcIndex - 1].end + time;
    }
    setCurrTime(time);
  });

  return (
    <span className="vjs-current-time-display">
      {createTimestamp(currTime)}
    </span>
  );
}

const vjsComponent = videojs.getComponent('Component');

class VideoJSCurrentTime extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-time-control');

    this.mount = this.mount.bind(this);

    this.player = player;
    this.options = options;

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    ReactDOM.render(
      <CurrentTimeDisplay player={this.player} options={this.options} />,
      this.el()
    );
  }
}

vjsComponent.registerComponent('VideoJSCurrentTime', VideoJSCurrentTime);

export default VideoJSCurrentTime;
