import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import { timeToHHmmss } from '@Services/utility-helpers';

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
    this.setAttribute('role', 'presentation');

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

  let initTimeRef = React.useRef(options.currentTime);
  const setInitTime = (t) => {
    initTimeRef.current = t;
  };

  player.on('timeupdate', () => {
    if (player.isDisposed()) return;
    const iOS = player.hasClass("vjs-ios-native-fs");
    let time;
    // Update time from the given initial time if it is not zero
    if (initTimeRef.current > 0 && player.currentTime() == 0) {
      time = initTimeRef.current;
    } else {
      time = player.currentTime();
    }
    if (targets.length > 1) time += targets[srcIndex].altStart;
    // This state update caused weird lagging behaviors when using the iOS native
    // player. iOS player handles its own time, so we can skip the update here.
    if (!iOS) { setCurrTime(time); }
    setInitTime(0);
  });

  // Update our timer after the user leaves full screen
  player.on("fullscreenchange", (e) => {
    if (!player.isFullscreen()) {
      setProgress(player.currentTime());
    }
  });

  return (
    <span className="vjs-current-time-display" role="presentation">
      {timeToHHmmss(currTime)}
    </span>
  );
}

vjsComponent.registerComponent('VideoJSCurrentTime', VideoJSCurrentTime);

export default VideoJSCurrentTime;
