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
  getSegmentMap,
  canvasesInManifest,
  getCanvasId,
} from '@Services/iiif-parser';
import { checkSrcRange, getMediaFragment } from '@Services/utility-helpers';

import VideoJSProgress from './VideoJSComponents/js/VideoJSProgress';
import VideoJSCurrentTime from './VideoJSComponents/js/VideoJSCurrentTime';
import VideoJSFileDownload from './VideoJSComponents/js/VideoJSFileDownload';
import VideoJSNextButton from './VideoJSComponents/js/VideoJSNextButton';
import VideoJSPreviousButton from './VideoJSComponents/js/VideoJSPreviousButton';
// import vjsYo from './vjsYo';

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

  const {
    canvasDuration,
    canvasIndex,
    currentNavItem,
    manifest,
    hasMultiItems,
    srcIndex,
    targets,
  } = manifestState;
  const {
    isClicked,
    isEnded,
    isPlaying,
    player,
    startTime,
    currentTime,
    playerRange,
  } = playerState;

  const [cIndex, setCIndex] = React.useState(canvasIndex);
  const [isReady, setIsReady] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [isContained, setIsContained] = React.useState(false);
  const [canvasSegments, setCanvasSegments] = React.useState([]);
  const [activeId, _setActiveId] = React.useState('');

  const playerRef = React.useRef();

  let activeIdRef = React.useRef();
  activeIdRef.current = activeId;
  const setActiveId = (id) => {
    _setActiveId(id);
    activeIdRef.current = id;
  };

  let currentTimeRef = React.useRef();
  currentTimeRef.current = currentTime;

  let isReadyRef = React.useRef();
  isReadyRef.current = isReady;

  let currentNavItemRef = React.useRef();
  currentNavItemRef.current = currentNavItem;

  /**
   * Initialize player when creating for the first time and cleanup
   * when unmounting after the player is being used
   */
  React.useEffect(() => {
    const options = {
      ...videoJSOptions,
    };

    setCIndex(canvasIndex);

    let newPlayer;
    if (playerRef.current != null) {
      newPlayer = videojs(playerRef.current, options);
    }

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
      if (newPlayer != null) {
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

        // Focus the player for hotkeys to work
        player.focus();

        // Options for videojs-hotkeys: https://github.com/ctd1500/videojs-hotkeys#options
        if (player.hotkeys) {
          player.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false,
            enableVolumeScroll: false,
            fullscreenKey: function (event, player) {
              // override fullscreen to trigger only when it's video
              return isVideo ? event.which === 70 : false;
            },
          });
        }
      });
      player.on('ended', () => {
        playerDispatch({ isEnded: true, type: 'setIsEnded' });
        handleEnded();
      });
      player.on('loadedmetadata', () => {
        console.log('loadedmetadata');

        if (player.markers) {
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
        }

        player.duration = function () {
          return canvasDuration;
        };

        isEnded ? player.currentTime(0) : player.currentTime(currentTime);

        if (isEnded || isPlaying) {
          player.play();
        }

        // Reset isEnded flag
        playerDispatch({ isEnded: false, type: 'setIsEnded' });

        setIsReady(true);
      });
      player.on('waiting', () => {
        /* When using structured navigation while the media is playing,
      set the currentTime to the start time of the clicked media
      fragment's start time. Without this the 'timeupdate' event tries
      to read currentTime before the player is ready, and triggers an error.
      */
        if (isClicked || isEnded) {
          player.currentTime(currentTimeRef.current);
        }
      });
      player.on('pause', () => {
        playerDispatch({ isPlaying: false, type: 'setPlayingStatus' });
      });
      player.on('play', () => {
        playerDispatch({ isPlaying: true, type: 'setPlayingStatus' });
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
      switchPlayer(canvasIndex);
    }
    setCIndex(canvasIndex);
    setCanvasSegments(getSegmentMap({ manifest }));
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
        const { start, end } = getMediaFragment(currentNavItem.id, canvasDuration);
        playerDispatch({
          endTime: end,
          startTime: start,
          type: 'setTimeFragment',
        });
        if (start != end) {
          player.markers.add([
            {
              time: start,
              duration: end - start,
              text: currentNavItem.label,
            },
          ]);
        }
      }
    } else if (startTime === null && canvasSegments.length > 0) {
      // When canvas gets loaded into the player, set the currentNavItem and startTime
      // if there's a media fragment starting from time 0.0.
      // This then triggers the creation of a fragment highlight in the player's timerail
      const firstItem = canvasSegments[0];
      const timeFragment = getMediaFragment(firstItem.id, canvasDuration);
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
   * Handle the 'ended' event fired by the player when a section comes to
   * an end. If there are sections ahead move onto the next canvas and
   * change the player and the state accordingly.
   */
  const handleEnded = () => {
    if (hasNextSection({ canvasIndex, manifest })) {
      manifestDispatch({
        canvasIndex: canvasIndex + 1,
        type: 'switchCanvas',
      });

      // Reset startTime and currentTime to zero
      playerDispatch({ startTime: 0, type: 'setTimeFragment' });
      playerDispatch({ currentTime: 0, type: 'setCurrentTime' });

      // Update the current nav item to next item
      const nextItem = getNextItem({ canvasIndex, manifest });

      const { start } = getMediaFragment(nextItem.id, canvasDuration);

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
    } else if (hasMultiItems) {
      // When there are multiple sources in a single canvas
      // advance to next source
      if (srcIndex + 1 < targets.length) {
        manifestDispatch({ srcIndex: srcIndex + 1, type: 'setSrcIndex' });
      } else {
        manifestDispatch({ srcIndex: 0, type: 'setSrcIndex' });
      }
      playerDispatch({ currentTime: 0, type: 'setCurrentTime' });
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
        cleanUpNav();
      }
    }
  };

  /**
   * Clear currentNavItem and other related state variables to update the tracker
   * in structure navigation and highlights within the player.
   */
  const cleanUpNav = () => {
    if (currentNavItemRef.current) {
      manifestDispatch({ item: null, type: 'switchItem' });
    }
    setActiveId(null);
    setIsContained(false);
  };

  /**
   * Get the segment, which encapsulates the current time of the playhead,
   * from a list of media fragments in the current canvas.
   * @param {Number} time playhead's current time
   */
  const getActiveSegment = (time) => {
    // Adjust time for multi-item canvases
    let currentTime = time;
    if (hasMultiItems) {
      currentTime = currentTime + targets[srcIndex].altStart;
    }
    // Find the relevant media segment from the structure
    for (let segment of canvasSegments) {
      const { id, isTitleTimespan } = segment;
      const canvasId = getCanvasId(id);
      const cIndex = canvasesInManifest(manifest).indexOf(canvasId);
      if (cIndex == canvasIndex) {
        // Mark title/heading structure items with a Canvas
        // i.e. canvases without structure has the Canvas information
        // in title item as a navigable link
        if (isTitleTimespan) {
          return segment;
        }
        const segmentRange = getMediaFragment(segment.id, canvasDuration);
        const isInRange = checkSrcRange(segmentRange, playerRange);
        const isInSegment =
          currentTime >= segmentRange.start && currentTime < segmentRange.end;
        if (isInSegment && isInRange) {
          return segment;
        }
      }
    }
    return null;
  };

  return (
    <div data-vjs-player>
      {isVideo ? (
        <React.Fragment>
          <video
            id="iiif-media-player"
            data-testid="videojs-video-element"
            data-canvasindex={cIndex}
            ref={(node) => (playerRef.current = node)}
            className="video-js"
          ></video>
        </React.Fragment>
      ) : (
        <audio
          id="iiif-media-player"
          data-testid="videojs-audio-element"
          data-canvasindex={cIndex}
          ref={(node) => (playerRef.current = node)}
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
