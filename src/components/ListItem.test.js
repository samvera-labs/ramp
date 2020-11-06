import React from 'react';
import { renderWithRedux } from '../services/testing-helpers';
import ListItem from './ListItem';

const singleItem = {
  id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-1',
  type: 'Range',
  label: {
    en: ['Track 1. I. Kraftig'],
  },
  items: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,374',
      type: 'Canvas',
    },
  ],
};

const multiItem = {
  id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2',
  type: 'Range',
  label: {
    en: ['CD2 - Mahler, Symphony No.3 (cont.)'],
  },
  items: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2-1',
      type: 'Range',
      label: {
        en: ['Track 1. II. Tempo di Menuetto'],
      },
      items: [
        {
          id:
            'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=0,566',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2-2',
      type: 'Range',
      label: {
        en: ['Track 2. III. Comodo'],
      },
      items: [
        {
          id:
            'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=566,1183',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2-3',
      type: 'Range',
      label: {
        en: ['Track 3. Tempo I'],
      },
      items: [
        {
          id:
            'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=1183,1635',
          type: 'Canvas',
        },
      ],
    },
  ],
};

describe('ListItem component', () => {
  test('renders successfully', () => {
    const { container } = renderWithRedux(
      <ListItem item={singleItem} isChild={false} />
    );
    expect(container).toBeTruthy();
  });

  test('creates an anchor element and title for an item', () => {
    const { getByTestId, getByText, queryByTestId } = renderWithRedux(
      <ListItem item={singleItem} isChild={false} />
    );
    expect(getByTestId(/list-item/)).toBeInTheDocument();

    const anchorElement = getByText('Track 1. I. Kraftig');
    expect(anchorElement.tagName).toEqual('A');
    expect(anchorElement).toHaveAttribute(
      'href',
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,374'
    );

    expect(queryByTestId('list')).not.toBeInTheDocument();
  });

  test('renders a child list if there are child ranges in manifest', () => {
    const { getByTestId, queryAllByTestId } = renderWithRedux(
      <ListItem item={multiItem} isChild={false} />
    );
    expect(getByTestId('list')).toBeInTheDocument();

    // Expect there to be 3 elements in list
    expect(queryAllByTestId('list-item').length).toEqual(4);
  });
});
