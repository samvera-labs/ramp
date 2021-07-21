import React from 'react';
import TanscriptSelector from './TranscriptMenu/TranscriptSelector';
import { createTimestamp, timeToMs } from '@Services/utility-helpers';
import './Transcript.scss';

const Transcript = ({ transcripts }) => {
  const [transcript, setTranscript] = React.useState([]);
  const [transcriptTitle, setTranscriptTitle] = React.useState('');
  const [transcriptUrl, setTranscriptUrl] = React.useState('');

  // React refs array for each timed text value in the transcript
  let textRefs = React.useRef([]);
  const transcriptContainerRef = React.useRef();

  React.useEffect(() => {
    if (transcripts && transcripts.length > 0) {
      setTranscript(transcripts[0].data);
      setTranscriptTitle(transcripts[0].title);
      setTranscriptUrl(transcripts[0].url);
    }

    // // FIXME:: use player's current time from state management once this
    // // is wired to it.
    setTimeout(function () {
      autoScrollAndHighlight(73004);
    }, 3000);
    setTimeout(function () {
      autoScrollAndHighlight(27531);
    }, 6000);
  }, []);

  const selectTranscript = (selectedTitle) => {
    const selectedTranscript = transcripts.filter(function (tr) {
      return tr.title === selectedTitle;
    });
    const { data, title, url } = selectedTranscript[0];
    setTranscript(data);
    setTranscriptTitle(title);
    setTranscriptUrl(url);

    setTimeout(function () {
      autoScrollAndHighlight(73004);
    }, 3000);
    setTimeout(function () {
      autoScrollAndHighlight(27531);
    }, 6000);
  };

  const autoScrollAndHighlight = (currenttime) => {
    let textTopOffset = 0;
    textRefs.current.map((tr) => {
      if (tr) {
        const start = tr.getAttribute('starttime');
        const end = tr.getAttribute('endtime');
        if (currenttime >= start && currenttime <= end) {
          tr.classList.add('active');
          textTopOffset = tr.offsetTop;
        } else {
          tr.classList.remove('active');
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
    transcript.map((t, index) => {
      let line = (
        <div
          className="irmp--transcript_item"
          data-testid="transcript_item"
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
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
        key={transcriptTitle}
      >
        <TanscriptSelector
          setTranscript={selectTranscript}
          title={transcriptTitle}
          url={transcriptUrl}
          transcriptData={transcripts}
        />
        {timedText}
      </div>
    );
  } else {
    return <p>Missing transcript data</p>;
  }
};

export default Transcript;
