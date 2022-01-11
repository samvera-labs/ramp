import React from 'react';
import List from './List';
import { render, screen } from '@testing-library/react';
import manifest from '@Json/test_data/transcript-multiple-canvas';
import { withManifestAndPlayerProvider } from '../services/testing-helpers';

describe('List component', () => {
  describe('with manifest', () => {
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
      expect(screen.getByText('First item - 1'));
      expect(screen.getByText('Second item - 1'));
    });
  });

  describe('without manifest', () => {
    test('shows message', () => {
      const listProps = { items: [], isChild: false };
      const ListWithoutManifest = withManifestAndPlayerProvider(List, {
        initialManifestState: { manifest: null },
        ...listProps,
      });
      render(<ListWithoutManifest />);
      expect(screen.getByTestId('list-error')).toHaveTextContent(
        'No manifest in List yet'
      );
    });
  });
});
