import React from 'react';
import { createTimestamp, timeToMs } from '@Services/utility-helpers';
import './Transcript.scss';

const Transcript = ({ transcript }) => {
  // React refs array for each timed text value in the transcript
  const textRefs = transcript
    ? React.useRef(transcript.map(() => React.createRef()))
    : [];
  // React ref for the transcript container
  const transcriptContainerRef = React.useRef();

  let timedText = [];
  if (transcript) {
    transcript.map((t, index) => {
      let line = (
        <div
          className="irmp--transcript_item"
          data-testid="transcript_item"
          key={index}
          ref={textRefs.current[index]}
          starttime={timeToMs(t.start)} // set custom attribute: starttime
          endtime={timeToMs(t.end)} // set custom attribute: endtime
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

  React.useEffect(() => {
    // FIXME:: use player's current time from state management once this
    // is wired to it.
    setTimeout(function () {
      autoScrollAndHighlight(73004);
    }, 3000);
    setTimeout(function () {
      autoScrollAndHighlight(27531);
    }, 6000);
  }, []);

  const autoScrollAndHighlight = (currenttime) => {
    let textTopOffset = 0;
    textRefs.current.map((tr) => {
      if (tr.current) {
        const start = tr.current.getAttribute('starttime');
        const end = tr.current.getAttribute('endtime');
        if (currenttime >= start && currenttime <= end) {
          tr.current.classList.add('active');
          textTopOffset = tr.current.offsetTop;
        } else {
          tr.current.classList.remove('active');
        }
      }
    });

    let parentTopOffset = transcriptContainerRef.current.offsetTop;
    // divide by 2 to vertically center the highlighted text
    transcriptContainerRef.current.scrollTop =
      (textTopOffset - parentTopOffset) / 2;
  };

  if (transcript) {
    return (
      <div
        className="irmp--transcript_nav"
        data-testid="transcript_nav"
        ref={transcriptContainerRef}
      >
        {timedText}
      </div>
    );
  }
  return <p>Missing transcript data</p>;
};

export default Transcript;
