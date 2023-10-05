import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ListItem from './ListItem';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../../../services/testing-helpers';

describe('ListItem component', () => {
  describe('with single item', () => {
    const sectionRef = { current: '' };
    beforeEach(() => {
      const props = {
        id: 'https://example.com/sample/transcript-annotation/canvas/1#t=0,374',
        duration: '00:01:14',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
        isTitle: false,
        isCanvas: false,
        itemIndex: 1,
        isClickable: true,
        isEmpty: false,
        label: 'Track 1. I Krafting',
        items: [],
        sectionRef: sectionRef
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: {},
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { playlist: { isPlaylist: false } },
      });
      render(<ListItemWithManifest />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('list-item'));
      expect(screen.getByText('1. Track 1. I Krafting (00:01:14)'));
    });
  });

  describe('with multiple items', () => {
    const sectionRef = { current: '' };
    const multiItem = {
      id: undefined,
      duration: '',
      rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
      isTitle: true,
      isCanvas: false,
      itemIndex: undefined,
      isClickable: false,
      isEmpty: false,
      label: 'Washing Hands',
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=157,160',
          duration: '00:03',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
          isTitle: false,
          isCanvas: false,
          itemIndex: 1,
          isClickable: true,
          isEmpty: false,
          label: 'Using Soap',
          items: [],
          sectionRef: sectionRef
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170',
          duration: '00:05',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-3',
          isTitle: false,
          isCanvas: false,
          itemIndex: 2,
          isClickable: true,
          isEmpty: false,
          label: 'Rinsing Well',
          items: [],
          sectionRef: sectionRef
        },
        {
          id: undefined,
          duration: '',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2',
          isTitle: true,
          isCanvas: false,
          itemIndex: undefined,
          isClickable: false,
          isEmpty: false,
          label: 'After Washing Hands',
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=170,180',
              duration: '00:10',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-1',
              isTitle: false,
              isCanvas: false,
              itemIndex: 3,
              isClickable: true,
              isEmpty: false,
              label: 'Drying Hands',
              items: [],
              sectionRef: sectionRef
            },
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=180,190',
              duration: '00:10',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-2',
              isTitle: false,
              isCanvas: false,
              itemIndex: 4,
              isClickable: true,
              isEmpty: false,
              label: 'Getting Ready',
              items: [],
              sectionRef: sectionRef
            }
          ],
          sectionRef: sectionRef
        }
      ],
      sectionRef: sectionRef
    };

    beforeEach(() => {
      const props = {
        ...multiItem
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: {},
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { playlist: { isPlaylist: false } },
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
      const anchorElement = screen.getByText('2. Rinsing Well (00:05)');
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
      waitFor(() => {
        expect(listItem).toHaveClass('active');
      });
    });

    test('removes tracker when item is inactive', () => {
      const listItem1 = screen.getAllByTestId('list-item')[2];
      fireEvent.click(listItem1.children[1]);
      waitFor(() => {
        expect(listItem1).toHaveClass('active');
      });

      const listItem2 = screen.getAllByTestId('list-item')[3];
      fireEvent.click(listItem2.children[1]);

      waitFor(() => {
        expect(listItem2).toHaveClass('active');
        expect(listItem1).not.toHaveClass('active');
      });
    });
  });

  describe('with canvas level structure item', () => {
    const sectionRef = { current: '' };
    const canvasItem =
    {
      id: undefined,
      duration: '09:32',
      rangeId: 'https://example.com/manifest/lunchroom_manners/range/1',
      isTitle: true,
      isCanvas: true,
      itemIndex: 1,
      isClickable: false,
      isEmpty: false,
      label: 'Lunchroom Manners',
      items: [
        {
          id: undefined,
          duration: '02:00',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
          isTitle: true,
          isCanvas: false,
          itemIndex: undefined,
          isClickable: false,
          isEmpty: false,
          label: 'Introduction',
          items: [
            {
              id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,45.321',
              duration: '00:45',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
              isTitle: false,
              isCanvas: false,
              itemIndex: 1,
              isClickable: true,
              isEmpty: false,
              label: 'Part I',
              items: [],
              sectionRef: sectionRef
            },
            {
              id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=60,120.321',
              duration: '01:00',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-2',
              isTitle: false,
              isCanvas: false,
              itemIndex: 2,
              isClickable: true,
              isEmpty: false,
              label: 'Part II',
              items: [],
              sectionRef: sectionRef
            },
          ],
          sectionRef: sectionRef
        }
      ],
      sectionRef: sectionRef
    };
    beforeEach(() => {
      const props = {
        ...canvasItem
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: {},
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { playlist: { isPlaylist: false } },
      });
      render(<ListItemWithManifest />);
    });
    afterEach(() => {
      cleanup();
    });

    test('renders the section with button', () => {
      expect(screen.queryAllByTestId('list')).toHaveLength(2);
      expect(screen.queryAllByTestId('list-item').length).toEqual(4);
      expect(screen.queryAllByTestId('list-item')[0]).toHaveTextContent('1. Lunchroom Manners09:32');
    });
  });
});
