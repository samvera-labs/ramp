import React from 'react';
import List from './List';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../../services/testing-helpers';

describe('List component', () => {
  const sectionRef = { current: '' };
  const initialManifestState = { structures: { isCollapsed: false }, canvasIndex: 0 };
  const structureContainerRef = { current: { scrollTop: 0 } };
  describe('with a regular manifest', () => {
    const items =
    {
      id: undefined,
      duration: '09:32',
      rangeId: 'https://example.com/manifest/lunchroom_manners/range/1',
      isTitle: true,
      isCanvas: true,
      itemIndex: 1,
      isClickable: false,
      isEmpty: false,
      canvasDuration: 0,
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
          canvasDuration: 0,
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
              canvasDuration: 572.034,
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
              canvasDuration: 572.034,
            },
          ],
        }
      ],
    };
    beforeEach(() => {
      const props = {
        items: [items],
        sectionRef,
        structureContainerRef,
        isPlaylist: false,
      };
      const ListWithManifest = withManifestAndPlayerProvider(List, {
        initialManifestState: { ...initialManifestState, playlist: { isPlaylist: false } },
        initialPlayerState: {},
        ...props
      });
      render(<ListWithManifest />);
    });
    test('renders structure successfully', () => {
      expect(screen.getAllByTestId('list'));
    });

    test('displays canvas level structure item w/o mediafragment as a span', () => {
      expect(screen.queryByTestId('listitem-section-span')).toBeInTheDocument();
      expect(screen.getByTestId('listitem-section-span'))
        .toHaveTextContent('1.Lunchroom Manners09:32');
    });

    test('displays structures with the correct ListItems', () => {
      expect(screen.getByText('Part I (00:45)'));
      expect(screen.getByText('Part I (00:45)').parentElement.tagName).toEqual('A');
      expect(screen.getByText('Introduction'));
      expect(screen.getByText('Introduction')).toHaveClass('ramp--structured-nav__item-title');
    });
  });

  test('displays canvas level structure item with mediafragment as a button', () => {
    const items = {
      id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,572',
      duration: '09:32',
      rangeId: 'https://example.com/manifest/lunchroom_manners/range/1',
      isTitle: true,
      isCanvas: true,
      itemIndex: 1,
      isClickable: false,
      isEmpty: false,
      label: 'Lunchroom Manners',
      canvasDuration: 572.034,
      items: [
        {
          id: undefined,
          duration: '00:00',
          rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
          isTitle: true,
          isCanvas: false,
          itemIndex: undefined,
          isClickable: false,
          isEmpty: false,
          label: 'Introduction',
          items: [],
          canvasDuration: 0
        }
      ],
    };
    const props = {
      items: [items],
      sectionRef,
      structureContainerRef,
      isPlaylist: false,
    };
    const ListWithManifest = withManifestAndPlayerProvider(List, {
      initialManifestState: { ...initialManifestState, playlist: { isPlaylist: false } },
      initialPlayerState: {},
      ...props
    });
    render(<ListWithManifest />);
    expect(screen.queryByTestId('listitem-section-button')).toBeInTheDocument();
    expect(screen.getByTestId('listitem-section-button'))
      .toHaveTextContent('1.Lunchroom Manners09:32');
  });

  describe('with playlist manifest', () => {
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
      canvasDuration: 572.034,
      label: "Beginning Responsibility: Lunchroom Manners",
      rangeId: "https://example.com/playlists/1/manifest/range/1"
    };
    const props = {
      items: [playlistItem],
      sectionRef,
      structureContainerRef,
      isPlaylist: true,
    };
    beforeEach(() => {
      const ListWithManifest = withManifestAndPlayerProvider(List, {
        initialManifestState: { ...initialManifestState, playlist: { isPlaylist: true } },
        initialPlayerState: {},
        ...props
      });
      render(<ListWithManifest />);
    });
    test('displays playlist items as timespans', () => {
      expect(screen.queryAllByTestId('list')).toHaveLength(1);
      expect(screen.queryAllByTestId('list-item').length).toEqual(1);
      expect(screen.queryAllByTestId('list-item')[0])
        .toHaveTextContent('1. Beginning Responsibility: Lunchroom Manners (09:32)');
      // Has tracker UI element attached 
      expect(screen.queryAllByTestId('list-item')[0].children[0]).toHaveClass('tracker');
    });

    test('shows tracker when clicked on the item', () => {
      expect(screen.queryAllByTestId('list-item').length).toEqual(1);
      const playlistItem = screen.getAllByTestId('list-item')[0];
      expect(playlistItem).not.toHaveClass('active');
      fireEvent.click(playlistItem);
      waitFor(() => {
        expect(playlistItem).toHaveClass('active');
      });
    });
  });
});
