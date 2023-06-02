import React from 'react';
import PropTypes from 'prop-types';
import TranscriptDownloader from './TranscriptDownloader';

const MACHINE_GEN_MESSAGE = 'Machine-generated transcript may contain errors.';

const TanscriptSelector = ({
  setTranscript,
  title,
  url,
  transcriptData,
  noTranscript,
  machineGenerated }) => {
  const [currentTitle, setCurrentTitle] = React.useState(title);

  const selectItem = (event) => {
    setCurrentTitle(event.target.value);
    setTranscript(event.target.value);
  };

  if (transcriptData) {
    return (
      <div
        className="ramp--transcript_selector"
        data-testid="transcript-selector"
      >
        <div className="ramp--transcript_list">
          <select
            className="transcript_list"
            data-testid="transcript-select-option"
            value={currentTitle}
            onChange={selectItem}
          >
            {transcriptData.map((t, i) => (
              <option value={t.title} key={i} >
                {t.title}
              </option>
            ))}
          </select>
        </div>
        {!noTranscript &&
          <TranscriptDownloader
            fileUrl={url}
            fileName={title}
            machineGenerated={machineGenerated} />
        }
        {machineGenerated &&
          <p className="ramp--transcript_machine_generated" data-testid="transcript-machinegen-msg">
            {MACHINE_GEN_MESSAGE}
          </p>
        }
      </div>
    );
  } else {
    return null;
  }
};

TanscriptSelector.propTypes = {
  setTranscript: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  transcriptData: PropTypes.array.isRequired,
  noTranscript: PropTypes.bool.isRequired,
  machineGenerated: PropTypes.bool.isRequired
};

export default TanscriptSelector;
