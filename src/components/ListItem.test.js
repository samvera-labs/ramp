import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from './ListItem';
import manifest from '../json/test_data/transcript-annotation';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../services/testing-helpers';

const singleItem = {
  id: 'http://example.com/sample/transcript-annotation/range/1-1',
  type: 'Range',
  label: {
    en: ['Track 1. I. Kraftig'],
  },
  items: [
    {
      id: 'http://example.com/sample/transcript-annotation/canvas/1#t=0,374',
      type: 'Canvas',
    },
  ],
};

const multiItem = {
  id: 'http://example.com/sample/transcript-annotation/range/2',
  type: 'Range',
  label: {
    en: ['CD2 - Mahler, Symphony No.3 (cont.)'],
  },
  items: [
    {
      id: 'http://example.com/sample/transcript-annotation/range/2-1',
      type: 'Range',
      label: {
        en: ['Track 1. II. Tempo di Menuetto'],
      },
      items: [
        {
          id: 'http://example.com/sample/transcript-annotation/canvas/2#t=0,566',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'http://example.com/sample/transcript-annotation/range/2-2',
      type: 'Range',
      label: {
        en: ['Track 2. III. Comodo'],
      },
      items: [
        {
          id: 'http://example.com/sample/transcript-annotation/canvas/2#t=566,1183',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'http://example.com/sample/transcript-annotation/range/2-3',
      type: 'Range',
      label: {
        en: ['Track 3. Tempo I'],
      },
      items: [
        {
          id: 'http://example.com/sample/transcript-annotation/canvas/2#t=1183,1635',
          type: 'Canvas',
        },
      ],
    },
  ],
};

describe('ListItem component', () => {
  describe('with single item', () => {
    beforeEach(() => {
      const props = {
        item: singleItem,
        isChild: false,
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: { playerRange: { start: 0, end: 1985 } },
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { manifest, canvasIndex: 0 },
      });
      render(<ListItemWithManifest />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('list-item'));
    });
  });

  describe('with multiple items', () => {
    beforeEach(() => {
      const props = {
        item: multiItem,
        isTitle: false,
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: { playerRange: { start: 0, end: 1985 } },
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { manifest, canvasIndex: 0 },
      });
      render(<ListItemWithManifest />);
    });

    test('renders a child list if there are child ranges in manifest', () => {
      expect(screen.getByTestId('list'));

      // Expect there to be 3 elements in list
      expect(screen.queryAllByTestId('list-item').length).toEqual(4);
    });

    test('creates an anchor element and title for an item', () => {
      const anchorElement = screen.getByText('Track 1. II. Tempo di Menuetto');
      expect(anchorElement.tagName).toEqual('A');
      expect(anchorElement).toHaveAttribute(
        'href',
        'http://example.com/sample/transcript-annotation/canvas/2#t=0,566'
      );

      expect(screen.queryByTestId('list')).not;
    });

    test('shows active item in structure navigation', () => {
      // The first item (item with index zero) is the title
      const listItem = screen.getAllByTestId('list-item')[2];
      expect(listItem).toHaveClass('ramp--structured-nav__list-item');
      expect(listItem).not.toHaveClass('active');
      // first child is the tracker element, second child is the link (<a>)
      fireEvent.click(listItem.children[1]);
      expect(listItem).toHaveClass('active');
    });

    test('removes tracker when item is inactive', () => {
      const listItem1 = screen.getAllByTestId('list-item')[2];
      const listItem2 = screen.getAllByTestId('list-item')[3];
      fireEvent.click(listItem1.children[1]);
      expect(listItem1).toHaveClass('active');

      fireEvent.click(listItem2.children[1]);
      expect(listItem2).toHaveClass('active');
      expect(listItem1).not.toHaveClass('active');
    });
  });
});
