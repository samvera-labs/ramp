import React from 'react';
import { render, screen } from '@testing-library/react';
import StructuredNavigation from './StructuredNavigation';
import manifest from '@Json/test_data/lunchroom-manners';
import {
  withManifestProvider,
  withManifestAndPlayerProvider,
  withPlayerProvider,
} from '../../services/testing-helpers';

describe('StructuredNavigation component', () => {
  describe('with manifest', () => {
    describe('with structures', () => {
      beforeEach(() => {
        // An example of how we could pass props into
        // the tested(in this case: StructuredNavigation) component directly
        const props = {
          foo: 'bar',
        };

        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: { playerRange: { start: 0, end: 1985 } },
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

      test('first item is a section title', () => {
        const firstItem = screen.getAllByTestId('list-item')[0];
        expect(firstItem.children[0]).toHaveTextContent(
          'Lunchroom Manners'
        );
        expect(firstItem.children[0]).toHaveClass(
          'ramp--structured-nav__section-title'
        );
      });
    });

    describe('without structures', () => {
      test('renders no list items and a message when structures are not present in manifest', () => {
        let manifestWithoutStructures = JSON.parse(JSON.stringify(manifest));
        delete manifestWithoutStructures.structures;

        // Example of how to wrap tests with a "combo Provider" helper
        const NavWithPlayerAndManifest = withManifestAndPlayerProvider(
          StructuredNavigation,
          {
            initialManifestState: { manifest: manifestWithoutStructures },
            initialPlayerState: { playerRange: { start: 0, end: 1985 } },
          }
        );
        render(<NavWithPlayerAndManifest />);
        // screen.debug();

        expect(screen.queryByTestId('list')).toBeNull();
        expect(screen.getByText(/There are no structures in the manifest/));
      });
    });
  });

  describe('without manifest', () => {
    const NavWithoutManifest = withManifestAndPlayerProvider(
      StructuredNavigation,
      { initialManifestState: { manifest: null } }
    );
    render(<NavWithoutManifest />);

    expect(screen.queryByTestId('list')).not.toBeInTheDocument();
    expect(screen.getByText(/No manifest - Please provide a valid manifest./));
  });

  describe('clicked on an invalid media fragment', () => {
    test('logs an error', () => {
      console.error = jest.fn();
      const NavWithInvalidFragment = withManifestAndPlayerProvider(
        StructuredNavigation,
        {
          initialManifestState: { manifest },
          initialPlayerState: {
            clickedUrl:
              'http://example.com/lunchroom-manners/canvas/2t=0,566',
            isClicked: true,
            playerRange: { start: 0, end: 1985 },
          },
        }
      );
      render(<NavWithInvalidFragment />);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        'Error retrieving time fragment object from Canvas URL in structured navigation'
      );
    });
  });
});
