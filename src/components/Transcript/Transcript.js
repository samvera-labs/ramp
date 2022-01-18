import React from 'react';
import PropTypes from 'prop-types';
import 'lodash';
import TanscriptSelector from './TranscriptMenu/TranscriptSelector';
import { createTimestamp } from '@Services/utility-helpers';
import { parseTranscriptData } from '@Services/transcript-parser';
import './Transcript.scss';

const Transcript = ({ playerID, transcripts }) => {
  const [canvasTranscripts, setCanvasTranscripts] = React.useState([]);
  const [transcript, _setTranscript] = React.useState([]);
  const [transcriptTitle, setTranscriptTitle] = React.useState('');
  const [transcriptUrl, setTranscriptUrl] = React.useState('');
  const [canvasIndex, _setCanvasIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setError] = React.useState('');

  let isMouseOver = false;
  // Setup refs to access state information within
  // event handler function
  const isMouseOverRef = React.useRef(isMouseOver);
  const setIsMouseOver = (state) => {
    isMouseOverRef.current = state;
    isMouseOver = state;
  };

  const isEmptyRef = React.useRef(false);
  const setIsEmpty = (e) => {
    isEmptyRef.current = e;
  };

  const canvasIndexRef = React.useRef();
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
  let timedText = [];

  let player = null;

  React.useEffect(() => {
    setTimeout(function () {
      const domPlayer = document.getElementById(playerID);
      if (!domPlayer) {
        console.error(
          "Cannot find player, '" +
            playerID +
            "' on page. Transcript synchronization is disabled."
        );
      } else {
        player = domPlayer.children[0];
      }
      if (player) {
        observeCanvasChange(player);
        player.dataset['canvasindex']
          ? setCanvasIndex(player.dataset['canvasindex'])
          : setCanvasIndex(0);
        player.addEventListener('timeupdate', function (e) {
          if (e == null || e.target == null) {
            return;
          }
          const currentTime = e.target.currentTime;
          textRefs.current.map((tr) => {
            if (tr) {
              const start = tr.getAttribute('starttime');
              const end = tr.getAttribute('endtime');
              if (currentTime >= start && currentTime <= end) {
                !tr.classList.contains('active')
                  ? autoScrollAndHighlight(currentTime, tr)
                  : null;
              } else {
                // remove highlight
                tr.classList.remove('active');
              }
            }
          });
        });

        player.addEventListener('ended', function (e) {
          // render next canvas related transcripts
          setCanvasIndex(canvasIndex + 1);
        });
      }
    }, 1000);
  });

  React.useEffect(() => {
    // Clean up state on component unmount
    return () => {
      setCanvasTranscripts([]);
      setTranscript([]);
      setTranscriptTitle('');
      setTranscriptUrl('');
      setCanvasIndex();
      player = null;
      isMouseOver = false;
      timedText = [];
    };
  }, []);

  React.useEffect(() => {
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
      !transcripts?.length > 0 ||
      !getCanvasT(transcripts)?.length > 0 ||
      !getTItems(transcripts)?.length > 0
    ) {
      setIsLoading(false);
      setIsEmpty(true);
      setTranscript([]);
      setError('No Transcript(s) found, please check again.');
    } else {
      const cTrancripts = getCanvasT(transcripts);
      setCanvasTranscripts(cTrancripts[0].items);
      setIsEmpty(false);
      setStateVar(cTrancripts[0].items[0]);
    }
  }, [canvasIndex]);

  const observeCanvasChange = () => {
    // Select the node that will be observed for mutations
    const targetNode = player;

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (mutation.attributeName?.includes('src')) {
          const p =
            document.querySelector('video') || document.querySelector('audio');
          if (p) {
            setCanvasIndex(parseInt(p.dataset['canvasindex']));
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  };

  const selectTranscript = (selectedTitle) => {
    const selectedTranscript = canvasTranscripts.filter(function (tr) {
      return tr.title === selectedTitle;
    });
    setStateVar(selectedTranscript[0]);
  };

  const setStateVar = async (transcript) => {
    if (!transcript) {
      return;
    }

    const { title, url } = transcript;
    setTranscriptTitle(title);

    // parse transcript data and update state variables
    await Promise.resolve(
      parseTranscriptData(url, canvasIndexRef.current)
    ).then(function (value) {
      if (value != null) {
        const { tData, tUrl } = value;
        setTranscriptUrl(tUrl);
        setTranscript(tData);
        tData?.length == 0
          ? setError('No Valid Transcript(s) found, please check again.')
          : null;
      } else {
        setTranscript([]);
        setError('Invalid URL for transcript, please check again.');
      }
      setIsLoading(false);
    });
  };

  const autoScrollAndHighlight = (currentTime, tr) => {
    if (!tr) {
      return;
    }

    // Highlight clicked/current time's transcript text
    let textTopOffset = 0;
    const start = tr.getAttribute('starttime');
    const end = tr.getAttribute('endtime');
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

    // Auto scroll the transcript
    let parentTopOffset = transcriptContainerRef.current.offsetTop;
    // divide by 2 to vertically center the highlighted text
    transcriptContainerRef.current.scrollTop =
      textTopOffset -
      parentTopOffset -
      transcriptContainerRef.current.clientHeight / 2;
  };

  /**
   * When clicked on a transcript text seek to the respective
   * timestamp in the player
   * @param {Object} e event for the click
   */
  const handleTranscriptTextClick = (e) => {
    e.preventDefault();
    if (player) {
      player.currentTime = e.currentTarget.getAttribute('starttime');
    }

    textRefs.current.map((tr) => {
      if (tr && tr.classList.contains('active')) {
        tr.classList.remove('active');
      }
    });
    e.currentTarget.classList.add('active');
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

  if (transcriptRef.current) {
    if (transcript.length > 0) {
      if (typeof transcript[0] == 'string') {
        // when given a word document as a transcript
        timedText.push(
          <div
            data-testid="transcript_docs"
            dangerouslySetInnerHTML={{ __html: transcript[0] }}
          />
        );
      } else {
        // timed transcripts
        transcript.map((t, index) => {
          let line = (
            <div
              className="irmp--transcript_item"
              data-testid="transcript_item"
              key={index}
              ref={(el) => (textRefs.current[index] = el)}
              onClick={handleTranscriptTextClick}
              starttime={t.begin} // set custom attribute: starttime
              endtime={t.end} // set custom attribute: endtime
            >
              {t.begin && (
                <span
                  className="irmp--transcript_time"
                  data-testid="transcript_time"
                >
                  <a href={'#'}>[{createTimestamp(t.begin)}]</a>
                </span>
              )}

              <span
                className="irmp--transcript_text"
                data-testid="transcript_text"
                dangerouslySetInnerHTML={{ __html: buildSpeakerText(t) }}
              />
            </div>
          );
          timedText.push(line);
        });
      }
    } else {
      // invalid transcripts
      timedText.push(
        <p key="no-transcript" id="no-transcript" data-testid="no-transcript">
          {errorMsg}
        </p>
      );
    }
  }

  if (!isLoading) {
    return (
      <div
        className="irmp--transcript_nav"
        data-testid="transcript_nav"
        key={transcriptTitle}
        onMouseOver={() => handleMouseOver(true)}
        onMouseLeave={() => handleMouseOver(false)}
      >
        {!isEmptyRef.current && (
          <div className="transcript_menu">
            <TanscriptSelector
              setTranscript={selectTranscript}
              title={transcriptTitle}
              url={transcriptUrl}
              transcriptData={canvasTranscripts}
            />
          </div>
        )}
        <div
          className={`transcript_content ${
            transcriptRef.current ? '' : 'static'
          }`}
          ref={transcriptContainerRef}
        >
          {transcriptRef.current && timedText}
          {transcriptUrl != '' && timedText.length == 0 && (
            <iframe
              className="transcript_viewer"
              data-testid="transcript_viewer"
              src={transcriptUrl}
            ></iframe>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

Transcript.propTypes = {
  playerID: PropTypes.string.isRequired,
  transcripts: PropTypes.arrayOf(
    PropTypes.shape({
      canvasId: PropTypes.number.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          start: PropTypes.string,
          end: PropTypes.string,
          value: PropTypes.string,
        })
      ),
    })
  ).isRequired,
};

export default Transcript;
