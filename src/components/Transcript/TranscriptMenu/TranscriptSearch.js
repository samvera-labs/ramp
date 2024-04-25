import React from 'react';

export const TranscriptSearch = ({ }) => {
  return (
    <div className="ramp--transcript_search">
      <input
        type="text"
        placeholder="Search transcript"
        aria-label="Search transcript"
        className="ramp--transcript_search-input"
      />
      <div class="ramp--transcript_search-navigator">
        <button class="ramp--transcript_search-prev" type="button" title="Previous Search Result" disabled="">Previous</button>
        <span class="ramp--transcript_search-count">1 of 32</span>
        <button class="ramp--transcript_search-next" type="button" title="Next Search Result">Next</button>
      </div>
    </div>
  );
};

export default TranscriptSearch;