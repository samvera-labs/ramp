import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';

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
import {
  hasNextSection,
  getNextItem,
  getMediaFragment,
  getItemId,
  getSegmentMap,
} from '@Services/iiif-parser';

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
  const [currentPlayer, setCurrentPlayer] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [isContained, setIsContained] = React.useState(false);
  const [segmentMap, setSegmentMap] = React.useState([]);

  const playerRef = React.useRef();

  const { manifest, canvasIndex, currentNavItem } = manifestState;
  const {
    isClicked,
    isEnded,
    isPlaying,
    player,
    startTime,
    endTime,
    currentTime,
  } = playerState;

  /**
   * Initialize player when creating for the first time and cleanup
   * when unmounting after the player is being used
   */
  React.useEffect(() => {
    const options = {
      ...videoJSOptions,
    };

    setCIndex(canvasIndex);

    const newPlayer = videojs(playerRef.current, options);
    newPlayer.getChild('controlBar').addChild('vjsYo', {});

    setCurrentPlayer(newPlayer);

    setMounted(true);

    setSegmentMap(getSegmentMap({ manifest, canvasIndex }));

    playerDispatch({
      player: newPlayer,
      type: 'updatePlayer',
    });

    // Clean up player instance on component unmount
    return () => {
      if (newPlayer) {
        newPlayer.dispose();
        setMounted(false);
      }
    };
  }, []);

  /**
   * Attach markers to the player and bind VideoJS events
   * with player instance
   */
  React.useEffect(() => {
    if (player && mounted) {
      player.on('ready', function () {
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
        setIsReady(true);
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

        setIsReady(false);
      });
      player.on('pause', () => {
        console.log('pause');
        playerDispatch({ isPlaying: false, type: 'setPlayingStatus' });
      });
      player.on('play', () => {
        console.log('play');
        playerDispatch({ isPlaying: true, type: 'setPlayingStatus' });
      });
      player.on('seeked', () => {
        handleSeeked();
      });
    }
  }, [player]);

  /**
   * Update markers whenever player's currentTime is being
   * updated. Time update happens when;
   * 1. using structure navigation
   * 2. seek and scrubbing events are fired
   * 3. timeupdate event fired when playing the media file
   */
  React.useEffect(() => {
    if (!player || !currentPlayer) {
      return;
    }
    if ((startTime != null || !isNaN(startTime)) && currentNavItem != null) {
      player.currentTime(currentTime, playerDispatch({ type: 'resetClick' }));

      // Mark current timefragment
      if (player.markers) {
        player.markers.removeAll();

        // Use currentNavItem's start and end time for marker creation
        const { start, stop } = getMediaFragment(getItemId(currentNavItem));

        playerDispatch({
          endTime: stop,
          startTime: start,
          type: 'setTimeFragment',
        });

        player.markers.add([
          {
            time: start,
            duration: stop - start,
            text: currentNavItem.label.en[0],
          },
        ]);
      }
    } else {
      // When canvas gets loaded into the player, set the currentNavItem and startTime
      // if there's a media fragment starting from time 0.0.
      // This then triggers the creation of a fragment highlight in the player's timerail
      const firstItem = getSegmentMap({ manifest, canvasIndex })[0];
      const timeFragment = getMediaFragment(getItemId(firstItem));
      if (timeFragment && timeFragment.start == 0) {
        manifestDispatch({ item: firstItem, type: 'switchItem' });
      }
    }
  }, [startTime, endTime, isClicked, isReady]);

  /**
   * Switch canvas when using structure navigation / the media file ends
   */
  React.useEffect(() => {
    if (isClicked && canvasIndex !== cIndex) {
      switchPlayer();
    }
    setCIndex(canvasIndex);
  }, [canvasIndex]);

  /**
   * Remove existing timerail highlight if the player's currentTime
   * doesn't fall within a defined structure item
   */
  useEffect(() => {
    if (!player || !currentPlayer) {
      return;
    }
    if (isContained == false && player.markers) {
      player.markers.removeAll();
    }
  }, [isContained]);

  /**
   * Handle the 'seeked' event when player's scrubber or progress bar is
   * used to change the currentTime.
   */
  const handleSeeked = () => {
    const seekedTime = player.currentTime();
    playerDispatch({
      currentTime: seekedTime,
      type: 'setCurrentTime',
    });
    let isInStructure = null;

    // Find the relevant media segment from the structure
    for (let segment of segmentMap) {
      const { start, stop } = getMediaFragment(getItemId(segment));
      if (seekedTime >= start && seekedTime < stop) {
        isInStructure = segment;
        playerDispatch({
          endTime: stop,
          startTime: start,
          type: 'setTimeFragment',
        });
        manifestDispatch({ item: segment, type: 'switchItem' });
        break;
      }
    }

    if (isInStructure) {
      setIsContained(true);
    } else {
      setIsContained(false);
    }
  };

  /**
   * Handle the 'ended' event fired by the player when a section comes to
   * an end. If there are sections ahead move onto the next canvas and
   * change the player and the state accordingly.
   */
  const handleEnded = () => {
    if (hasNextSection({ canvasIndex, manifest })) {
      manifestDispatch({ canvasIndex: canvasIndex + 1, type: 'switchCanvas' });

      // Reset startTime and currentTime to zero
      playerDispatch({ startTime: 0, type: 'setTimeFragment' });
      playerDispatch({ currentTime: 0, type: 'setCurrentTime' });

      // Update the current nav item to next item
      const nextItem = getNextItem({ canvasIndex, manifest });

      const { start } = getMediaFragment(getItemId(nextItem));

      // If there's a structure item at the start of the next canvas
      // mark it as the currentNavItem. Otherwise empty out the currentNavItem.
      if (start == 0) {
        manifestDispatch({
          item: nextItem,
          type: 'switchItem',
        });
      } else {
        manifestDispatch({ item: null, type: 'switchItem' });
      }

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
