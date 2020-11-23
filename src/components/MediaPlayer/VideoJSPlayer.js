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
import { useManifestState } from '../../context/manifest-context';

function VideoJSPlayer({ isVideo, switchPlayer, ...videoJSOptions }) {
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const manifestState = useManifestState();

  const [cIndex, setCIndex] = React.useState(canvasIndex);

  const playerRef = React.useRef();

  const { manifest, canvasIndex } = manifestState;
  const { isClicked, player, startTime, endTime } = playerState;

  React.useEffect(() => {
    const options = {
      ...videoJSOptions,
    };

    const newPlayer = videojs(playerRef.current, options);

    newPlayer.getChild('controlBar').addChild('vjsYo', {});

    if (isClicked && canvasIndex !== cIndex) {
      const oldPlayer = videojs(`videojs-player-${cIndex}`);
      switchPlayer(oldPlayer);
    }
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

    setCIndex(canvasIndex);
  }, [canvasIndex]);

  React.useEffect(() => {
    if (player) {
      //player.addChild('BigPlayButton');
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
        handleEnded(player);
      });
      player.on('loadedmetadata', () => {
        console.log('loadedmetadata');
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
      player.currentTime(startTime, playerDispatch({ type: 'resetClick' }));

      // Mark current timefragment
      if (player.markers) {
        player.markers.removeAll();
        player.markers.add([
          { time: startTime, duration: endTime - startTime, text: 'this' },
        ]);
      }
    }
  }, [startTime, endTime]);

  const handleEnded = (Player) => {
    // TODO: Need to get this working
    // if (hasNextSection({ canvasIndex, manifest })) {
    //   manifestDispatch({ canvasIndex: canvasIndex + 1, type: 'switchCanvas' });
    //   let newInstance = switchMedia(
    //     player,
    //     canvasIndex + 1,
    //     isPlaying || true,
    //     captionOn,
    //     manifest
    //   );
    //   playerDispatch({ player: newInstance, type: 'updatePlayer' });
    //   setCIndex(cIndex + 1);
    // }
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
