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

/**
 * Disable each marker when one of the markers in the table
 * is being edited reading isEditing value from global
 * state
 * @returns { isDisabled: Boolean }
 */
export const useMarkers = () => {
  const manifestState = useContext(ManifestStateContext);
  const { isEditing } = manifestState.playlist;

  const isDisabled = useMemo(() => {
    return isEditing;
  }, [isEditing]);

  return { isDisabled };
};

export const useMediaPlayer = () => {
  const manifestState = useContext(ManifestStateContext);
  const manifestDispatch = useContext(ManifestDispatchContext);
  const playerState = useContext(PlayerStateContext);

  let player;
  if (playerState) {
    player = playerState.player;
  }

  const playerRef = useRef();
  playerRef.current = useMemo(() => { return player; }, [player]);

  const getCurrentTime = useCallback(() => {
    if (playerRef.current) {
      return playerRef.current.currentTime();
    } else {
      return 0;
    }
  }, [playerRef.current]);

  const {
    allCanvases, autoAdvance, canvasIndex, canvasIsEmpty, manifest,
  } = manifestState;

  const [isMultiCanvased, setIsMultiCanvased] = useState(false);
  const [lastCanvasIndex, setLastCanvasIndex] = useState(0);

  let canvasMessageTimerRef = useRef(null);
  const autoAdvanceRef = useRef();
  autoAdvanceRef.current = autoAdvance;

  useEffect(() => {
    // Deduct 1 from length to compare against canvasIndex, which starts from 0
    const lastIndex = allCanvases?.length - 1;
    setIsMultiCanvased(lastIndex > 0);
    setLastCanvasIndex(lastIndex || 0);
  }, [manifest, canvasIndex]);

  useEffect(() => {
    if (canvasIsEmpty) {
      // Clear the existing timer when the autoplay is turned off when displaying
      // inaccessible message
      if (!autoAdvanceRef.current) {
        clearCanvasMessageTimer();
      } else {
        // Create a timer to advance to the next Canvas when autoplay is turned
        // on when inaccessible message is been displayed
        createCanvasMessageTimer();
      }
    }
  }, [autoAdvanceRef.current, canvasIsEmpty]);

  /**
   * Create timer to display the inaccessible Canvas message
   */
  const createCanvasMessageTimer = useCallback(() => {
    canvasMessageTimerRef.current = setTimeout(() => {
      if (canvasIndex < lastCanvasIndex && autoAdvanceRef.current) {
        manifestDispatch({
          canvasIndex: canvasIndex + 1,
          type: 'switchCanvas',
        });
      }
    }, CANVAS_MESSAGE_TIMEOUT);
  });

  /**
   * Clear existing timer to display the inaccessible Canvas message
   */
  const clearCanvasMessageTimer = useCallback(() => {
    if (canvasMessageTimerRef.current) {
      clearTimeout(canvasMessageTimerRef.current);
      canvasMessageTimerRef.current = null;
    }
  });

  return {
    isMultiCanvased, lastCanvasIndex, canvasIndex,
    createCanvasMessageTimer, clearCanvasMessageTimer,
    getCurrentTime, player
  };
};

export const useVideoJSPlayer = () => {
  const manifestState = useContext(ManifestStateContext);

  const {
    autoAdvance,
    canvasIndex,
    canvasIsEmpty,
  } = manifestState;

  const autoAdvanceRef = useRef();
  autoAdvanceRef.current = autoAdvance;

  const [messageTime, setMessageTime] = useState(CANVAS_MESSAGE_TIMEOUT / 1000);

  let messageIntervalRef = useRef(null);

  useEffect(() => {
    // Clear existing interval for inaccessible message display
    clearDisplayTimeInterval();

    if (canvasIsEmpty && !messageIntervalRef.current) {
      setMessageTime(CANVAS_MESSAGE_TIMEOUT / 1000);
      createDisplayTimeInterval();
    }
  }, [canvasIndex, canvasIsEmpty]);

  useEffect(() => {
    if (!autoAdvanceRef.current) {
      clearDisplayTimeInterval();
    } else if (autoAdvanceRef.current && !messageIntervalRef.current && canvasIsEmpty) {
      setMessageTime(CANVAS_MESSAGE_TIMEOUT / 1000);
      createDisplayTimeInterval();
    }
  }, [autoAdvanceRef.current]);

  /**
   * Create an interval to run every second to update display for the timer
   * for inaccessible canvas message display. Using useCallback to cache the
   * function as this doesn't need to change with component re-renders
   */
  const createDisplayTimeInterval = useCallback(() => {
    if (!autoAdvanceRef.current) return;
    const createTime = new Date().getTime();
    messageIntervalRef.current = setInterval(() => {
      let now = new Date().getTime();
      let timeRemaining = (CANVAS_MESSAGE_TIMEOUT - (now - createTime)) / 1000;
      if (timeRemaining > 0) {
        setMessageTime(Math.ceil(timeRemaining));
      } else {
        clearDisplayTimeInterval();
      }
    }, 1000);
  }, []);

  /**
   * Cleanup interval created for timer display for inaccessible message
   */
  const clearDisplayTimeInterval = useCallback(() => {
    clearInterval(messageIntervalRef.current);
    messageIntervalRef.current = null;
  });

  return { messageTime };
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
