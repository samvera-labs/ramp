import React from 'react';
import './Transcript.scss';

const Transcript = (props) => {
  //   const startTimes = [
  //     1.0,
  //     22.0,
  //     26.0,
  //     32.0,
  //     36.0,
  //     42.0,
  //     47.0,
  //     52.0,
  //     57.0,
  //     66.0,
  //     72.0,
  //     83.0,
  //     90.0,
  //   ];
  const textRefs = React.useRef(props.transcript.map(() => React.createRef()));
  const transcriptContainerRef = React.useRef();

  let timedText = [];
  props.transcript.map((t, index) => {
    let line = (
      <div key={index} id={t.start} ref={textRefs.current[index]}>
        <span className="transcript-time">{t.start}</span>
        <span>{t.value}</span>
      </div>
    );
    timedText.push(line);
  });

  React.useEffect(() => {
    console.log('Calling useEffect');
    setTimeout(function () {
      autoScrollAndHighlight(5);
    }, 6000);
  }, []);

  const autoScrollAndHighlight = (i) => {
    textRefs.current[i].current.style.background = '#80a59099';
    let topPos = textRefs.current[i].current.offsetTop;
    console.log(transcriptContainerRef.current);
    transcriptContainerRef.current.scrollTop = topPos;
  };

  return (
    <div className="transcript-nav" ref={transcriptContainerRef}>
      <h3>Lunchroom Transcript</h3>
      {timedText}
    </div>
  );
};

export default Transcript;
