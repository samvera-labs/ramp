import React from 'react';
import TanscriptSelector from './TranscriptMenu/TranscriptSelector';
import { createTimestamp, timeToMs } from '@Services/utility-helpers';
import './Transcript.scss';

const Transcript = ({ transcripts }) => {
  const [transcript, setTranscript] = React.useState([]);
  const [transcriptTitle, setTranscriptTitle] = React.useState('');

  // React refs array for each timed text value in the transcript
  let textRefs = [];
  const transcriptContainerRef = React.useRef();

  React.useEffect(() => {
    if (transcripts.length > 0) {
      setTranscript(transcripts[0].data);
      setTranscriptTitle(transcripts[0].title);
    }
  }, []);

  // React.useEffect(() => {
  //   // FIXME:: use player's current time from state management once this
  //   // is wired to it.
  //   setTimeout(function () {
  //     autoScrollAndHighlight(73004);
  //   }, 3000);
  //   setTimeout(function () {
  //     autoScrollAndHighlight(27531);
  //   }, 6000);
  // }, []);

  const selectTranscript = (t) => {
    const selectedTranscript = transcripts.filter(function (tr) {
      return tr.title === t;
    });
    setTranscript(selectedTranscript[0].data);
    setTranscriptTitle(selectedTranscript[0].title);
  };

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
    let timedText = [];
    textRefs = React.useRef(transcript.map(() => React.createRef()));
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
    return (
      <div
        className="irmp--transcript_nav"
        data-testid="transcript_nav"
        ref={transcriptContainerRef}
      >
        <TanscriptSelector
          setTranscript={selectTranscript}
          title={transcriptTitle}
          transcripts={transcripts}
        />
        {timedText}
      </div>
    );
  } else {
    return <p>Missing transcript data</p>;
  }
};

export default Transcript;
