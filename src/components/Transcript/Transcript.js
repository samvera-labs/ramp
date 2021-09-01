import React from 'react';
import PropTypes from 'prop-types';
import 'lodash';
import TanscriptSelector from './TranscriptMenu/TranscriptSelector';
import { createTimestamp, timeToS } from '@Services/utility-helpers';
import './Transcript.scss';

const Transcript = ({ transcripts }) => {
  const [transcript, _setTranscript] = React.useState([]);
  const [transcriptTitle, setTranscriptTitle] = React.useState('');
  const [transcriptUrl, setTranscriptUrl] = React.useState('');
  const [isMouseOver, _setIsMouseOver] = React.useState(false);

  // Setup refs to access state information within
  // event handler function
  const isMouseOverRef = React.useRef(isMouseOver);
  const setIsMouseOver = (state) => {
    isMouseOverRef.current = state;
    _setIsMouseOver(state);
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
    if (transcripts?.length > 0) {
      const { data, title, url } = transcripts[0];
      setTranscript(data);
      setTranscriptTitle(title);
      setTranscriptUrl(url);
    }
  }, []);

  React.useEffect(() => {
    setTimeout(function () {
      player =
        document.querySelector('video') || document.querySelector('audio');
      if (player) {
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
      }
    });
  }, []);

  const selectTranscript = (selectedTitle) => {
    const selectedTranscript = transcripts.filter(function (tr) {
      return tr.title === selectedTitle;
    });
    const { data, title, url } = selectedTranscript[0];
    setTranscript(data);
    setTranscriptTitle(title);
    setTranscriptUrl(url);
  };

  const autoScrollAndHighlight = (currentTime, tr) => {
    if (!tr) {
      return;
    }

    // Highlight clicked/current time's transcript text
    let textTopOffset = 0;
    const start = tr.getAttribute('starttime');
    const end = tr.getAttribute('endtime');
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
    player = document.querySelector('video') || document.querySelector('audio');
    if (player) {
      player.currentTime = e.currentTarget.getAttribute('starttime');
    }
  };

  /**
   * Update state based on mouse events - hover or not hover
   * @param {Boolean} state flag identifying mouse event
   */
  const handleMouseOver = (state) => {
    setIsMouseOver(state);
  };

  if (transcriptRef.current) {
    transcript.map((t, index) => {
      const start = timeToS(t.start);
      const end = timeToS(t.end);
      let line = (
        <div
          className="irmp--transcript_item"
          data-testid="transcript_item"
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
          onClick={handleTranscriptTextClick}
          starttime={start} // set custom attribute: starttime
          endtime={end} // set custom attribute: endtime
        >
          <span className="irmp--transcript_time" data-testid="transcript_time">
            <a href={'#'}>{createTimestamp(t.start)}</a>
          </span>
          <span className="irmp--transcript_text" data-testid="transcript_text">
            {t.value}
          </span>
        </div>
      );
      timedText.push(line);
    });
  }

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
          transcriptData={transcripts}
        />
      </div>
      <div
        className={`transcript_content ${
          transcriptRef.current ? '' : 'static'
        }`}
        ref={transcriptContainerRef}
      >
        {transcriptRef.current ? (
          timedText
        ) : (
          <iframe
            className="transcript_gdoc-viewer"
            data-testid="transcript_gdoc-viewer"
            src={`https://docs.google.com/gview?url=${transcriptUrl}&embedded=true`}
          ></iframe>
        )}
      </div>
    </div>
  );
};

Transcript.propTypes = {
  transcripts: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

export default Transcript;
