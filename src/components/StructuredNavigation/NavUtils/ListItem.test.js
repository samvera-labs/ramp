import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ListItem from './ListItem';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../../../services/testing-helpers';
import *  as utils from '@Services/utility-helpers';

describe('ListItem component', () => {
  const sectionRef = { current: '' };
  const initialManifestState = { structures: { isCollapsed: false }, canvasIndex: 0 };
  const structureContainerRef = { current: { scrollTop: 0, querySelector: jest.fn() } };
  const autoScrollMock = jest.spyOn(utils, 'autoScroll').mockImplementationOnce(jest.fn());

  const playlistItem =
  {
    canvasIndex: 1,
    duration: "09:32",
    id: "https://example.com/playlists/1/manifest/canvas/1#t=0.0,",
    isCanvas: true,
    isClickable: true,
    isEmpty: false,
    isTitle: false,
    itemIndex: 1,
    items: [],
    label: "Beginning Responsibility: Lunchroom Manners",
    summary: "Mind your manners!",
    homepage: "https://example.com/playlists/1?position=1",
    rangeId: "https://example.com/playlists/1/manifest/range/1",
    canvasDuration: 0,
    sectionRef: sectionRef,
    structureContainerRef,
  };
  const canvasItem =
  {
    id: undefined,
    duration: '02:00',
    rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
    isTitle: true,
    isCanvas: false,
    canvasIndex: 1,
    itemIndex: undefined,
    isClickable: false,
    isEmpty: false,
    canvasDuration: 0,
    label: 'Introduction',
    items: [
      {
        id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,45.321',
        duration: '00:45',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 1,
        isClickable: true,
        isEmpty: false,
        label: 'Part I',
        items: [],
        canvasDuration: 572.034,
        sectionRef: sectionRef,
        structureContainerRef,
      },
      {
        id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=60,120.321',
        duration: '01:00',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-2',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 2,
        isClickable: true,
        isEmpty: false,
        label: 'Part II',
        canvasDuration: 572.034,
        items: [],
        sectionRef: sectionRef,
        structureContainerRef,
      },
    ],
    sectionRef: sectionRef,
    structureContainerRef,
  };

  describe('with single item', () => {
    beforeEach(() => {
      const props = {
        id: 'https://example.com/sample/transcript-annotation/canvas/1#t=0,374',
        duration: '00:01:14',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 1,
        isClickable: true,
        isEmpty: false,
        label: 'Track 1. I Krafting',
        items: [],
        canvasDuration: 572.034,
        sectionRef: sectionRef,
        structureContainerRef,
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: {},
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
      });
      render(<ListItemWithManifest />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('list-item'));
      expect(screen.getByText('Track 1. I Krafting (00:01:14)'));
    });
  });

  describe('with multiple items', () => {
    const multiItem = {
      id: undefined,
      duration: '',
      rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
      isTitle: true,
      isCanvas: false,
      canvasIndex: 1,
      itemIndex: undefined,
      isClickable: false,
      isEmpty: false,
      canvasDuration: 0,
      label: 'Washing Hands',
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=157,160',
          duration: '00:03',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
          isTitle: false,
          isCanvas: false,
          canvasIndex: 1,
          itemIndex: 1,
          isClickable: true,
          isEmpty: false,
          label: 'Using Soap',
          items: [],
          canvasDuration: 572.034,
          sectionRef: sectionRef,
          structureContainerRef,
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170',
          duration: '00:05',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-3',
          isTitle: false,
          isCanvas: false,
          canvasIndex: 1,
          itemIndex: 2,
          isClickable: true,
          isEmpty: false,
          label: 'Rinsing Well',
          items: [],
          canvasDuration: 572.034,
          sectionRef: sectionRef,
          structureContainerRef,
        },
        {
          id: undefined,
          duration: '',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2',
          isTitle: true,
          isCanvas: false,
          canvasIndex: 1,
          itemIndex: undefined,
          isClickable: false,
          isEmpty: false,
          canvasDuration: 0,
          label: 'After Washing Hands',
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=170,180',
              duration: '00:10',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-1',
              isTitle: false,
              isCanvas: false,
              canvasIndex: 1,
              itemIndex: 3,
              isClickable: true,
              isEmpty: false,
              label: 'Drying Hands',
              items: [],
              canvasDuration: 572.034,
              sectionRef: sectionRef,
              structureContainerRef,
            },
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=180,190',
              duration: '00:10',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-2',
              isTitle: false,
              isCanvas: false,
              canvasIndex: 1,
              itemIndex: 4,
              isClickable: true,
              isEmpty: false,
              label: 'Getting Ready',
              items: [],
              canvasDuration: 572.034,
              sectionRef: sectionRef,
              structureContainerRef,
            }
          ],
          sectionRef: sectionRef,
          structureContainerRef,
        }
      ],
      sectionRef: sectionRef,
      structureContainerRef,
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
        initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
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
      const anchorElement = screen.getByText('Rinsing Well (00:05)');
      expect(anchorElement.tagName).toEqual('SPAN');
      expect(anchorElement.parentElement.tagName).toEqual('A');
      expect(anchorElement.parentElement).toHaveAttribute(
        'href',
        'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170'
      );
    });

    test('shows active item in structure navigation', () => {
      // The first item (item with index zero) is the title
      const listItem = screen.getAllByTestId('list-item')[2];
      expect(listItem).toHaveClass('ramp--structured-nav__list-item');
      expect(listItem).not.toHaveClass('active');
      expect(listItem.isClicked).toBeFalsy();

      // first child is the tracker element, second child is the link (<a>)
      fireEvent.click(listItem.children[1]);

      waitFor(() => {
        expect(autoScrollMock).toHaveBeenCalledTimes(1);
        expect(listItem.isClicked).toBeTruthy();
        expect(listItem).toHaveClass('active');
        expect(listItem.className).toEqual('ramp--structured-nav__list-item active');
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
        expect(autoScrollMock).toHaveBeenCalledTimes(2);
        expect(listItem2).toHaveClass('active');
        expect(listItem1).not.toHaveClass('active');
      });
    });
  });

  describe('with canvas level structure items', () => {
    test('renders the section as a button for regular manifests', () => {
      const props = {
        ...canvasItem
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: {},
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
      });
      render(<ListItemWithManifest />);
      expect(screen.queryAllByTestId('list')).toHaveLength(1);
      expect(screen.queryAllByTestId('list-item').length).toEqual(3);
      expect(screen.queryAllByTestId('list-item')[0]).toHaveAttribute('data-label', 'Introduction');
      expect(screen.queryAllByTestId('list-item')[1]).toHaveTextContent('Part I');
    });

    test('renders the section as link for playlist manifests', () => {
      const props = {
        ...playlistItem
      };
      const ListItemWithPlayer = withPlayerProvider(ListItem, {
        ...props,
        initialState: {},
      });
      const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
        initialState: { ...initialManifestState, playlist: { isPlaylist: true } },
      });
      render(<ListItemWithManifest />);
      expect(screen.queryAllByTestId('list-item').length).toEqual(1);
      expect(screen.queryAllByTestId('list-item')[0]).toHaveTextContent('Beginning Responsibility: Lunchroom Manners (09:32)');
      expect(screen.queryAllByTestId('list-item')[0].getAttribute('data-label')).toEqual('Beginning Responsibility: Lunchroom Manners');
      expect(screen.queryAllByTestId('list-item')[0].getAttribute('data-summary')).toEqual('Mind your manners!');
    });

    describe('sets the anchor element link', () => {
      test('with homepage property in Canvas when specified', () => {
        const props = {
          ...playlistItem
        };
        const ListItemWithPlayer = withPlayerProvider(ListItem, {
          ...props,
          initialState: {},
        });
        const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
          initialState: { ...initialManifestState, playlist: { isPlaylist: true } },
        });
        render(<ListItemWithManifest />);

        expect(screen.queryAllByTestId('list-item').length).toEqual(1);
        expect(screen.queryByText('Beginning Responsibility: Lunchroom Manners (09:32)')).toBeInTheDocument();
        const structItem = screen.getByText('Beginning Responsibility: Lunchroom Manners (09:32)');
        expect(structItem.parentElement.getAttribute('href'))
          .toEqual('https://example.com/playlists/1?position=1');
      });

      test('with Canvas media fragment when homepage is not specified', () => {
        const props = {
          ...canvasItem
        };
        const ListItemWithPlayer = withPlayerProvider(ListItem, {
          ...props,
          initialState: {},
        });
        const ListItemWithManifest = withManifestProvider(ListItemWithPlayer, {
          initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
        });
        render(<ListItemWithManifest />);
        expect(screen.queryAllByTestId('list')).toHaveLength(1);
        expect(screen.queryAllByTestId('list-item').length).toEqual(3);
        expect(screen.queryByText('Part I (00:45)')).toBeInTheDocument();
        const structItem = screen.getByText('Part I (00:45)');
        expect(structItem.parentElement.getAttribute('href'))
          .toEqual('https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,45.321');
      });
    });
  });
});
