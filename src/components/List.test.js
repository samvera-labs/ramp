import React from 'react';
import List from './List';
import manifest from '../json/mahler-symphony-audio';
import { renderWithRedux } from '../services/testing-helpers';

describe('ListItem component', () => {
  test('renders successfully', () => {
    const { container } = renderWithRedux(
      <List items={manifest.structures} isChild={false} />
    );
    expect(container).toBeTruthy();
  });

  test('displays the correct ListItems', () => {
    const items = [
      {
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-1',
        type: 'Range',
        label: {
          en: ['Track 1. I. Kraftig'],
        },
        items: [
          {
            id:
              'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,374',
            type: 'Canvas',
          },
        ],
      },
      {
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-2',
        type: 'Range',
        label: {
          en: ['Track 2. Langsam. Schwer'],
        },
        items: [
          {
            id:
              'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=374,525',
            type: 'Canvas',
          },
        ],
      },
    ];

    const { getByText, getByTestId } = renderWithRedux(
      <List items={items} isChild={true} />
    );
    expect(getByTestId('list')).toBeInTheDocument();
    expect(getByText('Track 1. I. Kraftig')).toBeInTheDocument();
    expect(getByText('Track 2. Langsam. Schwer')).toBeInTheDocument();
  });

  test('displays collapsible structure', () => {
    const items = [
      {
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1',
        type: 'Range',
        label: {
          en: ['CD1 - Mahler, Symphony No.3'],
        },
        items: [],
      },
    ];

    const { getByText, getByTestId } = renderWithRedux(
      <List items={items} isChild={false} />
    );
    expect(getByTestId('collapsible')).toBeInTheDocument();
    expect(getByText('CD1 - Mahler, Symphony No.3')).toBeInTheDocument();
  });
});
