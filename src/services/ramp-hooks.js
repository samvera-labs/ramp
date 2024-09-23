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
import { CANVAS_MESSAGE_TIMEOUT, checkSrcRange, getMediaFragment } from '@Services/utility-helpers';
import { getMediaInfo } from '@Services/iiif-parser';

/**
 * Disable each marker when one of the markers in the table
 * is being edited reading isEditing value from global
 * state
 * @returns { isDisabled: bool }
 */
export const useMarkers = () => {
  const manifestState = useContext(ManifestStateContext);
  const { isEditing } = manifestState.playlist;

  const isDisabled = useMemo(() => {
    return isEditing;
  }, [isEditing]);

  return { isDisabled };
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

  const playerRef = useRef(null);
  playerRef.current = useMemo(() => { return player; }, [player]);

  // Deduct 1 from length to compare against canvasIndex, which starts from 0
  const lastCanvasIndex = useMemo(() => { return allCanvases?.length - 1 ?? 0; },
    [allCanvases]);
  const isMultiCanvased = useMemo(() => { return allCanvases?.length - 1 > 0 ? true : false; },
    [allCanvases]);

  // Wrapper function to get player's time for creating a new playlist marker
  const getCurrentTime = useCallback(() => {
    if (playerRef.current) {
      return playerRef.current.currentTime();
    } else {
      return 0;
    }
  }, [playerRef.current]);

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
 * 
 * @param {Object} obj
 * @param {Boolean} obj.enableFileDownload
 * @param {Boolean} obj.withCredentials
 * @returns  {
 * isMultiSourced: bool,
 * isVideo: bool,
 * playerConfig: obj,
 * ready: bool,
 * renderingFiles: array,
 * switchPlayer: func
 * }
 */
export const useSetupPlayer = ({
  enableFileDownload = false,
  withCredentials = false,
  lastCanvasIndex
}) => {
  const manifestDispatch = useContext(ManifestDispatchContext);
  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const {
    allCanvases,
    autoAdvance,
    canvasIndex,
    customStart,
    manifest,
    playlist,
    renderings,
    srcIndex
  } = manifestState;
  const { isPlaylist } = playlist;

  const {
    clearDisplayTimeInterval, createDisplayTimeInterval
  } = useShowInaccessibleMessage({ lastCanvasIndex });

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
    clearDisplayTimeInterval();
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
    if (!currentCanvas.isEmpty) {
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
      // Create timer to display the message when autoadvance is ON
      if (autoAdvance) {
        createDisplayTimeInterval();
      }
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
  const switchPlayer = (index, fromStart, focusElement = '') => {
    if (index != undefined && index > -1 && index <= lastCanvasIndex) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas',
      });
      initCanvas(index, fromStart);
      playerDispatch({ element: focusElement, type: 'setPlayerFocusElement' });
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
    manifestDispatch({
      srcIndex: srcindex,
      type: 'setSrcIndex',
    });
  };

  return {
    isMultiSourced,
    isVideo,
    playerConfig,
    ready,
    renderingFiles,
    nextItemClicked,
    switchPlayer,
  };
};

export const useVideoJSPlayer = () => {
  const playerState = useContext(PlayerStateContext);
  const { currentTime, isClicked, player } = playerState;

  const [isReady, setIsReady] = React.useState(false);

  // Dispose Video.js instance when VideoJSPlayer component is removed
  useEffect(() => {
    return () => {
      if (player) {
        player.dispose();
        document.removeEventListener('keydown', playerHotKeys);
        setIsReady(false);
      }
    };
  }, []);

  /**
   * Setting the current time of the player when using structure navigation
   */
  useEffect(() => {
    if (player && isReady) {
      player.currentTime(currentTime, playerDispatch({ type: 'resetClick' }));
    }
  }, [isClicked, isReady]);


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

  let canvasIndexRef = useRef();
  canvasIndexRef.current = useMemo(() => { return canvasIndex; }, [canvasIndex]);

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
        if (canvasIndexRef.current < lastCanvasIndex && autoAdvance) {
          manifestDispatch({
            canvasIndex: canvasIndexRef.current + 1,
            type: 'switchCanvas',
          });
        }
        clearDisplayTimeInterval();
      }
    }, 1000);
  }, []);

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
 * @param {Function} obj.setIsOpen
 * @returns 
 */
export const useActiveStructure = ({
  itemIndex,
  isRoot,
  itemId,
  liRef,
  sectionRef,
  isCanvas,
  canvasDuration,
  setIsOpen,
}) => {
  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);
  const { canvasIndex, currentNavItem, playlist } = manifestState;
  const { isPlaylist } = playlist;

  const isActiveLi = useMemo(() => {
    return (itemId != undefined && (currentNavItem?.id === itemId)
      && (isPlaylist || !isCanvas) && currentNavItem?.canvasIndex === canvasIndex + 1)
      ? true : false;
  }, [currentNavItem, canvasIndex]);

  const isActiveSection = useMemo(() => {
    const isCurrentSection = canvasIndex + 1 === itemIndex;
    // Do not mark root range as active
    if (isCurrentSection && !isRoot) {
      // Collapse the section in structured navigation
      setIsOpen(true);
      return true;
    } else {
      return false;
    }
  }, [canvasIndex]);

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

  return { isActiveSection, isActiveLi, handleClick, canvasIndex, currentNavItem, isPlaylist };
};

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
        parseTranscriptData(url, canvasIndexRef.current, format)
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
