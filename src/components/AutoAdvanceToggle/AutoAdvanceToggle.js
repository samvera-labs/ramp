import React from 'react';
import { useManifestState, useManifestDispatch } from '../../context/manifest-context';
import './AutoAdvanceToggle.scss';

const AutoAdvanceToggle = ({ label = "Autoplay", showLabel = true }) => {
  const { manifest, autoAdvance } = useManifestState();
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
      <label className="ramp--auto-advance-toggle"
        aria-labelledby='auto-advance-toggle-label'
      >
        <input
          data-testid="auto-advance-toggle"
          name="auto-advance-toggle"
          type="checkbox"
          checked={autoAdvance}
          onChange={e => manifestDispatch({ autoAdvance: e.target.checked, type: "setAutoAdvance" })}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default AutoAdvanceToggle;
