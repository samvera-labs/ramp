import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StructuredNavigation from './StructuredNavigation';
import manifestWoCanvasRefs from '@TestData/transcript-annotation';
import manifest from '@TestData/lunchroom-manners';
import singleCanvasManifest from '@TestData/single-canvas';
import {
  withManifestProvider,
  withManifestAndPlayerProvider,
  withPlayerProvider,
} from '../../services/testing-helpers';
import { ErrorBoundary } from 'react-error-boundary';
import playlist from '@TestData/playlist';

describe('StructuredNavigation component', () => {
  // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
  const ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  window.ResizeObserver = ResizeObserver;

  describe('with manifest', () => {
    describe('with structures including Canvas references for sections', () => {
      beforeEach(() => {
        // An example of how we could pass props into
        // the tested(in this case: StructuredNavigation) component directly
        const props = {
          foo: 'bar',
        };

        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: {},
        });
        const NavWithManifest = withManifestProvider(NavWithPlayer, {
          initialState: {
            manifest: manifest,
            canvasIndex: 0,
            canvasSegments: [],
            playlist: { isPlaylist: false }
          },
        });
        render(
          <ErrorBoundary>
            <NavWithManifest />
          </ErrorBoundary>
        );
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('structured-nav'));
        expect(screen.getByTestId('structured-nav')).toHaveClass(
          'ramp--structured-nav ramp--structured-nav-with_root'
        );
      });

      test('returns a List of items when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('list').length).toBeGreaterThan(0);
      });

      test('renders root Range as a span', () => {
        expect(screen.queryByText('Table of Contents')).not.toBeNull();

        const rootRange = screen.getAllByTestId('list-item')[0];
        expect(rootRange.children[0]).toHaveTextContent(
          'Table of Contents'
        );
        expect(rootRange.children[0]).toHaveClass(
          'ramp--structured-nav__section'
        );
        expect(rootRange.children[0].children[0].tagName).toBe('SPAN');
      });

      test('first Canvas item is a section title as a button', () => {
        const firstItem = screen.getAllByTestId('list-item')[1];
        expect(firstItem.children[0]).toHaveTextContent(
          'Lunchroom Manners'
        );
        expect(firstItem.children[0]).toHaveClass(
          'ramp--structured-nav__section'
        );
        expect(firstItem.children[0].children[0].tagName).toBe('BUTTON');
      });
    });

    describe('with structures without Canvas references for sections', () => {
      beforeEach(() => {
        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: {},
        });
        const NavWithManifest = withManifestProvider(NavWithPlayer, {
          initialState: {
            manifest: manifestWoCanvasRefs,
            canvasIndex: 0,
            canvasSegments: [],
            playlist: { isPlaylist: false }
          },
        });
        render(
          <ErrorBoundary>
            <NavWithManifest />
          </ErrorBoundary>
        );
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('structured-nav')).toBeInTheDocument();
      });

      test('returns a List of items when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('list').length).toBeGreaterThan(0);
      });

      test('first item is a section title as a span', () => {
        const firstItem = screen.getAllByTestId('list-item')[0];
        expect(firstItem.children[0]).toHaveTextContent(
          'CD1 - Mahler, Symphony No.3'
        );
        expect(firstItem.children[0]).toHaveClass(
          'ramp--structured-nav__section'
        );
        expect(firstItem.children[0].children[0].tagName).toBe('SPAN');
      });
    });

    describe('with structures with behavior=top in the root Range', () => {
      beforeEach(() => {
        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: {},
        });
        const NavWithManifest = withManifestProvider(NavWithPlayer, {
          initialState: {
            manifest: manifestWoCanvasRefs,
            canvasIndex: 0,
            canvasSegments: [],
            playlist: { isPlaylist: false }
          },
        });
        render(
          <ErrorBoundary>
            <NavWithManifest />
          </ErrorBoundary>
        );
      });
      test('renders successfully without root Range', () => {
        expect(screen.queryByTestId('structured-nav'));
        expect(screen.getByTestId('structured-nav')).toHaveClass(
          'ramp--structured-nav'
        );
      });

      test('returns a List of items when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('list').length).toBeGreaterThan(0);
      });

      test('does not render root Range with behavior set to top', () => {
        expect(screen.queryByText('Symphony no. 3 - Mahler, Gustav')).toBeNull();
      });

      test('renders top Range\'s descendants as canvas items', () => {
        const canvasItems = screen.queryAllByTestId('listitem-section');

        expect(canvasItems).toHaveLength(2);
        expect(canvasItems[0]).toHaveTextContent('CD1 - Mahler, Symphony No.3');
      });
    });

    describe('with structures with root Range for a single Canvas', () => {
      beforeEach(() => {
        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: {},
        });
        const NavWithManifest = withManifestProvider(NavWithPlayer, {
          initialState: {
            manifest: singleCanvasManifest,
            canvasIndex: 0,
            canvasSegments: [],
            playlist: { isPlaylist: false }
          },
        });
        render(
          <ErrorBoundary>
            <NavWithManifest />
          </ErrorBoundary>
        );
      });

      test('renders successfully with root Range as a Canvas', () => {
        expect(screen.queryByTestId('structured-nav'));
        expect(screen.getByTestId('structured-nav')).toHaveClass(
          'ramp--structured-nav'
        );
      });

      test('returns a List of items when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('list').length).toBeGreaterThan(0);
        expect(screen.queryAllByTestId('list-item')).toHaveLength(5);
      });

      test('renders root as a Canvas using a span', () => {
        expect(screen.queryByText("Gaetano Donizetti, L'Elisir D'Amore")).not.toBeNull();

        const canvasItem = screen.getAllByTestId('list-item')[0];
        expect(canvasItem.children[0]).toHaveTextContent(
          "Gaetano Donizetti, L'Elisir D'Amore"
        );
        expect(canvasItem.children[0]).toHaveClass(
          'ramp--structured-nav__section active'
        );
        expect(canvasItem.children[0].children[0].tagName).toBe('SPAN');
      });

      test('renders root Range\'s descendants w/o Canvas refs as titles', () => {
        const firstItem = screen.queryAllByTestId('list-item')[1];
        expect(firstItem.children[0].tagName).toBe('SPAN');
        expect(firstItem.children[0]).toHaveTextContent('Atto Primo');
        // First title has 2 timespans nested within
        expect(firstItem.children[1].children).toHaveLength(2);
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
            initialManifestState: { manifest: manifestWithoutStructures, playlist: { isPlaylist: false } },
            initialPlayerState: {},
          }
        );
        render(
          <ErrorBoundary>
            <NavWithPlayerAndManifest />
          </ErrorBoundary>);

        expect(screen.queryByTestId('list')).toBeNull();
        expect(screen.getByText(/There are no structures in the manifest/));
      });
    });
  });

  test('without manifest', () => {
    const NavWithoutManifest = withManifestAndPlayerProvider(
      StructuredNavigation,
      { initialManifestState: { manifest: null, playlist: { isPlaylist: false } } }
    );
    render(
      <ErrorBoundary>
        <NavWithoutManifest />
      </ErrorBoundary>
    );

    expect(screen.queryByTestId('list')).not.toBeInTheDocument();
    expect(screen.getByText(/No manifest - Please provide a valid manifest./));
  });

  describe('clicked on an invalid media fragment', () => {
    test('logs an error', () => {
      // Mock console functions
      let originalLogger = console.log;
      let originalError = console.error;
      console.log = jest.fn();
      console.error = jest.fn();

      const NavWithInvalidFragment = withManifestAndPlayerProvider(
        StructuredNavigation,
        {
          initialManifestState: { manifest, canvasSegments: [], playlist: { isPlaylist: false } },
          initialPlayerState: {
            clickedUrl:
              'http://example.com/lunchroom-manners/canvas/2t=0,566',
            isClicked: true,
          },
        }
      );
      render(
        <ErrorBoundary>
          <NavWithInvalidFragment />
        </ErrorBoundary>
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        'StructuredNavigation -> invalid media fragment in structure item -> ', undefined
      );
      expect(console.log).toHaveBeenCalledWith(
        'Canvas not found in Manifest, ',
        'http://example.com/lunchroom-manners/canvas/2t=0,566'
      );
      // Cleanup mocks
      console.log = originalLogger;
      console.error = originalError;
    });
  });

  describe('with a playlist manifest', () => {
    beforeEach(() => {
      const NavWithPlayerAndManifest = withManifestAndPlayerProvider(StructuredNavigation, {
        initialManifestState: {
          manifest: playlist,
          playlist: { isPlaylist: true },
          canvasIsEmpty: true,
          canvasSegments: []
        },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <NavWithPlayerAndManifest />
        </ErrorBoundary>
      );
    });

    test('renders successfully', () => {
      expect(screen.queryByTestId('structured-nav'));
      expect(screen.getByTestId('structured-nav')).toHaveClass(
        'ramp--structured-nav playlist-items'
      );
    });

    test('renders all playlist items', () => {
      expect(screen.queryAllByTestId('list-item')).toHaveLength(4);
      expect(screen.queryAllByTestId('list-item')[1]).toHaveTextContent('Playlist Item 1');
    });

    test('renders lock icon for inaccessible items', () => {
      expect(screen.queryAllByTestId('list-item')[0]).toHaveTextContent('Restricted Item');
      expect(screen.queryAllByTestId('list-item')[0].children[1]).toHaveClass('structure-item-locked');
    });

    test('does not render root Range', () => {
      expect(screen.queryByText('Playlist Manifest')).toBeNull();
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
