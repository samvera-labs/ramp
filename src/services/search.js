import { useRef, useEffect, useState, useMemo, useCallback, useContext } from 'react';
import { PlayerDispatchContext } from '../context/player-context';
import { ManifestStateContext } from '../context/manifest-context';
import { getSearchService } from './iiif-parser';
import { getMatchedParts, parseContentSearchResponse } from './transcript-parser';
import { getByTestId } from '@testing-library/react';

export const defaultMatcherFactory = (items) => {
  const mappedItems = items.map(item => item.text.toLocaleLowerCase());
  return (query, abortController) => {
    const qStr = query.trim().toLocaleLowerCase();
    const matchedItems = mappedItems.reduce((results, mappedText, idx) => {
      const matchOffset = mappedText.indexOf(qStr);
      if (matchOffset !== -1) {
        const matchedItem = items[idx];
        const matchParts = getMatchedParts(matchOffset, matchedItem.text, qStr);

        return [
          ...results,
          { ...matchedItem, score: idx, match: matchParts }
        ];
      } else {
        return results;
      }
    }, []);
    return { matchedTranscriptLines: matchedItems, hitCounts: [] };
  };
};

const contentSearchFactory = (searchService, items) => {
  return async (query, abortController) => {
    try {
      const res = await fetch(`${searchService}?q=${query}`,
        { signal: abortController.signal }
      );
      const json = await res.json();
      let results = [];
      if (json.items?.length > 0) {
        const parsed = parseContentSearchResponse(json, query, items);
        // results = parsed.matchedTranscriptLines;
        return parsed;
      }
      return { matchedTranscriptLines: [], hitCounts: [] };
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(e);
        return [];
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
  showMarkers = defaultSearchOpts.showMarkers,
  matchesOnly = defaultSearchOpts.matchesOnly,
  matcherFactory = defaultSearchOpts.matcherFactory
}) {
  const [searchResults, setSearchResults] = useState({ results: {}, ids: [], matchingIds: [], counts: [] });
  const [searchService, setSearchService] = useState();
  const abortControllerRef = useRef(null);

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
      matcher = contentSearchFactory(searchService, itemsWithIds);
    }
    return { matcher, itemsWithIds, itemsIndexed };
  }, [transcripts, matcherFactory]);

  const playerDispatch = useContext(PlayerDispatchContext);
  const manifestState = useContext(ManifestStateContext);

  // Parse searchService from the Canvas/Manifest
  useEffect(() => {
    const { manifest } = manifestState;
    if (manifest) {
      let serviceId = getSearchService(manifest, canvasIndex);
      setSearchService(serviceId);
    }
  }, [canvasIndex]);

  useEffect(() => {
    // abort any existing search operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Cancelling content search request');
    }
  }, [query]);

  useEffect(() => {
    if (!itemsWithIds.length) {
      if (playerDispatch) playerDispatch({ type: 'setSearchMarkers', payload: [] });
      setSearchResults({ results: {}, matchingIds: [], ids: [] });
      return;
    } else if (!enabled || !query) {
      if (playerDispatch) playerDispatch({ type: 'setSearchMarkers', payload: [] });
      const sortedIds = sorter([...itemsWithIds]).map(item => item.id);
      setSearchResults({
        results: itemsIndexed,
        matchingIds: [],
        ids: sortedIds
      });
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    (Promise.resolve(matcher(query, abortControllerRef.current))
      .then(({ matchedTranscriptLines, hitCounts }) => {
        if (abortController.signal.aborted || matchedTranscriptLines == undefined) return;
        const matchingItemsIndexed = matchedTranscriptLines.reduce((acc, match) => ({
          ...acc,
          [match.id]: match
        }), {});
        const sortedMatchIds = sorter([...matchedTranscriptLines], true).map(item => item.id);
        if (matchesOnly) {
          setSearchResults({
            results: matchingItemsIndexed,
            ids: sortedMatchIds,
            matchingIds: sortedMatchIds
          });
        } else {
          const joinedIndexed = {
            ...itemsIndexed,
            ...matchingItemsIndexed
          };
          const sortedItemIds = sorter(Object.values(joinedIndexed), false).map(item => item.id);

          const searchResults = {
            results: joinedIndexed,
            ids: sortedItemIds,
            matchingIds: sortedMatchIds
          };
          setSearchResults(searchResults);
          if (hitCounts?.length > 0) {
            setSearchResults({
              ...searchResults,
              counts: hitCounts,
            });
          }

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
      })
      .catch(e => {
        console.error('search failed', e, query, transcripts);
      })
    );
  }, [matcher, query, enabled, sorter, matchesOnly, showMarkers, playerDispatch]);

  return searchResults;
}

export const useSearchCounts = ({ searchResults, canvasTranscripts }) => {
  const [resultCount, setResultCount] = useState(null);

  if (!searchResults?.counts || canvasTranscripts?.length === 0) {
    return { tanscriptHitCounts: canvasTranscripts, resultCount, setResultCount };
  }

  const hitCounts = searchResults.counts;

  let canvasTranscriptsWithCount = [];
  canvasTranscripts.map((ct) => {
    ct.numberOfHits = hitCounts.find((h) => h.transcriptURL === ct.url).numberOfHits;
    canvasTranscriptsWithCount.push(ct);
  });

  const setResultsNavCount = useCallback((transcriptUrl) => {
    const hitCounts = searchResults.counts;
    if (!(hitCounts === undefined || hitCounts?.length === 0)) {
      const currentCount = hitCounts.find(c => c.transcriptURL === transcriptUrl).numberOfHits;
      setResultCount(currentCount);
    }
  }, []);

  console.log(canvasTranscriptsWithCount);
  return { tanscriptHitCounts: canvasTranscriptsWithCount, resultCount, setResultsNavCount };
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

  return { focusedMatchId, setFocusedMatchId, focusedMatchIndex, setFocusedMatchIndex };
};
