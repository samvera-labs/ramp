import React from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'videojs-markers-plugin/dist/videojs-markers-plugin';
import 'videojs-markers-plugin/dist/videojs.markers.plugin.css';

require('@silvermine/videojs-quality-selector')(videojs);
import '@silvermine/videojs-quality-selector/dist/css/quality-selector.css';

import {
  usePlayerDispatch,
  usePlayerState,
} from '../../../context/player-context';
import {
  useManifestState,
  useManifestDispatch,
} from '../../../context/manifest-context';
import {
  hasNextSection,
  getNextItem,
  getSegmentMap,
  canvasesInManifest,
  getCanvasId,
} from '@Services/iiif-parser';
import { checkSrcRange, getMediaFragment } from '@Services/utility-helpers';

/** VideoJS custom components */
import VideoJSProgress from './components/js/VideoJSProgress';
import VideoJSCurrentTime from './components/js/VideoJSCurrentTime';
import VideoJSFileDownload from './components/js/VideoJSFileDownload';
import VideoJSNextButton from './components/js/VideoJSNextButton';
import VideoJSPreviousButton from './components/js/VideoJSPreviousButton';
// import vjsYo from './vjsYo';

function VideoJSPlayer({
  isVideo,
  playlistMarkers,
  isPlaylist,
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
    autoAdvance,
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
  const autoAdvanceRef = React.useRef();
  autoAdvanceRef.current = autoAdvance;

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

  // Using dynamic imports to enforce code-splitting in webpack
  // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  const loadResources = async (langKey) => {
    try {
      const resources = await import(`video.js/dist/lang/${langKey}.json`);
      return resources;
    } catch (e) {
      console.error(`${langKey} is not available, defaulting to English`);
      const resources = await import('video.js/dist/lang/en.json');
      return resources;
    }
  };

  /**
   * Initialize player when creating for the first time and cleanup
   * when unmounting after the player is being used
   */
  React.useEffect(async () => {
    const options = {
      ...videoJSOptions,
    };

    setCIndex(canvasIndex);

    // Dynamically load the selected language from VideoJS's lang files
    let selectedLang;
    await loadResources(options.language)
      .then((res) => {
        selectedLang = JSON.stringify(res);
      });
    let languageJSON = JSON.parse(selectedLang);

    let newPlayer;
    if (playerRef.current != null) {
      videojs.addLanguage(options.language, languageJSON);
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

        // Add class for volume panel in audio player to make it always visible
        if (!isVideo) {
          player.getChild('controlBar').getChild('VolumePanel').addClass('vjs-slider-active');
        }

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
          if (isPlaylist) {
            player.markers({
              markerTip: {
                display: true,
                text: function (marker) {
                  return marker.text;
                },
              },
              markerStyle: {
                'border-radius': 0,
                height: '0.5em',
                width: '0.5em',
                transform: 'rotate(-45deg)',
                top: '4px',
                content: '',
                'border-style': 'solid',
                'border-width': '0.25em 0.25em 0 0',
                'background-color': 'transparent'
              },
              markers: [],
            });
          } else {
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

        let tracks = player.textTracks();
        tracks.on('change', () => {
          let trackModes = [];
          for (let i = 0; i < tracks.length; i++) {
            trackModes.push(tracks[i].mode);
          }
          const subsOn = trackModes.includes('showing') ? true : false;
          handleCaptionChange(subsOn);
        });

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

  React.useEffect(() => {
    let markersList = [];
    if (playlistMarkers?.length > 0) {
      playlistMarkers.map((m) => {
        markersList.push({ time: parseFloat(m.time), text: m.value });
      });
    }

    if (player && player.markers && isReady) {
      // Clear existing markers when updating the markers
      player.markers.removeAll();
      player.markers.add(markersList);
    }
  }, [player, isReady, playlistMarkers]);

  /**
   * Switch canvas when using structure navigation / the media file ends
   */
  React.useEffect(() => {
    if (isClicked && canvasIndex !== cIndex) {
      switchPlayer(canvasIndex, false);
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
        if (!isPlaylist) {
          player.markers.removeAll();
        }
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
    } else if (startTime === null && canvasSegments.length > 0 && isReady) {
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
    if (player !== null && player != undefined && isReady) {
      player.currentTime(currentTime, playerDispatch({ type: 'resetClick' }));
    }
  }, [isClicked, isReady]);

  /**
   * Remove existing timerail highlight if the player's currentTime
   * doesn't fall within a defined structure item
   */
  React.useEffect(() => {
    if (!player || !currentPlayer) {
      return;
    } else if (isContained == false && player.markers && !isPlaylist) {
      player.markers.removeAll();
    }
  }, [isContained]);

  /**
   * Add class to icon to indicate captions are on/off in player toolbar
   * @param {Boolean} subsOn flag to indicate captions are on/off
   */
  const handleCaptionChange = (subsOn) => {
    if (subsOn) {
      player.controlBar.subsCapsButton.addClass('captions-on');
    } else {
      player.controlBar.subsCapsButton.removeClass('captions-on');
    }
  };
  /**
   * Handle the 'ended' event fired by the player when a section comes to
   * an end. If there are sections ahead move onto the next canvas and
   * change the player and the state accordingly.
   */
  const handleEnded = () => {
    if (!autoAdvanceRef.current) {
      return;
    }

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
      const cIndex = canvasesInManifest(manifest).findIndex(c => { return c.canvasId === canvasId; });
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
            className="video-js vjs-big-play-centered"
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
  playlistMarkers: PropTypes.array,
  isPlaylist: PropTypes.bool,
  switchPlayer: PropTypes.func,
  handleIsEnded: PropTypes.func,
  videoJSOptions: PropTypes.object,
};

export default VideoJSPlayer;
