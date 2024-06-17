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
import { checkSrcRange, getMediaFragment, playerHotKeys } from '@Services/utility-helpers';
import { IS_ANDROID, IS_IOS, IS_IPAD, IS_MOBILE } from '@Services/browser';
import { useLocalStorage } from '@Services/local-storage';

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
  hasMultipleCanvases,
  isPlaylist,
  trackScrubberRef,
  scrubberTooltipRef,
  tracks,
  placeholderText,
  renderingFiles,
  enableFileDownload,
  options,
}) {
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const manifestState = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const {
    canvasDuration,
    canvasIndex,
    currentNavItem,
    hasMultiItems,
    srcIndex,
    targets,
    autoAdvance,
    playlist,
    structures,
    canvasSegments,
    hasStructure,
    canvasIsEmpty,
  } = manifestState;
  const {
    isClicked,
    isEnded,
    isPlaying,
    player,
    searchMarkers,
    currentTime,
  } = playerState;

  const [cIndex, _setCIndex] = React.useState(canvasIndex);
  const [isReady, _setIsReady] = React.useState(false);
  const [activeId, _setActiveId] = React.useState('');
  const [startVolume, setStartVolume] = useLocalStorage('startVolume', 1);
  const [startQuality, setStartQuality] = useLocalStorage('startQuality', null);
  const [startMuted, setStartMuted] = useLocalStorage('startMuted', false);


  const videoJSRef = React.useRef(null);
  const playerRef = React.useRef(null);

  const autoAdvanceRef = React.useRef();
  autoAdvanceRef.current = autoAdvance;

  const srcIndexRef = React.useRef();
  srcIndexRef.current = srcIndex;

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
  const setIsReady = (r) => {
    _setIsReady(r);
    isReadyRef.current = r;
  };

  let currentNavItemRef = React.useRef();
  currentNavItemRef.current = currentNavItem;

  let canvasIsEmptyRef = React.useRef();
  canvasIsEmptyRef.current = canvasIsEmpty;

  let canvasDurationRef = React.useRef();
  canvasDurationRef.current = canvasDuration;

  let isPlayingRef = React.useRef();
  isPlayingRef.current = isPlaying;

  let isEndedRef = React.useRef();
  isEndedRef.current = isEnded;

  let cIndexRef = React.useRef();
  cIndexRef.current = canvasIndex;
  const setCIndex = (i) => {
    _setCIndex(i);
    cIndexRef.current = i;
  };

  // FIXME:: Dynamic language imports break with rollup configuration when
  // packaging
  // Using dynamic imports to enforce code-splitting in webpack
  // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
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

  // Dispose Video.js instance when VideoJSPlayer component is removed
  React.useEffect(() => {
    return () => {
      if (playerRef.current != null) {
        playerRef.current.dispose();
        document.removeEventListener('keydown', playerHotKeys);
        setIsReady(false);
      }
    };
  }, []);

  /**
   * Initialize Video.js when for the first page load or update
   * src and other properties of the existing Video.js instance
   * on Canvas change
   */
  React.useEffect(async () => {
    setCIndex(canvasIndex);

    // Set selected quality from localStorage in Video.js options
    setSelectedQuality(options.sources);

    // Video.js player is only initialized on initial page load
    if (!playerRef.current && options.sources?.length > 0) {
      // Dynamically load the selected language from VideoJS's lang files
      let selectedLang;
      await loadResources(options.language)
        .then((res) => {
          selectedLang = JSON.stringify(res);
        });
      let languageJSON = JSON.parse(selectedLang);

      buildTracksHTML();
      videojs.addLanguage(options.language, languageJSON);

      const player = playerRef.current = videojs(videoJSRef.current, options, () => {
        playerInitSetup(playerRef.current);
      });

      /* Another way to add a component to the controlBar */
      // player.getChild('controlBar').addChild('vjsYo', {});

      playerDispatch({
        player: player,
        type: 'updatePlayer',
      });
    } else if (playerRef.current && options.sources?.length > 0) {
      // Update the existing Video.js player on consecutive Canvas changes
      const player = playerRef.current;

      // Block player while metadata is loaded
      player.addClass('vjs-disabled');

      setIsReady(false);
      updatePlayer(player);
      playerLoadedMetadata(player);

      playerDispatch({
        player: player,
        type: 'updatePlayer',
      });
    }
  }, [options.sources, videoJSRef]);

  React.useEffect(() => {
    if (playerRef.current) {
      // For empty Canvas pause the player if it's playing
      if (isPlayingRef.current) { playerRef.current.pause(); }
      // Set the player's aspect ratio to video
      playerRef.current.audioOnlyMode(false);
      playerRef.current.canvasIsEmpty = true;
      playerRef.current.aspectRatio('16:9');
    }
  }, [canvasIsEmpty]);

  /**
   * Build track HTML for Video.js player on initial page load
   */
  const buildTracksHTML = () => {
    if (tracks?.length > 0 && videoJSRef.current) {
      tracks.map((t) => {
        let trackEl = document.createElement('track');
        trackEl.setAttribute('key', t.key);
        trackEl.setAttribute('src', t.src);
        trackEl.setAttribute('kind', t.kind);
        trackEl.setAttribute('label', t.label);
        trackEl.setAttribute('srcLang', t.srclang);
        videoJSRef.current.appendChild(trackEl);
      });
    }
  };

  const updatePlayer = (player) => {
    player.src(options.sources);
    player.poster(options.poster);
    player.canvasIndex = cIndexRef.current;
    player.srcIndex = srcIndex;
    player.targets = targets;
    player.duration(canvasDuration);
    player.canvasIsEmpty = canvasIsEmptyRef.current;

    // Update textTracks in the player
    var oldTracks = player.remoteTextTracks();
    var i = oldTracks.length;
    while (i--) {
      player.removeRemoteTextTrack(oldTracks[i]);
    }
    if (tracks?.length > 0 && isVideo) {
      tracks.forEach(function (track) {
        player.addRemoteTextTrack(track, false);
      });
    }

    /*
      Update player control bar for;
       - track scrubber button
       - appearance of the player: big play button and aspect ratio of the player 
        based on media type
       - volume panel based on media type
       - file download menu
    */
    if (player.getChild('controlBar') != null && !canvasIsEmpty) {
      const controlBar = player.getChild('controlBar');
      // Index of the duration display in the player's control bar
      const durationIndex = controlBar.children()
        .findIndex((c) => c.name_ == 'DurationDisplay') ||
        (hasMultipleCanvases ? 6 : 4);
      /*
        Track-scrubber button: remove if the Manifest is not a playlist manifest
        or the current Canvas doesn't have structure items. Or add back in if it's
        not present otherwise.
       */
      if (!(hasStructure || playlist.isPlaylist)) {
        controlBar.removeChild('videoJSTrackScrubber');
      } else if (!controlBar.getChild('videoJSTrackScrubber')) {
        // Add track-scrubber button after duration display if it is not available
        controlBar.addChild(
          'videoJSTrackScrubber',
          { trackScrubberRef, timeToolRef: scrubberTooltipRef },
          durationIndex + 1
        );
      }

      if (tracks?.length > 0 && isVideo && !controlBar.getChild('subsCapsButton')) {
        let subsCapBtn = controlBar.addChild(
          'subsCapsButton', {}, durationIndex + 1
        );
        // Add CSS to mark captions-on
        subsCapBtn.children_[0].addClass('captions-on');
      }

      /*
        Change player's appearance when switching between audio and video canvases.
        For audio: player height is reduced and big play button is removed
        For video: player aspect ratio is set to 16:9 and has the centered big play button
      */
      if (!isVideo) {
        player.audioOnlyMode(true);
        player.addClass('vjs-audio');
        player.height(player.controlBar.height());
        player.removeChild('bigPlayButton');
      } else {
        player.audioOnlyMode(false);
        player.removeClass('vjs-audio');
        player.aspectRatio('16:9');
        player.addChild('bigPlayButton');
      }

      /*
        Volume panel display on desktop browsers:
        For audio: volume panel is inline with a sticky volume slider
        For video: volume panel is not inline.
        On mobile device browsers, the volume panel is replaced by muteToggle
        for both audio and video.
      */
      if (!IS_MOBILE) {
        const volumeIndex = controlBar.children()
          .findIndex((c) => c.name_ == 'VolumePanel');
        controlBar.removeChild('volumePanel');
        if (!isVideo) {
          controlBar.addChild('volumePanel', { inline: true }, volumeIndex);
        } else {
          controlBar.addChild('volumePanel', { inline: false }, volumeIndex);
        }
        /* 
          Trigger ready event to reset the volume slider in the refreshed 
          volume panel. This is needed on player reload, since volume slider 
          is set on either 'ready' or 'volumechange' events.
        */
        player.trigger('volumechange');
      }

      if (enableFileDownload) {
        controlBar.removeChild('videoJSFileDownload');

        if (renderingFiles?.length > 0) {
          const fileOptions = {
            title: 'Download Files',
            controlText: 'Alternate resource download',
            files: renderingFiles
          };
          // For video add icon before last icon, for audio add it to the end
          isVideo
            ? controlBar.addChild('videoJSFileDownload', { ...fileOptions },
              controlBar.children().length - 1
            )
            : controlBar.addChild('videoJSFileDownload', { ...fileOptions }
            );
        }
      }
    }
  };

  /**
   * Setup on loadedmetadata event is broken out of initial setup function,
   * since this needs to be called when reloading the player on Canvas change
   * @param {Object} player Video.js player instance
   */
  const playerLoadedMetadata = (player) => {
    player.one('loadedmetadata', () => {
      videojs.log('Player loadedmetadata');

      player.duration(canvasDurationRef.current);

      // Reveal player once metadata is loaded
      player.removeClass('vjs-disabled');

      isEndedRef.current ? player.currentTime(0) : player.currentTime(currentTime);

      if (isEndedRef.current || isPlayingRef.current) {
        /*
          iOS devices lockdown the ability for unmuted audio and video media to autoplay.
          They accomplish this by capturing any programmatic play events and returning
          a rejected Promise. In certain versions of iOS, this rejected promise would
          cause a runtime error within Ramp. This error would cause the error boundary
          handling to trigger, forcing a user to reload the player/page. By silently 
          catching the rejected Promise we are able to provide a more seamless user
          experience, where the user can manually play the media or change to a different
          section.
         */
        var promise = player.play();

        if (promise !== undefined) {
          promise.then(_ => {
            // Autoplay
          }).catch(error => {
            // Prevent error from triggering error boundary
          });
        }
      }

      if (isVideo) { setUpCaptions(player); }

      /*
        Set playable duration within the given media file and alternate start time as
        player properties. These values are read by track-scrubber component to build
        and update the track-scrubber progress and time in the UI.
      */
      const mediaRange = getMediaFragment(options.sources[0].src, canvasDurationRef.current);
      if (mediaRange != undefined) {
        player.playableDuration = mediaRange.end - mediaRange.start;
        player.altStart = mediaRange.start;
      } else {
        player.playableDuration = canvasDurationRef.current;
        player.altStart = targets[srcIndex].altStart;
      }

      setIsReady(true);
    });
  };

  const [fragmentMarker, setFragmentMarker] = React.useState(null);

  // pretty sure this can be removed...
  React.useEffect(() => {
    const player = playerRef.current;
    if (playlist.markers?.length > 0 && isReadyRef.current) {
      // Set player duration, for markers API. The value set in the player update
      // function sometimes doesn't update the duration in the markers API.
      player.duration(canvasDurationRef.current);
    }
  }, [playerRef.current, isReadyRef.current, playlist.markers]);

  // update markers in player
  React.useEffect(() => {
    if (playerRef.current && playerRef.current.markers && isReadyRef.current) {
      // markers plugin not yet initialized
      if (typeof playerRef.current.markers === 'function') {
        player.markers({
          markerTip: {
            display: false, // true,
            text: marker => marker.text
          },
          markerStyle: {},
          markers: [],
        });
      }

      let playlistMarkers = [];
      if (playlist?.markers?.length) {
        const canvasMarkers = playlist.markers.filter((m) => m.canvasIndex === canvasIndex)[0].canvasMarkers;
        playlistMarkers = canvasMarkers.map((m) => ({
          time: parseFloat(m.time),
          text: m.value,
          class: 'ramp--track-marker--playlist'
        }));
      }

      playerRef.current.markers.removeAll();
      playerRef.current.markers.add([
        ...(fragmentMarker ? [fragmentMarker] : []),
        ...searchMarkers,
        ...playlistMarkers,

      ]);
    }
  }, [
    fragmentMarker,
    searchMarkers,
    canvasDuration,
    canvasIndex,
    playerRef.current,
    isReadyRef.current
  ]);

  /**
   * Setup player with player-related information parsed from the IIIF
   * Manifest Canvas. This gets called on both initial page load and each
   * Canvas switch to setup and update player respectively.
   * @param {Object} player current player instance from Video.js
   */
  const playerInitSetup = (player) => {
    player.on('ready', function () {
      videojs.log('Player ready');

      // Add this class in mobile/tablet devices to always show the control bar,
      // since the inactivityTimeout is flaky in some browsers
      if (IS_MOBILE || IS_IPAD) {
        player.controlBar.addClass('vjs-mobile-visible');
      }

      player.muted(startMuted);
      player.volume(startVolume);
      player.canvasIndex = cIndexRef.current;
      player.srcIndex = srcIndex;
      // Need to set this once experimentalSvgIcons option in Video.js options was enabled
      player.getChild('controlBar').qualitySelector.setIcon('cog');
    });

    playerLoadedMetadata(player);

    player.on('pause', () => {
      // When canvas is empty the pause event is temporary to keep the player
      // instance on page without playing for inaccessible items. The state
      // update is blocked on these events, since it is expected to autoplay
      // the next time player is loaded with playable media.
      if (!canvasIsEmptyRef.current) {
        playerDispatch({ isPlaying: false, type: 'setPlayingStatus' });
      }
    });

    player.on('canplay', () => {
      // Reset isEnded flag
      playerDispatch({ isEnded: false, type: 'setIsEnded' });
    });
    player.on('play', () => {
      playerDispatch({ isPlaying: true, type: 'setPlayingStatus' });
    });
    player.on('timeupdate', () => {
      handleTimeUpdate();
    });
    player.on('ended', () => {
      playerDispatch({ isEnded: true, type: 'setIsEnded' });
      handleEnded();
    });
    player.on('volumechange', () => {
      setStartMuted(player.muted());
      setStartVolume(player.volume());
    });
    player.on('qualityRequested', (e, quality) => {
      setStartQuality(quality.label);
    });
    /*
      This event handler helps to execute hotkeys functions related to 'keydown' events
      before any user interactions with the player or when focused on other non-input 
      elements on the page
    */
    document.addEventListener('keydown', (event) => {
      playerHotKeys(event, player, canvasIsEmptyRef.current);
    });
  };

  /**
   * Setup captions for the player based on context
   * @param {Object} player Video.js player instance
   */
  const setUpCaptions = (player) => {
    let textTracks = player.textTracks();
    /* 
      Filter the text track Video.js adds with an empty label and language 
      when nativeTextTracks are enabled for iPhones and iPads.
      Related links, Video.js => https://github.com/videojs/video.js/issues/2808 and
      in Apple => https://developer.apple.com/library/archive/qa/qa1801/_index.html
    */
    if (IS_MOBILE && !IS_ANDROID) {
      textTracks.on('addtrack', () => {
        for (let i = 0; i < textTracks.length; i++) {
          if (textTracks[i].language === '' && textTracks[i].label === '') {
            player.textTracks().removeTrack(textTracks[i]);
          }
          if (i == 0) { textTracks[i].mode = 'showing'; }
        }
      });
    }
    // Turn first caption/subtitle ON and turn captions ON indicator via CSS on first load
    if (textTracks.tracks_?.length > 0) {
      let firstSubCap = textTracks.tracks_.filter(
        t => t.kind === 'subtitles' || t.kind === 'captions'
      );
      if (firstSubCap?.length > 0) {
        firstSubCap[0].mode = 'showing';
        handleCaptionChange(true);
      }
    }

    // Add/remove CSS to indicate captions/subtitles is turned on
    textTracks.on('change', () => {
      let trackModes = [];
      for (let i = 0; i < textTracks.length; i++) {
        trackModes.push(textTracks[i].mode);
      }
      const subsOn = trackModes.includes('showing') ? true : false;
      handleCaptionChange(subsOn);
    });
  };


  /**
   * Setting the current time of the player when using structure navigation
   */
  React.useEffect(() => {
    if (playerRef.current !== null && isReadyRef.current) {
      playerRef.current.currentTime(currentTimeRef.current, playerDispatch({ type: 'resetClick' }));
    }
  }, [isClicked, isReady]);

  const setSelectedQuality = (sources) => {
    //iterate through sources and find source that matches startQuality and source currently marked selected
    //if found set selected attribute on matching source then remove from currently marked one
    const originalQuality = sources?.find((source) => source.selected == true);
    const selectedQuality = sources?.find((source) => source.label == startQuality);
    if (selectedQuality) {
      originalQuality.selected = false;
      selectedQuality.selected = true;
    }
  };

  /**
   * Add CSS class to icon to indicate captions are on/off in player control bar
   * @param {Boolean} subsOn flag to indicate captions are on/off
   */
  const handleCaptionChange = (subsOn) => {
    let player = playerRef.current;
    /* 
      For audio instances Video.js is setup to not to build the CC button 
      in Ramp's player control bar.
    */
    if (!player.controlBar.subsCapsButton
      || !player.controlBar.subsCapsButton?.children_) {
      return;
    }
    if (subsOn) {
      player.controlBar.subsCapsButton.children_[0].addClass('captions-on');
    } else {
      player.controlBar.subsCapsButton.children_[0].removeClass('captions-on');
    }
  };

  /**
   * Handle the 'ended' event fired by the player when a section comes to
   * an end. If there are sections ahead move onto the next canvas and
   * change the player and the state accordingly.
   */
  const handleEnded = () => {
    if (!autoAdvanceRef.current && !hasMultiItems) {
      return;
    }

    // Remove all the existing structure related markers in the player
    if (playerRef.current && playerRef.current.markers) {
      playerRef.current.markers.removeAll();
    }
    if (hasMultiItems) {
      // When there are multiple sources in a single canvas
      // advance to next source
      if (srcIndex + 1 < targets.length) {
        manifestDispatch({ srcIndex: srcIndex + 1, type: 'setSrcIndex' });
        playerDispatch({ currentTime: 0, type: 'setCurrentTime' });
      }
    } else if (structuresRef.current?.length > 0) {
      const nextItem = structuresRef.current[cIndexRef.current + 1];

      if (nextItem && nextItem != undefined) {
        manifestDispatch({
          canvasIndex: cIndexRef.current + 1,
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
          start = getMediaFragment(nextFirstItem.id, canvasDurationRef.current).start;
        }

        // If there's a timespan item at the start of the next canvas
        // mark it as the currentNavItem. Otherwise empty out the currentNavItem.
        if (start === 0) {
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
          playerRef.current.currentTime(start);
        }
      }
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
    const player = playerRef.current;
    if (player !== null && isReadyRef.current) {
      let playerTime = player.currentTime() ?? currentTimeRef.current;
      if (hasMultiItems && srcIndexRef.current > 0) {
        playerTime = playerTime + targets[srcIndexRef.current].altStart;
      }
      const activeSegment = getActiveSegment(playerTime);
      // the active segment has changed
      if (activeIdRef.current !== activeSegment?.id) {
        if (activeSegment === null) {
          /**
           * Clear currentNavItem and other related state variables to update the tracker
           * in structure navigation and highlights within the player.
           */
          manifestDispatch({ item: null, type: 'switchItem' });
          setActiveId(null);
        } else {
          // Set the active segment in state
          manifestDispatch({ item: activeSegment, type: 'switchItem' });
          setActiveId(activeSegment.id);

          if (!isPlaylist && player.markers) {
            const { start, end } = getMediaFragment(activeSegment.id, canvasDurationRef.current);
            playerDispatch({
              endTime: end,
              startTime: start,
              type: 'setTimeFragment',
            });
            if (start !== end) {
              // don't let marker extend past the end of the canvas
              let markerEnd = end > canvasDurationRef.current ? canvasDurationRef.current : end;
              setFragmentMarker({
                time: start,
                duration: markerEnd - start,
                text: start,
                class: 'ramp--track-marker--fragment'
              });
            } else { // to prevent zero duration fragments I suppose
              setFragmentMarker(null);
            }
          } else if (fragmentMarker !== null) {
            setFragmentMarker(null);
          }
        }
      }
    };
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
      const { id, isCanvas, canvasIndex } = segment;
      if (canvasIndex == cIndexRef.current + 1) {
        // Canvases without structure has the Canvas information
        // in Canvas-level item as a navigable link
        if (isCanvas) {
          return segment;
        }
        const segmentRange = getMediaFragment(id, canvasDuration);
        const isInRange = checkSrcRange(segmentRange, canvasDuration);
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
    <div>
      <div data-vjs-player data-canvasindex={cIndexRef.current}>
        {canvasIsEmptyRef.current && (
          <div data-testid="inaccessible-message-display"
            // These styles needs to be inline for the poster to display within the Video boundaries
            style={{
              position: !playerRef.current ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'medium',
              color: '#fff',
              backgroundColor: 'black',
              zIndex: 101,
              aspectRatio: !playerRef.current ? '16/9' : '',
              textAlign: 'center',
            }}>
            <p style={{ width: '50%' }} dangerouslySetInnerHTML={{ __html: placeholderText }}></p>
          </div>
        )}
        <video
          data-testid={`videojs-${isVideo ? 'video' : 'audio'}-element`}
          data-canvasindex={cIndexRef.current}
          ref={videoJSRef}
          className={`video-js vjs-big-play-centered vjs-disabled ${IS_ANDROID ? 'is-mobile' : ''}`}
          onTouchStart={saveTouchStartCoords}
          onTouchEnd={mobilePlayToggle}
          style={{ display: `${canvasIsEmptyRef.current ? 'none' : ''}` }}
        >
        </video>
      </div>
      {(hasStructure || playlist.isPlaylist) &&
        (<div className="vjs-track-scrubber-container hidden" ref={trackScrubberRef} id="track_scrubber">
          <p className="vjs-time track-currenttime" role="presentation"></p>
          <span type="range" aria-label="Track scrubber" role="slider" tabIndex={0}
            className="vjs-track-scrubber" style={{ width: '100%' }}>
            <span className="tooltiptext" ref={scrubberTooltipRef} aria-hidden={true} role="presentation"></span>
          </span>
          <p className="vjs-time track-duration" role="presentation"></p>
        </div>)
      }
    </div >
  );
}

VideoJSPlayer.propTypes = {
  isVideo: PropTypes.bool,
  hasMultipleCanvases: PropTypes.bool,
  isPlaylist: PropTypes.bool,
  trackScrubberRef: PropTypes.object,
  scrubberTooltipRef: PropTypes.object,
  tracks: PropTypes.array,
  placeholderText: PropTypes.string,
  renderingFiles: PropTypes.array,
  enableFileDownload: PropTypes.bool,
  videoJSOptions: PropTypes.object,
};

export default VideoJSPlayer;
