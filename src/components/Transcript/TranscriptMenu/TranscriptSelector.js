import React from 'react';
import PropTypes from 'prop-types';
import TranscriptDownloader from './TranscriptDownloader';
import { TRANSCRIPT_TYPES } from '@Services/transcript-parser';

const MACHINE_GEN_MESSAGE = 'Machine-generated transcript may contain errors.';

const TranscriptSelector = ({
  selectTranscript,
  transcriptData,
  transcriptInfo,
  noTranscript,
  setAutoScroll
}) => {
  const { filename, id, tUrl, tFileExt, tType, isMachineGen } = transcriptInfo;

  const [autoScrollCheck, setAutoScrollCheck] = React.useState(true);

  const selectItem = (event) => {
    selectTranscript(event.target.value);
  };

  /**
   * Event handler for auto-scroll check box status changes
   */
  const handleOnChange = () => {
    const checkValue = !autoScrollCheck;
    setAutoScrollCheck(checkValue);
    setAutoScroll(checkValue);
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
            value={id || ''} // value prop cannot be null, which happens for a split second on initial load
            onChange={selectItem}
            aria-label="Select transcripts"
            aria-expanded={false}
            aria-haspopup="true"
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
            fileName={filename}
            fileExt={tFileExt}
            machineGenerated={isMachineGen} />
        }
        {isMachineGen &&
          <p className="ramp--transcript_machine_generated" data-testid="transcript-machinegen-msg">
            {MACHINE_GEN_MESSAGE}
          </p>
        }
        {tType === TRANSCRIPT_TYPES.timedText && (
          <div className="ramp--transcript_auto_scroll_check"
            data-testid="transcript-auto-scroll-check">
            <input
              type="checkbox"
              id="auto-scroll-check"
              name="autoscrollcheck"
              aria-checked={autoScrollCheck}
              checked={autoScrollCheck}
              onChange={handleOnChange}
            />
            <label htmlFor="auto-scroll-check">Auto-scroll with media</label>
          </div>)
        }
      </div>
    );
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
  noTranscript: PropTypes.bool.isRequired,
  setAutoScroll: PropTypes.func.isRequired,
};

export default TranscriptSelector;
