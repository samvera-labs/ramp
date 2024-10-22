import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StructuredNavigation from './StructuredNavigation';
import manifestWoCanvasRefs from '@TestData/transcript-annotation';
import manifest from '@TestData/lunchroom-manners';
import singleCanvasManifest from '@TestData/single-canvas';
import invalidStructure from '@TestData/invalid-structure';
import {
  withManifestProvider,
  withManifestAndPlayerProvider,
  withPlayerProvider,
  manifestState,
} from '../../services/testing-helpers';
import { ErrorBoundary } from 'react-error-boundary';
import playlist from '@TestData/playlist';
import * as utils from '@Services/utility-helpers';

describe('StructuredNavigation component', () => {
  // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
  const ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  window.ResizeObserver = ResizeObserver;

  // Mock utl method, since maxLeght sets to zero in test dom
  jest.spyOn(utils, 'truncateCenter').mockImplementation((str) => {
    return str;
  });

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
          initialState: { ...manifestState(manifest) },
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
          'ramp--structured-nav__content ramp--structured-nav__content-with_root'
        );
      });

      test('renders root Range as a collapsible span', () => {
        expect(screen.getAllByTestId('listitem-section').length).toEqual(2);
        const rootRange = screen.getAllByTestId('listitem-section')[0];
        expect(rootRange).toHaveClass('ramp--structured-nav__section');
        expect(rootRange.children[0]).toHaveClass('section-head-buttons');
        expect(rootRange.children[0].children[0])
          .toHaveAttribute('data-testid', 'listitem-section-span');
        expect(rootRange.children[0].children[0])
          .toHaveClass('ramp--structured-nav__section-title');

        const sectionHead = rootRange.children[0];
        expect(sectionHead.children[0].children[0]).toHaveTextContent('Table of Contents');
        expect(sectionHead.children[0]).toHaveClass(
          'ramp--structured-nav__section-title not-clickable'
        );
        expect(rootRange.children[0].children[1]).toHaveClass('collapse-expand-button');
      });

      test('returns a List of items when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('list').length).toBeGreaterThan(0);
      });

      test('first Canvas item is a section title as a button', () => {
        const firstCanvas = screen.queryAllByTestId('listitem-section')[1];
        expect(firstCanvas.children[0].children[0]).toHaveTextContent('1. Lunchroom Manners11:00');
        expect(firstCanvas.children[0]).toHaveClass('section-head-buttons');
        expect(firstCanvas.children[0].children[1]).toHaveClass('collapse-expand-button');
      });
    });

    describe('with structures without Canvas references for sections', () => {
      beforeEach(() => {
        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: {},
        });
        const NavWithManifest = withManifestProvider(NavWithPlayer, {
          initialState: { ...manifestState(manifestWoCanvasRefs) },
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
        expect(screen.queryAllByTestId('listitem-section').length).toBeGreaterThan(0);
        expect(screen.queryAllByTestId('listitem-section')[0])
          .toHaveTextContent('1. CD1 - Mahler, Symphony No.309:32');

        const firstItem = screen.getAllByTestId('list-item')[0];
        expect(firstItem).toHaveAttribute('data-label', 'Track 1. I. Kraftig');
        expect(firstItem).toHaveTextContent(
          '1. Track 1. I. Kraftig (06:14)'
        );
        expect(firstItem).toHaveClass(
          'ramp--structured-nav__list-item'
        );
      });
    });

    describe('with structures with behavior=top in the root Range', () => {
      beforeEach(() => {
        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: {},
        });
        const NavWithManifest = withManifestProvider(NavWithPlayer, {
          initialState: { ...manifestState(manifestWoCanvasRefs) },
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
          'ramp--structured-nav__content'
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
          initialState: { ...manifestState(singleCanvasManifest) },
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
          'ramp--structured-nav__content'
        );
      });

      test('returns a List of items when structures are present in the manifest', () => {
        expect(screen.queryByTestId('section-collapse-icon')).toBeInTheDocument();
        expect(screen.getAllByTestId('list').length).toBeGreaterThan(0);
        expect(screen.queryAllByTestId('list-item')).toHaveLength(4);
      });

      test('renders root as a Canvas using a span', () => {
        expect(screen.queryByTestId('listitem-section-span')).toBeInTheDocument();
        expect(screen.getByTestId('listitem-section-span'))
          .toHaveTextContent("Gaetano Donizetti, L'Elisir D'Amore");
        expect(screen.getByTestId('listitem-section-span'))
          .toHaveClass('ramp--structured-nav__section-title not-clickable');

        expect(screen.queryByTestId('section-collapse-icon')).toBeInTheDocument();
        const canvasItem = screen.getAllByTestId('list-item')[0];
        expect(canvasItem.children[0]).toHaveTextContent('Atto Primo');
        expect(canvasItem.children[0]).toHaveClass(
          'ramp--structured-nav__item-title'
        );
      });

      test('renders root Range\'s descendants w/o Canvas refs as titles', () => {
        expect(screen.queryByTestId('section-collapse-icon')).toBeInTheDocument();
        const firstItem = screen.queryAllByTestId('list-item')[0];
        expect(firstItem.children[0].tagName).toBe('SPAN');
        expect(firstItem.children[0]).toHaveTextContent('Atto Primo');
        // First title has 2 timespans nested within
        expect(firstItem.children[1].children).toHaveLength(2);
      });

      test('collapses all structure when clicked on root range collapse button', () => {
        expect(screen.queryByTestId('section-collapse-icon')).toBeInTheDocument();
        // Collapse root range
        fireEvent.click(screen.getByTestId('section-collapse-icon'));

        expect(screen.queryAllByTestId('list-item').length).toEqual(0);
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
            initialManifestState: { ...manifestState(manifestWithoutStructures) },
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

  describe('structure with an invalid media fragment', () => {
    test('logs an error', () => {
      // Mock console functions
      let originalLogger = console.log;
      let originalError = console.error;
      console.log = jest.fn();
      console.error = jest.fn();

      const NavWithInvalidFragment = withManifestAndPlayerProvider(
        StructuredNavigation,
        {
          initialManifestState: { ...manifestState(invalidStructure) },
          initialPlayerState: {},
        }
      );
      render(
        <ErrorBoundary>
          <NavWithInvalidFragment />
        </ErrorBoundary>
      );

      waitFor(() => {
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(
          'iiif-parser -> getStructureRanges() -> error parsing structures'
        );
      });

      // Cleanup mocks
      console.log = originalLogger;
      console.error = originalError;
    });
  });

  describe('with a playlist manifest', () => {
    beforeEach(() => {
      const NavWithPlayerAndManifest = withManifestAndPlayerProvider(StructuredNavigation, {
        initialManifestState: { ...manifestState(playlist, 0, true), canvasIsEmpty: true },
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
        'ramp--structured-nav__content playlist-items'
      );
    });

    test('renders all playlist items', () => {
      waitFor(() => {
        expect(screen.queryAllByTestId('list-item')).toHaveLength(6);
        expect(screen.queryAllByTestId('list-item')[2]).toHaveTextContent('Playlist Item 1');
      });
    });

    test('renders lock icon for inaccessible items', () => {
      waitFor(() => {
        expect(screen.queryAllByTestId('list-item')[0]).toHaveTextContent('Restricted Item');
        expect(screen.queryAllByTestId('list-item')[0].children[1]).toHaveClass('structure-item-locked');
      });
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

  test('renders scroll to see more', () => {
    const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
      initialState: {},
    });
    const NavWithManifest = withManifestProvider(NavWithPlayer, {
      initialState: { ...manifestState(manifest) },
    });
    render(
      <ErrorBoundary>
        <NavWithManifest />
      </ErrorBoundary>
    );
    expect(screen.queryByText('Scroll to see more')).toBeInTheDocument();
  });
});
