import { useRef, useEffect, useMemo } from 'react';
import createFuzzySearch from '@nozbe/microfuzz';

const defaultMatcherFactory = (items) => {
  const wrapped = items.map((item, idx) => (
    (typeof item === 'string'
      ? { text: item, id: idx }
      : { id: idx, ...item }
    )
  ));

  const fuzzySearch = createFuzzySearch(wrapped, {
    key: 'text',
    strategy: 'smart'
  });

  return (query, abortController) => {
    return fuzzySearch(query).map(m => (
      { ...m.item, matches: m.matches, score: m.score }
    ));
  };
};

const defaultSorter = (items) => items;


export function useFilteredTranscripts({
  enabled,
  query,
  transcripts,
  setSearchResults,
  sorter = defaultSorter,
  matcherFactory = defaultMatcherFactory
}) {
  const abortControllerRef = useRef(null);

  const matcher = useMemo(() => (
    matcherFactory(transcripts)
  ), [transcripts, matcherFactory]);


  useEffect(() => {
    console.log('foobar')
    if (!transcripts || !transcripts.length || !enabled || !query) {
      setSearchResults({ results: {}, ids: [], idsScored: [] });
      return;
    }

    const abortController = new AbortController();
    // abort any existing search operations
    if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) abortControllerRef.current.abort();
    abortControllerRef.current = abortController;
    (Promise.resolve(matcher(query, abortController))
      .then((filtered) => {
        if (abortController.signal.aborted) return;
        if (filtered.length) {
          setSearchResults({
            results: filtered.reduce((acc, match) => ({
              ...acc,
              [match.id]: match
            }), {}),
            idsScored: sorter(filtered).map(match => match.id),
            ids: filtered.map(match => match.id).sort((a, b) => a - b)
          });
        } else {
          setSearchResults({
            results: {},
            ids: [],
            idsScored: []
          });
        }
      })
      .catch(e => {
        console.error('search failed', e, query, transcripts);
      })
    );
  }, [matcher, query, enabled]);
}
