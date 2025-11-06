import React, { memo } from 'react';
import PropTypes from 'prop-types';
import TranscriptDownloader from './TranscriptDownloader';

/**
 * Build seletor and downloader for transcripts in the current Canvas
 * @param {Object} props
 * @param {Function} props.selectTranscript callback func to update transcript selection
 * @param {Array} props.transcriptData list of the information for each transcirpt in the Canvas
 * @param {Object} props.transcriptInfo information of the selected transcript
 * @param {Boolean} props.noTranscript flag to indicate unsupported transcript selection
 */
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

  if (transcriptData?.length > 0) {
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

export default memo(TranscriptSelector);
