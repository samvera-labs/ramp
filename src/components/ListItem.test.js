import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from './ListItem';
import manifest from '../json/test_data/mahler-symphony-audio';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../services/testing-helpers';

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
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=0,566',
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
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=566,1183',
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
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=1183,1635',
          type: 'Canvas',
        },
      ],
    },
  ],
};

describe('ListItem component single item', () => {
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
  });
});

describe('ListItem component multi item', () => {
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

    // Expect there to be 3 elements in list
    expect(screen.queryAllByTestId('list-item').length).toEqual(4);
  });

  test('creates an anchor element and title for an item', () => {
    const anchorElement = screen.getByText('Track 1. II. Tempo di Menuetto');
    expect(anchorElement.tagName).toEqual('A');
    expect(anchorElement).toHaveAttribute(
      'href',
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=0,566'
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
});
