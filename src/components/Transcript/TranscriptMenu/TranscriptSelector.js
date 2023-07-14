import React from 'react';
import PropTypes from 'prop-types';
import TranscriptDownloader from './TranscriptDownloader';

const MACHINE_GEN_MESSAGE = 'Machine-generated transcript may contain errors.';

const TanscriptSelector = ({
  setTranscript,
  transcriptData,
  transcriptInfo,
  noTranscript,
}) => {
  const { title, id, tUrl, tFileExt, isMachineGen } = transcriptInfo;
  const [currentId, setCurrentId] = React.useState(id);

  const selectItem = (event) => {
    setCurrentId(event.target.value);
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
            value={currentId}
            onChange={selectItem}
          >
            {transcriptData.map((t, i) => (
              <option value={t.id} label={t.title} key={i}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
        {!noTranscript &&
          <TranscriptDownloader
            fileUrl={tUrl}
            fileName={title}
            fileExt={tFileExt}
            machineGenerated={isMachineGen} />
        }
        {isMachineGen &&
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
  transcriptData: PropTypes.array.isRequired,
  transcriptInfo: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
    tUrl: PropTypes.string,
    tFileExt: PropTypes.string,
    isMachineGen: PropTypes.bool
  }).isRequired,
  noTranscript: PropTypes.bool.isRequired,
};

export default TanscriptSelector;
