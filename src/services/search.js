import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { usePlayerState, usePlayerDispatch } from '../context/player-context';

const defaultMatcherFactory = (items) => {
  const mappedItems = items.map(item => item.text.toLocaleLowerCase());
  return (query, abortController) => {
    const qStr = query.trim().toLocaleLowerCase();
    const matchedItems = mappedItems.reduce((results, mappedText, idx) => {
      const matchOffset = mappedText.indexOf(qStr);
      if (matchOffset !== -1) {
        const matchedItem = items[idx];
        const matchParts = [
          matchedItem.text.slice(0, matchOffset),
          matchedItem.text.slice(matchOffset, matchOffset + qStr.length),
          matchedItem.text.slice(matchOffset + qStr.length)
        ];

        return [
          ...results,
          { ...matchedItem, score: idx, match: matchParts }
        ];
      } else {
        return results;
      }
    }, []);
    return matchedItems;
  };
};

const defaultSorter = (items) => items.sort((a, b) => a.id - b.id);

export function useFilteredTranscripts({
  enabled,
  query,
  transcripts,
  matchesOnly = false,
  sorter = defaultSorter,
  matcherFactory = defaultMatcherFactory
}) {
  const [searchResults, setSearchResults] = useState({ results: {}, ids: [], matchingIds: [] });
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
    const matcher = matcherFactory(itemsWithIds);
    return { matcher, itemsWithIds, itemsIndexed };
  }, [transcripts, matcherFactory]);

  const playerCtx = usePlayerState();
  const playerDispatch = usePlayerDispatch();

  useEffect(() => {
    if (!itemsWithIds.length) {
      setSearchResults({ results: {}, matchingIds: [], ids: [] });
      return;
    } else if (!enabled || !query) {
      const sortedIds = sorter([...itemsWithIds]).map(item => item.id);

      setSearchResults({
        results: itemsIndexed,
        matchingIds: [],
        ids: sortedIds
      });
      return;
    }

    const abortController = new AbortController();
    // abort any existing search operations
    if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) abortControllerRef.current.abort();
    abortControllerRef.current = abortController;

    (Promise.resolve(matcher(query, abortController))
      .then((filtered) => {
        if (abortController.signal.aborted) return;
        const matchingItemsIndexed = filtered.reduce((acc, match) => ({
          ...acc,
          [match.id]: match
        }), {});
        const sortedMatchIds = sorter([...filtered]).map(item => item.id);
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
          const sortedItemIds = sorter(Object.values(joinedIndexed)).map(item => item.id);

          const searchResults = {
            results: joinedIndexed,
            ids: sortedItemIds,
            matchingIds: sortedMatchIds
          };
          setSearchResults(searchResults);

          if (playerCtx?.player) {
            let nextMarkers = [];

            if (
              searchResults.matchingIds.length < 25
              || (query?.length >= 4 && searchResults.matchingIds.length < 45)
            ) {
              // ^^ don't show a billion markers if we're searching for a short string ^^
              nextMarkers = searchResults.matchingIds.map(id => {
                const result = searchResults.results[id];
                return {
                  time: result.begin,
                  text: '',
                  class: 'ramp--track-marker--search'
                };
              });
            }
            playerDispatch({ type: 'setSearchMarkers', payload: nextMarkers })
          }
        }
      })
      .catch(e => {
        console.error('search failed', e, query, transcripts);
      })
    );
  }, [matcher, query, enabled, sorter, matchesOnly, playerCtx?.player]);

  return searchResults;
}


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
}