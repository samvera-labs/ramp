import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { TRANSCRIPT_TYPES, TRANSCRIPT_CUE_TYPES } from '@Services/transcript-parser';
import TranscriptMenu from './TranscriptMenu/TranscriptMenu';
import {
  useFilteredTranscripts,
  useFocusedMatch,
  useSearchOpts,
  useSearchCounts
} from '@Services/search';
import { useTranscripts } from '@Services/ramp-hooks';
import { autoScroll, timeToHHmmss } from '@Services/utility-helpers';
import Spinner from '@Components/Spinner';
import './Transcript.scss';

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

const TranscriptLine = memo(({
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
  const itemRef = useRef(null);
  const isFocused = item.id === focusedMatchId;
  const wasFocusedRef = useRef(isFocused);
  const wasActiveRef = useRef(isActive);
  // React ref to store previous focusedMatchIndex
  const prevFocusedIndexRef = useRef(-1);
  // React ref to store previous focusedMatchId
  const prevFocusedIdRef = useRef(-1);
  // React ref to iterate through multiple hits within a focused cue
  const activeRelativeCountRef = useRef(0);

  useEffect(() => {
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
  useEffect(() => {
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
          autoScroll(currentHighlight, transcriptContainerRef, true);
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
    } else if (focusedMatchId !== null && item.tag === TRANSCRIPT_CUE_TYPES.timedCue) {
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
      <p className="ramp--transcript_untimed_item"
        dangerouslySetInnerHTML={{ __html: buildSpeakerText(item, isNonTimedText) }}>
      </p>

    </a>;
  } else {
    return null;
  }
});

const TranscriptList = memo(({
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
  const [manuallyActivatedItemId, setManuallyActivatedItem] = useState(null);
  const goToItem = useCallback((item) => {
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

  if (transcriptInfo.tError) {
    return (
      <p key="no-transcript" id="no-transcript" data-testid="no-transcript" role="listitem">
        {transcriptInfo.tError}
      </p>
    );
  } else if (!searchResults.results || searchResults.results.length === 0) {
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
});

/**
 * Parse and display transcript content for the current Canvas.
 * @param {Object} props
 * @param {String} props.playerID
 * @param {String} props.manifestUrl
 * @param {Boolean} props.showNotes
 * @param {Object} props.showNotes
 * @param {Object} props.search
 * @param {Array} props.transcripts
 */
const Transcript = ({ playerID, manifestUrl, showNotes = false, search = {}, transcripts = [] }) => {
  const [currentTime, _setCurrentTime] = useState(-1);
  const setCurrentTime = useMemo(() => throttle(_setCurrentTime, 50), []);

  // Read and parse transcript(s) as state changes
  const {
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
  } = useTranscripts({ manifestUrl, playerID, setCurrentTime, transcripts });

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
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const searchResults =
    useFilteredTranscripts({
      ...searchOpts,
      query: searchQuery,
      transcripts: transcript,
      canvasIndex: canvasIndexRef.current,
      selectedTranscript: selectedTranscript,
    });

  const {
    focusedMatchId,
    setFocusedMatchId,
    focusedMatchIndex,
    setFocusedMatchIndex
  } = useFocusedMatch({ searchResults });

  const tanscriptHitCounts = useSearchCounts({ searchResults, canvasTranscripts, searchQuery });

  const [_autoScrollEnabled, _setAutoScrollEnabled] = useState(true);
  const autoScrollEnabledRef = useRef(_autoScrollEnabled);
  const setAutoScrollEnabled = (a) => {
    autoScrollEnabledRef.current = a;
    _setAutoScrollEnabled(a); // force re-render
  };

  const transcriptContainerRef = useRef();

  const seekPlayer = useCallback((time) => {
    setCurrentTime(time); // so selecting an item works in tests
    if (playerRef.current) playerRef.current.currentTime(time);
  }, []);

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
            noTranscript={transcriptInfo.tError?.length > 0 && transcriptInfo.tError != NO_SUPPORT_MSG}
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
          className={cx('transcript_content', transcript ? '' : 'static')}
          data-testid={`transcript_content_${transcriptInfo.tType}`}
          role="list"
          tabIndex={0}
          aria-label="Attached Transcript content"
          ref={transcriptContainerRef}
        >
          <TranscriptList
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
