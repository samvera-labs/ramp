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
import { useShowMoreOrLess, useSyncPlayback, useTranscripts } from '@Services/ramp-hooks';
import { autoScroll, screenReaderFriendlyText, timeToHHmmss } from '@Services/utility-helpers';
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
  isFirstItem,
  focusedMatchId,
  setFocusedMatchId,
  autoScrollEnabled,
  showMoreSettings,
  showNotes,
  transcriptContainerRef,
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
  // React ref to store the text element
  const textRef = useRef(null);
  // React ref to store the time element
  const timeRef = useRef(null);

  const { textLineLimit: MAX_LINES } = showMoreSettings;

  // Only truncate text for timed cues without a search match
  // Reasoning: display full text for a cue with a search match, because the search hit could be in the truncated portion of text
  const enableShowMore = showMoreSettings.enableShowMore && item.tag === TRANSCRIPT_CUE_TYPES.timedCue && item.match == undefined;

  const isShowMoreRef = useRef(true);
  const setIsShowMoreRef = (state) => isShowMoreRef.current = state;

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

    // Handle click on a link in the cue text in the same tab
    if (e.target.tagName == 'A') {
      // Check if the href value is a valid URL before navigation
      const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
      const href = e.target.getAttribute('href');
      if (!href?.match(urlRegex)) {
        e.preventDefault();
      } else {
        window.open(href, '_self');
        return;
      }
    }

    if (item.match && focusedMatchId !== item.id) {
      setFocusedMatchId(item.id);
    } else if (focusedMatchId !== null && item.tag === TRANSCRIPT_CUE_TYPES.timedCue) {
      autoScroll(itemRef.current, transcriptContainerRef, true);
    }
    goToItem(item);
  };

  const cueText = useMemo(() => {
    return buildSpeakerText(item, item.tag === TRANSCRIPT_CUE_TYPES.nonTimedLine);
  }, [item]);

  // Custom hook to handle show more/less
  const {
    handleKeyDown,
    handleLinkClicks,
    handleLinkKeyDown,
    handleShowMoreLessClick,
    handleShowMoreLessKeydown,
    hasLongerText,
    textToShow } = useShowMoreOrLess({
      autoScrollEnabled,
      enableShowMore,
      MAX_LINES,
      refs: {
        annotationRef: itemRef, annotationTagsRef: null, annotationTextsRef: textRef,
        annotationTimesRef: timeRef, containerRef: transcriptContainerRef
      },
      setIsShowMoreRef, setIsActive: setFocusedMatchId, texts: cueText
    });

  // Build text portion of the cue with show more/less when it is enabeld
  const textElement = useMemo(() => (
    <div
      key={`cue_${item.id}`}
      className='ramp--transcript_cue-texts'
      ref={textRef}
    >
      {textToShow?.length > 0 && (
        <p
          key={`cue-text_${item.id}`}
          data-testid={TRANSCRIPT_CUE_TYPES.timedCue && 'transcript_timed_text'}
          className='ramp--transcript_text'
          onClick={handleLinkClicks}
          onKeyDown={handleLinkKeyDown}
          dangerouslySetInnerHTML={{ __html: textToShow }}
        ></p>
      )}
      {(hasLongerText && enableShowMore) &&
        (<button
          key={`cue-show-more_${item.id}`}
          role='button'
          aria-label={isShowMoreRef.current ? 'show more' : 'show less'}
          aria-pressed={isShowMoreRef.current ? 'false' : 'true'}
          className='ramp--transcript__show-more-less'
          data-testid={`transcript-cue-show-more-${item.id}`}
          onClick={() => handleShowMoreLessClick(isShowMoreRef.current, setIsShowMoreRef)}
          onKeyDown={(e) => handleShowMoreLessKeydown(e, isShowMoreRef.current, setIsShowMoreRef)}
        >
          {isShowMoreRef.current ? 'Show more' : 'Show less'}
        </button>)
      }
    </div>
  ), [enableShowMore, textToShow, hasLongerText, showNotes]);

  const testId = useMemo(() => {
    switch (item.tag) {
      case TRANSCRIPT_CUE_TYPES.note:
        return 'transcript_note';
      case TRANSCRIPT_CUE_TYPES.metadata:
        return 'transcript_metadata';
      case TRANSCRIPT_CUE_TYPES.timedCue:
        return 'transcript_item';
      case TRANSCRIPT_CUE_TYPES.nonTimedLine:
        return 'transcript_untimed_text';
      default:
        return null;
    }
  }, [item.tag, showNotes]);

  if (!item.tag) return null;

  return (
    <span
      ref={itemRef}
      className={cx(
        'ramp--transcript_item',
        isActive && 'active',
        isFocused && 'focused',
        item.tag === TRANSCRIPT_CUE_TYPES.nonTimedLine && 'untimed',
        item.tag === TRANSCRIPT_CUE_TYPES.metadata && 'metadata-block'
      )}
      data-testid={testId}
      /* For untimed cues,
       - set tabIndex for keyboard navigation
       - onClick handler to scroll them to top on click
       - set aria-label with full cue text */
      tabIndex={isFirstItem && item.begin == undefined ? 0 : -1}
      onClick={item.begin == undefined ? onClick : null}
      aria-label={item.begin == undefined && screenReaderFriendlyText(cueText)}
    >
      {item.tag === TRANSCRIPT_CUE_TYPES.timedCue && typeof item.begin === 'number' && (
        <span className='ramp--transcript_time' data-testid='transcript_time'
          role='button'
          ref={timeRef}
          onClick={onClick}
          onKeyDown={(e) => handleKeyDown(e, onClick)}
          tabIndex={isFirstItem ? 0 : -1}
          aria-label={`${timeToHHmmss(item.begin, true)}, ${screenReaderFriendlyText(cueText)}`}
        >
          [{timeToHHmmss(item.begin, true)}]
        </span>
      )}
      {textElement}
    </span>
  );
});

const TranscriptList = memo(({
  seekPlayer,
  currentTime,
  searchResults,
  focusedMatchId,
  transcriptInfo,
  setFocusedMatchId,
  autoScrollEnabled,
  showMoreSettings,
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

  const testId = Object.keys(TRANSCRIPT_TYPES)
    .find(key => TRANSCRIPT_TYPES[key] === transcriptInfo.tType);

  // Ref for container of transcript cue elements
  const transcriptListRef = useRef(null);

  /**
   * Get the first non-metadata and non-note item's id for setting up roving tabIndex for 
   * each cue in TranscriptLine component
   */
  const firstItemId = useMemo(() => {
    if (searchResults?.results && Object.values(searchResults.results).length > 0) {
      const firstTimedCue = Object.values(searchResults.results)
        .find(result => result.tag != TRANSCRIPT_CUE_TYPES.metadata && result.tag != TRANSCRIPT_CUE_TYPES.note);
      if (firstTimedCue) {
        return firstTimedCue.id;
      }
    }
    return null;
  }, [searchResults]);

  // Index of the focused cue in the transcript list
  const currentIndex = useRef(0);
  const setCurrentIndex = (i) => currentIndex.current = i;

  /**
   * Handle keyboard accessibility within the transcript component using
   * roving tabindex strategy.
   * To start off all the transcript cue elements' tabIndex is set to -1,
   * except for the first cue, which is set to 0.
   * Then detect 'ArrowDown' and 'ArrowUp' key events to move focus down and
   * up respectively through the cues list.
   * @param {Event} e keyboard event
   */
  const handleKeyDown = (e) => {
    // Get the timestamp for each cue for timed transcript, as these are focusable
    const cueTimes = transcriptListRef.current.querySelectorAll('.ramp--transcript_time');
    // Get the non-empty cues for untimed transcript
    const cueList = Array.from(transcriptListRef.current.children).filter((c) => c.textContent?.length > 0);

    const cueLength = cueTimes?.length || cueList?.length || 0;
    if (cueLength > 0) {
      let nextIndex = currentIndex.current;
      /**
       * Default behavior is prevented (e.preventDefault()) only for the handled 
       * key combinations to allow other keyboard shortcuts to work as expected.
       */
      if (e.key === 'ArrowDown') {
        // Wraps focus back to first cue when the end of transcript is reached
        nextIndex = (currentIndex.current + 1) % cueLength;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        nextIndex = (currentIndex.current - 1 + cueLength) % cueLength;
        e.preventDefault();
      }
      if (nextIndex !== currentIndex.current) {
        if (cueTimes?.length > 0) {
          // Use timestamps of timed cues for navigation
          cueTimes[currentIndex.current].tabIndex = -1;
          cueTimes[nextIndex].tabIndex = 0;
          cueTimes[nextIndex].focus();
          // Scroll the cue into view
          autoScroll(cueTimes[nextIndex], transcriptContainerRef);
        } else if (cueList?.length > 0) {
          // Use whole cues for navigation for untimed cues
          cueList[currentIndex.current].tabIndex = -1;
          cueList[nextIndex].tabIndex = 0;
          cueList[nextIndex].focus();
          // Scroll the cue to the top of container
          autoScroll(cueList[nextIndex], transcriptContainerRef, true);
        }
        setCurrentIndex(nextIndex);
      }
    }
  };

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
        data-testid={`transcript_${testId}`}
        onKeyDown={handleKeyDown}
        ref={transcriptListRef}
        aria-label='Scrollable transcript cues'
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
                  && searchResults.results[itemId].tag !== TRANSCRIPT_CUE_TYPES.note
                  && searchResults.results[itemId].tag !== TRANSCRIPT_CUE_TYPES.metadata
                  && searchResults.results[itemId].begin <= currentTime
                  && currentTime <= searchResults.results[itemId].end
                )
              }
              item={searchResults.results[itemId]}
              isFirstItem={firstItemId === itemId}
              autoScrollEnabled={autoScrollEnabled}
              setFocusedMatchId={setFocusedMatchId}
              showNotes={showNotes}
              showMoreSettings={showMoreSettings}
              transcriptContainerRef={transcriptContainerRef}
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
 * @param {Boolean} props.showMetadata
 * @param {Boolean} props.showNotes
 * @param {Object} props.showMoreSettings
 * @param {Object} props.search
 * @param {Array} props.transcripts
 */
const Transcript = ({ playerID, manifestUrl, showMetadata = false, showNotes = false, showMoreSettings = {}, search = {}, transcripts = [] }) => {
  const [currentTime, _setCurrentTime] = useState(-1);
  const setCurrentTime = useMemo(() => throttle(_setCurrentTime, 50), []);

  // Default showMoreSettings
  const defaultShowMoreSettings = { enableShowMore: false, textLineLimit: 6 };

  // Fill in missing properties, e.g. if prop only set to { enableShowMore: true }
  showMoreSettings = { ...defaultShowMoreSettings, ...showMoreSettings, };

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
  } = useTranscripts({ manifestUrl, playerID, setCurrentTime, showMetadata, showNotes, transcripts });

  const { syncPlayback } = useSyncPlayback({ enableTimeupdate: true, playerRef, setCurrentTime });

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
      canvasTranscripts: canvasTranscripts,
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
    syncPlayback(time);
  }, []);

  if (!isLoading) {
    return (
      <div
        className="ramp--transcript_nav"
        data-testid="transcript_nav"
        key={transcriptInfo.title}
        role='complementary'
        aria-label='transcript display'
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
          aria-label="Attached Transcript content"
          ref={transcriptContainerRef}
          tabIndex={-1}
        >
          <TranscriptList
            currentTime={currentTime}
            seekPlayer={seekPlayer}
            searchResults={searchResults}
            focusedMatchId={focusedMatchId}
            transcriptInfo={transcriptInfo}
            setFocusedMatchId={setFocusedMatchId}
            autoScrollEnabled={autoScrollEnabledRef.current && searchQuery === null}
            showMoreSettings={showMoreSettings}
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
  showMetadata: PropTypes.bool,
  showNotes: PropTypes.bool,
  showMoreSettings: PropTypes.shape({
    enableShowMore: PropTypes.bool,
    textLineLimit: PropTypes.number
  }),
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
