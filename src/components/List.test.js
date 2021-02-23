import React from 'react';
import List from './List';
import { render, screen } from '@testing-library/react';
import manifest from '../json/test_data/mahler-symphony-audio';
import { withManifestAndPlayerProvider } from '../services/testing-helpers';

describe('List component', () => {
  beforeEach(() => {
    const listProps = {
      items: manifest.structures,
      isChild: true,
    };
    const ListWithManifest = withManifestAndPlayerProvider(List, {
      initialManifestState: { manifest, canvasIndex: 0 },
      ...listProps,
    });
    render(<ListWithManifest />);
  });

  test('renders successfully', () => {
    expect(screen.getAllByTestId('list'));
  });

  test('displays the correct ListItems', () => {
    expect(screen.getByText('Track 1. I. Kraftig'));
    expect(screen.getByText('Track 2. Langsam. Schwer'));
  });
});
