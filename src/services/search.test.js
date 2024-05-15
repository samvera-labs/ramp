import React, { useEffect} from 'react';
import { PlayerProvider } from '../context/player-context';
import { useFilteredTranscripts, defaultMatcherFactory } from './search';
import { render, screen, waitFor } from '@testing-library/react';

const transcriptsFixture = [
    { id: 0, text: 'The party has begun.' },
    { id: 1, text: 'I believe that on the first night I went to Gatsby\'s house' },
    { id: 2, text: 'I was one of the few guests who had actually been invited.' },
    { id: 3, text: 'People were not invited-they went there. They got into automobiles which bore them out to Long Island,' },
    { id: 4, text: 'and somehow they ended up at Gatsby\'s door.' }, 
    { id: 5, text: 'Once there they were introduced by somebody who knew Gatsby,' },
    { id: 6, text: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.' },
    { id: 7, text: 'Sometimes they came and went without having met Gatsby at all,' },
    { id: 8, text: 'came for the party with a simplicity of heart that was its own ticket of admission.' }
];
const fixture = {
    results: transcriptsFixture.reduce((r, t) => ({
        ...r,
        [t.id]: t
    }), {}),
    ids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    matchingIds: []
};

describe('useFilteredTranscripts', () => {
    const createTest = (props = {}) => {
        // not a real ref because react throws warning if we use outside a component
        const resultRef = { current: null };
        const transcripts = [...transcriptsFixture];
        const InnerComponent = () => {

            const searchResults = useFilteredTranscripts({
                enabled: true,
                query: null,
                transcripts,
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
                <InnerComponent />
            </PlayerProvider>
        );
        return { resultRef, Component };
    };

    describe('custom behavior', () => {

        describe('custom matcherFactory', () => {
            test('matcher factory can be customized to customize how matches are found', async () => {
                const matcherFactory = (items) => {
                    const mappedItems = items.map(item => ({ ...item, text: item.text.replaceAll(' ', '') }));
                    return defaultMatcherFactory(mappedItems);                    
                };
                const { resultRef, Component } = createTest({ matcherFactory, query: 'theparty' });

                render(Component);
                await waitFor(() => expect(resultRef.current.matchingIds).toEqual([0, 8]));
            });
            test('matcher factory can create an async matcher', async() => {
                const matcherFactory = (items) => {
                    const matcher = defaultMatcherFactory(items);
                    return async (query, abortController) => {
                        const results = matcher(query, abortController);
                        await new Promise(r => setTimeout(r, 500));
                        return results;
                    };
                };
                const { resultRef, Component } = createTest({ matcherFactory, query: 'Gatsby' });
                render(Component);
                await waitFor(() => expect(resultRef.current.matchingIds).toEqual([1, 4, 5, 7]));
            });
        });

        describe('custom sorter', () => {
            test('with matchesOnly both ids and matchingIds will be sorted the same', async () => {
                const { resultRef, Component } = createTest({
                    sorter: (items) => items.sort((a, b) => a.text.localeCompare(b.text)),
                    query: 'Gatsby',
                    matchesOnly: true
                });
                render(Component);
                await waitFor(() => expect(resultRef.current.ids).toEqual([4, 1, 5, 7]));
                expect(resultRef.current.matchingIds).toEqual([4, 1, 5, 7]);
            });
            test('without matchesOnly, ids will also be sorted', async () => {
                const { resultRef, Component } = createTest({
                    sorter: (items) => items.sort((a, b) => a.text.localeCompare(b.text)),
                    query: 'Gatsby',
                    matchesOnly: false
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
                    matchesOnly: false
                });
                render(Component);
                await waitFor(() => expect(resultRef.current.ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]));
                expect(resultRef.current.matchingIds).toEqual([4, 1, 5, 7]);
            });
            
        })
    });
    describe('default behavior', () => { 
        test('when the search query is null, all results are returned with 0 matches', async () => {
            const { resultRef, Component } = createTest({ query: null });
            render(Component);
            await waitFor(() => expect(resultRef.current).toEqual(fixture));
        });
        test('when enabled: false is passed, all results are returned with 0 matches', async () => {
            const { resultRef, Component } = createTest({ enabled: false });
            render(Component);
            await waitFor(() => expect(resultRef.current).toEqual(fixture));
        });
        test('when the search query is set, matchingIds will contain ids of matches', async () => {
            const { resultRef, Component } = createTest({ query: 'Gatsby' });
            render(Component);
            await waitFor(() => expect(resultRef.current.matchingIds).toEqual([1, 4, 5, 7]));
        });
        test('when matchesOnly is true, only matching results are returned', async () => {
            const { resultRef, Component } = createTest({ query: 'Gatsby', matchesOnly: true });
            render(Component);
            await waitFor(() => expect(resultRef.current.ids).toEqual([1, 4, 5, 7]));
        });
        test('results included in the match set will include a match property for highlighting matches', async () => {
            const { resultRef, Component } = createTest({ query: 'Gatsby' });
            render(Component);
            await waitFor(() => {
                expect(resultRef.current.results[1].match).toEqual([
                    'I believe that on the first night I went to ',
                    'Gatsby',
                    '\'s house'
                ])
            });
            expect(resultRef.current.results[4].match).toEqual([
                'and somehow they ended up at ',
                'Gatsby',
                '\'s door.'
            ]);
            expect(resultRef.current.results[5].match).toEqual([
                'Once there they were introduced by somebody who knew ',
                'Gatsby',
                ','
            ]);
            expect(resultRef.current.results[7].match).toEqual([
                'Sometimes they came and went without having met ',
                'Gatsby',
                ' at all,'
            ]);

        });
    });
});

