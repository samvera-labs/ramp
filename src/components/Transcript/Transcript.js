import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import {
  readSupplementingAnnotations,
  parseTranscriptData,
  sanitizeTranscripts,
  TRANSCRIPT_TYPES,
  TRANSCRIPT_CUE_TYPES,
} from '@Services/transcript-parser';
import TranscriptMenu from './TranscriptMenu/TranscriptMenu';
import { useFilteredTranscripts, useFocusedMatch, useSearchOpts, useSearchCounts } from '@Services/search';
import { autoScroll, timeToHHmmss } from '@Services/utility-helpers';
import './Transcript.scss';

const NO_TRANSCRIPTS_MSG = 'No valid Transcript(s) found, please check again.';
const INVALID_URL_MSG = 'Invalid URL for transcript, please check again.';
const INVALID_VTT = 'Invalid WebVTT file, please check again.';
const INVALID_TIMESTAMP = 'Invalid timestamp format in cue(s), please check again.';
const NO_SUPPORT = 'Transcript format is not supported, please check again.';

const buildSpeakerText = (item, isDocx = false) => {
  let text = isDocx ? item.textDisplayed : item.text;
  if (item.match) {
    text = item.match;
  }
  if (item.speaker) {
    return `<u>${item.speaker}:</u> ${text}`;
  } else {
    return text;
  }
};

const TranscriptLine = ({
  item,
  goToItem,
  isActive,
  focusedMatchId,
  setFocusedMatchId,
  autoScrollEnabled,
  showNotes,
  transcriptContainerRef,
  isNonTimedText,
  focusedMatchIndex,
}) => {
  const itemRef = React.useRef(null);
  const isFocused = item.id === focusedMatchId;
  const wasFocusedRef = React.useRef(isFocused);
  const wasActiveRef = React.useRef(isActive);
  // React ref to store previous focusedMatchIndex
  const prevFocusedIndexRef = React.useRef(-1);
  // React ref to store previous focusedMatchId
  const prevFocusedIdRef = React.useRef(-1);
  // React ref to iterate through multiple hits within a focused cue
  const activeRelativeCountRef = React.useRef(0);

  React.useEffect(() => {
    let doScroll = false;
    const prevFocused = prevFocusedIdRef.current;
    if (isActive && !wasActiveRef.current) {
      if (autoScrollEnabled) {
        wasActiveRef.current = true;
        doScroll = true;
      }
    } else {
      wasActiveRef.current = false;
    }
    if (isFocused && !wasFocusedRef.current) {
      wasFocusedRef.current = true;
      doScroll = true;
    } else {
      wasFocusedRef.current = false;
    }
    if (doScroll && itemRef.current) {
      autoScroll(itemRef.current, transcriptContainerRef, true);
    }

    // Update relative count and match id refs within the component when navigating results
    if (prevFocused < focusedMatchId || prevFocused < 0 || !prevFocused) {
      activeRelativeCountRef.current = -1;
    } else {
      activeRelativeCountRef.current = item.matchCount;
    }
    prevFocusedIdRef.current = focusedMatchId;
  }, [autoScrollEnabled, isActive, isFocused, itemRef.current]);

  /**
   * Add a border highlight to the current focused search hit when using search
   * result navigation, when there are multiple hits within a focused cue
   */
  React.useEffect(() => {
    if (itemRef.current && isFocused) {
      // Find all highlights within the focused cue
      const highlights = itemRef.current.querySelectorAll('.ramp--transcript_highlight');
      // Clean classList from previous navigations
      highlights.forEach(h => h.classList.remove('current-hit'));

      // Read previously focused match index
      const prevFocusedIndex = prevFocusedIndexRef.current;
      // Adjust the relative focus index within the focused cue
      activeRelativeCountRef.current = focusedMatchIndex > prevFocusedIndex
        ? activeRelativeCountRef.current + 1
        : activeRelativeCountRef.current <= 0 ? 0 : activeRelativeCountRef.current - 1;

      // If exists add a border to the current focused hit within the cue
      if (activeRelativeCountRef.current > -1) {
        const currentHighlight = highlights[activeRelativeCountRef.current];
        if (currentHighlight != undefined) {
          currentHighlight.classList.add('current-hit');
          autoScroll(currentHighlight, transcriptContainerRef);
        }
      }
      // Update the ref for focused match index in the component
      prevFocusedIndexRef.current = focusedMatchIndex;
    }
  }, [focusedMatchIndex]);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.match && focusedMatchId !== item.id) {
      setFocusedMatchId(item.id);
    } else if (focusedMatchId !== null) {
      autoScroll(itemRef.current, transcriptContainerRef, true);
    }
    goToItem(item);
  };

  if (item.tag === TRANSCRIPT_CUE_TYPES.note && showNotes) {
    return (
      <a
        href="#"
        ref={itemRef}
        role="listitem"
        onClick={onClick}
        className={cx(
          'ramp--transcript_item',
          isActive && 'active',
          isFocused && 'focused'
        )}
        data-testid="transcript_text"
        dangerouslySetInnerHTML={{ __html: buildSpeakerText(item) }}
      >
      </a>
    );
  } else if (item.tag === TRANSCRIPT_CUE_TYPES.timedCue) {
    return (
      <a
        href="#"
        ref={itemRef}
        role="listitem"
        onClick={onClick}
        data-testid="transcript_item"
        className={cx(
          'ramp--transcript_item',
          isActive && 'active',
          isFocused && 'focused'
        )}
      >
        {typeof item.begin === 'number' && (
          <span
            className="ramp--transcript_time"
            data-testid="transcript_time"
          >
            [{timeToHHmmss(item.begin, true)}]
          </span>
        )}
        <span
          className="ramp--transcript_text"
          data-testid="transcript_text"
          dangerouslySetInnerHTML={{ __html: buildSpeakerText(item) }}
        />
      </a>
    );
  } else if (item.tag === TRANSCRIPT_CUE_TYPES.nonTimedLine) {
    return <a
      href="#"
      ref={itemRef}
      role="listitem"
      onClick={onClick}
      className={cx(
        'ramp--transcript_item',
        isActive && 'active',
        isFocused && 'focused'
      )}
      data-testid="transcript_untimed_text">
      <p className="ramp--transcript_untimed_item" dangerouslySetInnerHTML={{ __html: buildSpeakerText(item, isNonTimedText) }}></p>

    </a>;
  } else {
    return null;
  }
};

const Spinner = () => (
  <div className="lds-spinner">
    <div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div>
  </div>
);

const TranscriptList = ({
  isSearchable,
  seekPlayer,
  currentTime,
  searchResults,
  focusedMatchId,
  transcriptInfo,
  setFocusedMatchId,
  autoScrollEnabled,
  showNotes,
  transcriptContainerRef,
  focusedMatchIndex,
}) => {
  const [manuallyActivatedItemId, setManuallyActivatedItem] = React.useState(null);
  const goToItem = React.useCallback((item) => {
    if (typeof item.begin === 'number') {
      seekPlayer(item.begin);
      setManuallyActivatedItem(null);
    } else {
      setManuallyActivatedItem(item.id);
    }
  }, [seekPlayer]);

  let testid;
  switch (transcriptInfo.tType) {
    case TRANSCRIPT_TYPES.plainText:
      testid = 'plain-text';
      break;
    case TRANSCRIPT_TYPES.docx:
      testid = 'docs';
      break;
    case TRANSCRIPT_TYPES.timedText:
      testid = 'timed-text';
    default:
      testid = '';
      break;
  }

  if (isSearchable) {
    if (!searchResults.results || searchResults.results.length === 0) {
      return (
        <Spinner />
      );
    } else {
      return (
        <div
          data-testid={`transcript_${testid}`}
        >
          {
            searchResults.ids.map((itemId) => (
              <TranscriptLine
                key={itemId}
                goToItem={goToItem}
                focusedMatchId={focusedMatchId}
                isActive={
                  manuallyActivatedItemId === itemId
                  || (
                    typeof searchResults.results[itemId].begin === 'number'
                    && searchResults.results[itemId].begin <= currentTime
                    && currentTime <= searchResults.results[itemId].end
                  )
                }
                item={searchResults.results[itemId]}
                autoScrollEnabled={autoScrollEnabled}
                setFocusedMatchId={setFocusedMatchId}
                showNotes={showNotes}
                transcriptContainerRef={transcriptContainerRef}
                isNonTimedText={true}
                focusedMatchIndex={focusedMatchIndex}
              />
            ))
          }
        </div>
      );
    }
  } else {
    return (
      <p key="no-transcript" id="no-transcript" data-testid="no-transcript" role="note">
        {transcriptInfo.tError}
      </p>
    );
  }
};

/**
 *
 * @param {String} param0 ID of the HTML element for the player on page
 * @param {String} param1 manifest URL to read transcripts from
 * @param {Object} param2 transcripts resource
 * @returns
 */
const Transcript = ({ playerID, manifestUrl, showNotes = false, search = {}, transcripts = [] }) => {
  const [transcriptsList, setTranscriptsList] = React.useState([]);
  const [canvasTranscripts, setCanvasTranscripts] = React.useState([]);
  const [transcript, setTranscript] = React.useState([]);
  const [transcriptInfo, setTranscriptInfo] = React.useState({
    title: null,
    filename: null,
    id: null,
    tUrl: null,
    tType: null,
    tFileExt: null,
    isMachineGen: false,
    tError: null,
  });
  const [selectedTranscript, setSelectedTranscript] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  // Store transcript data in state to avoid re-requesting file contents
  const [cachedTranscripts, setCachedTranscripts] = React.useState([]);

  /* 
    Enable search only for timed text as it is only working for these transcripts
    TODO:: remove 'isSearchable' if/when search is supported for other formats
   */
  const { initialSearchQuery, ...searchOpts } = useSearchOpts({
    ...search,
    isSearchable: transcriptInfo.tType === TRANSCRIPT_TYPES.timedText
      || transcriptInfo.tType === TRANSCRIPT_TYPES.docx
      || transcriptInfo.tType === TRANSCRIPT_TYPES.plainText,
    showMarkers: transcriptInfo.tType === TRANSCRIPT_TYPES.timedText
  });
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery);

  const [_canvasIndex, _setCanvasIndex] = React.useState(-1);
  const canvasIndexRef = React.useRef(_canvasIndex);
  const setCanvasIndex = (c) => {
    abortController.abort();
    canvasIndexRef.current = c;
    _setCanvasIndex(c); // force re-render
  };

  const searchResults = useFilteredTranscripts({
    ...searchOpts,
    query: searchQuery,
    transcripts: transcript,
    canvasIndex: canvasIndexRef.current,
    selectedTranscript: selectedTranscript,
  });

  const { focusedMatchId, setFocusedMatchId, focusedMatchIndex, setFocusedMatchIndex } = useFocusedMatch({ searchResults });

  const tanscriptHitCounts = useSearchCounts({ searchResults, canvasTranscripts, searchQuery });

  const [isEmpty, setIsEmpty] = React.useState(true);
  const [_autoScrollEnabled, _setAutoScrollEnabled] = React.useState(true);
  const autoScrollEnabledRef = React.useRef(_autoScrollEnabled);
  const setAutoScrollEnabled = (a) => {
    autoScrollEnabledRef.current = a;
    _setAutoScrollEnabled(a); // force re-render
  };

  const abortController = new AbortController();

  const playerIntervalRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const transcriptContainerRef = React.useRef();

  const [currentTime, _setCurrentTime] = React.useState(-1);
  const setCurrentTime = React.useMemo(() => throttle(_setCurrentTime, 50), []);

  const seekPlayer = React.useCallback((time) => {
    setCurrentTime(time); // so selecting an item works in tests
    if (playerRef.current) playerRef.current.currentTime = time;
  }, []);

  /**
   * Start an interval at the start of the component to poll the
   * canvasindex attribute changes in the player on the page
   */
  React.useEffect(() => {
    playerIntervalRef.current = setInterval(() => {
      const domPlayer = document.getElementById(playerID);
      if (!domPlayer) {
        console.error(
          "Cannot find player, '" +
          playerID +
          "' on page. Transcript synchronization is disabled."
        );
        // Inaccessible canvas => stop loading spinner
        setIsLoading(false);
      } else {
        if (domPlayer.children[0]) playerRef.current = domPlayer.children[0];
        else playerRef.current = domPlayer;
      }

      if (playerRef.current) {
        let cIndex = parseInt(playerRef.current.dataset['canvasindex']);
        if (Number.isNaN(cIndex)) cIndex = 0;
        if (cIndex !== canvasIndexRef.current) {
          // Clear the transcript text in the component
          setTranscript([]);
          setCanvasIndex(cIndex);
          setCurrentTime(playerRef.current.currentTime);

          playerRef.current.addEventListener('timeupdate', () => {
            setCurrentTime(playerRef.current.currentTime);
          });
        }
      }
    }, 500);
  }, []);

  React.useEffect(() => {
    // Clean up state when the component unmounts
    return () => {
      clearInterval(playerIntervalRef.current);
    };
  }, []);

  React.useEffect(async () => {
    let allTranscripts = [];

    if (transcripts?.length === 0 && !manifestUrl) {
      // When both required props are invalid
      setIsLoading(false);
      setTranscript([]);
      setTranscriptInfo({
        tType: TRANSCRIPT_TYPES.noTranscript, id: '',
        tError: NO_TRANSCRIPTS_MSG
      });
    } else {
      allTranscripts = (transcripts?.length > 0)
        // transcripts prop is processed first if given
        ? await sanitizeTranscripts(transcripts)
        // Read supplementing annotations from the given manifest
        : await readSupplementingAnnotations(manifestUrl);

      setTranscriptsList(allTranscripts);
      initTranscriptData(allTranscripts);
    }
  }, [canvasIndexRef.current]); // helps to load initial transcript with async req

  React.useEffect(() => {
    if (transcriptsList?.length > 0 && canvasIndexRef.current != undefined) {
      let cTranscripts = transcriptsList.filter((tr) => tr.canvasId == canvasIndexRef.current)[0];
      setCanvasTranscripts(cTranscripts.items);
      setStateVar(cTranscripts.items[0]);
    }
  }, [canvasIndexRef.current]);

  const initTranscriptData = (allTranscripts) => {
    // When canvasIndex updates -> return
    if (abortController.signal.aborted) return;
    const getCanvasT = (tr) => {
      return tr.filter((t) => t.canvasId == _canvasIndex);
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

  const selectTranscript = React.useCallback((selectedId) => {
    const selectedTranscript = canvasTranscripts.filter((tr) => (
      tr.id === selectedId
    ));
    setStateVar(selectedTranscript[0]);
  }, [canvasTranscripts]);

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
              newError = NO_SUPPORT;
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

  if (!isLoading) {
    return (
      <div
        className="ramp--transcript_nav"
        data-testid="transcript_nav"
        key={transcriptInfo.title}
      >
        {!isEmpty && (
          <TranscriptMenu
            showSearch={searchOpts.enabled}
            selectTranscript={selectTranscript}
            transcriptData={tanscriptHitCounts}
            transcriptInfo={transcriptInfo}
            noTranscript={transcriptInfo.tError?.length > 0 && transcriptInfo.tError != NO_SUPPORT}
            setAutoScrollEnabled={setAutoScrollEnabled}
            setFocusedMatchIndex={setFocusedMatchIndex}
            focusedMatchIndex={focusedMatchIndex}
            autoScrollEnabled={autoScrollEnabledRef.current}
            searchResults={searchResults}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <div
          className={`transcript_content ${transcript ? '' : 'static'}`}
          data-testid={`transcript_content_${transcriptInfo.tType}`}
          role="list"
          aria-label="Attached Transcript content"
          ref={transcriptContainerRef}
        >
          <TranscriptList
            isSearchable={searchOpts.isSearchable}
            currentTime={currentTime}
            seekPlayer={seekPlayer}
            searchResults={searchResults}
            focusedMatchId={focusedMatchId}
            transcriptInfo={transcriptInfo}
            setFocusedMatchId={setFocusedMatchId}
            autoScrollEnabled={autoScrollEnabledRef.current && searchQuery === null}
            showNotes={showNotes}
            transcriptContainerRef={transcriptContainerRef}
            focusedMatchIndex={focusedMatchIndex}
          />
        </div>
      </div>
    );
  } else {
    return (
      <Spinner />
    );
  }
};

Transcript.propTypes = {
  /** `id` attribute of the media player in the DOM */
  playerID: PropTypes.string.isRequired,
  /** URL of the manifest */
  manifestUrl: PropTypes.string,
  showSearch: PropTypes.bool,
  showNotes: PropTypes.bool,
  search: PropTypes.oneOf([PropTypes.bool, PropTypes.shape({
    initialSearchQuery: PropTypes.string,
    showMarkers: PropTypes.bool,
    matcherFactory: PropTypes.func,
    sorter: PropTypes.func,
    matchesOnly: PropTypes.bool
  })]),
  /** A list of transcripts for respective canvases in the manifest */
  transcripts: PropTypes.arrayOf(
    PropTypes.shape({
      /** Index of the canvas in manifest, starts with zero */
      canvasId: PropTypes.number.isRequired,
      /** List of title and URI key value pairs for each individual transcript resource */
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          url: PropTypes.string,
        })
      ),
    })
  ),
};

export default Transcript;
