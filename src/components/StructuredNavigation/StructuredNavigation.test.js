import React from 'react';
import { fireEvent, queryAllByTestId, render, screen, waitFor } from '@testing-library/react';
import StructuredNavigation from './StructuredNavigation';
import manifest from '@TestData/lunchroom-manners';
import {
  withManifestProvider,
  withManifestAndPlayerProvider,
  withPlayerProvider,
} from '../../services/testing-helpers';
import playlist from '@TestData/playlist';

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

      test('first item is a Canvas root node', () => {
        const firstItem = screen.getAllByTestId('list-item')[0];
        expect(firstItem.children[0]).toHaveTextContent(
          'Lunchroom Manners'
        );
        expect(firstItem).toHaveClass('ramp--structured-nav__list-item');
        expect(firstItem.children[0]).toHaveAttribute('href');
      });

      test('second item is a title', () => {
        const secondItem = screen.getAllByTestId('list-item')[1];
        expect(secondItem.children[0]).toHaveTextContent(
          'Washing Hands'
        );
        expect(secondItem.children[0]).toHaveClass(
          'ramp--structured-nav__title-item'
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

  describe('with a playlist manifest', () => {
    beforeEach(() => {
      const NavWithPlayerAndManifest = withManifestAndPlayerProvider(StructuredNavigation, {
        initialManifestState: {
          manifest: playlist,
          playlist: { isPlaylist: true },
          canvasIsEmpty: true,
          navItems: [
            {
              id: 'http://example.com/manifests/playlist/canvas/1#t=0',
              label: 'Restricted Item',
              isTitleTimespan: false,
            },
            {
              id: 'http://example.com/manifests/playlist/canvas/2#t=0',
              label: 'Playlist Item 1',
              isTitleTimespan: false,
            },
            {
              id: 'http://example.com/manifests/playlist/canvas/3#t=0',
              label: 'Playlist Item 2',
              isTitleTimespan: false,
            }
          ]
        },
        initialPlayerState: { playerRange: { start: null, end: null } },
      });
      render(<NavWithPlayerAndManifest />);
    });

    test('renders all playlist items', () => {
      expect(screen.queryAllByTestId('list-item')).toHaveLength(3);
      expect(screen.queryAllByTestId('list-item')[1]).toHaveTextContent('Playlist Item 1');
    });

    test('renders lock icon for inaccessible items', () => {
      expect(screen.queryAllByTestId('list-item')[0]).toHaveTextContent('Restricted Item');
      expect(screen.queryAllByTestId('list-item')[0].children[1]).toHaveClass('structure-item-locked');
    });

    test('renders first item as active', () => {
      waitFor(() => {
        expect(screen.queryAllByTestId('list-item')[0]).toHaveClass('active');
      });
    });

    test('marks inaccessible items as active when clicked', () => {
      const firstItem = screen.queryAllByTestId('list-item')[0];
      const inaccessibleItem = screen.queryAllByTestId('list-item')[1];

      waitFor(() => {
        expect(firstItem).toHaveClass('active');

        fireEvent.click(inaccessibleItem);

        expect(inaccessibleItem).toHaveClass('active');
        expect(firstItem).not.toHaveClass('active');
      });
    });
  });
});
