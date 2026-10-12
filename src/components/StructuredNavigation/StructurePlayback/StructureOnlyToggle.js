import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useStructurePlayback } from '@Services/hooks/useStructurePlayback';
import { ExclamationSVGIcon } from '@Services/svg-icons';
import { timeToHHmmss } from '@Services/utility-helpers';
import './StructureOnlyToggle.scss';

/**
 * A toggle button to toggle structure-only playback ON/OFF. When toggled ON, the media player plays
 * through the defined timespans in Ranges in 'structures' property skipping the gaps in-between.
 * @param {Object} props
 * @param {String} props.label
 * @param {Boolean} props.initStatus
 * @param {Boolean} props.show
 */
const StructureOnlyToggle = ({ label, initStatus, show }) => {
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

  const { firstTimespan, handleChange, onPlayFromBeginning, onTurnOff, showNotice, showStaticStructNotice, structureOnlyPlayback }
    = useStructurePlayback({ toggleState: initStatus, hasUI: show });

  const startTime = useMemo(() => {
    if (firstTimespan) {
      return timeToHHmmss(firstTimespan.times.start);
    }
  }, [firstTimespan]);

  const startLabel = useMemo(() => {
    return firstTimespan ? firstTimespan.label : '';
  }, [firstTimespan, startTime]);

  if (show) {
    // Display the toggle and structure-only playback notice when UI is turned ON
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
        {showNotice && (
          <div className='ramp--structure-only-playback__notice'>
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
        )}
      </div>
    );
  } else if (showStaticStructNotice) {
    // Display a static notice for structure-only playback in the background
    return (
      <div className='ramp--structure-only-playback__notice'>
        <div aria-live='polite' className='ramp--structure-only-playback__banner' role='status'>
          <div className='ramp--structure-only-playback__icon'>
            <ExclamationSVGIcon />
          </div>
          <div className='ramp--structure-only-playback__content'>
            <strong>Structure-only playback is turned on</strong>
            <span>{`Playback will begin at ${startTime} with "${startLabel}"`}</span>
          </div>
        </div>
      </div>
    );
  }
};

StructureOnlyToggle.propTypes = {
  /** Text label for the toggle button. */
  label: PropTypes.string,
  /** Initial structure-only playback toggle status */
  initStatus: PropTypes.bool,
  /** Flag indicating whether to display the UI or not */
  show: PropTypes.bool
};

export default StructureOnlyToggle;
