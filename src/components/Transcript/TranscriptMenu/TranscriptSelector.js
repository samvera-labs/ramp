import React from 'react';
import TranscriptDownloader from './TranscriptDownloader';

const TanscriptSelector = (props) => {
  const selectItem = (title, url) => {
    props.setTranscript(title, url);
  };

  if (props.transcriptData) {
    return (
      <div
        className="irmp--transcript_selector"
        data-testid="transcript-selector"
      >
        <div className="transcript_dropdown">
          <span>
            {props.title}
            <i className="arrow down"></i>
          </span>
          <div className="transcript_list">
            <ul>
              {props.transcriptData.map((t, i) => (
                <li key={i}>
                  <span
                    key={i}
                    onClick={() => selectItem(t.title, t.url)}
                    data-testid="transcript-option"
                  >
                    {t.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <TranscriptDownloader fileUrl={props.url} fileName={props.title} />
      </div>
    );
  } else {
    return null;
  }
};

export default TanscriptSelector;
