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
  getCanvasId,
  getCanvasIndex,
} from '@Services/iiif-parser';
import { checkSrcRange, getMediaFragment, playerHotKeys } from '@Services/utility-helpers';

/** VideoJS custom components */
import VideoJSProgress from './components/js/VideoJSProgress';
import VideoJSCurrentTime from './components/js/VideoJSCurrentTime';
import VideoJSFileDownload from './components/js/VideoJSFileDownload';
import VideoJSNextButton from './components/js/VideoJSNextButton';
import VideoJSPreviousButton from './components/js/VideoJSPreviousButton';
import VideoJSTrackScrubber from './components/js/VideoJSTrackScrubber';
// import vjsYo from './vjsYo';

function VideoJSPlayer({
  isVideo,
  isPlaylist,
  switchPlayer,
  trackScrubberRef,
  scrubberTooltipRef,
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
    playlist,
    structures,
    canvasSegments
  } = manifestState;
  const {
    isClicked,
    isEnded,
    isPlaying,
    player,
    currentTime,
    playerRange,
  } = playerState;

  const [cIndex, setCIndex] = React.useState(canvasIndex);
  const [isReady, setIsReady] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isContained, setIsContained] = React.useState(false);
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

  let currentPlayerRef = React.useRef(null);

  // FIXME:: Dynamic language imports break with rollup configuration when
  // packaging
  // // Using dynamic imports to enforce code-splitting in webpack
  // // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  const loadResources = async (langKey) => {
    try {
      const resources = await import(`../../../../node_modules/video.js/dist/lang/${langKey}.json`);
      return resources;
    } catch (e) {
      console.error(`${langKey} is not available, defaulting to English`);
      const resources = await import('../../../../node_modules/video.js/dist/lang/en.json');
      return resources;
    }
  };

  let canvasSegmentsRef = React.useRef();
  canvasSegmentsRef.current = canvasSegments;

  let structuresRef = React.useRef();
  structuresRef.current = structures;

  /**
   * Initialize player when creating for the first time
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
      newPlayer = currentPlayerRef.current = videojs(playerRef.current, options);
    }

    /* Another way to add a component to the controlBar */
    // newPlayer.getChild('controlBar').addChild('vjsYo', {});

    setMounted(true);

    playerDispatch({
      player: newPlayer,
      type: 'updatePlayer',
    });
  }, []);

  // Clean up player instance on component unmount
  React.useEffect(() => {
    return () => {
      if (currentPlayerRef.current != null) {
        currentPlayerRef.current.dispose();
        document.removeEventListener('keydown', playerHotKeys);
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

        // Add class for volume panel in audio player to make it always visible
        if (!isVideo) {
          player.getChild('controlBar').getChild('VolumePanel').addClass('vjs-slider-active');
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
        if (isClicked && isEnded) {
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
      document.addEventListener('keydown', playerHotKeys);
    }
  }, [player]);

  React.useEffect(() => {
    if (playlist.markers?.length > 0) {
      const playlistMarkers = playlist.markers
        .filter((m) => m.canvasIndex === canvasIndex)[0].canvasMarkers;
      let markersList = [];
      playlistMarkers.map((m) => {
        markersList.push({ time: parseFloat(m.time), text: m.value });
      });

      if (player && player.markers && isReady) {
        // Clear existing markers when updating the markers
        player.markers.removeAll();
        player.markers.add(markersList);
      }
    }

  }, [player, isReady, playlist.markers]);

  /**
   * Switch canvas when using structure navigation / the media file ends
   */
  React.useEffect(() => {
    if (isClicked && canvasIndex !== cIndex) {
      switchPlayer(canvasIndex, false);
    }
    setCIndex(canvasIndex);
  }, [canvasIndex]);

  /**
   * Update markers whenever player's currentTime is being
   * updated. Time update happens when;
   * 1. using structure navigation
   * 2. seek and scrubbing events are fired
   * 3. timeupdate event fired when playing the media file
   */
  React.useEffect(() => {
    if (!player || !currentPlayerRef.current || player.isDisposed()) {
      return;
    }
    if (currentNavItem !== null && isReady && !isPlaylist) {
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
    }
  }, [currentNavItem, isReady, canvasSegments]);

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
    if (!player || !currentPlayerRef.current || player.isDisposed()) {
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
    if (structuresRef.current?.length > 0) {
      const nextItem = structuresRef.current[canvasIndex + 1];

      if (nextItem && nextItem != undefined) {
        manifestDispatch({
          canvasIndex: canvasIndex + 1,
          type: 'switchCanvas',
        });

        // Reset startTime and currentTime to zero
        playerDispatch({ startTime: 0, type: 'setTimeFragment' });
        playerDispatch({ currentTime: 0, type: 'setCurrentTime' });

        // Get first timespan in the next canvas
        let firstTimespanInNextCanvas = canvasSegmentsRef.current.filter(
          (t) => t.canvasIndex === nextItem.canvasIndex && t.itemIndex === 1
        );
        // If the nextItem doesn't have an ID (a Canvas media fragment) pick the first timespan
        // in the next Canvas
        let nextFirstItem = nextItem.id != undefined ? nextItem : firstTimespanInNextCanvas[0];

        let start = 0;
        if (nextFirstItem != undefined && nextFirstItem.id != undefined) {
          start = getMediaFragment(nextFirstItem.id, canvasDuration).start;
        }

        // If there's a timespan item at the start of the next canvas
        // mark it as the currentNavItem. Otherwise empty out the currentNavItem.
        if (start === 0) {
          setIsContained(true);
          manifestDispatch({
            item: nextFirstItem,
            type: 'switchItem',
          });
        } else if (nextFirstItem.isEmpty) {
          // Switch the currentNavItem and clear isEnded flag
          manifestDispatch({
            item: nextFirstItem,
            type: 'switchItem',
          });
          playerDispatch({ isEnded: false, type: 'setIsEnded' });
        } else {
          manifestDispatch({ item: null, type: 'switchItem' });
        }
        setCIndex(cIndex + 1);
      }
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
    if (player !== null && isReadyRef.current && !isClicked) {
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
   * Toggle play/pause on video touch for mobile browsers
   * @param {Object} e onTouchEnd event
   */
  const mobilePlayToggle = (e) => {
    if (e.changedTouches[0].clientX == touchX && e.changedTouches[0].clientY == touchY) {
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    }
  };

  /**
   * Save coordinates of touch start for comparison to touch end to prevent play/pause
   * when user is scrolling.
   * @param {Object} e onTouchStart event
   */
  let touchX = null;
  let touchY = null;
  const saveTouchStartCoords = (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
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
    for (let segment of canvasSegmentsRef.current) {
      const { id, isCanvas } = segment;
      const canvasId = getCanvasId(id);
      const cIndex = getCanvasIndex(manifest, canvasId);
      if (cIndex == canvasIndex) {
        // Canvases without structure has the Canvas information
        // in Canvas-level item as a navigable link
        if (isCanvas) {
          return segment;
        }
        const segmentRange = getMediaFragment(id, canvasDuration);
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
    <React.Fragment>
      <div data-vjs-player>
        {isVideo ? (
          <React.Fragment>
            <video
              id="iiif-media-player"
              data-testid="videojs-video-element"
              data-canvasindex={cIndex}
              ref={(node) => (playerRef.current = node)}
              className="video-js vjs-big-play-centered"
              onTouchStart={saveTouchStartCoords}
              onTouchEnd={mobilePlayToggle}
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
      <div className="vjs-track-scrubber-container hidden" ref={trackScrubberRef} id="track_scrubber">
        <p className="vjs-time track-currenttime" role="presentation"></p>
        <span type="range" aria-label="Track scrubber" role="slider" tabIndex={0}
          className="vjs-track-scrubber" style={{ width: '100%' }}>
          <span className="tooltiptext" ref={scrubberTooltipRef} aria-hidden={true} role="presentation"></span>
        </span>
        <p className="vjs-time track-duration" role="presentation"></p>
      </div>
    </React.Fragment>
  );
}

VideoJSPlayer.propTypes = {
  isVideo: PropTypes.bool,
  isPlaylist: PropTypes.bool,
  switchPlayer: PropTypes.func,
  trackScrubberRef: PropTypes.object,
  scrubberTooltipRef: PropTypes.object,
  videoJSOptions: PropTypes.object,
};

export default VideoJSPlayer;
