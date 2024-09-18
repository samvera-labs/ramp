import React from 'react';
import PropTypes from 'prop-types';
import { useManifestState, useManifestDispatch } from '../../context/manifest-context';
import './AutoAdvanceToggle.scss';

const AutoAdvanceToggle = ({ label = "Autoplay", showLabel = true }) => {
  const { autoAdvance } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const handleChange = (e) => {
    manifestDispatch({ autoAdvance: e.target.checked, type: "setAutoAdvance" });
  };

  const toggleButton = React.useMemo(() => {
    return (<input
      data-testid="auto-advance-toggle"
      name="auto-advance-toggle"
      type="checkbox"
      checked={autoAdvance}
      aria-label={label}
      onChange={handleChange}
    />);
  }, [autoAdvance]);

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
        aria-labelledby="auto-advance-toggle-label">
        {toggleButton}
        <span className="slider round"></span>
      </label>
    </div>
  );
};

AutoAdvanceToggle.propTypes = {
  label: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default AutoAdvanceToggle;
