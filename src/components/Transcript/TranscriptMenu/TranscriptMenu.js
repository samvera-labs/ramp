import React from 'react';
import PropTypes from 'prop-types';
import TranscriptSelector from './TranscriptSelector';
import TranscriptSearch from './TranscriptSearch';
import { TRANSCRIPT_TYPES } from '@Services/transcript-parser';
import './TranscriptMenu.scss';

const MACHINE_GEN_MESSAGE = 'Machine-generated transcript may contain errors.';

/**
 * Build menu for the displaying transcript search, search navigation,
 * and transcript selector
 * @param {Object} props
 * @param {Boolean} props.showSearch show/hide search UI
 * @param {Function} props.setAutoScrollEnabled callback func to change auto-scroll preference
 * @param {Boolean} props.autoScrollEnabled flag to indicate auto-scroll transcript check
 * @param {String} props.searchQuery user entered search query
 * @param {Function} props.setSearchQuery callback func to update search query
 * @param {Object} props.searchResults result set from the current search
 * @param {Number} props.focusedMatchIndex index of the focused search hit
 * @param {Function} props.setFocusedMatchIndex callback func to update focused search hit with 
 * search navigation
 */
export const TranscriptMenu = ({
  showSearch,
  setAutoScrollEnabled,
  autoScrollEnabled,
  searchQuery = null,
  setSearchQuery,
  searchResults,
  focusedMatchIndex,
  setFocusedMatchIndex,
  ...selectorProps
}) => {
  const { transcriptInfo } = selectorProps;
  const { tType, isMachineGen } = transcriptInfo;

  return (
    <div className="ramp--transcript_menu">
      {showSearch && (
        <TranscriptSearch
          searchResults={searchResults}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          focusedMatchIndex={focusedMatchIndex}
          setFocusedMatchIndex={setFocusedMatchIndex}
        />
      )}
      <TranscriptSelector {...selectorProps} />
      <div className="ramp--transcript_menu-info">
        {isMachineGen && (
          <p
            key="machine-gen-msg"
            className="ramp--transcript_machine_generated"
            data-testid="transcript-machinegen-msg"
          >
            {MACHINE_GEN_MESSAGE}
          </p>
        )
        }
        {tType === TRANSCRIPT_TYPES.timedText && (
          <div
            className="ramp--transcript_auto_scroll_check"
            data-testid="transcript-auto-scroll-check"
          >
            <input
              type="checkbox"
              id="auto-scroll-check"
              name="autoscrollcheck"
              aria-checked={autoScrollEnabled}
              title={searchQuery !== null
                ? 'Auto-scroll is disabled when searching'
                : ''
              }
              checked={autoScrollEnabled}
              disabled={searchQuery !== null}
              onChange={() => {
                setAutoScrollEnabled(!autoScrollEnabled);
              }}
            />
            <label
              htmlFor="auto-scroll-check"
              title={searchQuery !== null
                ? 'Auto-scroll is disabled when searching'
                : ''
              }
            >
              Auto-scroll with media
            </label>
          </div>
        )}

      </div>
    </div>
  );
};

export default TranscriptMenu;

TranscriptMenu.propTypes = {
  showSearch: PropTypes.bool,
  autoScrollEnabled: PropTypes.bool.isRequired,
  setAutoScrollEnabled: PropTypes.func.isRequired,
  ...TranscriptSelector.propTypes,
  ...TranscriptMenu.propTypes
};
