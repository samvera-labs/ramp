import React from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import hlsjs from 'hls.js';

import 'videojs-markers-plugin/dist/videojs-markers-plugin';
import 'videojs-markers-plugin/dist/videojs.markers.plugin.css';

import {
  usePlayerDispatch,
  usePlayerState,
} from '../../context/player-context';
import vjsYo from './vjsYo';
import {
  useManifestState,
  useManifestDispatch,
} from '../../context/manifest-context';
import { hasNextSection, getNextItem } from '@Services/iiif-parser';

function VideoJSPlayer({
  isVideo,
  switchPlayer,
  handleIsEnded,
  ...videoJSOptions
}) {
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const manifestState = useManifestState();
  const manifestDispatch = useManifestDispatch();
  const [cIndex, setCIndex] = React.useState(canvasIndex);
  const [isReady, setIsReady] = React.useState(false);

  const playerRef = React.useRef();

  const { manifest, canvasIndex, currentNavItem } = manifestState;
  const {
    isClicked,
    isEnded,
    isPlaying,
    player,
    startTime,
    endTime,
  } = playerState;

  React.useEffect(() => {
    const options = {
      ...videoJSOptions,
    };

    setCIndex(canvasIndex);

    const newPlayer = videojs(playerRef.current, options);

    newPlayer.getChild('controlBar').addChild('vjsYo', {});

    playerDispatch({
      player: newPlayer,
      type: 'updatePlayer',
    });

    // Clean up player instance on component unmount
    return () => {
      if (newPlayer) {
        // Reset isReady flag
        setIsReady(false);
        newPlayer.dispose();
      }
    };
  }, []);

  React.useEffect(() => {
    if (player) {
      player.on('ready', function () {
        setIsReady(true);
        console.log('ready');
        // Initialize markers
        player.markers({
          markerTip: {
            display: true,
            text: function (marker) {
              return marker.text;
            },
          },
          markerStyle: {
            opacity: '0.5',
            'background-color': '#80A590',
            'border-radius': 0,
            height: '16px',
            top: '-7px',
          },
          markers: [],
        });
      });
      player.on('ended', () => {
        console.log('ended');
        playerDispatch({ isEnded: true, type: 'setIsEnded' });
        handleEnded(player);
      });
      player.on('loadedmetadata', () => {
        console.log('loadedmetadata');

        if (isEnded || isPlaying) {
          player.play();
        }
        // Reset isEnded flag
        playerDispatch({ isEnded: false, type: 'setIsEnded' });
      });
      player.on('pause', () => {
        console.log('pause');
        playerDispatch({ isPlaying: false, type: 'setPlayingStatus' });
      });
      player.on('play', () => {
        console.log('play');
        playerDispatch({ isPlaying: true, type: 'setPlayingStatus' });
      });
    }
  }, [player]);

  React.useEffect(() => {
    if (!player) {
      return;
    }

    if (startTime != null && isReady) {
      player.currentTime(startTime, playerDispatch({ type: 'resetClick' }));

      // Mark current timefragment
      if (player.markers) {
        player.markers.removeAll();
        player.markers.add([
          {
            time: startTime,
            duration: endTime - startTime,
            text: currentNavItem.label.en[0],
          },
        ]);
      }
    }
  }, [startTime, endTime, isClicked, isReady]);

  React.useEffect(() => {
    if (isClicked && canvasIndex !== cIndex) {
      switchPlayer();
    }
    setCIndex(canvasIndex);
  }, [canvasIndex]);

  const handleEnded = () => {
    if (hasNextSection({ canvasIndex, manifest })) {
      manifestDispatch({ canvasIndex: canvasIndex + 1, type: 'switchCanvas' });
      // Reset startTime to zero
      playerDispatch({ startTime: 0, type: 'setTimeFragment' });
      // Update the current nav item to next item
      manifestDispatch({
        item: getNextItem({ canvasIndex, manifest }),
        type: 'switchItem',
      });

      handleIsEnded();

      setCIndex(cIndex + 1);
    }
  };

  return (
    <div data-vjs-player>
      {isVideo ? (
        <video
          data-testid="video-element"
          ref={playerRef}
          className="video-js"
        ></video>
      ) : (
        <audio
          data-testid="audio-element"
          ref={playerRef}
          className="video-js vjs-default-skin"
        ></audio>
      )}
    </div>
  );
}

VideoJSPlayer.propTypes = {
  isVideo: PropTypes.bool,
  switchPlayer: PropTypes.func,
  handleIsEnded: PropTypes.func,
  videoJSOptions: PropTypes.object,
};

export default VideoJSPlayer;
