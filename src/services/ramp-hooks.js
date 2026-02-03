/**
 * This module contains custom hooks used in Ramp components as
 * needed to listen and update the UI based on the global state
 * in the contexts.
 * This enables to control re-renders in each componet by only
 * relying on parts of the global state which are applicable to
 * them.
 */
import { useMemo, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { ManifestDispatchContext, ManifestStateContext } from '../context/manifest-context';
import { PlayerDispatchContext, PlayerStateContext } from '../context/player-context';
import {
  parseTranscriptData, readSupplementingAnnotations, sanitizeTranscripts,
  TRANSCRIPT_MOTIVATION,
  TRANSCRIPT_TYPES
} from './transcript-parser';
import {
  CANVAS_MESSAGE_TIMEOUT, checkSrcRange, HOTKEY_ACTION_OUTPUT, playerHotKeys,
  screenReaderFriendlyTime, identifyMachineGen,
  truncateText,
  autoScroll
} from '@Services/utility-helpers';
import { getMediaInfo } from '@Services/iiif-parser';
import videojs from 'video.js';
import throttle from 'lodash/throttle';
import { parseAnnotationSets } from './annotations-parser';

/**
 * Disable each marker when one of the markers in the table
 * is being edited reading isEditing value from global
 * state and read presence of annotation service in the Manifest.
 * @returns { 
 * isDisabled: Boolean,
 * hasAnnotationService: Boolean
 * }
 */
export const useMarkers = () => {
  const manifestState = useContext(ManifestStateContext);
  const { isEditing, hasAnnotationService } = manifestState.playlist;

  const isDisabled = useMemo(() => {
    return isEditing;
  }, [isEditing]);

  return { isDisabled, hasAnnotationService };
};

/**
 * Read player and related updates as player is changed in
 * global state
 * @returns { 
 * canvasIndex: number,
 * canvasIsEmpty: bool,
 * isMultiCanvased: bool,
 * lastCanvasIndex: number,
 * player: object 
 * getCurrentTime: func, 
 * }
 */
export const useMediaPlayer = () => {
  const manifestState = useContext(ManifestStateContext);
  const playerState = useContext(PlayerStateContext);

  const { player } = playerState;
  const { allCanvases, canvasIndex, canvasIsEmpty } = manifestState;

  const [currentTime, _setCurrentTime] = useState(-1);
  const setCurrentTime = useMemo(() => throttle(_setCurrentTime, 50), []);

  const playerRef = useRef(null);

  // Deduct 1 from length to compare against canvasIndex, which starts from 0
  const lastCanvasIndex = useMemo(() => { return allCanvases.length > 0 ? allCanvases.length - 1 : 0; },
    [allCanvases]);
  const isMultiCanvased = useMemo(() => { return allCanvases?.length - 1 > 0 ? true : false; },
    [allCanvases]);

  // Wrapper function to get player's time for creating a new playlist marker
  const getCurrentTime = useCallback(() => {
    if (player) {
      return player.currentTime();
    } else {
      return 0;
    }
  }, [player]);

  /**
   * Listen to player's timeupdate event to update currentTime.
   * 'currentTime' value is used in AnnotationRow component to update active
   * annotation-row.
   */
  useEffect(() => {
    if (manifestState && playerState) {
      playerRef.current = playerState.player;
    }
    if (playerRef.current) {
      playerRef.current.on('timeupdate', () => {
        // Calculate relative current time in Canvas when it is multi-sourced
        if (playerRef.current.targets?.length > 1) {
          const currentSrcIndex = playerRef.current.srcIndex ?? 0;
          const currentTarget = playerRef.current.targets[currentSrcIndex];
          if (currentTarget) {
            const targetStart = currentTarget.altStart || 0;
            const playerTime = playerRef.current.currentTime();
            setCurrentTime(playerTime + targetStart);
          }
        } else {
          setCurrentTime(playerRef.current.currentTime());
        }
      });
    }
  }, [manifestState]);

  return {
    canvasIndex,
    canvasIsEmpty,
    currentTime,
    isMultiCanvased,
    lastCanvasIndex,
    player,
    getCurrentTime,
  };
};

/**
 * Read Canvas information and update state to reload player on
 * Canvas changes
 * @param {Object} obj
 * @param {Boolean} obj.enableFileDownload
 * @param {Boolean} obj.withCredentials
 * @param {Number} obj.lastCanvasIndex
 * @returns  {
 * isMultiSourced: bool,
 * isPlaylist: bool,
 * isVideo: bool,
 * nextItemClicked: func,
 * playerConfig: obj,
 * ready: bool,
 * renderingFiles: array,
 * srcIndex: number,
 * switchPlayer: func
 * }
 */
export const useSetupPlayer = ({
  enableFileDownload = false,
  lastCanvasIndex,
  withCredentials = false,
}) => {
  const manifestDispatch = useContext(ManifestDispatchContext);
  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const {
    allCanvases,
    canvasIndex,
    customStart,
    manifest,
    playlist,
    renderings,
    srcIndex
  } = manifestState;
  const { isPlaylist } = playlist;

  const [isVideo, setIsVideo] = useState();
  const [playerConfig, setPlayerConfig] = useState({
    error: '',
    sources: [],
    tracks: [],
    poster: null,
    targets: [],
  });
  const [isMultiSourced, setIsMultiSourced] = useState();
  const [firstLoad, setFirstLoad] = useState(true);
  const [ready, setReady] = useState(false);

  const renderingFiles = useMemo(() => {
    if (enableFileDownload && renderings != {}) {
      return (renderings?.manifest)?.concat(renderings?.canvas[canvasIndex]?.files);
    } else {
      return [];
    }
  }, [renderings, canvasIndex]);

  useEffect(() => {
    if (manifest) {
      /*
        Always start from the start time relevant to the Canvas only in playlist contexts,
        because canvases related to playlist items always start from the given start.
        With regular manifests, the start time could be different when using structured 
        navigation to switch between canvases.
      */
      if (canvasIndex == undefined || canvasIndex < 0) {
        throw new Error('Invalid canvas index. Please check your Manifest.');
      }
      initCanvas(canvasIndex, isPlaylist);
    }

    return () => {
      setReady(false);
      playerDispatch({ player: null, type: 'updatePlayer' });
    };
  }, [manifest, canvasIndex]);

  /**
   * Initialize the next Canvas to be viewed in the player instance
   * @param {Number} canvasId index of the Canvas to be loaded into the player
   * @param {Boolean} fromStart flag to indicate how to start new player instance
   */
  const initCanvas = (canvasId, fromStart) => {
    const {
      isMultiSource, sources, tracks, canvasTargets, mediaType, error, poster
    } = getMediaInfo({
      manifest,
      canvasIndex: canvasId,
      startTime: canvasId === customStart.startIndex && firstLoad
        ? customStart.startTime : 0,
      srcIndex,
      isPlaylist,
    });

    if (withCredentials) {
      sources.map(function (source) {
        return (source.withCredentials = true);
      });
    }
    setIsVideo(mediaType === 'video');
    manifestDispatch({ canvasTargets, type: 'canvasTargets' });
    manifestDispatch({ isMultiSource, type: 'hasMultipleItems' });

    // Set the current time in player from the canvas details
    if (fromStart) {
      if (canvasTargets?.length > 0) {
        playerDispatch({ currentTime: canvasTargets[0].altStart, type: 'setCurrentTime' });
      } else {
        playerDispatch({ currentTime: 0, type: 'setCurrentTime' });
      }
    }

    setPlayerConfig({
      ...playerConfig,
      error, sources, tracks, poster, targets: canvasTargets
    });

    const currentCanvas = allCanvases.find((c) => c.canvasIndex === canvasId);
    // When Manifest is empty currentCanvas is null
    if (currentCanvas && !currentCanvas.isEmpty) {
      // Manifest is taken from manifest state, and is a basic object at this point
      // lacking the getLabel() function so we manually retrieve the first label.
      let manifestLabel = manifest.label ? Object.values(manifest.label)[0][0] : '';
      // Filter out falsy items in case canvas.label is null or an empty string
      let titleText = [manifestLabel, currentCanvas.label].filter(Boolean).join(' - ');
      manifestDispatch({ canvasDuration: currentCanvas.duration, type: 'canvasDuration' });
      manifestDispatch({
        canvasLink: { label: titleText, id: currentCanvas.canvasId },
        type: 'canvasLink',
      });
      manifestDispatch({ type: 'setCanvasIsEmpty', isEmpty: false });
    } else {
      playerDispatch({ type: 'updatePlayer' });
      manifestDispatch({ type: 'setCanvasIsEmpty', isEmpty: true });
      // Set poster as playerConfig.error to be used for empty Canvas message in VideoJSPlayer
      setPlayerConfig({ ...playerConfig, error: poster });
    }
    setIsMultiSourced(isMultiSource || false);

    error ? setReady(false) : setReady(true);
    // Reset firstLoad flag after customStart is used on initial load
    setFirstLoad(false);
  };

  /**
   * Switch player when navigating across canvases
   * @param {Number} index canvas index to be loaded into the player
   * @param {Boolean} fromStart flag to indicate set player start time to zero or not
   * @param {String} focusElement element to be focused within the player when using
   * next or previous buttons with keyboard
   */
  const switchPlayer = (index, fromStart) => {
    if (index != undefined && index > -1 && index <= lastCanvasIndex) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas',
      });
      initCanvas(index, fromStart);
    }
  };

  /**
   * Switch src in the player when seeked to a time range within a
   * different item in the same canvas
   * @param {Number} srcindex new srcIndex
   * @param {Number} value current time of the player
   */
  const nextItemClicked = (srcindex, value) => {
    playerDispatch({ currentTime: value, type: 'setCurrentTime' });
    manifestDispatch({ srcIndex: srcindex, type: 'setSrcIndex' });
  };

  return {
    isMultiSourced,
    isPlaylist,
    isVideo,
    nextItemClicked,
    playerConfig,
    ready,
    renderingFiles,
    srcIndex,
    switchPlayer,
  };
};

/**
 * Initialize and update VideoJS instance on global state changes when
 * Canvas changes
 * @param {Object} obj
 * @param {Object} obj.options VideoJS options
 * @param {Function} obj.playerInitSetup VideoJS initialize setup func
 * @param {String} obj.startQuality selected quality stored in local storage
 * @param {Array} obj.tracks text tracks for the selected Canvas
 * @param {Function} obj.updatePlayer VideoJS update func on Canvas change
 * @param {Object} obj.videoJSRef React ref for video tag on page
 * @param {String} obj.videoJSLangMap VideoJS language for set language
 * @returns {
 * activeId: string,
 * fragmentMarker: obj,
 * isReadyRef: obj,
 * playerRef: obj,
 * setActiveId: func,
 * setFragmentMarker: func,
 * setIsReady: func,
 * }
 */
export const useVideoJSPlayer = ({
  options,
  playerInitSetup,
  startQuality,
  tracks,
  updatePlayer,
  videoJSRef,
  videoJSLangMap
}) => {
  const manifestState = useContext(ManifestStateContext);
  const playerState = useContext(PlayerStateContext);
  const playerDispatch = useContext(PlayerDispatchContext);
  const { canvasDuration, canvasIndex, canvasIsEmpty, currentNavItem, playlist } = manifestState;
  const { currentTime, isClicked, player, searchMarkers } = playerState;

  const [activeId, setActiveId] = useState('');
  const [fragmentMarker, setFragmentMarker] = useState(null);
  // Needs to maintain this in a state variable for useEffect for marker updates
  const [isReady, _setIsReady] = useState(false);

  const isReadyRef = useRef(isReady);
  const setIsReady = (r) => {
    _setIsReady(r);
    isReadyRef.current = r;
  };
  const playerRef = useRef(null);
  const setPlayer = (p) => {
    /**
     * When player is set to null, dispose player using Video.js' dispose()
     * method. This ensures player is reset when changing the manifest w/o a
     * page reload. e.g. changing Manifest in demo site using `Set Manifest`.
     */
    p ? playerRef.current = p : playerRef.current.dispose();
  };

  useEffect(() => {
    // Dispose Video.js instance when VideoJSPlayer component is removed
    return () => {
      if (playerRef.current) {
        setPlayer(null);
        document.removeEventListener('keydown', playerHotKeys);
        setIsReady(false);
      }
    };
  }, []);

  // Update VideoJS instance on Canvas change
  useEffect(() => {
    // Set selected quality from localStorage in Video.js options
    setSelectedQuality(options.sources);
    // Set Video.js language from props
    videojs.addLanguage(options.language, JSON.parse(videoJSLangMap));

    // Video.js player is only initialized on initial page load
    if (!playerRef.current && options.sources?.length > 0) {

      buildTracksHTML();

      // Turn Video.js logging off and handle errors in this code, to avoid
      // cluttering the console when loading inaccessible items.
      videojs.log.level('off');

      const player = videojs(videoJSRef.current, options, () => {
        playerInitSetup(player);
      });
      setPlayer(player);

      /* Another way to add a component to the controlBar */
      // player.getChild('controlBar').addChild('vjsYo', {});

      playerDispatch({ player: player, type: 'updatePlayer' });

      initializeEventHandlers(player);

    } else if (playerRef.current && options.sources?.length > 0) {
      // Update the existing Video.js player on consecutive Canvas changes
      const player = playerRef.current;

      // Reset markers
      if (activeId) player.markers?.removeAll();
      setActiveId(null);

      // Block player while metadata is loaded when canvas is not empty
      if (!canvasIsEmpty) {
        player.addClass('vjs-disabled');

        setIsReady(false);
        updatePlayer(player);

        playerDispatch({ player: player, type: 'updatePlayer' });
      } else {
        // Mark as ready to for inaccessible canvas (empty)
        setIsReady(true);
      }
    }
  }, [options.sources, videoJSRef, videoJSLangMap]);

  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current;
      // Show/hide control bar for valid/inaccessible items respectively
      if (canvasIsEmpty) {
        // Set the player's aspect ratio to video
        player.audioOnlyMode(false);
        player.canvasIsEmpty = true;
        player.aspectRatio('16:9');
        player.controlBar.addClass('vjs-hidden');
        player.removeClass('vjs-disabled');
        player.pause();
        /**
         * Update the activeId to update the active item in the structured navigation.
         * For playable items this is updated in the timeupdate handler.
         */
        setActiveId(currentNavItem?.id);
      } else {
        // Reveal control bar; needed when loading a Canvas after an inaccessible item
        player.controlBar.removeClass('vjs-hidden');
      }
    }
  }, [canvasIndex, canvasIsEmpty, currentNavItem]);

  // Setting the current time of the player when using structure navigation
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.currentTime(currentTime, playerDispatch({ type: 'resetClick' }));
    }
  }, [isClicked, player]);

  const markers = useMemo(() => {
    if (playlist?.markers?.length > 0) {
      const canvasMarkers = playlist.markers
        .filter((m) => m.canvasIndex === canvasIndex);
      if (canvasMarkers?.length > 0) {
        return canvasMarkers[0].canvasMarkers.map((m) => ({
          time: parseFloat(m.time),
          text: m.value,
          class: 'ramp--track-marker--playlist'
        }));
      }
    }
  }, [playlist.markers]);

  // Update VideoJS player's markers for search hits/playlist markers/structure navigation
  useEffect(() => {
    if (playerRef.current && playerRef.current.markers && isReady) {
      // markers plugin not yet initialized
      if (typeof playerRef.current.markers === 'function') {
        playerRef.current.markers({
          markerTip: {
            display: false, // true,
            text: marker => marker.text
          },
          markerStyle: {},
          markers: [],
        });
      }

      let playlistMarkers = [];
      if (markers?.length > 0) {
        playlistMarkers = markers.map((m) => ({
          time: parseFloat(m.time),
          text: m.value,
          class: 'ramp--track-marker--playlist'
        }));
      }

      playerRef.current.markers?.removeAll();
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
    isReady,
    markers
  ]);

  /**
   * Attach events related to player on initial setup of the VideoJS
   * instance
   * @param {Object} player 
   */
  const initializeEventHandlers = (player) => {
    // Update player status in state only when pause is initiate by the user
    player.controlBar.getChild('PlayToggle').on('pointerdown', () => {
      handlePause();
    });
    player.on('pointerdown', (e) => {
      const elementTag = e.target.nodeName.toLowerCase();
      if (elementTag == 'video') {
        handlePause();
      }
    });
    /*
      This event handler helps to execute hotkeys functions related to 'keydown' events
      before any user interactions with the player or when focused on other non-input 
      elements on the page
    */
    document.addEventListener('keydown', (event) => {
      const result = playerHotKeys(event, playerRef.current, canvasIsEmpty);
      // Update player status in global state
      switch (result) {
        case HOTKEY_ACTION_OUTPUT.pause:
          handlePause();
          break;
        // Handle other cases as needed for each action
        default:
          break;
      }
    });

    // Listen for resize events on desktop browsers and trigger player.resize event
    window.addEventListener('resize', () => {
      // Check if player is initialized before triggering resize event, especially helpful
      // when switching the Manifest in the demo site without a page reload
      if (player?.player_) player.trigger('resize');
    });

    /**
     * The 'resize' event on window doesn't catch zoom in/out in iOS Safari.
     * Therefore, use window.visualViewport to detect zoom in/out in mobile browsers when
     * zoomed in/out using OS/browser settings.
     */
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        // Check if player is initialized before triggering resize event, especially helpful
        // when switching the Manifest in the demo site without a page reload
        if (player?.player_) player.trigger('resize');
      });
    }
  };

  /**
   * Update global state only when a user pause the player by using the
   * player interface or keyboard shortcuts
   */
  const handlePause = () => {
    playerDispatch({ isPlaying: false, type: 'setPlayingStatus' });
  };

  const setSelectedQuality = (sources) => {
    //iterate through sources and find source that matches startQuality and source currently marked selected
    //if found set selected attribute on matching source then remove from currently marked one
    const originalQuality = sources?.find((source) => source.selected == true);
    const selectedQuality = sources?.find((source) => source.label == startQuality);
    if (selectedQuality && originalQuality) {
      selectedQuality.selected = true;
      originalQuality.selected = false;
    }
  };

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
        trackEl.setAttribute('srclang', t.srclang);
        videoJSRef.current.appendChild(trackEl);
      });
    }
  };

  return {
    activeId,
    fragmentMarker,
    isReadyRef,
    playerRef,
    setActiveId,
    setFragmentMarker,
    setIsReady
  };
};

/**
 * Handle display of inaccessible message timer and interval for
 * countdown
 * @param {Object} obj
 * @param {Number} obj.lastCanvasIndex
 * @returns {
 * messageTime: number,
 * clearCanvasMessageTimer: func,
 * createCanvasMessageTimer: func
 * }
 */
export const useShowInaccessibleMessage = ({ lastCanvasIndex }) => {
  const manifestDispatch = useContext(ManifestDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const { autoAdvance, canvasIndex, canvasIsEmpty } = manifestState;

  const [messageTime, setMessageTime] = useState(CANVAS_MESSAGE_TIMEOUT / 1000);

  let messageIntervalRef = useRef(null);

  useEffect(() => {
    // Clear existing interval for inaccessible message display
    clearDisplayTimeInterval();

    if (canvasIsEmpty && !messageIntervalRef.current && autoAdvance) {
      setMessageTime(CANVAS_MESSAGE_TIMEOUT / 1000);
      createDisplayTimeInterval();
    }
  }, [canvasIndex, autoAdvance, canvasIsEmpty]);

  /**
   * Create an interval to run every second to update display for the timer
   * for inaccessible canvas message display. Using useCallback to cache the
   * function as this doesn't need to change with component re-renders
   */
  const createDisplayTimeInterval = useCallback(() => {
    const createTime = new Date().getTime();
    messageIntervalRef.current = setInterval(() => {
      let now = new Date().getTime();
      let timeRemaining = (CANVAS_MESSAGE_TIMEOUT - (now - createTime)) / 1000;
      if (timeRemaining > 0) {
        setMessageTime(Math.ceil(timeRemaining));
      } else {
        // Advance to next Canvas when timer ends
        if (canvasIndex < lastCanvasIndex && autoAdvance) {
          manifestDispatch({
            canvasIndex: canvasIndex + 1,
            type: 'switchCanvas',
          });
        }
        clearDisplayTimeInterval();
      }
    }, 1000);
  });

  // Cleanup interval created for timer display for inaccessible message
  const clearDisplayTimeInterval = useCallback(() => {
    clearInterval(messageIntervalRef.current);
    messageIntervalRef.current = null;
  });

  return { messageTime, clearDisplayTimeInterval, createDisplayTimeInterval };
};

/**
 * Handle global state updates and local state updates for structured
 * navigation related components based on the user interactions and
 * player status updates
 * @param {Object} obj
 * @param {Number} obj.itemIndex
 * @param {Boolean} obj.isRoot 
 * @param {String} obj.itemId URL of the struct item
 * @param {Object} obj.liRef React ref for li element for struct item
 * @param {Object} obj.sectionRef React ref for collapsible ul element
 * @param {Object} obj.structureContainerRef React ref for the structure container
 * @param {Boolean} obj.isCanvas
 * @param {Boolean} obj.isEmpty is a restricted item
 * @param {Number} obj.canvasDuration
 * @param {Function} obj.setSectionIsCollapsed
 * @param {Object} obj.times start and end times of the structure timespan
 * @returns { 
 * canvasIndex,
 * currentNavItem,
 * handleClick,
 * isActiveLi,
 * isActiveSection,
 * isPlaylist,
 * screenReaderTime
 * }
 */
export const useActiveStructure = ({
  itemIndex,
  isRoot,
  itemId,
  liRef,
  sectionRef,
  structureContainerRef,
  isCanvas,
  isEmpty,
  canvasDuration,
  setSectionIsCollapsed,
  times,
}) => {
  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const { canvasIndex, currentNavItem, playlist } = manifestState;
  const { isPlaylist } = playlist;
  const playerState = useContext(PlayerStateContext);
  const { isPlaying } = playerState;

  // Use the appropriate ref based on whether it's a section or a list item
  const listRef = useMemo(() => {
    return (isCanvas && !isPlaylist) ? sectionRef : liRef;
  }, [sectionRef, liRef]);

  const isActiveLi = useMemo(() => {
    return (itemId != undefined && (currentNavItem?.id === itemId)
      && (isPlaylist || !isCanvas) && currentNavItem?.canvasIndex === canvasIndex + 1)
      ? true : false;
  }, [currentNavItem, canvasIndex]);

  const isActiveSection = useMemo(() => {
    const isCurrentSection = canvasIndex + 1 === itemIndex;
    // Do not mark root range as active
    // Expand section when current section is played
    if (isCurrentSection && (!isRoot || isPlaying)) {
      // Expand the section by setting sectionIsCollapsed=false in TreeNode
      setSectionIsCollapsed(false);
      return true;
    } else {
      return false;
    }
  }, [canvasIndex, isPlaying]);

  // Convert timestamp to a text read as a human
  const screenReaderTime = useMemo(() => {
    if (times != undefined) {
      return screenReaderFriendlyTime(times.start);
    } else {
      return '';
    }
  }, [itemId, canvasDuration]);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const inRange = checkSrcRange(times, { end: canvasDuration });
    /* 
      Only continue the click action if not both start and end times of 
      the timespan are not outside Canvas' duration
    */
    if (inRange) {
      playerDispatch({ clickedUrl: itemId, type: 'navClick' });
      listRef.current.isClicked = true;
      if (sectionRef.current) {
        sectionRef.current.isClicked = true;
      }
      // Update content of aria-live to notify the player update to user via assistive technologies
      // for non-restricted items.
      const screenReaderElement = structureContainerRef.current.querySelector('[aria-live="assertive"]');
      if (screenReaderElement) {
        if (isCanvas) {
          // Section click, navigates to a new Canvas
          screenReaderElement.textContent = `Player seeked to ${screenReaderTime} in Canvas ${itemIndex}`;
        } else if (!isEmpty) {
          // Non-empty timespan click, seeks the player
          screenReaderElement.textContent = `Player seeked to ${screenReaderTime}`;
        }
      }
    }
  });

  return {
    canvasIndex,
    currentNavItem,
    handleClick,
    isActiveLi,
    isActiveSection,
    isPlaylist,
    screenReaderTime,
  };
};

/**
 * Enable collapse/expand all sections when collapse/expand all
 * section button is enabled in StructuredNavigation component
 * @returns {
 * collapseExpandAll,
 * isCollapsed,
 * updateSectionStatus,
 * }
 */
export const useCollapseExpandAll = () => {
  const manifestDispatch = useContext(ManifestDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const { canvasIndex } = manifestState;
  const { isCollapsed, structItems } = manifestState.structures;
  const playerState = useContext(PlayerStateContext);
  const { isPlaying } = playerState;

  // Mark collapsible structure sections on inital load
  const collapsibleStructure = useMemo(() => {
    return structItems?.length > 0 && structItems.map((s) => {
      // s.collapseStatus == undefined stops changing these values on subsequent updates
      if (s.items?.length > 0 && s.collapseStatus == undefined) {
        // Using Strings instead of Boolean for easier understanding of code
        s.collapseStatus = isCollapsed ? 'isCollapsed' : 'isExpanded';
      }
      return s;
    });
  }, []);

  /**
   * Update section's 'collapseStatus' on playback status 
   * or Canvas change
   */
  useEffect(() => {
    if (isPlaying) {
      updateSectionStatus(canvasIndex, false);
    }
  }, [isPlaying, canvasIndex]);

  /**
   * Update 'isCollapsed' status for all sections in global state and
   * for each section in 'collapsibleStructure' local variable.
   */
  const collapseExpandAll = useCallback(() => {
    const updated = !isCollapsed;
    manifestDispatch({ type: 'setIsCollapsed', isCollapsed: updated });

    // Update each section's 'collapseStatus' property
    for (let i = collapsibleStructure.length - 1; i > -1; i--) {
      updateSection(i, updated);
    }
  });

  /**
   * Update each section's collapse status when interacting with a section's
   * collapse/expand button or playback.
   * When all sections are changed manually update the global state to reflect
   * the changed status in the 'CollapseExpandButton' for all sections.
   * @param {Number} index section's respective canvas index in Manifest
   * @param {Boolean} status updated status for collapsible structure for the section
   */
  const updateSectionStatus = (index, status) => {
    updateSection(index, status);

    // Convert global status into a string value
    const allSectionStatus = isCollapsed ? 'isCollapsed' : 'isExpanded';

    // Get all sections' statuses
    const eachSectionStatus = collapsibleStructure.map((s) => s.collapseStatus)
      .filter(c => c != undefined);

    if (eachSectionStatus?.length > 0) {
      // Check all sections have the same status
      const allSectionsHaveChanged = eachSectionStatus
        .every(s => s === eachSectionStatus[0]);

      // Update global state when all sections have been updated manually
      if (allSectionsHaveChanged && eachSectionStatus[0] != allSectionStatus) {
        collapseExpandAll();
      }
    }
  };

  /**
   * Wrapper function to update 'collapseStatus' property in 'collapsibleStructure' 
   * array for a given section
   * @param {Number} index 
   * @param {Boolean} status 
   */
  const updateSection = (index, status) => {
    // Only update 'collapseStatus' property for sections with children
    if (collapsibleStructure[index]?.items?.length > 0) {
      collapsibleStructure[index].collapseStatus = status ? 'isCollapsed' : 'isExpanded';
    }
  };

  return { collapseExpandAll, isCollapsed, updateSectionStatus };
};

/**
 * State handling and setup for transcripts
 * @param {Object} obj
 * @param {String} obj.manifestUrl
 * @param {String} obj.playerID
 * @param {Function} obj.setCurrentTime 
 * @param {Boolean} obj.showMetadata
 * @param {Boolean} obj.showNotes
 * @param {Array} obj.transcripts
 * @returns {
 * canvasIndexRef: obj,
 * canvasTranscripts: array,
 * isEmpty: bool,
 * isLoading: bool,
 * NO_SUPPORT_MSG: str,
 * playerRef: obj,
 * selectedTranscript: obj,
 * selectTranscript: func,
 * transcript: array,
 * transcriptInfo: obj,
 * }
 */
export const useTranscripts = ({
  manifestUrl,
  playerID,
  setCurrentTime,
  showMetadata,
  showNotes,
  transcripts,
}) => {
  const manifestState = useContext(ManifestStateContext);
  const playerState = useContext(PlayerStateContext);

  const NO_TRANSCRIPTS_MSG = 'No valid Transcript(s) found, please check again.';
  const INVALID_URL_MSG = 'Invalid URL for transcript, please check again.';
  const INVALID_VTT = 'Invalid WebVTT file, please check again.';
  const INVALID_TIMESTAMP = 'Invalid timestamp format in cue(s), please check again.';
  const NO_SUPPORT_MSG = 'Transcript format is not supported, please check again.';

  const abortController = new AbortController();
  const canvasIndexRef = useRef();
  const setCanvasIndex = (c) => {
    abortController.abort();
    canvasIndexRef.current = c;
  };

  const playerRef = useRef(null);
  const playerIntervalRef = useRef(null);

  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [transcriptsList, setTranscriptsList] = useState([]);
  const [transcriptInfo, setTranscriptInfo] = useState({
    title: null,
    filename: null,
    id: null,
    tUrl: null,
    tType: null,
    tFileExt: null,
    isMachineGen: false,
    tError: null,
  });
  const [canvasTranscripts, setCanvasTranscripts] = useState([]);
  // Store transcript data in state to avoid re-requesting file contents
  const [cachedTranscripts, setCachedTranscripts] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState({ url: '', isTimed: false });

  // Read annotations from ManifestState if it exists
  const annotations = useMemo(() => {
    return manifestState === undefined ? [] : manifestState.annotations;
  }, [manifestState]);
  const transcriptParseAbort = useRef(null);

  /**
   * Start an interval at the start of the component to poll the
   * canvasindex attribute changes in the player on the page
   */
  useEffect(() => {
    if (manifestState && playerState) {
      canvasIndexRef.current = manifestState.canvasIndex;
      playerRef.current = playerState.player;
    } else {
      playerIntervalRef.current = setInterval(() => {
        const domPlayer = document.getElementById(playerID);
        if (!domPlayer) {
          console.warn(
            `Cannot find player, ${playerID} on page. Transcript synchronization is disabled`
          );
          // Inaccessible canvas => stop loading spinner
          setIsLoading(false);
        } else {
          if (domPlayer.player) playerRef.current = domPlayer.player;
          else playerRef.current = domPlayer;
        }

        if (playerRef.current) {
          let cIndex = parseInt(playerRef.current.canvasIndex);
          if (Number.isNaN(cIndex)) cIndex = 0;
          if (cIndex !== canvasIndexRef.current) {
            // Clear the transcript text in the component
            setTranscript([]);
            setCanvasIndex(cIndex);
            setCurrentTime(playerRef.current.currentTime());
          }
        }
      }, 500);
    }
  }, [manifestState]);

  useEffect(() => {
    if (transcripts?.length === 0 && !manifestUrl) {
      // When both required props are invalid
      setIsLoading(false);
      setTranscript([]);
      setTranscriptInfo({
        tType: TRANSCRIPT_TYPES.noTranscript, id: '',
        tError: NO_TRANSCRIPTS_MSG
      });
    } else if (annotations?.length > 0 && transcripts?.length === 0) {
      /* 
      When annotations are present in global state and transcripts prop is not set
      use the parsed annotations to load transcripts instead of fetching and
      parsing the Manifest content again
       */
      transcriptParseAbort?.current?.abort();
      const canvasAnnotations = annotations
        .filter((a) => a.canvasIndex == canvasIndexRef.current);
      if (canvasAnnotations?.length > 0 && canvasAnnotations[canvasIndexRef.current]?.annotationSets?.length > 0) {
        // Filter supplementing annotations from all annotations in the Canvas
        const transcriptAnnotations = canvasAnnotations[canvasIndexRef.current].annotationSets
          .filter((as) => as.motivation?.includes(TRANSCRIPT_MOTIVATION) || as.isSupplementing);
        // Convert annotations into Transcript component friendly format
        const transcriptItems = transcriptAnnotations?.length > 0
          ? transcriptAnnotations.map((t, index) => {
            const { filename, format, items, label, url = manifestUrl } = t;
            let { isMachineGen, labelText } = identifyMachineGen(label);
            return {
              id: `${labelText}-${canvasIndexRef.current}-${index}`,
              filename,
              format,
              isMachineGen: isMachineGen,
              title: labelText,
              url,
              items,
            };
          }) : [];
        const allTranscripts = [...transcriptsList,
        { canvasId: canvasIndexRef.current, items: transcriptItems }];
        setTranscriptsList(allTranscripts ?? []);
        initTranscriptData(allTranscripts ?? []);
      } else {
        // When annotations exist but no supplementing annotations found
        setIsLoading(false);
        setTranscript([]);
        setTranscriptInfo({
          tType: TRANSCRIPT_TYPES.noTranscript, id: '',
          tError: NO_TRANSCRIPTS_MSG
        });
      }
    } else {
      transcriptParseAbort.current = new AbortController();
      loadTranscripts(transcripts);
    }
  }, [annotations]);

  useEffect(() => {
    // Clean up when the component unmounts
    return () => {
      clearInterval(playerIntervalRef.current);
      transcriptParseAbort.current?.abort();
      abortController?.abort();
    };
  }, []);

  /**
   * If a list of transcripts is given in the props, then sanitize them
   * to match the expected format in the component.
   * If not fallback to reading transcripts from a given manifest URL.
   * @param {Array} transcripts list of transcripts from props
   */
  const loadTranscripts = async (transcripts) => {
    let allTranscripts = (transcripts?.length > 0)
      // transcripts prop is processed first if given
      ? await sanitizeTranscripts(transcripts)
      // Read supplementing annotations from the given manifest
      : await readSupplementingAnnotations(manifestUrl, '', transcriptParseAbort.current.signal);

    // Do nothing if the transcript parsing was aborted
    if (transcriptParseAbort.current.signal.aborted) {
      return;
    } else {
      setTranscriptsList(allTranscripts ?? []);
      initTranscriptData(allTranscripts ?? []);
    }
  };

  const initTranscriptData = (allTranscripts) => {
    // When canvasIndex updates -> return
    if (abortController.signal.aborted) return;
    const getCanvasT = (tr) => {
      return tr.filter((t) => t.canvasId == canvasIndexRef.current);
    };
    const getTItems = (tr) => {
      return getCanvasT(tr)[0].items;
    };
    /**
     * When transcripts prop is empty
     * OR the respective canvas doesn't have transcript data
     * OR canvas' transcript items list is empty
     */
    if (
      !allTranscripts?.length > 0 ||
      !getCanvasT(allTranscripts)?.length > 0 ||
      !getTItems(allTranscripts)?.length > 0
    ) {
      setIsEmpty(true);
      setTranscript([]);
      setStateVar(undefined);
    } else {
      setIsEmpty(false);
      const cTranscripts = getCanvasT(allTranscripts)[0];
      setCanvasTranscripts(cTranscripts.items);
      setStateVar(cTranscripts.items[0]);
    }
  };

  useEffect(() => {
    if (transcriptsList?.length > 0 && canvasIndexRef.current != undefined) {
      let cTranscripts = transcriptsList
        .filter((tr) => tr.canvasId == canvasIndexRef.current)[0];
      setCanvasTranscripts(cTranscripts?.items);
      setStateVar(cTranscripts?.items[0]);
    }
  }, [canvasIndexRef.current]); // helps to load initial transcript with async req

  const setStateVar = async (transcript) => {
    // When selected transcript is null or undefined display error message
    if (!transcript || transcript == undefined) {
      setIsEmpty(true);
      setIsLoading(false);
      setTranscriptInfo({ tType: TRANSCRIPT_TYPES.noTranscript, id: '', tError: NO_TRANSCRIPTS_MSG });
      return;
    }

    // set isEmpty flag to render transcripts UI
    setIsEmpty(false);

    const { id, items, title, filename, url, isMachineGen, format } = transcript;

    // Check cached transcript data
    const cached = cachedTranscripts.filter(
      ct => ct.id == id && ct.canvasId == canvasIndexRef.current
    );
    if (cached?.length > 0) {
      // Load cached transcript data into the component
      const { tData, tFileExt, tType, tError } = cached[0];
      setTranscript(tData);
      setTranscriptInfo({ title, filename, id, isMachineGen, tType, tUrl: url, tFileExt, tError });
      setSelectedTranscript({
        url: url,
        isTimed: tType == TRANSCRIPT_TYPES.timedText
      });
    } else {
      // Parse new transcript data from the given sources
      await Promise.resolve(
        parseTranscriptData({
          url, format, canvasIndex: canvasIndexRef.current, showMetadata, showNotes,
          inlineAnnotations: items
        })
      ).then(function (value) {
        if (value != null) {
          const { tData, tUrl, tType, tFileExt } = value;
          let newError = '';
          switch (tType) {
            case TRANSCRIPT_TYPES.invalid:
              newError = INVALID_URL_MSG;
              break;
            case TRANSCRIPT_TYPES.noTranscript:
              newError = NO_TRANSCRIPTS_MSG;
              break;
            case TRANSCRIPT_TYPES.noSupport:
              newError = NO_SUPPORT_MSG;
              break;
            case TRANSCRIPT_TYPES.invalidVTT:
              newError = INVALID_VTT;
              break;
            case TRANSCRIPT_TYPES.invalidTimestamp:
              newError = INVALID_TIMESTAMP;
              break;
            default:
              break;
          }
          setTranscript(tData);
          setTranscriptInfo({ title, filename, id, isMachineGen, tType, tUrl, tFileExt, tError: newError });
          setSelectedTranscript({
            url: tUrl,
            isTimed: tType == TRANSCRIPT_TYPES.timedText
          });
          transcript = {
            ...transcript,
            tType: tType,
            tData: tData,
            tFileExt: tFileExt,
            canvasId: canvasIndexRef.current,
            tError: newError,
          };
          // Cache the transcript info 
          setCachedTranscripts([...cachedTranscripts, transcript]);
        }
      });
    }
    setIsLoading(false);
  };

  const selectTranscript = useCallback((selectedId) => {
    const selectedTranscript = canvasTranscripts.filter((tr) => (
      tr.id === selectedId
    ));
    setStateVar(selectedTranscript[0]);
  }, [canvasTranscripts]);

  return {
    canvasIndexRef,
    canvasTranscripts,
    isEmpty,
    isLoading,
    NO_SUPPORT_MSG,
    playerRef,
    selectedTranscript,
    selectTranscript,
    transcript,
    transcriptInfo
  };
};

/**
 * Global state handling related to annotations row display
 * @param {Object} obj
 * @param {String} obj.canvasId
 * @returns {
 *  checkCanvas: func
 * }
 */
export const useAnnotationRow = ({ canvasId }) => {
  const manifestState = useContext(ManifestStateContext);
  const manifestDispatch = useContext(ManifestDispatchContext);

  const { allCanvases, canvasIndex } = manifestState;

  const isCurrentCanvas = useMemo(() => {
    return allCanvases[canvasIndex].canvasId == canvasId;
  }, [canvasId, canvasIndex]);

  /**
   * Update current Canvas in state if the clicked Annotation is pointing
   * to a different Canvas within the given Manifest
   */
  const checkCanvas = useCallback((a) => {
    if (!isCurrentCanvas) {
      const clickedCanvas = allCanvases.filter((c) => c.canvasId === canvasId);
      if (clickedCanvas?.length > 0) {
        const currentCanvas = clickedCanvas[0];
        manifestDispatch({ canvasIndex: currentCanvas.canvasIndex, type: 'switchCanvas' });
      }
    }
    // Set the clicked annotation in global state
    manifestDispatch({ clickedAnnotation: a, type: 'setClickedAnnotation' });
  }, [isCurrentCanvas]);

  return { checkCanvas };
};

/**
 * Handle synchronization of playback time with the current annotation/transcript cue
 * @param {Object} obj
 * @param {String} obj.annotationId
 * @param {Array} obj.displayedAnnotations
 * @param {Boolean} obj.enableTimeupdate
 * @param {Object} obj.playerRef 
 * @param {Function} obj.setCurrentTime
 * @param {Object} obj.times
 * @returns {
 *  inPlayerRange: bool,
 *  syncPlayback: func
 * }
 */
export const useSyncPlayback = ({
  annotationId, displayedAnnotations = [], enableTimeupdate = false, playerRef, setCurrentTime, times = {}
}) => {
  const manifestState = useContext(ManifestStateContext);
  const manifestDispatch = useContext(ManifestDispatchContext);
  const playerDispatch = useContext(PlayerDispatchContext);

  const { clickedAnnotation } = manifestState;
  const { startTime, endTime, currentTime } = times;

  useEffect(() => {
    if (playerRef.current && enableTimeupdate) {
      playerRef.current.on('timeupdate', () => {
        // Sync transcript cues with relative current time in Canvas when it is multi-sourced
        if (playerRef.current.targets?.length > 1) {
          const currentSrcIndex = playerRef.current.srcIndex ?? 0;
          const currentTarget = playerRef.current.targets[currentSrcIndex];
          if (currentTarget) {
            const targetStart = currentTarget.altStart || 0;
            const playerTime = playerRef.current.currentTime();
            setCurrentTime(playerTime + targetStart);
          }
        } else {
          setCurrentTime(playerRef.current.currentTime());
        }
      });
    }
  }, [playerRef.current, enableTimeupdate]);

  /**
   * Use the current annotation's startTime and endTime in comparison with the startTime
   * of the next annotation in the list to mark an annotation as active.
   * When auto-scrolling is enabled, this is used by the AnnotationRow component to
   * highlight and scroll the active annotation to the top of the container.
   */
  const inPlayerRange = useMemo(() => {
    // Index of the current annotation
    const currentAnnotationIndex = displayedAnnotations
      .findIndex((a) => a.time?.start === startTime);
    // Retrieve the next annotation in the list if it exists
    const nextAnnotation = currentAnnotationIndex < displayedAnnotations?.length && currentAnnotationIndex > -1
      ? displayedAnnotations[currentAnnotationIndex + 1]
      : undefined;
    // If there's a next annotation, retrieve its start time
    const nextAnnotationStartTime = nextAnnotation != undefined
      ? nextAnnotation.time?.start : undefined;

    // Filter annotations that has a start time less than or equal to the currentTime
    const activeAnnotations = displayedAnnotations.filter((a) => a.time?.start <= currentTime);

    /**
     * IF there's a clicked annotation stored in global state, return the clicked annotation
     * if it matches the current annotation. Once the player's currentTime is out of the range
     * of the clicked annotation, clear it in global state.
     * 
     * ELSE IF there are possible active annotations with a start time less than or equal to the currentTime,
     * get the last annotation on that list. 
     * 
     * If the last active annotation is the current annotation mark it as active. Uses start times of
     * possible lastAnnotation and current annotation as they are unique to each annotation;
     *  - for time-point annotations, compare only the start times. Assumption:: the annotation has an implicit
     *    time range from its start time till the start time of the next annotation on the list
     *  - for time-range annotations, consider endTime to check whether currentTime is in the current
     *    annotation's time range
     * OR 
     * if the currentTime is within the range of the current annotation's startTime and endTime
     * without exceeding the next annotation's start time, mark the current annotation as active.
     * 
     * Here current annotation is referring to the AnnotationRow instance calling this function.
     */
    if (clickedAnnotation != null) {
      // Return annotation that matches the clicked annotation
      if (clickedAnnotation.id === annotationId) {
        return true;
      }
      /**
       * Once the player's current time is either,
       * - out of range of a clicked time-range annotation OR
       * - greater than the start time of a clicked time-point annotation
       * clear the value of clickedAnnotation in global state
       */
      if ((clickedAnnotation.time.end === undefined && clickedAnnotation.time.start != currentTime)
        || (clickedAnnotation.time.start > currentTime || clickedAnnotation.time.end < currentTime)) {
        // Use setTimeout to add this into event queue instead calling it immediately resulting a bad state
        setTimeout(() => {
          manifestDispatch({ clickedAnnotation: null, type: 'setClickedAnnotation' });
        }, 0);
      }
    } else if (activeAnnotations?.length > 0) {
      const lastAnnotation = activeAnnotations[activeAnnotations.length - 1];
      if ((lastAnnotation.time.start === startTime && endTime === undefined)
        || (lastAnnotation.time?.start === startTime && currentTime <= endTime)
        || (nextAnnotationStartTime != undefined && currentTime < nextAnnotationStartTime
          && startTime <= currentTime && currentTime <= endTime)
      ) {
        return true;
      } else {
        return false;
      }
    }
  }, [currentTime, displayedAnnotations, clickedAnnotation]);

  const syncPlayback = useCallback((time) => {
    // Offset for multi-source playback
    let timeOffset = 0;
    if (playerRef.current) {
      const isMultiSource = playerRef.current.targets?.length > 1;

      // Find the srcIndex for the current time if multi-source
      if (isMultiSource) {
        let targetSrcIndex = 0;
        const targets = playerRef.current.targets;

        // Find which source contains this time
        for (let i = 0; i < targets.length; i++) {
          const { altStart, duration } = targets[i];
          // Check if the time falls within the current source's duration
          if (time >= altStart && time < altStart + duration) {
            targetSrcIndex = i;
            timeOffset = altStart;
            break;
          }
        }
        if (playerRef.current.srcIndex !== targetSrcIndex) {
          manifestDispatch({ srcIndex: targetSrcIndex, type: 'setSrcIndex' });
          playerDispatch({ currentTime: time - timeOffset, type: 'setCurrentTime' });
        }
      }

      console.log(`Syncing player to time: ${time - timeOffset}`);
      playerRef.current.currentTime(time - timeOffset);
    }
  }, [playerRef.current]);

  return { syncPlayback, inPlayerRange };
};

/**
 * Handle global state updates related to annotations and markers;
 * - Parse and store annotations in global state from Manifest on inital load.
 * - Update markers in global state in playlist context when Canvas changes.
*/
export const useAnnotations = () => {
  const manifestState = useContext(ManifestStateContext);
  const manifestDispatch = useContext(ManifestDispatchContext);

  const { annotations, canvasIndex, manifest, playlist } = manifestState;
  const { isPlaylist } = playlist;

  // Parse annotations once Manifest is loaded initially
  useEffect(() => {
    if ((annotations?.length > 0
      || annotations?.filter((a) => a.canvasIndex === canvasIndex).length === 0)
      && manifest !== null) {
      let annotationSet = parseAnnotationSets(manifest, canvasIndex);
      manifestDispatch({ annotations: annotationSet, type: 'setAnnotations' });
    }
  }, [manifest]);

  /**
   * Update markers array in playlist context in the global state when
   * Canvas changes.
   */
  useEffect(() => {
    if (isPlaylist && annotations?.length > 0) {
      // Check if annotations are available for the current Canvas
      const markers = annotations.filter((a) => a.canvasIndex === canvasIndex);

      let canvasMarkers = [];
      // Filter all markers from annotationSets for the current Canvas
      if (markers?.length > 0) {
        const { _, annotationSets } = markers[0];
        canvasMarkers = annotationSets.map((a) => a.markers)
          .filter(m => m != undefined).flat();
        // Sort markers chronologically
        canvasMarkers.sort((a, b) => a.time - b.time);
      }
      // Update markers in global state
      manifestDispatch({ markers: { canvasIndex, canvasMarkers }, type: 'setPlaylistMarkers' });
    }

  }, [isPlaylist, canvasIndex, annotations]);
};

/**
 * Handle show more/less functionality for annotations/cues with long texts or tags
 * @param {Object} obj
 * @param {Boolean} obj.autoScrollEnabled
 * @param {Boolean} obj.enableShowMore
 * @param {Boolean} obj.inPlayerRange
 * @param {Number} obj.MAX_LINES
 * @param {Object} obj.refs
 * @param {Function} obj.setIsShowMoreRef
 * @param {Function} obj.setIsActive
 * @param {Array} obj.tags
 * @param {Array} obj.texts 
 * @returns {
 *  hasLongerTags: bool,
 *  hasLongerText: bool,
 *  setShowMoreTags: func,
 *  showMoreTags: bool,
 *  setTextToShow: func,
 *  textToShow: str,
 *  toggleTagsView: func,
 *  truncatedText: str
 * }
 */
export const useShowMoreOrLess = ({
  autoScrollEnabled, enableShowMore, inPlayerRange,
  MAX_LINES, refs, setIsShowMoreRef, setIsActive, tags, texts }) => {

  const { annotationRef, annotationTagsRef, annotationTextsRef, annotationTimesRef, containerRef, moreTagsButtonRef } = refs;
  // Text displayed for the annotation/cue
  const [textToShow, setTextToShow] = useState(0);
  // If annotation/cue has a longer text; truncated text to fit number of MAX_LINES in the display
  const [truncatedText, setTruncatedText] = useState('');
  const [hasLongerText, setHasLongerText] = useState(false);
  // State variables to store information related to overflowing tags in the annotation
  const [hasLongerTags, setLongerTags] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);

  /**
   * When there are multiple annotations/cue in the same time range, auto-scroll to
   * the annotation/cue with the start time that is closest to the current time
   * of the player.
   * This allows a better user experience when auto-scroll is enabled during playback, 
   * and there are multiple annotations/cue that falls within the same time range.
   */
  useEffect(() => {
    inPlayerRange ? setIsActive(true) : setIsActive(false);
    if (autoScrollEnabled && inPlayerRange) {
      autoScroll(annotationRef.current, containerRef, true);
    }
  }, [inPlayerRange]);

  /**
   * Truncate annotation/cue text based on the width of the element on the page.
   * Use a ResizeObserver to re-calculate truncated texts based on Annotations/Transcripts
   * container re-size events
   */
  useEffect(() => {
    const textBlock = annotationTextsRef.current;
    let canvas, observer;
    const calcTruncatedText = () => {
      if (textBlock && texts?.length > 0) {
        const textBlockWidth = textBlock.clientWidth;
        const fontSize = parseFloat(getComputedStyle(textBlock).fontSize);
        if (!isNaN(fontSize)) {
          // Create a temporary canvas element to measure average character width
          canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          context.font = getComputedStyle(textBlock).font;

          // Calculate average character width based on the specified font in CSS
          const textWidth = context.measureText(texts).width;
          const avgCharWidth = textWidth / texts.length;

          // Calculate maximum number of characters that can be shown on avg character width
          const charsPerLine = textBlockWidth / avgCharWidth;

          /**
           * To account for spaces at the end of line breaks, calculate max character for
           * half a line width less than given MAX_LINES count
           */
          const maxCharactersToShow = charsPerLine * (MAX_LINES - 1)
            + Math.floor(charsPerLine / 2);

          let elementText = texts;

          /**
           * When texts has line breaks with shorter text in each line, pad each shorter line 
           * until the length of it reaches the calculated charsPerLine number
           */
          if (texts.includes('<br>')) {
            const lines = texts.split('<br>');
            let paddedText = [];
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.length < charsPerLine) {
                // Account for the space for <br> for line breaks
                const maxLineLength = charsPerLine > 4 ? charsPerLine - 4 : 0;
                paddedText.push(line.padEnd(maxLineLength));
              } else {
                // Do nothing if text length is longer than charsPerLine
                paddedText.push(line);
              }
            }
            elementText = paddedText.join('<br>');
          }

          // Truncate text if the text is longer than max character count
          const { truncated, isTruncated } = truncateText(elementText, maxCharactersToShow);
          if (isTruncated) {
            setTextToShow(truncated);
            setTruncatedText(truncated);
            setIsShowMoreRef(true);
            setHasLongerText(true);
          } else {
            setTextToShow(elementText);
            setHasLongerText(false);
          }
        }
      }
    };

    // Only truncate text if `enableShowMore` is turned ON
    if (enableShowMore) {
      // Create a ResizeObserver to truncate the text as the container re-sizes
      observer = new ResizeObserver(entries => {
        requestAnimationFrame(() => {
          for (let entry of entries) {
            calcTruncatedText();
          }
        });
      });
      if (containerRef.current) observer.observe(containerRef.current);

      // Truncate text on load
      calcTruncatedText();
    } else {
      setTextToShow(texts);
    }

    // Cleanup observer and temp canvas element on component un-mount
    return () => {
      canvas?.remove();
      observer?.disconnect();
    };
  }, [texts]);

  /**
   * Hide annotation tags when they overflow the width of the annotation 
   * container on the page
   */
  useEffect(() => {
    let observer;
    // When tags are present use ResizeObserver to display show more/less button
    if (tags) {
      /**
       * Use ResizeObserver to hide/show tags as the annotations component re-sizes. 
       * Using it along with 'requestAnimationFrame' optimizes the animation
       * when container is contunuously being re-sized.
       */
      observer = new ResizeObserver(entries => {
        requestAnimationFrame(() => {
          for (let entry of entries) {
            updateTagView(true);
          }
        });
      });
      if (containerRef.current) observer.observe(containerRef.current);

      const updateTagView = (s) => {
        const hasOverflowingTags = toggleTagsView(s);
        // Update state
        setLongerTags(hasOverflowingTags);
        setShowMoreTags(hasOverflowingTags);
      };

      // Hide/show tags on load
      updateTagView(true);
    }

    // Cleanup observer on component un-mount
    return () => {
      observer?.disconnect();
    };
  }, [tags]);

  /**
   * Hide/show tags in the Annotation when the tags overflow the annotation
   * component's width.
   * This function is called in the ResizeObserver, as well as a callback function
   * within the click event handler of the show more/less tags button to re-render 
   * tags as needed.
   * @param {Boolean} hideTags 
   * @returns {Boolean}
   */
  const toggleTagsView = (hideTags) => {
    let hasOverflowingTags = false;
    // Tag UI element for the annotation on the page
    const tagsBlock = annotationTagsRef.current;
    // Times UI element for the cue/annotation on the page
    const timesBlock = annotationTimesRef.current;
    if (tagsBlock && timesBlock && tags?.length > 0) {
      /* Reset the grid-column to its default if it was previously set */
      tagsBlock.style.gridColumn = '';
      const timesBlockWidth = timesBlock?.clientWidth || 0;
      // Available space to render tags for the current annotation
      const availableTagsWidth = tagsBlock.parentElement.clientWidth - timesBlockWidth;
      if (tagsBlock.children?.length > 0) {
        // 20 is an approximate width of the button, since this element gets rendered later
        const moreTagsButtonWidth = moreTagsButtonRef.current?.clientWidth || 20;
        // Reserve space for show more tags button
        let spaceForTags = Math.abs(availableTagsWidth - moreTagsButtonWidth);
        let hasLongerChild = false;
        for (let i = 0; i < tagsBlock.children.length; i++) {
          const child = tagsBlock.children[i];
          // Reset 'hidden' class in each tag
          if (child.classList.contains('hidden')) child.classList.remove('hidden');
          // Check if at least one tag has longer text than the available space
          if (child.clientWidth > availableTagsWidth) hasLongerChild = true;
          if (hideTags && child != moreTagsButtonRef.current) {
            spaceForTags = spaceForTags - child.clientWidth;
            // If the space left is shorter than the width of more tags button, 
            // hide the rest of the tags
            if (spaceForTags < moreTagsButtonWidth) {
              hasOverflowingTags = true;
              child.classList.add('hidden');
            }
          }
        }
        /* Make the tags block span the full width of the time and tags container if 
        there are tags with longer text */
        if (hasLongerChild) {
          tagsBlock.style.gridColumn = '1 / -1';
        }
      }
    }
    return hasOverflowingTags;
  };

  /**
   * Seek the player to the start time of the focused annotation/cue, and mark it as active
   * when using Enter/Space keys to select the focused annotation/cue
   * @param {Event} e keyboard event
   * @returns 
   */
  const handleKeyDown = (e, onClick) => {
    if (e.keyCode == 13 || e.keyCode == 32) {
      onClick(e);
    } else {
      return;
    }
  };

  /**
   * Validate and handle click events on a link in the annotation/cue text
   * @param {Event} e 
   * @returns 
   */
  const handleLinkClicks = (e) => {
    // Handle click on a link in the text in the same tab without seeking the player
    if (e.target.tagName == 'A') {
      // Check if the href value is a valid URL before navigation
      const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
      const href = e.target.getAttribute('href');
      if (!href?.match(urlRegex)) {
        e.preventDefault();
      } else {
        window.open(e.target.href, '_self');
        return;
      }
    }
  };

  /**
   * Click event handler for the 'Show more'/'Show less' button for
   * each annotation/cue text.
   */
  const handleShowMoreLessClick = (isShowMore, setIsShowMoreRef) => {
    if (!isShowMore) {
      setTextToShow(truncatedText);
      // Scroll to the top of the annotation/cue when 'Show less' button is clicked
      autoScroll(annotationRef.current, containerRef, true);
    } else {
      setTextToShow(texts);
    }
    setIsShowMoreRef(!isShowMore);
  };

  /**
   * Keydown event handler for show more/less button in the annotation/cue text
   * @param {Event} e keydown event
   */
  const handleShowMoreLessKeydown = (e, isShowMore, setIsShowMoreRef) => {
    if (e.key == 'Enter' || e.key == ' ') {
      e.preventDefault();
      handleShowMoreLessClick(isShowMore, setIsShowMoreRef);
    }
  };

  /**
   * Keydown event handler for links within annotation/cue texts
   * @param {Event} e 
   */
  const handleLinkKeyDown = (e) => {
    if (e.key == 'Enter' || e.key == ' ') {
      e.preventDefault();
      handleLinkClicks(e);
    }
  };

  return {
    handleKeyDown,
    handleLinkClicks,
    handleLinkKeyDown,
    handleShowMoreLessClick,
    handleShowMoreLessKeydown,
    hasLongerTags,
    hasLongerText,
    setShowMoreTags,
    showMoreTags,
    setTextToShow,
    textToShow,
    toggleTagsView,
    truncatedText
  };
};
