import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from './ListItem';
import manifest from '@Json/test_data/transcript-multiple-canvas';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../services/testing-helpers';

const singleItem = {
  id: 'https://example.com/sample/transcript-multiple-canvas/range/1-1',
  type: 'Range',
  label: {
    en: ['First item'],
  },
  items: [
    {
      id: 'https://example.com/sample/transcript-multiple-canvas/canvas/1#t=0,123',
      type: 'Canvas',
    },
  ],
};

const multiItem = {
  id: 'https://example.com/sample/transcript-multiple-canvas/range/1',
  type: 'Range',
  label: {
    en: ['First title'],
  },
  items: [
    {
      id: 'https://example.com/sample/transcript-multiple-canvas/range/1-1',
      type: 'Range',
      label: {
        en: ['First item - 1'],
      },
      items: [
        {
          id: 'https://example.com/sample/transcript-multiple-canvas/canvas/1#t=0,123',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://example.com/sample/transcript-multiple-canvas/range/1-2',
      type: 'Range',
      label: {
        en: ['Second item - 1'],
      },
      items: [
        {
          id: 'https://example.com/sample/transcript-multiple-canvas/canvas/1#t=123,345',
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
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { manifest, canvasIndex: 0 },
      });
      render(<ListItemWithManifest />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('list-item'));
      expect(screen.getByText('First item')).toBeInTheDocument();
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
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { manifest, canvasIndex: 0 },
      });
      render(<ListItemWithManifest />);
    });

    test('renders a child list if there are child ranges in manifest', () => {
      expect(screen.getByTestId('list'));
      expect(screen.queryAllByTestId('list-item').length).toEqual(3);
    });

    test('creates an anchor element and title for an item', () => {
      const anchorElement = screen.getByText('First item - 1');
      expect(anchorElement.tagName).toEqual('A');
      expect(anchorElement).toHaveAttribute(
        'href',
        'https://example.com/sample/transcript-multiple-canvas/canvas/1#t=0,123'
      );

      expect(screen.queryByTestId('list')).not;
    });

    test('shows active item in structure navigation', () => {
      // The first item (item with index zero) is the title
      const listItem = screen.getAllByTestId('list-item')[2];
      expect(listItem).toHaveClass('irmp--structured-nav__list-item');
      expect(listItem).not.toHaveClass('active');
      // first child is the tracker element, second child is the link (<a>)
      fireEvent.click(listItem.children[1]);
      expect(listItem).toHaveClass('active');
    });

    test('removes tracker when item is inactive', () => {
      const listItem1 = screen.getAllByTestId('list-item')[1];
      const listItem2 = screen.getAllByTestId('list-item')[2];
      fireEvent.click(listItem1.children[1]);
      expect(listItem1).toHaveClass('active');

      fireEvent.click(listItem2.children[1]);
      expect(listItem2).toHaveClass('active');
      expect(listItem1).not.toHaveClass('active');
    });
  });
});
