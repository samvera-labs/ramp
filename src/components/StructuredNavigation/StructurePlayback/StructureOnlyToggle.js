import React from 'react';
import PropTypes from 'prop-types';
import { useStructurePlayback } from '../../../services/hooks/useStructurePlayback';
import './StructureOnlyToggle.scss';

/**
 * A toggle button to enable/disable structure-only playback. When enabled, the media player plays
 * through the defined timespans in Ranges in 'structures' property skipping the gaps in-between.
 * @param {Object} props
 * @param {String} props.label
 */
const StructureOnlyToggle = ({ label = 'Play structure only' }) => {
  const { structureOnlyPlayback, handleChange } = useStructurePlayback();

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
      aria-checked={String(structureOnlyPlayback)}
      tabIndex={0}
      data-testid='structure-only-playback'
      className='ramp--structure-only-playback'
    >
      <span className='ramp--structure-only-playback-label'
        data-testid='structure-only-playback-label'>
        {label}
      </span>
      <span className='slider'>
        <span data-testid='structure-only-playback-toggle'></span>
      </span>
    </div>

  );
};

StructureOnlyToggle.propTypes = {
  /** Text label for the toggle button. */
  label: PropTypes.string
};

export default StructureOnlyToggle;
