import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import { timeToHHmmss } from '../../../../services/utility-helpers';
import '../styles/VideoJSCurrentTime.scss';

const vjsComponent = videojs.getComponent('Component');

/**
 * Custom component to display the current time of the player
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options options passed into component
 * options: { srcIndex, targets }
 */
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

function CurrentTimeDisplay({ player, options }) {
  const { srcIndex, targets } = options;

  const [currTime, setCurrTime] = React.useState(player.currentTime());

  player.on('timeupdate', () => {
    let time = player.currentTime();

    if (targets.length > 1) time += targets[srcIndex].altStart;
    setCurrTime(time);
  });

  return (
    <span className="vjs-current-time-display">{timeToHHmmss(currTime)}</span>
  );
}

vjsComponent.registerComponent('VideoJSCurrentTime', VideoJSCurrentTime);

export default VideoJSCurrentTime;
