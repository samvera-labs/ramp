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
  const [canvasIndex, setCanvasIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  let isMouseOver = false;
  // Setup refs to access state information within
  // event handler function
  const isMouseOverRef = React.useRef(isMouseOver);
  const setIsMouseOver = (state) => {
    isMouseOverRef.current = state;
    isMouseOver = state;
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
      if (domPlayer) {
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
    });
  });

  React.useEffect(() => {
    // Clean up state on component unmount
    return () => {
      setCanvasTranscripts([]);
      setTranscript([]);
      setTranscriptTitle('');
      setTranscriptUrl('');
      setCanvasIndex(0);
      player = null;
      isMouseOver = false;
      timedText = [];
    };
  }, []);

  React.useEffect(() => {
    if (transcripts?.length > 0) {
      const cTrancripts = transcripts.filter((t) => t.canvasId === canvasIndex);
      if (cTrancripts?.length > 0) {
        setCanvasTranscripts(cTrancripts[0].items);
        setStateVar(cTrancripts[0].items[0]);
      } else {
        return;
      }
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
    await Promise.resolve(parseTranscriptData(url, canvasIndex)).then(function (
      value
    ) {
      const { tData, tUrl } = value;
      setIsLoading(false);
      setTranscriptUrl(tUrl);
      setTranscript(tData);
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
    } else {
      timedText.push(
        <p key="no-transcript" data-testid="no-transcript">
          No Transcript was found in the given IIIF Manifest (Canvas)
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
        <div className="transcript_menu">
          <TanscriptSelector
            setTranscript={selectTranscript}
            title={transcriptTitle}
            url={transcriptUrl}
            transcriptData={canvasTranscripts}
          />
        </div>
        <div
          className={`transcript_content ${
            transcriptRef.current ? '' : 'static'
          }`}
          ref={transcriptContainerRef}
        >
          {transcriptRef.current && timedText}
          {transcriptUrl != '' && timedText.length == 0 && (
            <iframe
              className="transcript_gdoc-viewer"
              data-testid="transcript_gdoc-viewer"
              src={`https://docs.google.com/gview?url=${transcriptUrl}&embedded=true`}
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
