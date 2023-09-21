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

    test('displays canvas as an accordion', () => {
      expect(screen.queryByTestId('listitem-section-button')).toBeInTheDocument();
      const sectionAccordion = screen.getByTestId('listitem-section-button');
      expect(sectionAccordion.children[0]).toHaveTextContent('Lunchroom Manners09:32');
      expect(sectionAccordion.children[1]).toHaveClass('structure-accordion-arrow');
    });

    test('displays the correct ListItems', () => {
      expect(screen.getByText('Using Soap (00:03)'));
      expect(screen.getByText('After Washing Hands'));
    });
  });
});
