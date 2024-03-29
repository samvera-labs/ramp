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

    /* When player src is changed, call method to mount and update the component */
    player.on('loadstart', () => {
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
  const { targets } = options;

  const [currTime, setCurrTime] = React.useState(player.currentTime());

  let initTimeRef = React.useRef(options.currentTime);
  const setInitTime = (t) => {
    initTimeRef.current = t;
  };

  let playerEventListener;

  // Clean up time interval on component unmount
  React.useEffect(() => {
    playerEventListener = setInterval(() => {
      handleTimeUpdate();
    }, 100);

    return () => {
      clearInterval(playerEventListener);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (player.isDisposed()) { return; }
    const iOS = player.hasClass("vjs-ios-native-fs");
    let time;
    // Update time from the given initial time if it is not zero
    if (initTimeRef.current > 0 && player.currentTime() == 0) {
      time = initTimeRef.current;
    } else {
      time = player.currentTime();
    }
    const { start, altStart } = targets[player.srcIndex];

    console.log('CURENT TIME: ', time, start, altStart, player.srcIndex);
    if (altStart != start && player.srcIndex > 0) {
      time = time + altStart;
    }
    // This state update caused weird lagging behaviors when using the iOS native
    // player. iOS player handles its own time, so we can skip the update here.
    if (!iOS) { setCurrTime(time); }
    setInitTime(0);
  };


  // Update our timer after the user leaves full screen
  player.on("fullscreenchange", (e) => {
    if (!player.isFullscreen()) {
      setCurrTime(player.currentTime());
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
