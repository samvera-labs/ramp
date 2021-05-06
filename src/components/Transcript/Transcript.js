import React from 'react';
import './Transcript.scss';

const Transcript = (props) => {
  // React refs array for each timed text value in the transcript
  const textRefs = React.useRef(props.transcript.map(() => React.createRef()));
  // React ref for the transcript container
  const transcriptContainerRef = React.useRef();

  let timedText = [];
  props.transcript.map((t, index) => {
    let line = (
      <div key={index} id={t.start} ref={textRefs.current[index]}>
        <span className="transcript-time">
          <a href={'#'}>{t.start}</a>
        </span>
        <span>{t.value}</span>
      </div>
    );
    timedText.push(line);
  });

  React.useEffect(() => {
    setTimeout(function () {
      autoScrollAndHighlight(9);
    }, 3000);
    setTimeout(function () {
      autoScrollAndHighlight(3);
    }, 6000);
  }, []);

  const autoScrollAndHighlight = (i) => {
    textRefs.current[i].current.style.background = '#80a59099';
    let textTopOffset = textRefs.current[i].current.offsetTop;
    let parentTopOffset = transcriptContainerRef.current.offsetTop;
    // divide by 2 to vertically center the highlighted text
    transcriptContainerRef.current.scrollTop =
      (textTopOffset - parentTopOffset) / 2;
  };

  return (
    <div className="transcript-nav" ref={transcriptContainerRef}>
      <h3>Lunchroom Transcript</h3>
      {timedText}
    </div>
  );
};

export default Transcript;
