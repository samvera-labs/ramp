import React from 'react';
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
const AutoAdvanceToggle = ({ label = 'Autoplay', showLabel = true }) => {
  const { autoAdvance } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const handleChange = (e) => {
    e.target.setAttribute('aria-checked', String(!autoAdvance));
    manifestDispatch({ autoAdvance: !autoAdvance, type: 'setAutoAdvance' });
  };

  /**
   * On Space/Enter keypresses enable toggle button
   * @param {Event} e keydown event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChange(e);
    }
  };

  return (
    <div
      role='switch'
      onClick={handleChange}
      onKeyDown={handleKeyDown}
      aria-checked={String(autoAdvance)}
      tabIndex={0}
      data-testid='auto-advance'
      className='ramp--auto-advance'
    >
      {showLabel && (
        <span className='ramp--auto-advance-label'
          data-testid='auto-advance-label'>
          {label}
        </span>
      )}
      <span className='slider'>
        <span data-testid='auto-advance-toggle'></span>
      </span>
    </div>

  );
};

AutoAdvanceToggle.propTypes = {
  label: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default AutoAdvanceToggle;
