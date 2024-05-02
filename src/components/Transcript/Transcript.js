import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { timeToHHmmss } from '@Services/utility-helpers';
import {
  readSupplementingAnnotations,
  parseTranscriptData,
  sanitizeTranscripts,
  TRANSCRIPT_TYPES,
  TRANSCRIPT_CUE_TYPES,
} from '@Services/transcript-parser';
import TranscriptMenu from './TranscriptMenu/TranscriptMenu';
import { useFilteredTranscripts } from '../../services/search';
import './Transcript.scss';

const NO_TRANSCRIPTS_MSG = 'No valid Transcript(s) found, please check again.';
const INVALID_URL_MSG = 'Invalid URL for transcript, please check again.';
const INVALID_VTT = 'Invalid WebVTT file, please check again.';
const NO_SUPPORT = 'Transcript format is not supported, please check again.';

const buildSpeakerText = (item) => {
  let text = item.text;
  if (item.match) {
    text = item.match.reduce((acc, match, i) => {
      if (i % 2 === 0) {
        acc += match;
      } else {
        acc += `<span class="ramp--transcript_highlight">${match}</span>`;
      }
      return acc;
    }, '');
  }
  if (item.speaker) {
    return `<u>${item.speaker}:</u> ${text}`;
  } else {
    return text;
  }
};

const TranscriptLine = ({
  item,
  seekPlayer,
  currentTime,
  focusedMatchId,
  setFocusedMatchId,
  autoScrollEnabled
}) => {
  const itemRef = React.useRef(null);
  const isFocused = item.id === focusedMatchId;
  const isActive = item.begin <= currentTime && currentTime <= item.end;
  const wasFocusedRef = React.useRef(isFocused);
  const wasActiveRef = React.useRef(isActive);

  React.useEffect(() => {
    let doScroll = false;
    if (isActive && !wasActiveRef.current) {
      wasActiveRef.current = true;
      if (autoScrollEnabled) {
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
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [autoScrollEnabled, isActive, isFocused, itemRef.current]);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.match && focusedMatchId !== item.id) {
      setFocusedMatchId(item.id);
    } else if (focusedMatchId !== null) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    seekPlayer(item.begin);
  };

  if (item.tag === TRANSCRIPT_CUE_TYPES.note) {
    return (
      <span
        className="ramp--transcript_text"
        data-testid="transcript_text"
        dangerouslySetInnerHTML={{ __html: buildSpeakerText(item) }}
      >
      </span>
    );
  } else if (item.tag === TRANSCRIPT_CUE_TYPES.timedCue) {
    return (
      <a
        className={cx(
          'ramp--transcript_item',
          isActive && 'active',
          isFocused && 'focused'
        )}
        data-testid="transcript_item"
        ref={itemRef}
        onClick={onClick}
        href={'#'}
        role="listitem"
      >
        {item.begin && (
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
  seekPlayer,
  transcript,
  currentTime,
  searchResults,
  focusedMatchId,
  transcriptInfo,
  setFocusedMatchId,
  autoScrollEnabled
}) => {
  if (transcriptInfo.tType === TRANSCRIPT_TYPES.docx) {
    return (
      <div
        data-testid="transcript_docs"
        dangerouslySetInnerHTML={{ __html: transcript[0] }}
      />
    );
  } else if (transcriptInfo.tType === TRANSCRIPT_TYPES.timedText) {
    if (!searchResults.results || searchResults.results.length === 0) {
      return (
        <Spinner />
      );
    } else {
      return searchResults.ids.map((itemId) => (
        <TranscriptLine
          key={itemId}
          seekPlayer={seekPlayer}
          currentTime={currentTime}
          focusedMatchId={focusedMatchId}
          item={searchResults.results[itemId]}
          autoScrollEnabled={autoScrollEnabled}
          setFocusedMatchId={setFocusedMatchId}
        />
      ));
    }
  } else if (transcriptInfo.tType === TRANSCRIPT_TYPES.plainText) {
    return (
      <div
        data-testid="transcript_plain-text"
        dangerouslySetInnerHTML={{ __html: transcript }}
      />
    );
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
const Transcript = ({ playerID, showSearch, manifestUrl, transcripts = [], initialSearchQuery = null }) => {
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

  const [isLoading, setIsLoading] = React.useState(true);
  // Store transcript data in state to avoid re-requesting file contents
  const [cachedTranscripts, setCachedTranscripts] = React.useState([]);

  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery);
  const [searchResults, setSearchResults] = React.useState({ results: {}, ids: [], matchingIds: [] });

  useFilteredTranscripts({
    enabled: showSearch,
    query: searchQuery,
    setSearchResults,
    matchesOnly: false,
    transcripts: transcript
  });

  const [isEmpty, setIsEmpty] = React.useState(true);

  const [_autoScrollEnabled, _setAutoScrollEnabled] = React.useState(true);
  const autoScrollEnabledRef = React.useRef(_autoScrollEnabled);
  const setAutoScrollEnabled = (a) => {
    autoScrollEnabledRef.current = a;
    _setAutoScrollEnabled(a); // force re-render
  };

  const [_canvasIndex, _setCanvasIndex] = React.useState(-1);
  const canvasIndexRef = React.useRef(_canvasIndex);
  const setCanvasIndex = (c) => {
    canvasIndexRef.current = c;
    _setCanvasIndex(c); // force re-render
  };

  const playerIntervalRef = React.useRef(null);
  const playerRef = React.useRef(null);

  const [focusedMatchIndex, setFocusedMatchIndex] = React.useState(null);
  const focusedMatchId = (focusedMatchIndex === null
    ? null
    : searchResults.matchingIds[focusedMatchIndex]
  );

  const setFocusedMatchId = React.useCallback((id) => {
    const index = searchResults.matchingIds.indexOf(id);
    if (index !== -1) {
      setFocusedMatchIndex(index);
    } else {
      setFocusedMatchIndex(null);
    }
  }, [searchResults.matchingIds]);
  React.useEffect(() => {
    if (!searchResults.matchingIds.length && focusedMatchIndex !== null) {
      setFocusedMatchIndex(null);
    } else if (searchResults.matchingIds.length && focusedMatchIndex === null) {
      setFocusedMatchIndex(0); // focus the first match
    } else if (focusedMatchIndex !== null && focusedMatchIndex >= searchResults.matchingIds.length) {
      // as the list of results gets shorter, make sure we don't show "10 of 3" in the search navigator
      setFocusedMatchIndex(searchResults.matchingIds.length - 1);
    }
  }, [searchResults, focusedMatchIndex]);

  const [currentTime, _setCurrentTime] = React.useState(-1);
  const setCurrentTime = React.useMemo(() => throttle(_setCurrentTime, 50), []);

  const seekPlayer = React.useCallback((time) => {
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
      } else {
        playerRef.current = domPlayer.children[0];
      }
      if (playerRef.current) {
        let cIndex = parseInt(playerRef.current.dataset['canvasindex']);
        if (cIndex != canvasIndexRef.current) {
          // Clear the transcript text in the component
          setTranscript([]);
          setCanvasIndex(playerRef.current.dataset['canvasindex']);
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

    // transcripts prop is processed first if given
    if (transcripts?.length > 0) {
      allTranscripts = await sanitizeTranscripts(transcripts);
    } else if (manifestUrl) {
      // Read supplementing annotations from the given manifest
      allTranscripts = await readSupplementingAnnotations(manifestUrl);
    }
    setTranscriptsList(allTranscripts);
    initTranscriptData(allTranscripts);
  }, []);

  React.useEffect(() => {
    if (transcriptsList?.length > 0 && canvasIndexRef.current != undefined) {
      let cTranscripts = transcriptsList.filter((tr) => tr.canvasId == canvasIndexRef.current)[0];
      setCanvasTranscripts(cTranscripts.items);
      setStateVar(cTranscripts.items[0]);
    }
  }, [canvasIndexRef.current]);

  const initTranscriptData = (allTranscripts) => {
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
      setTranscriptInfo({ tType: TRANSCRIPT_TYPES.noTranscript, id: '', tError: NO_TRANSCRIPTS_MSG });
    } else {
      setIsEmpty(false);
      const cTranscripts = getCanvasT(allTranscripts)[0];
      setCanvasTranscripts(cTranscripts.items);
      setStateVar(cTranscripts.items[0]);
    }
    setIsLoading(false);
  };

  const selectTranscript = (selectedId) => {
    const selectedTranscript = canvasTranscripts.filter((tr) => (
      tr.id === selectedId
    ));
    setStateVar(selectedTranscript[0]);
  };

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
    } else {
      // Parse new transcript data from the given sources
      await Promise.resolve(
        parseTranscriptData(url, canvasIndexRef.current, format)
      ).then(function (value) {
        if (value != null) {
          const { tData, tUrl, tType, tFileExt } = value;
          let newError = '';
          if (tType === TRANSCRIPT_TYPES.invalid) {
            newError = INVALID_URL_MSG;
          } else if (tType === TRANSCRIPT_TYPES.noTranscript) {
            newError = NO_TRANSCRIPTS_MSG;
          } else if (tType === TRANSCRIPT_TYPES.noSupport) {
            newError = NO_SUPPORT;
          } else if (tType === TRANSCRIPT_TYPES.invalidTimedText) {
            newError = INVALID_VTT;
          }
          setTranscript(tData);
          setTranscriptInfo({ title, filename, id, isMachineGen, tType, tUrl, tFileExt, tError: newError });
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
            showSearch={showSearch}
            selectTranscript={selectTranscript}
            transcriptData={canvasTranscripts}
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
        >
          <TranscriptList
            transcript={transcript}
            currentTime={currentTime}
            seekPlayer={seekPlayer}
            searchResults={searchResults}
            focusedMatchId={focusedMatchId}
            transcriptInfo={transcriptInfo}
            setFocusedMatchId={setFocusedMatchId}
            autoScrollEnabled={autoScrollEnabledRef.current && searchQuery === null}
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
  initialSearchQuery: PropTypes.oneOf([PropTypes.string, PropTypes.null]),
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
