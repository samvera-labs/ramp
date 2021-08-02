import React from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'videojs-hotkeys';

import 'videojs-markers-plugin/dist/videojs-markers-plugin';
import 'videojs-markers-plugin/dist/videojs.markers.plugin.css';

require('@silvermine/videojs-quality-selector')(videojs);
import '@silvermine/videojs-quality-selector/dist/css/quality-selector.css';

import {
  usePlayerDispatch,
  usePlayerState,
} from '../../context/player-context';
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

  const { manifest, canvasIndex, currentNavItem } = manifestState;
  const { isClicked, isEnded, isPlaying, player, startTime, currentTime } =
    playerState;

  const [cIndex, setCIndex] = React.useState(canvasIndex);
  const [isReady, setIsReady] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [isContained, setIsContained] = React.useState(false);
  const [canvasSegments, setCanvasSegments] = React.useState([]);
  const [activeId, setActiveId] = React.useState('');

  const playerRef = React.useRef();
  let activeIdRef = React.useRef();
  let isReadyRef = React.useRef();
  activeIdRef.current = activeId;
  isReadyRef.current = isReady;

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

    /* Another way to add a component to the controlBar */
    // newPlayer.getChild('controlBar').addChild('vjsYo', {});

    setCurrentPlayer(newPlayer);

    setMounted(true);

    playerDispatch({
      player: newPlayer,
      type: 'updatePlayer',
    });

    // Clean up player instance on component unmount
    return () => {
      if (newPlayer) {
        newPlayer.dispose();
        setMounted(false);
        setIsReady(false);
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
        console.log('Player ready');
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
        // Focus the player for hotkeys to work
        player.focus();
        player.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false,
          fullscreenKey: function (event, player) {
            // override fullscreen to trigger only when it's video
            return isVideo ? event.which === 70 : false;
          },
        });
      });
      player.on('ended', () => {
        playerDispatch({ isEnded: true, type: 'setIsEnded' });
        handleEnded(player);
      });
      player.on('loadedmetadata', () => {
        console.log('loadedmetadata');

        if (isEnded || isPlaying) {
          player.play();
        }
        player.currentTime(currentTime);
        // Reset isEnded flag
        playerDispatch({ isEnded: false, type: 'setIsEnded' });

        setIsReady(true);
      });
      player.on('pause', () => {
        playerDispatch({ isPlaying: false, type: 'setPlayingStatus' });
      });
      player.on('play', () => {
        playerDispatch({ isPlaying: true, type: 'setPlayingStatus' });
      });
      player.on('seeked', () => {
        handleSeeked();
      });
      player.on('timeupdate', () => {
        handleTimeUpdate();
      });
    }
  }, [player]);

  /**
   * Switch canvas when using structure navigation / the media file ends
   */
  React.useEffect(() => {
    if (isClicked && canvasIndex !== cIndex) {
      switchPlayer();
    }
    setCIndex(canvasIndex);
    setCanvasSegments(getSegmentMap({ manifest, canvasIndex }));
  }, [canvasIndex]);

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
    if (currentNavItem !== null && isReady) {
      // Mark current time fragment
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
    } else if (startTime === null) {
      // When canvas gets loaded into the player, set the currentNavItem and startTime
      // if there's a media fragment starting from time 0.0.
      // This then triggers the creation of a fragment highlight in the player's timerail
      const firstItem = getSegmentMap({ manifest, canvasIndex })[0];
      const timeFragment = getMediaFragment(getItemId(firstItem));
      if (timeFragment && timeFragment.start === 0) {
        manifestDispatch({ item: firstItem, type: 'switchItem' });
      }
    }
  }, [currentNavItem, isReady]);

  /**
   * Setting the current time of the player when using structure navigation
   */
  React.useEffect(() => {
    if (player !== null && isReady) {
      player.currentTime(currentTime, playerDispatch({ type: 'resetClick' }));
    }
  }, [isClicked]);

  /**
   * Remove existing timerail highlight if the player's currentTime
   * doesn't fall within a defined structure item
   */
  React.useEffect(() => {
    if (!player || !currentPlayer) {
      return;
    } else if (isContained == false && player.markers) {
      player.markers.removeAll();
    }
  }, [isContained]);

  /**
   * Handle the 'seeked' event when player's scrubber or progress bar is
   * used to change the currentTime.
   */
  const handleSeeked = () => {
    if (player !== null && isReadyRef.current) {
      const seekedTime = player.currentTime();
      playerDispatch({
        currentTime: seekedTime,
        type: 'setCurrentTime',
      });
      // Find the relevant media segment from the structure
      const isInStructure = getActiveSegment(seekedTime);

      if (isInStructure) {
        setIsContained(true);
        manifestDispatch({ item: isInStructure, type: 'switchItem' });
      } else {
        setIsContained(false);
      }
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
      if (start === 0) {
        setIsContained(true);
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

  /**
   * Handle the 'timeUpdate' event emitted by VideoJS player.
   * The current time of the playhead used to show structure in the player's
   * time rail as the playhead arrives at a start time of an existing structure
   * item. When the current time is inside an item, that time fragment is highlighted
   * in the player's time rail.
   *  */
  const handleTimeUpdate = () => {
    if (player !== null && isReadyRef.current) {
      const activeSegment = getActiveSegment(player.currentTime());
      if (activeSegment && activeIdRef.current != activeSegment['id']) {
        // Set the active segment id in component's state
        setActiveId(activeSegment['id']);
        setIsContained(true);

        manifestDispatch({ item: activeSegment, type: 'switchItem' });
      } else if (activeSegment === null && player.markers) {
        setIsContained(false);
      }
    }
  };

  /**
   * Get the segment, which encapsulates the current time of the playhead,
   * from a list of media fragments in the current canvas.
   * @param {Number} time playhead's current time
   */
  const getActiveSegment = (time) => {
    // Find the relevant media segment from the structure
    for (let segment of canvasSegments) {
      const { start, stop } = getMediaFragment(getItemId(segment));
      if (time >= start && time < stop) {
        return segment;
      }
    }
    return null;
  };

  return (
    <div data-vjs-player>
      {isVideo ? (
        <video
          data-testid="videojs-video-element"
          ref={playerRef}
          className="video-js"
        ></video>
      ) : (
        <audio
          data-testid="videojs-audio-element"
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
