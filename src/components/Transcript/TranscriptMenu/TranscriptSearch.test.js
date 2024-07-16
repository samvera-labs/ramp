import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TranscriptSearch from './TranscriptSearch';
import * as sinon from 'sinon';

describe('TranscriptSearch component', () => {
  const getBaseProps = () => ({
    searchResults: {
      results: {},
      id: [],
      matchingIds: []
    },
    searchQuery: null,
    focusedMatchIndex: null,
    setFocusedMatchIndex: jest.fn(),
    setSearchQuery: jest.fn()
  });

  describe('with searchResults', () => {
    const getPropsWithResults = () => ({
      ...getBaseProps(),
      searchResults: {
        results: {
          0: { id: 0, text: 'The party has begun.' },
          1: { id: 1, text: 'I believe that on the first night I went to Gatsby\'s house' },
          2: { id: 2, text: 'I was one of the few guests who had actually been invited.' },
          3: { id: 3, text: 'People were not invited-they went there. They got into automobiles which bore them out to Long Island,' },
          4: { id: 4, text: 'and somehow they ended up at Gatsby\'s door.' },
          5: { id: 5, text: 'Once there they were introduced by somebody who knew Gatsby,' },
          6: { id: 6, text: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.' },
          7: { id: 7, text: 'Sometimes they came and went without having met Gatsby at all,' },
          8: { id: 8, text: 'came for the party with a simplicity of heart that was its own ticket of admission.' }
        },
        ids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        matchingIds: []
      }
    });

    describe('when there are matches for the search query', () => {
      const getPropsWithMatchingResults = () => {
        const base = getPropsWithResults();
        return {
          ...base,
          searchQuery: 'Gatsby',
          searchResults: {
            ...base.searchResults,
            matchingIds: [1, 4, 5, 7],
            results: {
              ...base.searchResults.results,
              1: {
                id: 1,
                text: 'I believe that on the first night I went to Gatsby\'s house',
                matches: [
                  'I believe that on the first night I went to ',
                  'Gatsby',
                  '\'s house'
                ]
              },
              4: {
                id: 4,
                text: 'and somehow they ended up at Gatsby\'s door.',
                matches: [
                  'and somehow they ended up at ',
                  'Gatsby',
                  '\'s door.'
                ]
              },
              5: {
                id: 5,
                text: 'Once there they were introduced by somebody who knew Gatsby,',
                matches: [
                  'Once there they were introduced by somebody who knew ',
                  'Gatsby',
                  ','
                ]
              },
              7: {
                id: 7,
                text: 'Sometimes they came and went without having met Gatsby at all,',
                matches: [
                  'Sometimes they came and went without having met ',
                  'Gatsby',
                  ' at all,'
                ]
              }
            }
          }
        };
      };

      test('result count reads "(focusedMatchIndex + 1) of (searchResults.matchingIds.length)"', async () => {
        const props = getPropsWithMatchingResults();
        const { rerender } = render(<TranscriptSearch {...props} focusedMatchIndex={0} />);
        const countEl = screen.getByTestId('transcript-search-count');
        expect(countEl).toHaveTextContent('1 of 4');
        rerender(<TranscriptSearch {...props} focusedMatchIndex={3} />);
        expect(countEl).toHaveTextContent('4 of 4');
      });
      test('when focusedMatchIndex is 0, the prev button is disabled', async () => {
        const props = getPropsWithMatchingResults();
        render(<TranscriptSearch {...props} focusedMatchIndex={0} />);
        const prevButtonEl = screen.getByTestId('transcript-search-prev');
        expect(prevButtonEl).toBeDisabled();
      });
      test('when focusedMatchIndex is not 0, the prev button is disabled', async () => {
        const props = getPropsWithMatchingResults();
        render(<TranscriptSearch {...props} focusedMatchIndex={1} />);
        const prevButtonEl = screen.getByTestId('transcript-search-prev');
        expect(prevButtonEl).not.toBeDisabled();
      });
      test('when focusedMatchIndex is the last index, the next button is disabled', () => {
        const props = getPropsWithMatchingResults();
        render(<TranscriptSearch {...props} focusedMatchIndex={3} />);
        const nextButtonEl = screen.getByTestId('transcript-search-next');
        expect(nextButtonEl).toBeDisabled();
      });
      test('when focusedMatchIndex is not the last index, the next button is not disabled', () => {
        const props = getPropsWithMatchingResults();
        render(<TranscriptSearch {...props} focusedMatchIndex={2} />);
        const nextButtonEl = screen.getByTestId('transcript-search-next');
        expect(nextButtonEl).not.toBeDisabled();
      });
      describe('interacting with the prev and next buttons', () => {
        test('clicking the prev button decrements focusedMatchIndex', () => {
          const props = getPropsWithMatchingResults();
          render(<TranscriptSearch {...props} focusedMatchIndex={2} />);
          const prevButtonEl = screen.getByTestId('transcript-search-prev');
          expect(props.setFocusedMatchIndex).not.toHaveBeenCalled();
          fireEvent.click(prevButtonEl);
          expect(props.setFocusedMatchIndex).toHaveBeenCalledWith(1);
        });
        test('clicking the next button increments focusedMatchIndex', () => {
          const props = getPropsWithMatchingResults();
          render(<TranscriptSearch {...props} focusedMatchIndex={2} />);
          const nextButtonEl = screen.getByTestId('transcript-search-next');
          expect(props.setFocusedMatchIndex).not.toHaveBeenCalled();
          fireEvent.click(nextButtonEl);
          expect(props.setFocusedMatchIndex).toHaveBeenCalledWith(3);
        });
        test('clicking a disabled button does nothing', () => {
          const props = getPropsWithMatchingResults();
          const { rerender } = render(<TranscriptSearch {...props} focusedMatchIndex={0} />);
          const prevButtonEl = screen.getByTestId('transcript-search-prev');
          fireEvent.click(prevButtonEl);
          rerender(<TranscriptSearch {...props} focusedMatchIndex={3} />);
          const nextButtonEl = screen.getByTestId('transcript-search-next');
          fireEvent.click(nextButtonEl);
          expect(props.setFocusedMatchIndex).not.toHaveBeenCalled();
        });
      });
    });

    describe('when there are no matches for the search query', () => {
      test('a no results found message is displayed', async () => {
        const props = getPropsWithResults();
        render(<TranscriptSearch {...props} searchQuery="not-found" />);
        const countEl = screen.getByTestId('transcript-search-count');
        expect(countEl).toHaveTextContent('no results found in this transcript');
      });

      test('prev and next buttons are not shown', async () => {
        const props = getPropsWithResults();
        render(<TranscriptSearch {...props} searchQuery="not-found" />);
        const prevButtonEl = screen.queryByTestId('transcript-search-prev');
        const nextButtonEl = screen.queryByTestId('transcript-search-next');
        expect(prevButtonEl).toBeNull();
        expect(nextButtonEl).toBeNull();
      });
    });
  });

  describe('modifying the search query', () => {
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });
    test('setSearchQuery is called when value of search input changes', () => {
      const props = getBaseProps();
      render(<TranscriptSearch {...props} />);
      expect(props.setSearchQuery).not.toHaveBeenCalled();
      const searchInputEl = screen.getByTestId('transcript-search-input');
      expect(searchInputEl.value).toBe('');
      fireEvent.change(searchInputEl, { target: { value: 'test' } });

      // Wait 100ms
      clock.tick(100);

      expect(searchInputEl.value).toBe('test');
      expect(props.setSearchQuery).toHaveBeenCalled();
    });
    test('search query is set to null when input contains nothing but whitespace', () => {
      const props = getBaseProps();
      render(<TranscriptSearch {...props} searchQuery="test" />);
      const searchInputEl = screen.getByTestId('transcript-search-input');
      expect(searchInputEl.value).toBe('test');
      fireEvent.change(searchInputEl, { target: { value: '  ' } });
      expect(searchInputEl.value).toBe('  ');
      expect(props.setSearchQuery).toHaveBeenCalledWith(null);
    });
    test('result count display is shown when search query is not empty', async () => {
      const props = getBaseProps();
      render(<TranscriptSearch {...props} searchQuery="test" />);
      const countEl = screen.queryByTestId('transcript-search-count');
      expect(countEl).not.toBeNull();
    });
    describe('clear button', () => {
      test('clear button becomes visible when there is a searchQuery', async () => {
        const props = getBaseProps();
        const { rerender } = render(<TranscriptSearch {...props} />);

        const searchInputEl = screen.getByTestId('transcript-search-input');
        let clearButtonEl = screen.queryByTestId('transcript-search-clear');
        expect(clearButtonEl).toBeNull();

        fireEvent.change(searchInputEl, { target: { value: 'test' } });

        // Wait 100ms
        clock.tick(100);

        expect(props.setSearchQuery).toHaveBeenCalledWith('test');
        rerender(<TranscriptSearch {...props} searchQuery="test" />);

        clearButtonEl = screen.queryByTestId('transcript-search-clear');
        expect(clearButtonEl).not.toBeNull();
        expect(searchInputEl.value).toBe('test');
      });
      test('clicking clear button causes value of input to be cleared and clear button to disappear', () => {
        const props = getBaseProps();
        const { rerender } = render(<TranscriptSearch {...props} searchQuery="test" />);
        const searchInputEl = screen.getByTestId('transcript-search-input');
        expect(searchInputEl.value).toBe('test');
        let clearButtonEl = screen.queryByTestId('transcript-search-clear');
        expect(clearButtonEl).not.toBeNull();

        fireEvent.click(clearButtonEl);

        expect(props.setSearchQuery).toHaveBeenCalledWith(null);
        rerender(<TranscriptSearch {...props} searchQuery={null} />);

        expect(searchInputEl.value).toBe('');
        clearButtonEl = screen.queryByTestId('transcript-search-clear');
        expect(clearButtonEl).toBeNull();
      });
    });
  });
  describe('with empty search query and no searchResults', () => {
    beforeEach(() => {
      const props = getBaseProps();
      render(<TranscriptSearch {...props} />);
    });
    test('search input is empty', () => {
      const searchInputEl = screen.getByTestId('transcript-search-input');
      expect(searchInputEl.value).toBe('');
    });
    test('the result count display, clear, prev, and next buttons are not shown', () => {
      const props = getBaseProps();
      render(<TranscriptSearch {...props} />);
      const countEl = screen.queryByTestId('transcript-search-count');
      const clearButtonEl = screen.queryByTestId('transcript-search-clear');
      const nextButtonEl = screen.queryByTestId('transcript-search-next');
      const prevButtonEl = screen.queryByTestId('transcript-search-prev');
      expect(countEl).toBeNull();
      expect(clearButtonEl).toBeNull();
      expect(prevButtonEl).toBeNull();
      expect(nextButtonEl).toBeNull();
    });
  });
  test('when searchQuery is passed during components initial render, the search input is pre-populated', () => {
    const props = getBaseProps();
    const { rerender } = render(<TranscriptSearch {...props} searchQuery="test" />);
    const searchInputEl = screen.getByTestId('transcript-search-input');
    expect(searchInputEl.value).toBe('test');
  });
});
