import { useRef, useEffect, useState, useMemo, useCallback, useContext } from 'react';
import { PlayerDispatchContext } from '../context/player-context';
import { ManifestStateContext } from '../context/manifest-context';
import { getSearchService } from './iiif-parser';
import { getMatchedTranscriptLines, parseContentSearchResponse } from './transcript-parser';

export const defaultMatcherFactory = (items) => {
  const mappedItems = items.map(item => item.text.toLocaleLowerCase());
  return (query, abortController) => {
    const queryRegex = new RegExp(String.raw`\b${query}\b`, 'i');
    const qStr = query.trim().toLocaleLowerCase();
    const matchedItems = mappedItems.reduce((results, mappedText, idx) => {
      const matchOffset = mappedText.search(queryRegex);
      if (matchOffset !== -1) {
        const matchedItem = items[idx];
        // Always takes only the first search hit
        const matchCount = 1;
        const [prefix, hit, suffix] = [
          matchedItem.text.slice(0, matchOffset),
          matchedItem.text.slice(matchOffset, matchOffset + qStr.length),
          matchedItem.text.slice(matchOffset + qStr.length)
        ];
        // Add highlight to the search match
        const match = `${prefix}<span class="ramp--transcript_highlight">${hit}</span>${suffix}`;
        return [
          ...results,
          { ...matchedItem, score: idx, match, matchCount }
        ];
      } else {
        return results;
      }
    }, []);
    return { matchedTranscriptLines: matchedItems, hitCounts: [], allSearchHits: null };
  };
};

export const contentSearchFactory = (searchService, items, selectedTranscript) => {
  return async (query, abortController) => {
    try {
      const res = await fetch(`${searchService}?q=${query}`,
        { signal: abortController.signal }
      );
      const json = await res.json();
      if (json.items?.length > 0) {
        const parsed = parseContentSearchResponse(json, query, items, selectedTranscript);
        return parsed;
      }
      return { matchedTranscriptLines: [], hitCounts: [], allSearchHits: null };
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(e);
        return { matchedTranscriptLines: [], hitCounts: [], allSearchHits: null };
      }
    }
  };
};

export const defaultSorter = (items) => items.sort((a, b) => a.id - b.id);

export const defaultSearchOpts = {
  initialSearchQuery: null,
  showMarkers: true,
  matcherFactory: defaultMatcherFactory,
  sorter: defaultSorter,
  matchesOnly: false
};

export const useSearchOpts = (opts) => {
  return (opts && opts.isSearchable
    ? { ...defaultSearchOpts, ...opts, enabled: true }
    : { ...defaultSearchOpts, enabled: false }
  );
};

export function useFilteredTranscripts({
  query,
  sorter = defaultSearchOpts.sorter,
  enabled = true,
  transcripts,
  canvasIndex,
  selectedTranscript,
  showMarkers = defaultSearchOpts.showMarkers,
  matchesOnly = defaultSearchOpts.matchesOnly,
  matcherFactory = defaultSearchOpts.matcherFactory
}) {
  const [searchResults, setSearchResults] = useState({ results: {}, ids: [], matchingIds: [], counts: [] });
  const [searchService, setSearchService] = useState();
  const [allSearchResults, setAllSearchResults] = useState(null);
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(0);

  const { matcher, itemsWithIds, itemsIndexed } = useMemo(() => {
    const itemsWithIds = (transcripts || []).map((item, idx) => (
      (typeof item === 'string'
        ? { text: item, id: idx }
        : { id: idx, ...item }
      )
    ));
    const itemsIndexed = itemsWithIds.reduce((acc, item) => ({
      ...acc,
      [item.id]: item
    }), {});
    let matcher = matcherFactory(itemsWithIds);
    if (searchService != null && searchService != undefined) {
      matcher = contentSearchFactory(searchService, itemsWithIds, selectedTranscript);
    }
    return { matcher, itemsWithIds, itemsIndexed };
  }, [transcripts, matcherFactory, selectedTranscript]);

  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);

  // Parse searchService from the Canvas/Manifest
  useEffect(() => {
    const { manifest } = manifestState;
    if (manifest) {
      let serviceId = getSearchService(manifest, canvasIndex);
      setSearchService(serviceId);
    }
    // Reset cached search hits on Canvas change
    setAllSearchResults(null);
  }, [canvasIndex]);

  useEffect(() => {
    // abort any existing search operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Cancelling content search request');
    }
    // Invoke the search factory when query is changed
    if (query) {
      callSearchFactory();
    }
  }, [query]);

  useEffect(() => {
    if (!itemsWithIds.length) {
      if (playerDispatch) playerDispatch({ type: 'setSearchMarkers', payload: [] });
      // Update searchResult instead of replacing to preserve the hit count
      setSearchResults({
        ...searchResults,
        results: {}, matchingIds: [], ids: [], sortedMatchCounts: []
      });
      return;
    } else if (!enabled || !query) {
      if (playerDispatch) playerDispatch({ type: 'setSearchMarkers', payload: [] });
      const sortedIds = sorter([...itemsWithIds]).map(item => item.id);
      setSearchResults({
        ...searchResults,
        results: itemsIndexed,
        matchingIds: [],
        sortedMatchCounts: [],
        ids: sortedIds
      });
      // When query is cleared; clear cached search results
      if (!query) {
        setAllSearchResults(null);
      }
      return;
    }

    // Use cached search results to find matches when switching between transcripts with same query
    if (allSearchResults != null) {
      const transcriptSearchResults = allSearchResults[selectedTranscript];
      const searchHits = getMatchedTranscriptLines(transcriptSearchResults, query, itemsWithIds);
      markMatchedItems(searchHits, searchResults?.counts, allSearchResults);
    } else {
      // Invoke search factory call when there are no cached search results
      callSearchFactory();
    }
  }, [matcher, query, enabled, sorter, matchesOnly, showMarkers, playerDispatch, selectedTranscript]);

  const callSearchFactory = () => {
    if (!debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    /**
     * Use setTimeout without a delay to defer the code block execution and schedule it to
     * run when the call stack is clear. This helps to prevent unnecessary intermediate UI
     * updates with the search results.
     */
    debounceTimerRef.current = setTimeout(() => {
      (Promise.resolve(matcher(query, abortControllerRef.current))
        .then(({ matchedTranscriptLines, hitCounts, allSearchHits }) => {
          if (abortController.signal.aborted) return;
          markMatchedItems(matchedTranscriptLines, hitCounts, allSearchHits);
        })
        .catch(e => {
          console.error('search failed', e, query, transcripts);
        })
      );
    });
  };
  /**
   * Generic function to prepare a list of search hits to be displayed in the transcript 
   * component either from a reponse from a content search API call (using content search factory)
   * across multiple transcripts or a single JS search using the default matcher factory.
   * @param {Array} matchedTranscriptLines an array of matched transcript lines with ids
   * @param {Array} hitCounts search hit counts for each transcript in the selected canvas
   * @param {Object} allSearchHits a map of search hits grouped by transcript
   * @returns 
   */
  const markMatchedItems = (matchedTranscriptLines, hitCounts = [], allSearchHits = null) => {
    /**
     * Set all search results and hit counts for each transcript before compiling the
     * matching search hit list for transcript lines. When there are no matches for the
     * current transcript, but there are for others this needs to be set here to avoid
     * duplicate API requests for content search when switching between transcripts.
     */
    setAllSearchResults(allSearchHits);
    let searchResults = {
      results: itemsWithIds,
      matchingIds: [],
      ids: sorter([...itemsWithIds]).map(item => item.id),
      counts: hitCounts?.length > 0 ? hitCounts : [],
    };
    if (matchedTranscriptLines === undefined) {
      setSearchResults({
        ...searchResults
      });
      return;
    };
    const matchingItemsIndexed = matchedTranscriptLines.reduce((acc, match) => ({
      ...acc,
      [match.id]: match
    }), {});

    const sortedMatchedLines = sorter([...matchedTranscriptLines], true);

    // Use matchCount for each cue to get the results count correct in UI
    let sortedMatchIds = [];
    sortedMatchedLines.map(item => {
      if (item.matchCount != undefined) {
        let count = 0;
        while (count < item.matchCount) {
          sortedMatchIds.push(item.id);
          count++;
        }
      }
    });

    const sortedMatchCounts = sortedMatchedLines.map((t) => ({ id: t.id, matchCount: t.matchCount }));

    if (matchesOnly) {
      setSearchResults({
        ...searchResults,
        results: matchingItemsIndexed,
        ids: sortedMatchIds,
        sortedMatchCounts: sortedMatchCounts,
        matchingIds: sortedMatchIds,
      });
    } else {
      const joinedIndexed = {
        ...itemsIndexed,
        ...matchingItemsIndexed
      };
      const sortedItemIds = sorter(Object.values(joinedIndexed), false).map(item => item.id);

      searchResults = {
        ...searchResults,
        results: joinedIndexed,
        ids: sortedItemIds,
        sortedMatchCounts: sortedMatchCounts,
        matchingIds: sortedMatchIds,
      };
      setSearchResults(searchResults);

      if (playerDispatch) {
        if (showMarkers) {
          let nextMarkers = [];
          if (
            searchResults.matchingIds.length < 25
            || (query?.length >= 4 && searchResults.matchingIds.length < 45)
          ) {
            // ^^ don't show a bazillion markers if we're searching for a short string ^^
            nextMarkers = searchResults.matchingIds.map(id => {
              const result = searchResults.results[id];
              return {
                time: result.begin,
                text: '',
                class: 'ramp--track-marker--search'
              };
            });
          }
          playerDispatch({ type: 'setSearchMarkers', payload: nextMarkers });
        } else {
          playerDispatch({ type: 'setSearchMarkers', payload: [] });
        }
      }
    }
  };

  return searchResults;
}

/**
 * Calculate the search hit count for each transcript in the canvas, when use type-in a search
 * query. Hit counts are cleared when search query is reset.
 * @param {Object.searchResults} searchResults search result object from useFilteredTranscripts hook
 * @param {Object.canvasTranscripts} canvasTranscripts a list of all the transcripts in the canvas 
 * @returns a list of all transcripts in the canvas with number of search hits for each transcript
 */
export const useSearchCounts = ({ searchResults, canvasTranscripts, searchQuery }) => {
  if (!searchResults?.counts || canvasTranscripts?.length === 0 || searchQuery === null) {
    return canvasTranscripts;
  }

  const hitCounts = searchResults.counts;
  let canvasTranscriptsWithCount = [];
  canvasTranscripts.map((ct) => {
    const numberOfHits = hitCounts.find((h) => h.transcriptURL === ct.url)?.numberOfHits || 0;
    canvasTranscriptsWithCount.push({ ...ct, numberOfHits });
  });

  return canvasTranscriptsWithCount;
};

export const useFocusedMatch = ({ searchResults }) => {
  const [focusedMatchIndex, setFocusedMatchIndex] = useState(null);
  const focusedMatchId = (focusedMatchIndex === null
    ? null
    : searchResults.matchingIds[focusedMatchIndex]
  );

  const setFocusedMatchId = useCallback((id) => {
    const index = searchResults.matchingIds.indexOf(id);
    if (index !== -1) {
      setFocusedMatchIndex(index);
    } else {
      setFocusedMatchIndex(null);
    }
  }, [searchResults.matchingIds]);

  useEffect(() => {
    if (!searchResults.matchingIds.length && focusedMatchIndex !== null) {
      setFocusedMatchIndex(null);
    } else if (searchResults.matchingIds.length && focusedMatchIndex === null) {
      setFocusedMatchIndex(0); // focus the first match
    } else if (focusedMatchIndex !== null && focusedMatchIndex >= searchResults.matchingIds.length) {
      // as the list of results gets shorter, make sure we don't show "10 of 3" in the search navigator
      setFocusedMatchIndex(searchResults.matchingIds.length - 1);
    }
  }, [searchResults.matchingIds, focusedMatchIndex]);

  useEffect(() => {
    if (searchResults.matchingIds.length && focusedMatchIndex > 0) {
      setFocusedMatchIndex(null);
    }
  }, [searchResults.matchingIds]);

  return { focusedMatchId, setFocusedMatchId, focusedMatchIndex, setFocusedMatchIndex };
};
