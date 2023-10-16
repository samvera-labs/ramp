import React from 'react';
import List from './List';
import { render, screen } from '@testing-library/react';
import { withManifestAndPlayerProvider } from '../../../services/testing-helpers';

describe('List component', () => {
  const sectionRef = { current: '' };
  describe('displays', () => {
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
            },
          ],
        }
      ],
    };
    beforeEach(() => {
      const props = {
        items: [items],
        sectionRef
      };
      const ListWithManifest = withManifestAndPlayerProvider(List, {
        initialManifestState: { playlist: { isPlaylist: false } },
        initialPlayerState: {},
        ...props
      });
      render(<ListWithManifest />);
    });
    test('sstructures uccessfully', () => {
      expect(screen.getAllByTestId('list'));
    });

    test('canvas level structure item w/o mediafragment as a span', () => {
      expect(screen.queryByTestId('listitem-section-span')).toBeInTheDocument();
      expect(screen.getByTestId('listitem-section-span'))
        .toHaveTextContent('1. Lunchroom Manners09:32');
    });

    test('structures with the correct ListItems', () => {
      expect(screen.getByText('1. Part I (00:45)'));
      expect(screen.getByText('Introduction'));
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
          items: []
        }
      ],
    };
    const props = {
      items: [items],
      sectionRef
    };
    const ListWithManifest = withManifestAndPlayerProvider(List, {
      initialManifestState: { playlist: { isPlaylist: false } },
      initialPlayerState: {},
      ...props
    });
    render(<ListWithManifest />);
    expect(screen.queryByTestId('listitem-section-button')).toBeInTheDocument();
    expect(screen.getByTestId('listitem-section-button'))
      .toHaveTextContent('1. Lunchroom Manners');
  });
});
