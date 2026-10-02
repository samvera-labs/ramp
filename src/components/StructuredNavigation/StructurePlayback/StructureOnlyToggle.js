import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useStructurePlayback } from '@Services//hooks/useStructurePlayback';
import { ExclamationSVGIcon } from '@Services//svg-icons';
import { timeToHHmmss } from '@Services/utility-helpers';
import './StructureOnlyToggle.scss';

/**
 * A toggle button to enable/disable structure-only playback. When enabled, the media player plays
 * through the defined timespans in Ranges in 'structures' property skipping the gaps in-between.
 * @param {Object} props
 * @param {String} props.label
 */
const StructureOnlyToggle = ({ label = 'Play structure only' }) => {
  const structureNoticeRef = React.useRef(null);

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

  /**
   * Callback to handle the display of the structure-only playback notice when
   * the buttons in the structure-only playback notice are clicked. This will
   * dissmiss the notice and remove it from the DOM.
   */
  const dismissNotice = () => {
    if (structureNoticeRef.current) {
      structureNoticeRef.current.remove();
      structureNoticeRef.current = null;
    }
  };

  const { firstTimespan, handleChange, structureOnlyPlayback, onPlayFromBeginning, onTurnOff }
    = useStructurePlayback({ dismissNotice });

  const startTime = useMemo(() => {
    if (firstTimespan) {
      return timeToHHmmss(firstTimespan.times.start);
    }
  }, [firstTimespan]);

  const startLabel = useMemo(() => {
    return firstTimespan ? firstTimespan.label : '';
  }, [firstTimespan, startTime]);

  return (
    <div className='ramp--structure-only-playback'>
      <div
        role='switch'
        onClick={handleChange}
        onKeyDown={handleKeyDown}
        aria-checked={String(structureOnlyPlayback)}
        tabIndex={0}
        data-testid='structure-only-playback'
        className='ramp--structure-only-playback__toggle-row'
      >
        <div>
          <strong data-testid='structure-only-playback-label'>
            {label}
          </strong>
          <span>Skip unstructured portions of the media</span>
        </div>
        <span className='slider'>
          <span data-testid='structure-only-playback-toggle'></span>
        </span>
      </div>
      <div className='ramp--structure-only-playback__notice' ref={structureNoticeRef}>
        <div aria-live='polite' className='ramp--structure-only-playback__banner' role='status'>
          <div className='ramp--structure-only-playback__icon'>
            <ExclamationSVGIcon />
          </div>
          <div className='ramp--structure-only-playback__content'>
            <strong>Structure-only playback is turned on</strong>
            <span>{`Playback will begin at ${startTime} with "${startLabel}"`}</span>
            <div className='ramp--structure-only-playback__actions'>
              <button className='start-over' onClick={onPlayFromBeginning}>Play from beginning</button>
              <button className='turn-off' onClick={onTurnOff}>Turn off</button>
            </div>
          </div>
          <button className='ramp--structure-only-playback__dismiss'>×</button>
        </div>
      </div>
    </div>
  );
};

StructureOnlyToggle.propTypes = {
  /** Text label for the toggle button. */
  label: PropTypes.string
};

export default StructureOnlyToggle;
