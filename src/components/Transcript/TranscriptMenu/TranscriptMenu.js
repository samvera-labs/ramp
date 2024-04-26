import React from 'react';
import PropTypes from 'prop-types';
import TranscriptSelector from './TranscriptSelector';
import TranscriptSearch from './TranscriptSearch';
import { TRANSCRIPT_TYPES } from '@Services/transcript-parser';
import './TranscriptMenu.scss';


export const TranscriptMenu = ({
  showSearch,
  setAutoScroll,
  ...selectorProps
}) => {
  const { transcriptInfo } = selectorProps;
  const { tType } = transcriptInfo;
  const [autoScrollChecked, setAutoScrollChecked] = React.useState(true);

  return (
    <div className="ramp--transcript_menu">
      {showSearch && <TranscriptSearch />}
      <TranscriptSelector {...selectorProps} />
      {tType === TRANSCRIPT_TYPES.timedText && (
        <div
          className="ramp--transcript_auto_scroll_check"
          data-testid="transcript-auto-scroll-check"
        >
          <input
            type="checkbox"
            id="auto-scroll-check"
            name="autoscrollcheck"
            aria-checked={autoScrollChecked}
            checked={autoScrollChecked}
            onChange={() => {
              const checkValue = !autoScrollChecked;
              setAutoScrollChecked(checkValue);
              setAutoScroll(checkValue);
            }}
          />
          <label htmlFor="auto-scroll-check">Auto-scroll with media</label>
        </div>
      )}
    </div>
  );
};

export default TranscriptMenu;

TranscriptMenu.propTypes = {
  showSearch: PropTypes.bool,
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