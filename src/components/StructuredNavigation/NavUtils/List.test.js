import React from 'react';
import List from './List';
import { render, screen } from '@testing-library/react';
import manifest from '@TestData/lunchroom-manners';
import { withManifestAndPlayerProvider } from '../../../services/testing-helpers';

describe('List component', () => {
  const sectionRef = { current: '' };
  describe('with manifest', () => {
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
          label: 'Washing Hands',
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=157,160',
              duration: '00:03',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-1',
              isTitle: false,
              isCanvas: false,
              itemIndex: 3,
              isClickable: true,
              isEmpty: false,
              label: 'Using Soap',
              items: [],
            },
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170',
              duration: '00:05',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-3',
              isTitle: false,
              isCanvas: false,
              itemIndex: 4,
              isClickable: true,
              isEmpty: false,
              label: 'Rinsing Well',
              items: [],
            },
            {
              id: undefined,
              duration: '',
              rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-4',
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
                  rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-4-1',
                  isTitle: false,
                  isCanvas: false,
                  itemIndex: 5,
                  isClickable: true,
                  isEmpty: false,
                  label: 'Drying Hands',
                  items: [],
                },
                {
                  id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=180,190',
                  duration: '00:10',
                  rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-4-2',
                  isTitle: false,
                  isCanvas: false,
                  itemIndex: 6,
                  isClickable: true,
                  isEmpty: false,
                  label: 'Getting Ready',
                  items: [],
                }
              ],
            }
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
    test('renders successfully', () => {
      expect(screen.getAllByTestId('list'));
    });

    test('displays canvas level node as a button', () => {
      expect(screen.queryByTestId('listitem-section-button')).toBeInTheDocument();
      const sectionButton = screen.getByTestId('listitem-section-button');
      expect(sectionButton.children[0]).toHaveTextContent('1. Lunchroom Manners09:32');
    });

    test('displays the correct ListItems', () => {
      expect(screen.getByText('3. Using Soap (00:03)'));
      expect(screen.getByText('After Washing Hands'));
    });
  });
});
