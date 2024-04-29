import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';


export const TranscriptSearch = ({
  enabled = true,
  searchResults,
  searchQuery = null,
  setSearchQuery
}) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!searchInputRef.current) return;
    if (searchQuery) searchInputRef.current.value = searchQuery;
  }, [!!searchInputRef.current]);

  const [focusedMatchIndex, setFocusedMatchIndex] = React.useState(0);
  const searchQueryEmpty = searchQuery === null || searchQuery.replace(/\s/g, '') === '';
  let resultNavigation = null;
  if (!searchQueryEmpty) {
    if (searchResults.ids.length === 0) {
      resultNavigation = (
        <div className="ramp--transcript_search_navigator">
          <span className="ramp--transcript_search_count">no results found</span>
        </div>
      );
    } else if (focusedMatchIndex !== null) {
      resultNavigation = (
        <div className="ramp--transcript_search_navigator">
          <button
            className="ramp--transcript_menu_button ramp--transcript_search_prev"
            type="button"
            disabled={focusedMatchIndex === 0}
            title="Previous Search Result"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (focusedMatchIndex > 0) {
                setFocusedMatchIndex(focusedMatchIndex - 1);
              }
              // setFocusedLine(searchResults.ids[focusedMatchIndex - 1]);
            }}
          >
            <span></span>
          </button>
          <span className="ramp--transcript_search_count">{focusedMatchIndex + 1} of {searchResults.ids.length}</span>
          <button
            className="ramp--transcript_menu_button ramp--transcript_search_next"
            type="button"
            disabled={focusedMatchIndex === searchResults.ids.length - 1}
            title="Next Search Result"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (focusedMatchIndex < searchResults.ids.length - 1) {
                setFocusedMatchIndex(focusedMatchIndex + 1);
              }
              // setFocusedLine(searchResults.ids[focusedMatchIndex + 1]);
            }}
          >
            <span></span>
          </button>
        </div>
      );
    }
  }
  console.log('SearchQuery: ' + searchQuery);
  return (
    <>
      <div className="ramp--transcript_search_input">
        <input
          type="text"
          ref={searchInputRef}
          aria-label="Search the transcript"
          placeholder="Search Transcript..."
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
        />
        <button
          type="button"
          aria-label="Clear search query"
          className="ramp--transcript_menu_button ramp--transcript_search_clear"
          onClick={() => {
            setSearchQuery(null);
            if (searchInputRef.current) searchInputRef.current.value = '';
          }}
          disabled={searchQueryEmpty}
        >
          <span></span>
        </button>
      </div>
      {resultNavigation}
    </>
  );
};


TranscriptSearch.propTypes = {
  setSearchQuery: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.any
  // setFocusedLine: PropTypes.func.isRequired,
  // focusedMatchIndex: PropTypes.number
};

export default TranscriptSearch;