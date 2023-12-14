import React from 'react';
import PropTypes from 'prop-types';
import 'lodash';
import TanscriptSelector from './TranscriptMenu/TranscriptSelector';
import { checkSrcRange, getMediaFragment, timeToHHmmss } from '@Services/utility-helpers';
import {
  getSupplementingAnnotations,
  parseTranscriptData,
  sanitizeTranscripts,
  TRANSCRIPT_TYPES,
} from '@Services/transcript-parser';
import './Transcript.scss';

const NO_TRANSCRIPTS_MSG = 'No valid Transcript(s) found, please check again.';
const INVALID_URL_MSG = 'Invalid URL for transcript, please check again.';
const NO_SUPPORT = 'Transcript format is not supported, please check again.';

/**
 *
 * @param {String} param0 ID of the HTML element for the player on page
 * @param {String} param1 manifest URL to read transcripts from
 * @param {Object} param2 transcripts resource
 * @returns 
 */
const Transcript = ({ playerID, manifestUrl, transcripts = [] }) => {
  const [transcriptsList, setTranscriptsList] = React.useState([]);
  const [canvasTranscripts, setCanvasTranscripts] = React.useState([]);
  const [transcript, _setTranscript] = React.useState([]);
  const [transcriptInfo, setTranscriptInfo] = React.useState({
    title: '',
    id: '',
    tUrl: '',
    tType: '',
    tFileExt: '',
    isMachineGen: false,
  });
  const [canvasIndex, _setCanvasIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setError] = React.useState('');
  const [timedTextState, setTimedText] = React.useState([]);
  // Store transcript data in state to avoid re-requesting file contents
  const [cachedTranscripts, setCachedTranscripts] = React.useState([]);

  let isMouseOver = false;
  // Setup refs to access state information within
  // event handler function
  const isMouseOverRef = React.useRef(isMouseOver);
  const setIsMouseOver = (state) => {
    isMouseOverRef.current = state;
    isMouseOver = state;
  };

  const isEmptyRef = React.useRef(true);
  const setIsEmpty = (e) => {
    isEmptyRef.current = e;
  };

  const canvasIndexRef = React.useRef(0);
  const setCanvasIndex = (c) => {
    canvasIndexRef.current = c;
    _setCanvasIndex(c);
  };

  // React refs array for each timed text value in the transcript
  let textRefs = React.useRef([]);
  const transcriptContainerRef = React.useRef();
  const transcriptRef = React.useRef();
  const setTranscript = (t) => {
    transcriptRef.current = t;
    _setTranscript(t);
  };

  let playerInterval;
  let player = React.useRef();

  /**
   * Start an interval at the start of the component to poll the
   * canvasindex attribute changes in the player on the page
   */
  React.useEffect(() => {
    playerInterval = setInterval(() => {
      const domPlayer = document.getElementById(playerID);
      if (!domPlayer) {
        console.error(
          "Cannot find player, '" +
          playerID +
          "' on page. Transcript synchronization is disabled."
        );
      } else {
        player.current = domPlayer.children[0];
      }
      if (player.current && player.current.dataset['canvasindex'] != canvasIndexRef.current) {
        setCanvasIndex(player.current.dataset['canvasindex']);

        player.current.addEventListener('timeupdate', function (e) {
          if (e == null || e.target == null) {
            return;
          }
          const currentTime = e.target.currentTime;
          textRefs.current.map((tr) => {
            if (tr) {
              const start = parseFloat(tr.getAttribute('starttime'));
              const end = parseFloat(tr.getAttribute('endtime'));
              if (currentTime >= start && currentTime <= end) {
                autoScrollAndHighlight(currentTime, start, end, tr);
              } else {
                // remove highlight
                tr.classList.remove('active');
              }
            }
          });
        });
      }
    }, 500);
  }, []);

  React.useEffect(() => {
    // Clean up state when the component unmounts
    return () => {
      setCanvasTranscripts([]);
      setTranscript([]);
      setTranscriptInfo({});
      setCanvasIndex();
      setIsLoading(true);
      setTimedText([]);
      setCachedTranscripts([]);
      player = null;
      isMouseOver = false;
      clearInterval(playerInterval);
    };
  }, []);

  React.useEffect(async () => {
    let allTranscripts = [];

    // transcripts prop is processed first if given
    if (transcripts?.length > 0) {
      allTranscripts = await sanitizeTranscripts(transcripts);
    } else if (manifestUrl) {
      // Read supplementing annotations from the given manifest
      allTranscripts = await getSupplementingAnnotations(manifestUrl);
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
  }, [canvasIndex]);

  const initTranscriptData = (allTranscripts) => {
    let getCanvasT = (tr) => {
      return tr.filter((t) => t.canvasId == canvasIndex);
    };
    let getTItems = (tr) => {
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
      setTranscriptInfo({ tType: TRANSCRIPT_TYPES.noTranscript });
      setError(NO_TRANSCRIPTS_MSG);
    } else {
      setIsEmpty(false);
      const cTrancripts = getCanvasT(allTranscripts)[0];
      setCanvasTranscripts(cTrancripts.items);
      setStateVar(cTrancripts.items[0]);
    }
    setIsLoading(false);
  };

  const selectTranscript = (selectedId) => {
    setTimedText([]);
    const selectedTranscript = canvasTranscripts.filter(function (tr) {
      return tr.id === selectedId;
    });
    setStateVar(selectedTranscript[0]);
  };

  const setStateVar = async (transcript) => {
    // When selected transcript is null or undefined display error message
    if (!transcript || transcript == undefined) {
      setIsEmpty(true);
      setIsLoading(false);
      setTranscriptInfo({ tType: TRANSCRIPT_TYPES.noTranscript });
      setError(NO_TRANSCRIPTS_MSG);
      return;
    }

    // set isEmpty flag to render transcripts UI
    setIsEmpty(false);

    const { id, title, url, isMachineGen } = transcript;

    // Check cached transcript data
    const cached = cachedTranscripts.filter(
      ct => ct.id == id && ct.canvasId == canvasIndexRef.current
    );
    if (cached?.length > 0) {
      // Load cached transcript data into the component
      const { data, fileExt, type, errorMsg } = cached[0];
      if (data?.length > 0) {
        setTranscript(data);
        setError('');
      } else {
        setError(errorMsg);
      }
      setTranscriptInfo({ title, id, isMachineGen, tType: type, tUrl: url, tFileExt: fileExt });
    } else {
      // Parse new transcript data from the given sources
      await Promise.resolve(
        parseTranscriptData(url, canvasIndexRef.current)
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
          }
          setError(newError);
          setTranscript(tData);
          setTranscriptInfo({ title, id, isMachineGen, tType, tUrl, tFileExt });
          transcript = {
            ...transcript,
            type: tType,
            data: tData,
            fileExt: tFileExt,
            canvasId: canvasIndexRef.current,
            errorMsg: newError,
          };
          setCachedTranscripts([...cachedTranscripts, transcript]);
        }
      });
    }
    setIsLoading(false);
  };

  const autoScrollAndHighlight = (currentTime, start, end, tr) => {
    if (!tr) {
      return;
    }

    // Highlight clicked/current time's transcript text
    let textTopOffset = 0;
    if (!start || !end) {
      return;
    }
    if (currentTime >= start && currentTime <= end) {
      tr.classList.add('active');
      textTopOffset = tr.offsetTop;
    } else {
      tr.classList.remove('active');
    }

    // When using the transcript panel to scroll/select text
    // return without auto scrolling
    if (isMouseOverRef.current) {
      return;
    }

    // Scroll the transcript line to the center of the 
    // transcript component view
    transcriptContainerRef.current.scrollTop =
      textTopOffset -
      transcriptContainerRef.current.clientHeight;
  };

  /**
   * Playable range in the player
   * @returns {Object}
   */
  const getPlayerDuration = () => {
    const duration = player.duration;
    let timeFragment = getMediaFragment(player.src, duration);
    if (timeFragment == undefined) {
      timeFragment = { start: 0, end: duration };
    }
    return timeFragment;
  };

  /**
   * Determine a transcript text line is within playable
   * range
   * @param {Object} ele target element from click event
   * @returns {Boolean}
   */
  const getIsClickable = (ele) => {
    const segmentRange = {
      start: Number(ele.getAttribute('starttime')),
      end: Number(ele.getAttribute('endtime')),
    };
    const playerRange = getPlayerDuration();
    const isInRange = checkSrcRange(segmentRange, playerRange);
    return isInRange;
  };

  const handleOnKeyPress = (e) => {
    if (e.type === 'keydown' && (e.key === ' ' || e.key === "Enter")) {
      handleTranscriptChange(e);
    }
  };

  /**
   * When clicked on a transcript text seek to the respective
   * timestamp in the player
   * @param {Object} e event for the click
   */
  const handleTranscriptChange = (e) => {
    e.preventDefault();

    /**
     * Disregard the click, which uses the commented out lines
     * or reset the player to the start time (the current functionality)
     * when clicked on a transcript line that is out of playable range.
     *  */
    // const parentEle = e.target.parentElement;
    // const isClickable = getIsClickable(parentEle);

    // if (isClickable) {
    if (player.current) {
      player.current.currentTime = e.currentTarget.getAttribute('starttime');
    }

    textRefs.current.map((tr) => {
      if (tr && tr.classList.contains('active')) {
        tr.classList.remove('active');
      }
    });
    e.currentTarget.classList.add('active');
    // }
  };

  /**
   * Update state based on mouse events - hover or not hover
   * @param {Boolean} state flag identifying mouse event
   */
  const handleMouseOver = (state) => {
    setIsMouseOver(state);
  };

  const buildSpeakerText = (t) => {
    let speakerText = '';
    if (t.speaker) {
      speakerText = `<u>${t.speaker}:</u> ${t.text}`;
    } else {
      speakerText = t.text;
    }
    return speakerText;
  };

  React.useEffect(() => {
    if (transcriptRef.current) {
      setTimedText([]);
      let timedText = [];
      switch (transcriptInfo.tType) {
        case TRANSCRIPT_TYPES.docx:
          // when given a word document as a transcript
          timedText.push(
            <div
              data-testid="transcript_docs"
              dangerouslySetInnerHTML={{ __html: transcript[0] }}
            />
          );
          break;
        case TRANSCRIPT_TYPES.timedText:
          if (transcript.length > 0) {
            transcript.map((t, index) => {
              let line = (
                <a
                  className="ramp--transcript_item"
                  data-testid="transcript_item"
                  key={`t_${index}`}
                  ref={(el) => (textRefs.current[index] = el)}
                  onClick={handleTranscriptChange}
                  onKeyDown={handleOnKeyPress}
                  starttime={t.begin} // set custom attribute: starttime
                  endtime={t.end} // set custom attribute: endtime
                  href={'#'}
                  role="link"
                >
                  {t.begin && (
                    <span
                      className="ramp--transcript_time"
                      data-testid="transcript_time"
                      key={`ttime_${index}`}
                    >
                      [{timeToHHmmss(t.begin, true)}]
                    </span>
                  )}

                  <span
                    className="ramp--transcript_text"
                    data-testid="transcript_text"
                    key={`ttext_${index}`}
                    dangerouslySetInnerHTML={{ __html: buildSpeakerText(t) }}
                  />
                </a>
              );
              timedText.push(line);
            });
          }
          break;
        case TRANSCRIPT_TYPES.plainText:
          timedText.push(
            <div
              data-testid="transcript_plain-text"
              key={0}
              dangerouslySetInnerHTML={{ __html: transcript }}

            />
          );
          break;
        case TRANSCRIPT_TYPES.noSupport:
        case TRANSCRIPT_TYPES.invalid:
        case TRANSCRIPT_TYPES.noTranscript:
        default:
          // invalid transcripts
          timedText.push(
            <p key="no-transcript" id="no-transcript" data-testid="no-transcript" role="note">
              {errorMsg}
            </p>
          );
          break;
      }
      setTimedText(timedText);
    }
  }, [canvasIndex, isLoading, transcriptInfo.id]);

  if (!isLoading) {
    return (
      <div
        className="ramp--transcript_nav"
        data-testid="transcript_nav"
        key={transcriptInfo.title}
        onMouseOver={() => handleMouseOver(true)}
        onMouseLeave={() => handleMouseOver(false)}
      >
        {!isEmptyRef.current && (
          <div className="transcript_menu">
            <TanscriptSelector
              selectTranscript={selectTranscript}
              transcriptData={canvasTranscripts}
              transcriptInfo={transcriptInfo}
              noTranscript={errorMsg?.length > 0}
            />
          </div>
        )}
        <div
          className={`transcript_content ${transcriptRef.current ? '' : 'static'
            }`}
          ref={transcriptContainerRef}
          data-testid={`transcript_content_${transcriptInfo.tType}`}
          role="list"
          aria-label="Attached Transcript content"
        >
          {timedTextState?.length > 0 ? timedTextState.map(t => t) :
            (<div className="lds-spinner"><div>
            </div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div></div>)}
        </div>
      </div>
    );
  } else {
    return (
      <div className="lds-spinner"><div>
      </div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>
    );
  }
};

Transcript.propTypes = {
  /** `id` attribute of the media player in the DOM */
  playerID: PropTypes.string.isRequired,
  /** URL of the manifest */
  manifestUrl: PropTypes.string,
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
