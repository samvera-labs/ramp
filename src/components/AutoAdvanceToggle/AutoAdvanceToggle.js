import React from 'react';
import PropTypes from 'prop-types';
import { useManifestState, useManifestDispatch } from '../../context/manifest-context';
import './AutoAdvanceToggle.scss';

const AutoAdvanceToggle = ({ label = "Autoplay", showLabel = true }) => {
  const { autoAdvance } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  return (
    <div data-testid="auto-advance" className="ramp--auto-advance">
      {showLabel && (
        <span
          className="ramp--auto-advance-label"
          data-testid="auto-advance-label"
          htmlFor="auto-advance-toggle"
          id="auto-advance-toggle-label"
        >
          {label}
        </span>
      )}
      <div className="ramp--auto-advance-toggle">
        <input
          data-testid="auto-advance-toggle"
          name="auto-advance-toggle"
          type="checkbox"
          checked={autoAdvance}
          aria-label={label}
          onChange={e => manifestDispatch({ autoAdvance: e.target.checked, type: "setAutoAdvance" })}
        />
        <span className="slider round"></span>
      </div>
    </div>
  );
};

AutoAdvanceToggle.propTypes = {
  label: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default AutoAdvanceToggle;
