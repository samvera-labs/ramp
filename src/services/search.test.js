import React, { useEffect } from 'react';
import { PlayerProvider } from '../context/player-context';
import { useFilteredTranscripts, defaultMatcherFactory, contentSearchFactory, useSearchCounts } from './search';
import { render, waitFor } from '@testing-library/react';
import { ManifestProvider } from '../context/manifest-context';

const transcriptsFixture = [
  { id: 0, begin: 0.0, end: 10.0, text: 'The party has begun.' },
  { id: 1, begin: 71.9, end: 82.0, text: 'I believe that on the first night I went to Gatsby\'s house' },
  { id: 2, begin: 83.0, end: 85.0, text: 'I was one of the few guests who had actually been invited.' },
  { id: 3, begin: 90.4, end: 95.3, text: 'People were not invited-they went there. They got into automobiles which bore them out to Long Island,' },
  { id: 4, begin: 96.4, end: 102.5, text: 'and somehow they ended up at Gatsby\'s door.' },
  { id: 5, begin: 105.0, end: 109.2, text: 'Once there they were introduced by somebody who knew Gatsby,' },
  { id: 6, begin: 112.5, end: 120.5, text: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.' },
  { id: 7, begin: 121.3, end: 123.9, text: 'Sometimes they came and went without having met Gatsby at all,' },
  { id: 8, begin: 124.1, end: 125.0, text: 'came for the party with a simplicity of heart that was its own ticket of admission.' }
];
const fixture = {
  results: transcriptsFixture.reduce((r, t) => ({
    ...r,
    [t.id]: t
  }), {}),
  ids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  matchingIds: [],
  counts: [],
  sortedMatchCounts: []
};
const transcriptListFixture = [
  {
    filename: 'transcript1.vtt',
    format: 'text/vtt',
    id: 'transcritp1.vtt-0-1',
    isMachineGen: false,
    title: 'transcript1.vtt',
    url: 'http://example.com/canvas/1/transcript1.vtt'
  },
  {
    filename: 'transcript2.vtt',
    format: 'text/vtt',
    id: 'transcritp1.vtt-0-2',
    isMachineGen: false,
    title: 'transcript2.vtt',
    url: 'http://example.com/canvas/1/transcript2.vtt'
  },
  {
    filename: 'transcript.pdf',
    format: 'application/pdf',
    id: 'transcritp.pdf-0-3',
    isMachineGen: false,
    title: 'transcript.pdf',
    url: 'http://example.com/canvas/1/transcript.pdf'
  }
];

const untimedTranscriptFixture = [
  {
    id: 0,
    text: 'The party has begun.',
    tag: 'NON_TIMED_LINE',
    textDisplayed: 'The party has begun.'
  },
  {
    id: 1,
    text: "I believe that on the first night I went to Gatsby's house",
    tag: 'NON_TIMED_LINE',
    textDisplayed: "I believe that on the first night I went to Gatsby's house"
  },
  {
    id: 2,
    text: 'I was one of the few guests who had actually been invited.',
    tag: 'NON_TIMED_LINE',
    textDisplayed: 'I was one of the few guests who had actually been invited.'
  },
  {
    id: 3,
    text: 'People were not invited-they went there. They got into automobiles which bore them out to Long Island,',
    tag: 'NON_TIMED_LINE',
    textDisplayed: 'People were not invited-they went there. They got into automobiles which bore them out to Long Island,'
  },
  {
    id: 4,
    text: "and somehow they ended up at Gatsby's door.",
    tag: 'NON_TIMED_LINE',
    textDisplayed: "and somehow they ended up at Gatsby's door."
  },
  {
    id: 5,
    text: 'Once there they were introduced by somebody who knew Gatsby,',
    tag: 'NON_TIMED_LINE',
    textDisplayed: 'Once there they were introduced by somebody who knew Gatsby,'
  },
  {
    id: 6,
    text: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.',
    tag: 'NON_TIMED_LINE',
    textDisplayed: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.'
  },
  {
    id: 7,
    text: 'Sometimes they came and went without having met Gatsby at all,',
    tag: 'NON_TIMED_LINE',
    textDisplayed: 'Sometimes they came and went without having met Gatsby at all,'
  },
  {
    id: 8,
    text: 'came for the party with a simplicity of heart that was its own ticket of admission.',
    tag: 'NON_TIMED_LINE',
    textDisplayed: 'came for the party with a simplicity of heart that was its own ticket of admission.'
  }
];
const untimedFixture = {
  results: untimedTranscriptFixture.reduce((r, t) => ({
    ...r,
    [t.id]: t
  }), {}),
  ids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  matchingIds: [],
  counts: [],
  sortedMatchCounts: []
};

describe('useFilteredTranscripts', () => {
  const createTest = (props = {}) => {
    // not a real ref because react throws warning if we use outside a component
    const resultRef = { current: null };
    const InnerComponent = () => {

      const searchResults = useFilteredTranscripts({
        enabled: true,
        query: null,
        ...props
      });
      useEffect(() => {
        resultRef.current = searchResults;
      }, [searchResults]);
      return (
        <div></div>
      );
    };
    const Component = (
      <PlayerProvider>
        <ManifestProvider>
          <InnerComponent />
        </ManifestProvider>
      </PlayerProvider>
    );
    return { resultRef, Component };
  };

  describe('custom behavior', () => {
    describe('custom matcherFactory', () => {
      test('matcher factory can create an async matcher', async () => {
        const matcherFactory = (items) => {
          const matcher = defaultMatcherFactory(items);
          return async (query, abortController) => {
            const results = matcher(query, abortController);
            await new Promise(r => setTimeout(r, 500));
            return results;
          };
        };
        const { resultRef, Component } = createTest({ matcherFactory, transcripts: [...transcriptsFixture], query: 'Gatsby' });
        render(Component);
        await waitFor(() => expect(resultRef.current.matchingIds).toEqual([1, 4, 5, 7]));
      });
    });

    describe('custom sorter', () => {
      test('with matchesOnly both ids and matchingIds will be sorted the same', async () => {
        const { resultRef, Component } = createTest({
          sorter: (items) => items.sort((a, b) => a.text.localeCompare(b.text)),
          query: 'Gatsby',
          matchesOnly: true,
          transcripts: [...transcriptsFixture],
        });
        render(Component);
        await waitFor(() => expect(resultRef.current.ids).toEqual([4, 1, 5, 7]));
        expect(resultRef.current.matchingIds).toEqual([4, 1, 5, 7]);
      });
      test('without matchesOnly, ids will also be sorted', async () => {
        const { resultRef, Component } = createTest({
          sorter: (items) => items.sort((a, b) => a.text.localeCompare(b.text)),
          query: 'Gatsby',
          matchesOnly: false,
          transcripts: [...transcriptsFixture],
        });
        render(Component);
        await waitFor(() => expect(resultRef.current.ids).toEqual([6, 4, 8, 1, 2, 5, 3, 7, 0]));
      });
      test('ids and matchingIds can be sorted different', async () => {
        /**
         * Here, the sorter function gets a second argument, justMatches, which is
         * is true when sorting matches (but not results). This allows the sorter to sort the
         * ids and matchingIds differently. An example of where this could be
         * useful is if you want to sort the matchingIds by some relevance score,
         * but want ids to be sorted chronologically
         */
        const { resultRef, Component } = createTest({
          sorter: (items, justMatches) => (justMatches
            ? items.sort((a, b) => a.text.localeCompare(b.text))
            : items.sort((a, b) => a.id - b.id)
          ),
          query: 'Gatsby',
          matchesOnly: false,
          transcripts: [...transcriptsFixture],
        });
        render(Component);
        await waitFor(() => expect(resultRef.current.ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]));
        expect(resultRef.current.matchingIds).toEqual([4, 1, 5, 7]);
      });

    });
  });

  describe('default behavior', () => {
    test('when the search query is null, all results are returned with 0 matches', async () => {
      const { resultRef, Component } = createTest({ transcripts: [...transcriptsFixture], query: null });
      render(Component);
      await waitFor(() => expect(resultRef.current).toEqual(fixture));
    });
    test('when enabled: false is passed, all results are returned with 0 matches', async () => {
      const { resultRef, Component } = createTest({ transcripts: [...transcriptsFixture], enabled: false });
      render(Component);
      await waitFor(() => expect(resultRef.current).toEqual(fixture));
    });
    test('when the search query is set, matchingIds will contain ids of matches', async () => {
      const { resultRef, Component } = createTest({ transcripts: [...transcriptsFixture], query: 'Gatsby' });
      render(Component);
      await waitFor(() => expect(resultRef.current.matchingIds).toEqual([1, 4, 5, 7]));
    });
    test('when matchesOnly is true, only matching results are returned', async () => {
      const { resultRef, Component } = createTest({ transcripts: [...transcriptsFixture], query: 'Gatsby', matchesOnly: true });
      render(Component);
      await waitFor(() => expect(resultRef.current.ids).toEqual([1, 4, 5, 7]));
    });
    test('results included in the match set will include a match property for highlighting matches', async () => {
      const { resultRef, Component } = createTest({ transcripts: [...transcriptsFixture], query: 'Gatsby' });
      render(Component);
      await waitFor(() => {
        expect(resultRef.current.results[1].match).toEqual(
          'I believe that on the first night I went to <span class="ramp--transcript_highlight">Gatsby</span>\'s house'
        );
      });
      expect(resultRef.current.results[4].match).toEqual(
        'and somehow they ended up at <span class="ramp--transcript_highlight">Gatsby</span>\'s door.'
      );
      expect(resultRef.current.results[5].match).toEqual(
        'Once there they were introduced by somebody who knew <span class="ramp--transcript_highlight">Gatsby</span>,'
      );
      expect(resultRef.current.results[7].match).toEqual(
        'Sometimes they came and went without having met <span class="ramp--transcript_highlight">Gatsby</span> at all,'
      );
    });
  });

  describe('content search behavior', () => {
    describe('with timed-text', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() =>
          Promise.resolve({
            json: () => {
              return {
                id: 'http://example.com/1/search?q=bungle',
                type: 'AnnotationPage',
                items: [
                  {
                    id: 'http://example.com/canvas/1/search/3',
                    type: 'Annotation',
                    motivation: 'supplementing',
                    target: "http://example.com/canvas/1/transcript/1#t=00:01:45.000,00:01:49.200",
                    body: {
                      type: 'TextualBody',
                      value: "Once there they were introduced by somebody who knew <em>Gatsby</em>,",
                      format: 'text/plain'
                    }
                  },
                  {
                    id: 'http://example.com/canvas/1/search/4',
                    type: 'Annotation',
                    motivation: 'supplementing',
                    target: "http://example.com/canvas/1/transcript/1#t=00:02:01.300,00:02:03.900",
                    body: {
                      type: 'TextualBody',
                      value: "Sometimes they came and went without having met <em>Gatsby</em> at all,",
                      format: 'text/plain'
                    }
                  },
                ]
              };
            },
          })
        );
      });
      const matcherFactory = (items) => {
        const matcher = contentSearchFactory('http://example.com/1/search', items, 'http://example.com/canvas/1/transcript/1');
        return async (query, abortController) => {
          const results = matcher(query, abortController);
          await new Promise(r => setTimeout(r, 500));
          return results;
        };
      };

      test('when the search query is null, all results are returned with 0 matches', async () => {
        const { resultRef, Component } = createTest({ matcherFactory, transcripts: transcriptsFixture, query: null });
        render(Component);
        await waitFor(() => expect(resultRef.current).toEqual(fixture));
      });
      test('when enabled: false is passed, all results are returned with 0 matches', async () => {
        const { resultRef, Component } = createTest({ enabled: false, transcripts: transcriptsFixture });
        render(Component);
        await waitFor(() => expect(resultRef.current).toEqual(fixture));
      });
      test('when the search query is set, matchingIds will contain ids of matches', async () => {
        const { resultRef, Component } = createTest({
          matcherFactory,
          transcripts: transcriptsFixture,
          query: 'Gatsby'
        });
        render(Component);
        await waitFor(() => {
          expect(resultRef.current.matchingIds).toEqual([5, 7]);
          expect(resultRef.current.counts).toEqual([{
            transcriptURL: 'http://example.com/canvas/1/transcript/1',
            numberOfHits: 2
          }]);
        });
      });
      test('when matchesOnly is true, only matching results are returned', async () => {
        const { resultRef, Component } = createTest({
          matcherFactory,
          transcripts: transcriptsFixture,
          query: 'Gatsby',
          matchesOnly: true
        });
        render(Component);
        await waitFor(() => {
          expect(resultRef.current.matchingIds).toEqual([5, 7]);
          expect(resultRef.current.counts).toEqual([{
            transcriptURL: 'http://example.com/canvas/1/transcript/1',
            numberOfHits: 2
          }]);
        });
      });
      test('results included in the match set will include a match property for highlighting matches', async () => {
        const { resultRef, Component } = createTest({
          matcherFactory,
          transcripts: transcriptsFixture,
          query: 'Gatsby'
        });
        render(Component);
        await waitFor(() => {
          expect(resultRef.current.results[5].match).toEqual(
            'Once there they were introduced by somebody who knew <span class="ramp--transcript_highlight">Gatsby</span>,'
          );
        });
        expect(resultRef.current.results[7].match).toEqual(
          'Sometimes they came and went without having met <span class="ramp--transcript_highlight">Gatsby</span> at all,'
        );
      });
    });

    describe('with untimed-text', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() =>
          Promise.resolve({
            json: () => {
              return {
                id: 'http://example.com/1/search?q=bungle',
                type: 'AnnotationPage',
                items: [
                  {
                    id: 'http://example.com/canvas/1/search/3',
                    type: 'Annotation',
                    motivation: 'supplementing',
                    target: "http://example.com/canvas/1/transcript/1",
                    body: {
                      type: 'TextualBody',
                      value: "Once there they were introduced by somebody who knew <em>Gatsby</em>,",
                      format: 'text/plain'
                    }
                  },
                  {
                    id: 'http://example.com/canvas/1/search/4',
                    type: 'Annotation',
                    motivation: 'supplementing',
                    target: "http://example.com/canvas/1/transcript/1",
                    body: {
                      type: 'TextualBody',
                      value: "Sometimes they came and went without having met <em>Gatsby</em> at all,",
                      format: 'text/plain'
                    }
                  },
                ]
              };
            },
          })
        );
      });
      const matcherFactory = (items) => {
        const matcher = contentSearchFactory('http://example.com/1/search', items, 'http://example.com/canvas/1/transcript/1');
        return async (query, abortController) => {
          const results = matcher(query, abortController);
          await new Promise(r => setTimeout(r, 500));
          return results;
        };
      };

      test('when the search query is null, all results are returned with 0 matches', async () => {
        const { resultRef, Component } = createTest({ matcherFactory, transcripts: untimedTranscriptFixture, query: null });
        render(Component);
        await waitFor(() => expect(resultRef.current).toEqual(untimedFixture));
      });
      test('when enabled: false is passed, all results are returned with 0 matches', async () => {
        const { resultRef, Component } = createTest({ transcripts: untimedTranscriptFixture, enabled: false });
        render(Component);
        await waitFor(() => expect(resultRef.current).toEqual(untimedFixture));
      });
      test('when the search query is set, matchingIds will contain ids of matches', async () => {
        const { resultRef, Component } = createTest({
          matcherFactory,
          transcripts: [...untimedTranscriptFixture],
          query: 'Gatsby'
        });
        render(Component);
        await waitFor(() => {
          expect(resultRef.current.ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
          expect(resultRef.current.matchingIds).toEqual([5, 7]);
          expect(resultRef.current.counts).toEqual([{
            transcriptURL: 'http://example.com/canvas/1/transcript/1',
            numberOfHits: 2
          }]);
        });
      });
      test('when matchesOnly is true, only matching results are returned', async () => {
        const { resultRef, Component } = createTest({
          matcherFactory,
          transcripts: [...untimedTranscriptFixture],
          query: 'Gatsby',
          matchesOnly: true
        });
        render(Component);
        await waitFor(() => {
          expect(resultRef.current.matchingIds).toEqual([5, 7]);
          expect(resultRef.current.ids).toEqual([5, 7]);
          expect(resultRef.current.counts).toEqual([{
            transcriptURL: 'http://example.com/canvas/1/transcript/1',
            numberOfHits: 2
          }]);
        });
      });
      test('results included in the match set will include a match property for highlighting matches', async () => {
        const { resultRef, Component } = createTest({
          matcherFactory,
          transcripts: [...untimedTranscriptFixture],
          query: 'Gatsby'
        });
        render(Component);
        await waitFor(() => {
          expect(resultRef.current.results[5].match).toEqual(
            'Once there they were introduced by somebody who knew <span class="ramp--transcript_highlight">Gatsby</span>,'
          );
        });
        expect(resultRef.current.results[7].match).toEqual(
          'Sometimes they came and went without having met <span class="ramp--transcript_highlight">Gatsby</span> at all,'
        );
      });
    });
  });
});

describe('useSearchCounts', () => {
  const createTest = (props = {}) => {
    // not a real ref because react throws warning if we use outside a component
    const searchResults = {
      counts: [
        {
          transcriptURL: 'http://example.com/canvas/1/transcript1.vtt',
          numberOfHits: 2
        },
        {
          transcriptURL: 'http://example.com/canvas/1/transcript2.vtt',
          numberOfHits: 15
        },
      ]
    };
    // not a real ref because react throws warning if we use outside a component
    const resultRef = { current: null };
    const canvasTranscripts = [...transcriptListFixture];
    const InnerComponent = () => {

      const tanscriptHitCounts = useSearchCounts({
        searchResults, canvasTranscripts, ...props
      });

      useEffect(() => {
        resultRef.current = tanscriptHitCounts;
      }, [tanscriptHitCounts]);
      return (
        <div></div>
      );
    };
    const Component = (
      <PlayerProvider>
        <ManifestProvider>
          <InnerComponent />
        </ManifestProvider>
      </PlayerProvider>
    );
    return { resultRef, Component };
  };
  test('when the search query is not null, transcript list is returned with numberOfHits property', async () => {
    const { resultRef, Component } = createTest({ searchQuery: 'Bungle' });
    render(Component);
    await waitFor(() => {
      expect(resultRef.current.length).toEqual(transcriptListFixture.length);
      expect(resultRef.current[0]).toEqual({
        filename: 'transcript1.vtt',
        format: 'text/vtt',
        id: 'transcritp1.vtt-0-1',
        isMachineGen: false,
        title: 'transcript1.vtt',
        url: 'http://example.com/canvas/1/transcript1.vtt',
        numberOfHits: 2
      });
    });
  });
  test('when the search query is null, original transcript list is returned', async () => {
    const { resultRef, Component } = createTest({ searchQuery: null });
    render(Component);
    await waitFor(() => {
      expect(resultRef.current).toEqual(transcriptListFixture);
      expect(resultRef.current[0]).toEqual({
        filename: 'transcript1.vtt',
        format: 'text/vtt',
        id: 'transcritp1.vtt-0-1',
        isMachineGen: false,
        title: 'transcript1.vtt',
        url: 'http://example.com/canvas/1/transcript1.vtt'
      });
    });
  });
})

