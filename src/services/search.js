import { useRef, useEffect, useMemo } from 'react';
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
  setSearchResults,
  matchesOnly = false,
  sorter = defaultSorter,
  matcherFactory = defaultMatcherFactory
}) {
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

            if (searchResults.matchingIds.length < 25 || (query !== null && query.length >= 3)) {
              // ^^ don't show a billion markers if we're searching for a short string ^^
              nextMarkers = searchResults.matchingIds.map(id => {
                const result = searchResults.results[id];

                // if (resultItem.begin < playbackRange.start || resultItem.begin > playbackRange.end) return null;
                // ^^ no markers for items outside the playback range ^^

                return {
                  time: result.begin,
                  text: result.text,
                  class: 'ramp--transcript_search-marker'
                };
              });
            }
            playerDispatch({ type: 'setSearchMarkers', payload: nextMarkers.filter(m => m !== null) })
          }

        }
      })
      .catch(e => {
        console.error('search failed', e, query, transcripts);
      })
    );
  }, [matcher, query, enabled, sorter, matchesOnly, playerCtx?.player]);

}
