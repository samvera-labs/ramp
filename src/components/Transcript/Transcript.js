import React from 'react';
import PropTypes from 'prop-types';
import 'lodash';
import TanscriptSelector from './TranscriptMenu/TranscriptSelector';
import { createTimestamp, timeToS } from '@Services/utility-helpers';
import './Transcript.scss';

const Transcript = ({ transcripts }) => {
  const [transcript, setTranscript] = React.useState([]);
  const [transcriptTitle, setTranscriptTitle] = React.useState('');
  const [transcriptUrl, setTranscriptUrl] = React.useState('');
  // const [wait, setWait] = React.useState(0);
  // const [transcriptIntervals, setTranscriptIntervals] = React.useState([]);

  // React refs array for each timed text value in the transcript
  let textRefs = React.useRef([]);
  const transcriptContainerRef = React.useRef();
  let player = null;
  let wait = 0;

  React.useEffect(() => {
    if (transcripts?.length > 0) {
      setTranscript(transcripts[0].data);
      setTranscriptTitle(transcripts[0].title);
      setTranscriptUrl(transcripts[0].url);
    }
  }, []);

  React.useEffect(() => {
    let delay = 0;
    setTimeout(function () {
      console.log('getting time synced');
      player =
        document.querySelector('video') || document.querySelector('audio');
      console.log(player);
      if (player) {
        // player.addEventListener('timeupdate', function (e) {
        //   const currentTime = e.target.currentTime;
        //   textRefs.current.forEach((tr) => {
        //     if (tr) {
        //       const start = tr.getAttribute('starttime');
        //       const end = tr.getAttribute('endtime');
        //       if (currentTime >= start && currentTime <= end) {
        //         _.throttle(function (e) {
        //           delay = (end - start) * 1000;
        //           console.log('calculated delay: ', delay);
        //           autoScrollAndHighlight(currentTime, tr);
        //         }, delay);
        //       }
        //     }
        //   });
        // });

        player.addEventListener('timeupdate', handleTimeUpdate);
        // player.addEventListener(
        //   'timeupdate',
        //   _.throttle(function (e) {
        //     throttleFunc(delay);
        //     delay = delay + 1000;
        //     // const currentTime = e.target.currentTime;
        //     // textRefs.current.forEach((tr) => {
        //     //   if (tr) {
        //     //     const start = tr.getAttribute('starttime');
        //     //     const end = tr.getAttribute('endtime');
        //     //     if (currentTime >= start && currentTime <= end) {
        //     //       delay = (end - start) * 1000;
        //     //       console.log('calculated delay: ', delay);
        //     //     }
        //     //     // autoScrollAndHighlight(currentTime, tr);
        //     //   }
        //     // });
        //   }, delay)
        // );
      }
    }, 100);
  }, [transcriptTitle]);

  const handleTimeUpdate = throttleFunc(function (e) {
    const currentTime = e.target.currentTime;
    console.log('Throttling at: ', currentTime);
    const tr = textRefs.current.filter((t) => {
      if (t) {
        const start = t.getAttribute('starttime');
        const end = t.getAttribute('endtime');
        if (currentTime >= start && currentTime <= end) {
          wait = (end - start) * 1000;
          return t;
        }
      }
    })[0];
    autoScrollAndHighlight(currentTime, tr);
    console.log(wait);
    debugger;
  }, wait);

  // const throttleFunc = (fnc, wait) => {
  //   setTimeout(fnc, wait);
  // };

  function throttleFunc(callback, limit) {
    // if (throttlePause) return;

    // throttlePause = true;
    setTimeout(() => {
      callback();
      // throttlePause = false;
    }, limit);
  }

  // const throttle = (callback, time) => {
  //   // if (throttlePause) return;

  //   // throttlePause = true;
  //   setTimeout(() => {
  //     callback();
  //     // throttlePause = false;
  //   }, time);
  // };
  // function throttleFunc(func, wait, options) {
  //   var context, args, result;
  //   var timeout = null;
  //   var previous = 0;
  //   if (!options) options = {};
  //   var later = function () {
  //     previous = options.leading === false ? 0 : Date.now();
  //     timeout = null;
  //     result = func.apply(context, args);
  //     if (!timeout) context = args = null;
  //   };
  //   return function () {
  //     var now = Date.now();
  //     if (!previous && options.leading === false) previous = now;
  //     var remaining = wait - (now - previous);
  //     context = this;
  //     args = arguments;
  //     if (remaining <= 0 || remaining > wait) {
  //       if (timeout) {
  //         clearTimeout(timeout);
  //         timeout = null;
  //       }
  //       previous = now;
  //       result = func.apply(context, args);
  //       if (!timeout) context = args = null;
  //     } else if (!timeout && options.trailing !== false) {
  //       timeout = setTimeout(later, remaining);
  //     }
  //     return result;
  //   };
  // }
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
    let textTopOffset = 0;

    if (!tr) {
      return;
    }
    textRefs.current.forEach((t) => t.classList.remove('active'));

    const start = tr.getAttribute('starttime');
    const end = tr.getAttribute('endtime');
    if (currentTime >= start && currentTime <= end) {
      tr.classList.add('active');
      textTopOffset = tr.offsetTop;
    } else {
      tr.classList.remove('active');
    }

    let parentTopOffset = transcriptContainerRef.current.offsetTop;
    // divide by 2 to vertically center the highlighted text
    transcriptContainerRef.current.scrollTop =
      (textTopOffset - parentTopOffset) / 2;
  };

  if (transcript) {
    let timedText = [];
    transcript.map((t, index) => {
      const start = timeToS(t.start);
      const end = timeToS(t.end);
      let line = (
        <div
          className="irmp--transcript_item"
          data-testid="transcript_item"
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
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
    // setTranscriptIntervals(timeIntervals);
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

Transcript.propTypes = {
  currentTime: PropTypes.number,
  transcripts: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

export default Transcript;
