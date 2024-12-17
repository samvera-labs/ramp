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
import { parseTranscriptData, readSupplementingAnnotations, sanitizeTranscripts, TRANSCRIPT_TYPES } from './transcript-parser';
import { CANVAS_MESSAGE_TIMEOUT, checkSrcRange, getMediaFragment, HOTKEY_ACTION_OUTPUT, playerHotKeys } from '@Services/utility-helpers';
import { getMediaInfo } from '@Services/iiif-parser';
import videojs from 'video.js';

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

  // Deduct 1 from length to compare against canvasIndex, which starts from 0
  const lastCanvasIndex = useMemo(() => { return allCanvases?.length - 1 ?? 0; },
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

  return {
    canvasIndex,
    canvasIsEmpty,
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

    // Video.js player is only initialized on initial page load
    if (!playerRef.current && options.sources?.length > 0) {
      videojs.addLanguage(options.language, JSON.parse(videoJSLangMap));

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
  }, [options.sources, videoJSRef]);

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
      if (playlist?.markers?.length) {
        const canvasMarkers = playlist.markers
          .filter((m) => m.canvasIndex === canvasIndex)[0].canvasMarkers;
        playlistMarkers = canvasMarkers.map((m) => ({
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
    isReady
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
      player.trigger('resize');
    });

    /**
     * The 'resize' event on window doesn't catch zoom in/out in iOS Safari.
     * Therefore, use window.visualViewport to detect zoom in/out in mobile browsers when
     * zoomed in/out using OS/browser settings.
     */
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        player.trigger('resize');
      });
    }
  };

  /**
   * Update global state only when a user pause the player by using the
   * player interface or keyboard shortcuts
   */
  const handlePause = (isPlaying) => {
    playerDispatch({ isPlaying, type: 'setPlayingStatus' });
  };

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
 * @param {Boolean} obj.isCanvas
 * @param {Number} obj.canvasDuration
 * @param {Function} obj.setSectionIsCollapsed
 * @returns { 
 * canvasIndex,
 * currentNavItem,
 * handleClick,
 * isActiveLi,
 * isActiveSection,
 * isPlaylist
 * }
 */
export const useActiveStructure = ({
  itemIndex,
  isRoot,
  itemId,
  liRef,
  sectionRef,
  isCanvas,
  canvasDuration,
  setSectionIsCollapsed,
}) => {
  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const { canvasIndex, currentNavItem, playlist } = manifestState;
  const { isPlaylist } = playlist;
  const playerState = useContext(PlayerStateContext);
  const { isPlaying } = playerState;

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
      // Expand the section by setting sectionIsCollapsed=false in SectionHeading
      setSectionIsCollapsed(false);
      return true;
    } else {
      return false;
    }
  }, [canvasIndex, isPlaying]);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const { start, end } = getMediaFragment(itemId, canvasDuration);
    const inRange = checkSrcRange({ start, end }, { end: canvasDuration });
    /* 
      Only continue the click action if not both start and end times of 
      the timespan are not outside Canvas' duration
    */
    if (inRange) {
      playerDispatch({ clickedUrl: itemId, type: 'navClick' });
      liRef.current.isClicked = true;
      if (sectionRef.current) {
        sectionRef.current.isClicked = true;
      }
    }
  });

  return {
    canvasIndex,
    currentNavItem,
    handleClick,
    isActiveLi,
    isActiveSection,
    isPlaylist
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
    updateSectionStatus(canvasIndex, false);
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
 * @param {Array} obj.transcripts
 * @returns {
 * canvasIndexRef,
 * canvasTranscripts,
 * isEmpty,
 * isLoading,
 * NO_SUPPORT_MSG,
 * playerRef,
 * selectedTranscript,
 * selectTranscript,
 * transcript,
 * transcriptInfo
 * }
 */
export const useTranscripts = ({
  manifestUrl,
  playerID,
  setCurrentTime,
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
  const [selectedTranscript, setSelectedTranscript] = useState();

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
    if (playerRef.current) {
      playerRef.current.on('timeupdate', () => {
        setCurrentTime(playerRef.current.currentTime());
      });
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
    } else {
      loadTranscripts(transcripts);
    }

    // Clean up state when the component unmounts
    return () => {
      clearInterval(playerIntervalRef.current);
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
      : await readSupplementingAnnotations(manifestUrl);
    setTranscriptsList(allTranscripts ?? []);
    initTranscriptData(allTranscripts ?? []);
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
      setCanvasTranscripts(cTranscripts.items);
      setStateVar(cTranscripts.items[0]);
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

    const { id, title, filename, url, isMachineGen, format } = transcript;

    // Check cached transcript data
    const cached = cachedTranscripts.filter(
      ct => ct.id == id && ct.canvasId == canvasIndexRef.current
    );
    if (cached?.length > 0) {
      // Load cached transcript data into the component
      const { tData, tFileExt, tType, tError } = cached[0];
      setTranscript(tData);
      setTranscriptInfo({ title, filename, id, isMachineGen, tType, tUrl: url, tFileExt, tError });
      setSelectedTranscript(url);
    } else {
      // Parse new transcript data from the given sources
      await Promise.resolve(
        parseTranscriptData(url, format, canvasIndexRef.current)
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
          setSelectedTranscript(tUrl);
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
