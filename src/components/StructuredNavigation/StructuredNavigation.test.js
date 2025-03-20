import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StructuredNavigation from './StructuredNavigation';
import manifestWoCanvasRefs from '@TestData/transcript-annotation';
import manifest from '@TestData/lunchroom-manners';
import singleCanvasManifest from '@TestData/single-canvas';
import invalidStructure from '@TestData/invalid-structure';
import thumbnailNavStructure from '@TestData/transcript-multiple-canvas';
import playlist from '@TestData/playlist';
import nonCollapsibleStructure from '@TestData/multiple-canvas-auto-advance';
import {
  withManifestProvider,
  withManifestAndPlayerProvider,
  withPlayerProvider,
  manifestState,
} from '../../services/testing-helpers';
import { ErrorBoundary } from 'react-error-boundary';
import * as hooks from '@Services/ramp-hooks';

describe('StructuredNavigation component', () => {
  // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
  const ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  window.ResizeObserver = ResizeObserver;

  // Cleanup all Jest mocks after tests are run
  afterAll(() => { jest.resetAllMocks(); });

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
        expect(screen.getAllByTestId('treeitem-section')).toHaveLength(2);
      });

      test('renders root Range as a non-collapsible span', () => {
        expect(screen.queryByText('Table of Contents')).not.toBeNull();

        const rootRange = screen.getAllByTestId('treeitem-section')[0];
        expect(rootRange).toHaveClass('ramp--structured-nav__section');
        // Only have the non-clickable span (no collapse arrow icon)
        expect(rootRange.children).toHaveLength(1);
        expect(rootRange.children[0]).toHaveClass('ramp--structured-nav__section-title not-clickable');
        expect(rootRange.children[0])
          .toHaveAttribute('data-testid', 'treeitem-section-span');

        // Conten within the non-clickable span
        expect(rootRange.children[0].children).toHaveLength(1);
        const sectionHead = rootRange.children[0];
        expect(sectionHead.children[0]).toHaveTextContent('Table of Contents');
        expect(sectionHead.children[0]).toHaveClass('ramp--structured-nav__title');
      });

      test('returns a List of items when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('tree-item').length).toBeGreaterThan(0);
      });

      test('first Canvas item is a section title as a button', () => {
        expect(screen.queryByText('Table of Contents')).toBeInTheDocument();

        const firstCanvas = screen.queryAllByTestId('treeitem-section')[1];
        expect(firstCanvas.children).toHaveLength(2);
        expect(firstCanvas.children[0]).toHaveTextContent('1.Lunchroom Manners11:00');
        expect(firstCanvas.children[0]).toHaveClass('ramp--structured-nav__section-title active');
        expect(firstCanvas.children[1]).toHaveClass('collapse-expand-button');
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

      test('returns a list of sections when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('nested-tree').length).toBeGreaterThan(0);
        expect(screen.queryAllByTestId('treeitem-section')).toHaveLength(2);
      });

      test('first item is a section title as a span', () => {
        const sections = screen.queryAllByTestId('treeitem-section');
        expect(sections.length).toBe(2);
        expect(sections[0].children[0]).toHaveTextContent('1.CD1 - Mahler, Symphony No.309:32');

        // Two sections w/o Canvas references are rendered as text
        expect(screen.queryAllByTestId('treeitem-section-span').length).toBe(2);

        expect(screen.queryAllByTestId('tree-item')).toHaveLength(14);
        const treeItems = screen.getAllByTestId('tree-item');
        expect(treeItems[0]).toHaveAttribute('data-label', 'CD1 - Mahler, Symphony No.3');

        expect(treeItems[1]).toHaveTextContent('1.Track 1. I. Kraftig (06:14)');
        expect(treeItems[1]).toHaveClass('ramp--structured-nav__tree-item');
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
        expect(screen.getByTestId('structured-nav')).toHaveClass('ramp--structured-nav__content');
      });

      test('returns a list of sections when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('nested-tree').length).toBeGreaterThan(0);
        expect(screen.queryAllByTestId('treeitem-section')).toHaveLength(2);
      });

      test('does not render root Range with behavior set to top', () => {
        expect(screen.queryByText('Symphony no. 3 - Mahler, Gustav')).toBeNull();
      });

      test('renders top Range\'s descendants as canvas items', () => {
        const canvasItems = screen.queryAllByTestId('treeitem-section');

        expect(canvasItems).toHaveLength(2);
        expect(canvasItems[0]).toHaveTextContent('CD1 - Mahler, Symphony No.3');
        expect(canvasItems[1]).toHaveTextContent('CD2 - Mahler, Symphony No.3 (cont.)');
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

      test('returns a list of sections when structures are present in the manifest', () => {
        expect(screen.getAllByTestId('nested-tree').length).toBeGreaterThan(0);
        expect(screen.queryAllByTestId('treeitem-section')).toHaveLength(1);
      });

      test('renders root as a Canvas using a span', () => {
        expect(screen.queryAllByTestId('treeitem-section-span')).toHaveLength(1);
        expect(screen.getByTestId('treeitem-section-span'))
          .toHaveTextContent("Gaetano Donizetti, L'Elisir D'Amore");
        expect(screen.getByTestId('treeitem-section-span'))
          .toHaveClass('ramp--structured-nav__section-title not-clickable');

        expect(screen.queryAllByTestId('tree-item')).toHaveLength(5);
        const firstTreeItem = screen.getAllByTestId('tree-item')[1];
        expect(firstTreeItem).toHaveTextContent('Atto Primo');
        expect(firstTreeItem).toHaveClass('ramp--structured-nav__tree-item');
      });

      test('renders root Range\'s descendants w/o Canvas refs as titles', () => {
        expect(screen.queryAllByTestId('tree-group').length).toBeGreaterThan(0);

        // The first level of nodes has 2 children referencing to canvases
        expect(screen.getAllByTestId('tree-group')[0].children).toHaveLength(2);
        const titles = screen.getAllByTestId('tree-group')[0].children;

        // The first item w/o Canvas reference is displayed as a Span
        expect(titles[0]).toHaveTextContent('Atto Primo');
        expect(titles[0].children).toHaveLength(2);
        expect(titles[0].children[0].tagName).toBe('SPAN');
        // First title has 2 timespans nested within
        expect(titles[0].children[1].tagName).toBe('UL');
        expect(titles[0].children[1].children).toHaveLength(2);

        // The second item with Canvas reference is displayed as an Anchor
        expect(titles[1]).toHaveTextContent('Atto Secondo');
        expect(titles[1].children).toHaveLength(2);
        expect(titles[1].children[1].tagName).toBe('A');
      });
    });

    describe('with structures with behavior=thumbnail-nav in the root Range', () => {
      beforeEach(() => {
        const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
          initialState: {},
        });
        const NavWithManifest = withManifestProvider(NavWithPlayer, {
          initialState: { ...manifestState(thumbnailNavStructure) },
        });
        render(
          <ErrorBoundary>
            <NavWithManifest />
          </ErrorBoundary>
        );
      });

      test('renders component', () => {
        expect(screen.queryByTestId('structured-nav')).toBeInTheDocument();
      });

      test('does not render any structure elements', () => {
        expect(screen.queryByTestId('nested-tree')).toBeNull();
        expect(screen.queryByText(/There are no structures in the manifest/)).toBeInTheDocument();
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

        expect(screen.queryByTestId('nested-tree')).toBeNull();
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

    expect(screen.queryByTestId('nested-tree')).not.toBeInTheDocument();
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
      // No nested items
      expect(screen.queryAllByTestId('tree-group').length).toBe(0);
      // Has linked leaf nodes for each playlist item
      expect(screen.queryAllByTestId('tree-item')).toHaveLength(6);
      expect(screen.queryAllByTestId('tree-item')[2]).toHaveTextContent('Playlist Item 1');
    });

    test('renders lock icon for inaccessible items', () => {
      expect(screen.queryAllByTestId('tree-item')[0]).toHaveTextContent('Restricted Item');
      // SVG icon with class is displayed
      expect(screen.queryAllByTestId('tree-item')[0].children[1].children[0])
        .toHaveClass('structure-item-locked');
    });

    test('does not render root Range', () => {
      expect(screen.queryByText('Playlist Manifest')).toBeNull();
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

  describe('collapse/expand sections button', () => {
    test('expands sections on inital render', () => {
      const props = { showAllSectionsButton: true };
      const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
        initialManifestState: { ...manifestState(manifestWoCanvasRefs) },
        initialPlayerState: {},
        ...props,
      });
      render(
        <ErrorBoundary>
          <NavWithProviders />
        </ErrorBoundary>
      );

      expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
      expect(screen.getByText('Close 2 Sections')).toBeInTheDocument();
      expect(screen.queryByTestId('collapse-expand-all-btn').children[0]).toHaveClass('arrow up');

      // Has multiple collapsible sections
      expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(2);
      expect(screen.queryAllByTestId('section-collapse-icon')[1].children[0]).toHaveClass('arrow up');
    });

    test('collapses all sections on click', () => {
      const props = { showAllSectionsButton: true };
      const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
        initialManifestState: { ...manifestState(manifestWoCanvasRefs) },
        initialPlayerState: {},
        ...props,
      });
      render(
        <ErrorBoundary>
          <NavWithProviders />
        </ErrorBoundary>
      );

      expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
      const collapseExpandAll = screen.getByTestId('collapse-expand-all-btn');
      expect(screen.getByText('Close 2 Sections')).toBeInTheDocument();
      expect(collapseExpandAll.children[0]).toHaveClass('arrow up');

      // Has multiple collapsible sections expanded by default
      expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(2);
      const collapseSectionBtns = screen.queryAllByTestId('section-collapse-icon');
      expect(collapseSectionBtns[0].children[0]).toHaveClass('arrow up');
      expect(collapseSectionBtns[1].children[0]).toHaveClass('arrow up');

      fireEvent.click(collapseExpandAll);

      expect(screen.getByText('Expand 2 Sections')).toBeInTheDocument();
      expect(collapseExpandAll.children[0]).toHaveClass('arrow down');
      expect(collapseSectionBtns[0].children[0]).toHaveClass('arrow down');
      expect(collapseSectionBtns[1].children[0]).toHaveClass('arrow down');
    });

    describe('with prop showAllSectionsButton', () => {
      describe('set to false (default)', () => {
        test('does not render for manifest w/ collapsible structures', () => {
          const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
            initialManifestState: { ...manifestState(manifestWoCanvasRefs) },
            initialPlayerState: {},
          });
          render(
            <ErrorBoundary>
              <NavWithProviders />
            </ErrorBoundary>
          );

          expect(screen.queryByTestId('collapse-expand-all-btn')).not.toBeInTheDocument();
          // Has multiple collapsible sections
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(2);
        });

        test('does not render for manifest w/o collapsible structures', () => {
          const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
            initialManifestState: { ...manifestState(nonCollapsibleStructure) },
            initialPlayerState: {},
          });
          render(
            <ErrorBoundary>
              <NavWithProviders />
            </ErrorBoundary>
          );

          expect(screen.queryByTestId('collapse-expand-all-btn')).not.toBeInTheDocument();
          // Do not have collapsible structure
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(0);
        });
      });

      describe('set to true', () => {
        const props = { showAllSectionsButton: true };
        test('renders for manifest w/ collapsible structures', () => {
          const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
            initialManifestState: { ...manifestState(manifestWoCanvasRefs) },
            initialPlayerState: {},
            ...props,
          });
          render(
            <ErrorBoundary>
              <NavWithProviders />
            </ErrorBoundary>
          );

          expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
          expect(screen.getByText('Close 2 Sections')).toBeInTheDocument();
          // Has multiple collapsible sections
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(2);
        });

        test('does not render for manifest w/o collapsible structures', () => {
          const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
            initialManifestState: { ...manifestState(nonCollapsibleStructure) },
            initialPlayerState: {},
            ...props,
          });
          render(
            <ErrorBoundary>
              <NavWithProviders />
            </ErrorBoundary>
          );

          expect(screen.queryByTestId('collapse-expand-all-btn')).not.toBeInTheDocument();
          // Do not have collapsible structure
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(0);
          expect(screen.getAllByTestId('tree-item').length).toEqual(3);
        });

        test('does not render for playlist manifest w/ structures', () => {
          const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
            initialManifestState: { ...manifestState(playlist, 0, true) },
            initialPlayerState: {},
            ...props,
          });
          render(
            <ErrorBoundary>
              <NavWithProviders />
            </ErrorBoundary>
          );

          expect(screen.queryByTestId('collapse-expand-all-btn')).not.toBeInTheDocument();
          // Do not have collapsible sections
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(0);
          expect(screen.getAllByTestId('tree-item').length).toEqual(6);
        });

        test('does not render for a manifest w/ a single section', () => {
          const NavWithProviders = withManifestAndPlayerProvider(StructuredNavigation, {
            initialManifestState: { ...manifestState(singleCanvasManifest) },
            initialPlayerState: {},
            ...props,
          });
          render(
            <ErrorBoundary>
              <NavWithProviders />
            </ErrorBoundary>
          );

          expect(screen.queryByTestId('collapse-expand-all-btn')).not.toBeInTheDocument();
          // Do not have collapsible sections
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(0);
          expect(screen.getAllByTestId('tree-item').length).toEqual(5);
        });
      });
    });
  });

  test('highlights the first item as active on load', () => {
    const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
      initialState: {},
    });
    const NavWithManifest = withManifestProvider(NavWithPlayer, {
      initialState: {
        ...manifestState(manifestWoCanvasRefs),
        currentNavItem: {
          label: 'Track 1. I. Kraftig',
          canvasDuration: 572.034,
          isTitle: false,
          rangeId: 'https://example.com/sample/transcript-annotation/range/1-1',
          id: 'https://example.com/sample/transcript-annotation/canvas/1#t=0,374',
          isEmpty: false, isCanvas: false, items: [],
          itemIndex: 1, canvasIndex: 1,
        }
      },
    });
    render(
      <ErrorBoundary>
        <NavWithManifest />
      </ErrorBoundary>
    );

    expect(screen.queryAllByTestId('treeitem-section-span').length).toBe(2);

    expect(screen.queryAllByTestId('tree-item')).toHaveLength(14);
    const treeItems = screen.getAllByTestId('tree-item');
    expect(treeItems[0]).toHaveAttribute('data-label', 'CD1 - Mahler, Symphony No.3');
    // First item with Canvas info is highlighted
    expect(treeItems[1]).toHaveTextContent('1.Track 1. I. Kraftig (06:14)');
    expect(treeItems[1]).toHaveClass('ramp--structured-nav__tree-item active');
  });
});
