import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useManifestState, useManifestDispatch } from '../../context/manifest-context';
import './AutoAdvanceToggle.scss';

/**
 * A toggle button to enable/disable auto-play across multiple
 * canvases
 * @param {Object} props
 * @param {String} props.label
 * @param {Boolean} props.showLabel
 */
const AutoAdvanceToggle = ({ label = "Autoplay", showLabel = true }) => {
  const { autoAdvance } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const handleChange = (e) => {
    manifestDispatch({ autoAdvance: e.target.checked, type: "setAutoAdvance" });
  };

  const toggleButton = useMemo(() => {
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
