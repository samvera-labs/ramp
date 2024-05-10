import React from 'react';
import PropTypes from 'prop-types';
import TranscriptSelector from './TranscriptSelector';
import TranscriptSearch from './TranscriptSearch';
import { TRANSCRIPT_TYPES } from '@Services/transcript-parser';
import './TranscriptMenu.scss';

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
  const { tType } = transcriptInfo;

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