import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ListItem from './ListItem';
import manifest from '@TestData/transcript-annotation';
import lunchroomManners from '@TestData/lunchroom-manners';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../../../services/testing-helpers';

const singleItem = {
  id: 'https://example.com/sample/transcript-annotation/range/1-1',
  type: 'Range',
  label: {
    en: ['Track 1. I. Kraftig'],
  },
  items: [
    {
      id: 'https://example.com/sample/transcript-annotation/canvas/1#t=0,374',
      type: 'Canvas',
    },
  ],
};

const multiItem = {
  id: 'https://example.com/manifest/lunchroom_manners/range/1-1',
  type: 'Range',
  label: { en: ['Washing Hands'] },
  items: [
    {
      id: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
      type: 'Range',
      label: { en: ['Using Soap'] },
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=157,160',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://example.com/manifest/lunchroom_manners/range/1-1-3',
      type: 'Range',
      label: { en: ['Rinsing Well'] },
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://example.com/manifest/lunchroom_manners/range/1-2',
      type: 'Range',
      label: { en: ['After Washing Hands'] },
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/range/1-2-1',
          type: 'Range',
          label: { en: ['Drying Hands'] },
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=170,180',
              type: 'Canvas',
            },
          ],
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/range/1-2-2',
          type: 'Range',
          label: { en: ['Getting Ready'] },
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=180,190',
              type: 'Canvas',
            },
          ],
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
        isCanvasNode: false,
        canvasInfo: {
          canvasId: 'https://example.com/manfiest/lunchroom_manners/canvas/1',
          isEmpty: false,
        }
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
        isCanvasNode: false,
        canvasInfo: {
          canvasId: 'https://example.com/manfiest/lunchroom_manners/canvas/1',
          isEmpty: false,
        }
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: { playerRange: { start: 0, end: 660 } },
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { manifest: lunchroomManners, canvasIndex: 0 },
      });
      render(<ListItemWithManifest />);
    });
    afterEach(() => {
      cleanup();
    });

    test('renders a child list if there are child ranges in manifest', () => {
      expect(screen.queryAllByTestId('list')).toHaveLength(2);
      expect(screen.queryAllByTestId('list-item').length).toEqual(6);
    });

    test('creates an anchor element and title for an item', () => {
      const anchorElement = screen.getByText('Rinsing Well');
      expect(anchorElement.tagName).toEqual('A');
      expect(anchorElement).toHaveAttribute(
        'href',
        'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170'
      );
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
      fireEvent.click(listItem1.children[1]);
      expect(listItem1).toHaveClass('active');

      waitFor(() => {
        const listItem2 = screen.getAllByTestId('list-item')[3];
        fireEvent.click(listItem2.children[1]);
        expect(listItem2).toHaveClass('active');
        expect(listItem1).not.toHaveClass('active');
      });
    });
  });
});
