import React from 'react';
import ReactDOM from 'react-dom';
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
import { hasNextSection } from '@Services/iiif-parser';

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
  const [isEnded, setIsEnded] = React.useState(false);

  const playerRef = React.useRef();

  const { manifest, canvasIndex } = manifestState;
  const { isClicked, isPlaying, player, startTime, endTime } = playerState;

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
        newPlayer.dispose();
      }
    };
  }, []);

  React.useEffect(() => {
    if (isClicked && canvasIndex !== cIndex) {
      const oldPlayer = videojs(`videojs-player-${canvasIndex}`);
      switchPlayer(oldPlayer);
    }
    setCIndex(canvasIndex);
  }, [canvasIndex]);

  React.useEffect(() => {
    if (player) {
      player.on('ready', function () {
        console.log('ready');
        // Initialize markers
        player.markers({
          markerStyle: {
            width: '4px',
            'background-color': 'red',
            'border-radius': 0,
          },
          markers: [],
        });
      });
      player.on('ended', () => {
        console.log('ended');
        setIsEnded(true);
        handleEnded(player);
      });
      player.on('loadedmetadata', () => {
        console.log('loadedmetadata');
        if (isEnded || isPlaying) {
          player.play();
        }
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

    if (startTime != null) {
      // Mark current timefragment
      if (player.markers) {
        player.markers.removeAll();
        player.markers.add([
          { time: startTime, duration: endTime - startTime, text: 'this' },
        ]);
      }
      player.currentTime(startTime, playerDispatch({ type: 'resetClick' }));
    }
  }, [startTime, endTime]);

  const handleEnded = () => {
    if (hasNextSection({ canvasIndex, manifest })) {
      manifestDispatch({ canvasIndex: canvasIndex + 1, type: 'switchCanvas' });
      const oldPlayer = videojs(`videojs-player-${cIndex}`);
      handleIsEnded(oldPlayer);
      setCIndex(cIndex + 1);
    }
  };

  return (
    <div data-vjs-player>
      {isVideo ? (
        <video
          id={`videojs-player-${canvasIndex}`}
          data-testid="video-element"
          ref={playerRef}
          className="video-js"
        ></video>
      ) : (
        <audio
          id={`videojs-player-${canvasIndex}`}
          data-testid="audio-element"
          ref={playerRef}
          className="video-js vjs-default-skin"
        ></audio>
      )}
    </div>
  );
}

VideoJSPlayer.propTypes = {};

export default VideoJSPlayer;
