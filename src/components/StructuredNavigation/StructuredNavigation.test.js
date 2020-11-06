import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StructuredNavigation from './StructuredNavigation';
import manifest from '@Json/mahler-symphony-audio';
import { ManifestProvider } from '../../context/manifest-context';

describe('StructuredNavigation component', () => {
  test.only('renders successfully', () => {
    render(
      <ManifestProvider initialState={{ manifest }}>
        <StructuredNavigation manifest={manifest} />
      </ManifestProvider>
    );
    expect(screen.getByTestId('structured-nav'));
    screen.debug();
  });

  test('returns a List of items when structures are present in the manifest', async () => {
    render(
      <ManifestProvider initialState={{ manifest }}>
        <StructuredNavigation manifest={manifest} />
      </ManifestProvider>
    );
    await waitFor(() => {
      expect(screen.getAllByTestId('list').length.toBeGreaterThan(0));
    });
  });

  test('returns message when structures are not present in manifest', () => {
    let manifestWithoutStructures = JSON.parse(JSON.stringify(manifest));
    delete manifestWithoutStructures.structures;

    render(
      <ManifestProvider initialState={{ manifest: manifestWithoutStructures }}>
        <StructuredNavigation manifest={manifestWithoutStructures} />
      </ManifestProvider>
    );
    expect(screen.queryByTestId('list')).toBeNull();
    expect(
      screen.getByText(/There are no structures in the manifest/)
    ).toBeInTheDocument();
  });
});
