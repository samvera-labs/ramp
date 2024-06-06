import React from 'react';
import PropTypes from 'prop-types';
import TranscriptDownloader from './TranscriptDownloader';

const MACHINE_GEN_MESSAGE = 'Machine-generated transcript may contain errors.';

const TranscriptSelector = ({
  selectTranscript,
  transcriptData,
  transcriptInfo,
  noTranscript
}) => {
  const { filename, id, tUrl, tFileExt, isMachineGen } = transcriptInfo;

  const selectItem = (event) => {
    selectTranscript(event.target.value);
  };

  if (transcriptData) {
    const result = [
      <div
        key="transcript-selector"
        data-testid="transcript-selector"
        className="ramp--transcript_selector"
      >
        <select
          data-testid="transcript-select-option"
          value={id || ''} // value prop cannot be null, which happens for a split second on initial load
          onChange={selectItem}
          aria-label="Select transcripts"
          aria-expanded={false}
          aria-haspopup="true"
        >
          {transcriptData.map((t, i) => (
            <option value={t.id}
              label={`${t.title}${t.numberOfHits ? ' (' + t.numberOfHits + ')' : ''}`}
              key={i}>
              {`${t.title}${t.numberOfHits ? ' (' + t.numberOfHits + ')' : ''}`}
            </option>
          ))}
        </select>
        {!noTranscript && (
          <TranscriptDownloader
            key="transcript-downloader"
            fileUrl={tUrl}
            fileName={filename}
            fileExt={tFileExt}
            machineGenerated={isMachineGen}
          />
        )}
      </div>
    ];

    if (isMachineGen) {
      result.push(
        <p
          key="machine-gen-msg"
          className="ramp--transcript_machine_generated"
          data-testid="transcript-machinegen-msg"
        >
          {MACHINE_GEN_MESSAGE}
        </p>
      );
    }
    return result;
  } else {
    return null;
  }
};

TranscriptSelector.propTypes = {
  selectTranscript: PropTypes.func.isRequired,
  transcriptData: PropTypes.array.isRequired,
  transcriptInfo: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
    tUrl: PropTypes.string,
    tFileExt: PropTypes.string,
    isMachineGen: PropTypes.bool
  }).isRequired,
  noTranscript: PropTypes.bool.isRequired
};

export default TranscriptSelector;
