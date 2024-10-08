import React, { useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SearchArrow } from '@Services/svg-icons';
import debounce from 'lodash/debounce';

/**
 * Build search within UI in the transcript search and handle user queries
 * @param {Object} props
 * @param {Object} props.searchResults result set from the current search
 * @param {String} props.searchQuery search query entered by the user
 * @param {Number} props.focusedMatchIndex index of the focused the search hit
 * @param {Function} props.setFocusedMatchIndex callback func to update focused match in search hits
 * @param {Function} props.setSearchQuery callback func to set search query
 */
export const TranscriptSearch = ({
  searchResults,
  searchQuery = null,
  focusedMatchIndex,
  setFocusedMatchIndex,
  setSearchQuery
}) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!searchInputRef.current) return;
    if (searchQuery) searchInputRef.current.value = searchQuery;
  }, [!!searchInputRef.current]);

  const handleOnChange = useMemo(
    () =>
      debounce((event) => {
        setSearchQuery(event.target.value);
      }, 100),
    []
  );

  const searchQueryEmpty = searchQuery === null || searchQuery.replace(/\s/g, '') === '';

  let resultNavigation = null;
  if (!searchQueryEmpty) {
    if (searchResults.matchingIds.length === 0) {
      resultNavigation = (
        <div className="ramp--transcript_search_navigator">
          <span
            data-testid="transcript-search-count"
            className="ramp--transcript_search_count"
          >
            no results found in this transcript
          </span>
        </div>
      );
    } else if (focusedMatchIndex !== null) {
      resultNavigation = (
        <div className="ramp--transcript_search_navigator">
          <button
            type="button"
            data-testid="transcript-search-prev"
            className="ramp--transcript_menu_button ramp--transcript_search_prev"
            disabled={focusedMatchIndex === 0}
            title="Previous Search Result"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (focusedMatchIndex > 0) {
                setFocusedMatchIndex(focusedMatchIndex - 1);
              }
            }}
          >
            <SearchArrow flip={true} />
          </button>
          <span
            className="ramp--transcript_search_count"
            data-testid="transcript-search-count"
          >
            {focusedMatchIndex + 1} of {searchResults.matchingIds.length} results
          </span>
          <button
            className="ramp--transcript_menu_button ramp--transcript_search_next"
            type="button"
            data-testid="transcript-search-next"
            disabled={focusedMatchIndex >= searchResults.matchingIds.length - 1}
            title="Next Search Result"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (focusedMatchIndex < searchResults.matchingIds.length - 1) {
                setFocusedMatchIndex(focusedMatchIndex + 1);
              }
            }}
          >
            <SearchArrow />
          </button>
        </div >
      );
    }
  }
  return (
    <>
      <div className="ramp--transcript_search_input">
        <input
          type="text"
          ref={searchInputRef}
          data-testid="transcript-search-input"
          aria-label="Search the transcript"
          placeholder="Search Transcript..."
          onChange={(event) => {
            if (event.target.value.trim() == '') {
              setSearchQuery(null);
            } else {
              handleOnChange(event);
            }
          }}
        />
        {!searchQueryEmpty && (
          <button
            type="button"
            aria-label="Clear search query!"
            data-testid="transcript-search-clear"
            className="ramp--transcript_menu_button ramp--transcript_search_clear"
            onClick={() => {
              setSearchQuery(null);
              if (searchInputRef.current) searchInputRef.current.value = '';
              // Set focus to the search input field
              searchInputRef.current.focus();
            }}
          >
            <span></span>
          </button>
        )}
      </div>
      {resultNavigation}
    </>
  );
};

TranscriptSearch.propTypes = {
  setSearchQuery: PropTypes.func.isRequired,
  focusedMatchIndex: PropTypes.number,
  setFocusedMatchIndex: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.any
};

export default TranscriptSearch;
