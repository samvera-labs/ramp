import React from 'react';
import { render, screen } from '@testing-library/react';
import StructuredNavigation from './StructuredNavigation';
import manifest from '@Json/mahler-symphony-audio';
import {
  withManifestProvider,
  withManifestAndPlayerProvider,
  withPlayerProvider,
} from '../../services/testing-helpers';

describe('StructuredNavigation component', () => {
  beforeEach(() => {
    // An example of how we could pass props into
    // the tested(in this case: StructuredNavigation) component directly
    const props = {
      foo: 'bar',
    };

    const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
      ...props,
    });
    const NavWithManifest = withManifestProvider(NavWithPlayer, {
      initialState: { manifest, canvasIndex: 0 },
    });
    render(<NavWithManifest />);
  });

  test('renders successfully', () => {
    expect(screen.getByTestId('structured-nav'));
  });

  test('returns a List of items when structures are present in the manifest', () => {
    expect(screen.getAllByTestId('list').length).toBeGreaterThan(0);
  });
});

describe('StructuredNavigation component without structures', () => {
  test.only('renders no list items and a message when structures are not present in manifest', () => {
    let manifestWithoutStructures = JSON.parse(JSON.stringify(manifest));
    delete manifestWithoutStructures.structures;

    // Example of how to wrap tests with a "combo Provider" helper
    const NavWithPlayerAndManifest = withManifestAndPlayerProvider(
      StructuredNavigation,
      {
        initialManifestState: { manifest: manifestWithoutStructures },
      }
    );
    render(<NavWithPlayerAndManifest />);
    screen.debug();

    expect(screen.queryByTestId('list')).toBeNull();
    expect(screen.getByText(/There are no structures in the manifest/));
  });
});
