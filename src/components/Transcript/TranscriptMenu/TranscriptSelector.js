import React from 'react';
import TranscriptDownloader from './TranscriptDownloader';

const TanscriptSelector = (props) => {
  const [title, setTitle] = React.useState(props.title);

  const selectItem = (event) => {
    setTitle(event.target.value);
    props.setTranscript(event.target.value);
  };

  if (props.transcriptData) {
    return (
      <div
        className="irmp--transcript_selector"
        data-testid="transcript-selector"
      >
        <div className="selector-content">
          <select
            className="transcript_list"
            data-testid="transcript-select-option"
            value={title}
            onChange={selectItem}
          >
            {props.transcriptData.map((t, i) => (
              <option value={t.title} key={i}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
        <TranscriptDownloader fileUrl={props.url} fileName={props.title} />
      </div>
    );
  } else {
    return null;
  }
};

export default TanscriptSelector;
