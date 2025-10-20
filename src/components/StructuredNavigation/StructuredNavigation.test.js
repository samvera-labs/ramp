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
        expect(screen.getAllByTestId('treeitem-section')).toHaveLength(3);
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

  describe('collapse/expand all sections button', () => {
    describe('with prop showAllSectionsButton=true', () => {
      const props = { showAllSectionsButton: true };
      describe('with a manifest w/ collapsible structures', () => {
        beforeEach(() => {
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
        });

        test('renders successfully', () => {
          expect(screen.queryByTestId('sections-heading-text')).toBeInTheDocument();
          expect(screen.getByTestId('sections-heading-text')).toHaveTextContent('2 Sections');
          expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
          expect(screen.getByText('Close Sections')).toBeInTheDocument();
          // Has multiple collapsible sections
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(2);
        });

        test('with sections expanded on inital render', () => {
          expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
          expect(screen.getByText('Close Sections')).toBeInTheDocument();
          expect(screen.queryByTestId('collapse-expand-all-btn').children[0]).toHaveClass('arrow up');

          // Has multiple collapsible sections
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(2);
          expect(screen.queryAllByTestId('section-collapse-icon')[1].children[0]).toHaveClass('arrow up');
        });

        test('collapses all sections on click', () => {
          expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
          const collapseExpandAll = screen.getByTestId('collapse-expand-all-btn');
          expect(screen.getByText('Close Sections')).toBeInTheDocument();
          expect(collapseExpandAll.children[0]).toHaveClass('arrow up');

          // Has multiple collapsible sections expanded by default
          expect(screen.queryAllByTestId('section-collapse-icon').length).toEqual(2);
          const collapseSectionBtns = screen.queryAllByTestId('section-collapse-icon');
          expect(collapseSectionBtns[0].children[0]).toHaveClass('arrow up');
          expect(collapseSectionBtns[1].children[0]).toHaveClass('arrow up');

          fireEvent.click(collapseExpandAll);

          expect(screen.getByText('Expand Sections')).toBeInTheDocument();
          expect(collapseExpandAll.children[0]).toHaveClass('arrow down');
          expect(collapseSectionBtns[0].children[0]).toHaveClass('arrow down');
          expect(collapseSectionBtns[1].children[0]).toHaveClass('arrow down');
        });

        test('collapses all section on ArrowLeft keydown event', () => {
          const collapseExpandAll = screen.getByTestId('collapse-expand-all-btn');
          expect(collapseExpandAll).toHaveTextContent('Close Sections');
          // Press 'ArrowLeft' key
          fireEvent.keyDown(collapseExpandAll, { key: 'ArrowLeft', keyCode: 37 });
          // Toggles the button text
          expect(collapseExpandAll).toHaveTextContent('Expand Sections');
        });

        test('does nothing on ArrowRight keydown event when sections are expanded', () => {
          const collapseExpandAll = screen.getByTestId('collapse-expand-all-btn');
          expect(collapseExpandAll).toHaveTextContent('Close Sections');
          // Press 'ArrowRight' key
          fireEvent.keyDown(collapseExpandAll, { key: 'ArrowRight', keyCode: 39 });
          // Does not toggle the button text
          expect(collapseExpandAll).toHaveTextContent('Close Sections');
        });

        test('expands all section on ArrowRight keydown event', () => {
          const collapseExpandAll = screen.getByTestId('collapse-expand-all-btn');
          expect(collapseExpandAll).toHaveTextContent('Close Sections');
          // Press 'ArrowLeft' key
          fireEvent.keyDown(collapseExpandAll, { key: 'ArrowLeft', keyCode: 37 });
          // Toggles the button text
          expect(collapseExpandAll).toHaveTextContent('Expand Sections');
          // Press 'ArrowRight' key
          fireEvent.keyDown(collapseExpandAll, { key: 'ArrowRight', keyCode: 39 });
          // Toggles the button text
          expect(collapseExpandAll).toHaveTextContent('Close Sections');
        });
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

        expect(screen.queryByTestId('sections-heading-text')).toBeInTheDocument();
        expect(screen.getByTestId('sections-heading-text')).toHaveTextContent('Sections');
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

    describe('with prop showAllSectionsButton=false (default)', () => {
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

  describe('allows keyboard nav according to tree view a11y design pattern', () => {
    const handleClickMock = jest.fn();
    let structuredNav, treeItems;
    const props = { showAllSectionsButton: true };
    beforeEach(() => {
      jest.spyOn(hooks, 'useActiveStructure').mockImplementation(() => ({
        handleClick: handleClickMock
      }));
      const NavWithPlayer = withPlayerProvider(StructuredNavigation, {
        ...props,
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
      treeItems = screen.getAllByTestId('tree-item');
    });

    test('renders successfully', () => {
      expect(screen.queryAllByTestId('tree-item').length).toEqual(21);
      expect(treeItems[0].children[1].children.length).toBe(2);

      expect(treeItems[0].children[1].children[0]).toHaveTextContent('Lunchroom Manners');
      expect(treeItems[0].children[1].children[1]).toHaveTextContent('Lunchroom Manners 2');

      const firstSection = treeItems[0].children[1].children[0];
      expect(firstSection.children).toHaveLength(2);

      const secondSection = treeItems[0].children[1].children[1];
      expect(secondSection.children).toHaveLength(1);
    });

    describe('when focused on an expanded section item', () => {
      beforeEach(() => {
        // Set focus to structure nav container
        structuredNav = screen.getByTestId('structured-nav');
        structuredNav.focus();
        // Move focus to the first section in structure by pressing ArrowDown twice
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        treeItems = screen.getAllByTestId('tree-item');
      });

      test('first section with collapsible structure has focus', () => {
        const sectionButton = treeItems[1].children[0].children[0];
        const collapseIcon = treeItems[1].children[0].children[1];

        // First collapsible section has focus
        expect(sectionButton).toHaveTextContent('Lunchroom Manners');
        expect(sectionButton).toHaveFocus();

        // Nested child structure is expanded
        expect(collapseIcon.children[0]).toHaveClass('arrow up');
        expect(treeItems[1].children).toHaveLength(2);
        expect(treeItems[1].children[1].tagName).toEqual('UL');
      });

      test('ArrowLeft keydown event collapses the nested structure', () => {
        const sectionButton = treeItems[1].children[0].children[0];
        const collapseIcon = treeItems[1].children[0].children[1];

        fireEvent.keyDown(sectionButton, { key: 'ArrowLeft', keyCode: 37 });

        // Collapses on click and hides the nested child structure
        expect(collapseIcon.children[0]).toHaveClass('arrow down');
        expect(treeItems[1].children).toHaveLength(1);
      });

      test('ArrowRight keydown event moves focus to first child', () => {
        const sectionButton = treeItems[1].children[0].children[0];

        fireEvent.keyDown(sectionButton, { key: 'ArrowRight', keyCode: 39 });

        // Focus is moved from section button to its first child
        expect(sectionButton).not.toHaveFocus();
        expect(treeItems[1].querySelectorAll('a')[0]).toHaveFocus();
        expect(treeItems[1].children[1]).toHaveTextContent('Using Soap');
      });

      test('Enter keydown event loads media into the player', () => {
        const sectionButton = treeItems[1].children[0].children[0];
        // Press 'Enter' key
        fireEvent.keyDown(sectionButton, { key: 'Enter', keyCode: 13 });
        // Calls handleClick in useActiveStructure custom hook
        expect(handleClickMock).toHaveBeenCalled();
      });
    });

    describe('when focused on a timespan item', () => {
      const mockStopPropagation = jest.spyOn(Event.prototype, 'stopPropagation');
      beforeEach(() => {
        // Set focus to structure nav container
        structuredNav = screen.getByTestId('structured-nav');
        structuredNav.focus();
        // Move focus to the first section in structure by pressing ArrowDown thrice
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        treeItems = screen.getAllByTestId('tree-item');
      });

      test('first child in first section has focus', () => {
        // First child is the 4th in the list because of 'Washing Hands' div
        const firstChildTracker = treeItems[3].children[0];
        const firstChildLink = treeItems[3].children[1];
        expect(firstChildTracker).toHaveClass('tracker');
        expect(firstChildLink).toHaveTextContent('Using Soap');
        expect(firstChildLink).toHaveFocus();
      });

      test('ArrowRight keydown event does nothing', () => {
        const firstChild = treeItems[3].children[1];
        // Press 'ArrowRight' key
        fireEvent.keyDown(firstChild, { key: 'ArrowRight', keyCode: 39 });
        expect(mockStopPropagation).toHaveBeenCalledTimes(1);
      });

      test('ArrowLeft keydown moves focus to section item', () => {
        const firstChild = treeItems[3].children[1];

        // Press 'ArrowDown' key moves focus to the next timespan: Rinsing Well
        fireEvent.keyDown(firstChild, { key: 'ArrowDown', keyCode: 40 });
        expect(treeItems[4].children[1]).toHaveFocus();
        expect(treeItems[4].children[1]).toHaveTextContent('Rinsing Well');

        // Press 'ArrowLeft' key moves focus to the parent section: Lunchroom Manners
        fireEvent.keyDown(treeItems[4].children[1], { key: 'ArrowLeft', keyCode: 37 });

        expect(treeItems[4].children[1]).not.toHaveFocus();
        expect(treeItems[1].children[0].children[0]).toHaveFocus();
        expect(treeItems[1].children[0].children[0]).toHaveTextContent('Lunchroom Manners');
      });

      test('ArrowDown keydown event moves focus to next timespan', () => {
        const firstChild = treeItems[3].children[1];
        expect(firstChild).toHaveFocus();
        // Press 'ArrowDown' key moves focus to the next timespan: Rinsing Well
        fireEvent.keyDown(firstChild, { key: 'ArrowDown', keyCode: 40 });

        // Focus is moved from the first child to next
        expect(firstChild).not.toHaveFocus();
        expect(treeItems[4].children[1]).toHaveFocus();
        expect(treeItems[4].children[1]).toHaveTextContent('Rinsing Well');
      });

      test('Space keydown event activates the timespan', () => {
        const firstChild = treeItems[3].children[1];
        expect(firstChild).toHaveFocus();
        // Press 'ArrowDown' key
        fireEvent.keyDown(firstChild, { key: 'ArrowDown', keyCode: 40 });

        // Focus is moved from the first child to next
        expect(firstChild).not.toHaveFocus();
        expect(treeItems[4].children[1]).toHaveFocus();
        expect(treeItems[4].children[1]).toHaveTextContent('Rinsing Well');

        fireEvent.keyDown(treeItems[4].children[1], { key: '', code: 'Space', keyCode: 32 });

        expect(handleClickMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when focused on a non-collapsible section item', () => {
      beforeEach(() => {
        // Collapse all sections
        const collapseExpandAll = screen.getByTestId('collapse-expand-all-btn');
        fireEvent.click(collapseExpandAll);

        // Set focus to structure nav container
        structuredNav = screen.getByTestId('structured-nav');
        structuredNav.focus();

        // Move focus to the first section in structure by pressing ArrowDown thrice
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        treeItems = screen.getAllByTestId('tree-item');
      });

      test('second section without collapsible structure has focus', () => {
        const sectionButton = treeItems[2].children[0].children[0];
        expect(sectionButton).toHaveTextContent('Lunchroom Manners 2');
        expect(sectionButton).toHaveFocus();

        // Does not have nested children
        expect(treeItems[2].children[0].children).toHaveLength(1);
      });

      test('ArrowRight keydown event does not do anything', () => {
        const sectionButton = treeItems[2].children[0].children[0];
        // Press 'ArrowRight' key
        fireEvent.keyDown(sectionButton, { key: 'ArrowRight', keyCode: 39 });
        // Calls handleClick in useActiveStructure custom hook
        expect(handleClickMock).not.toHaveBeenCalled();
      });

      test('Enter keydown event loads media into the player', () => {
        const sectionButton = treeItems[2].children[0].children[0];
        // Press 'Enter' key
        fireEvent.keyDown(sectionButton, { key: 'Enter', keyCode: 13 });
        // Calls handleClick in useActiveStructure custom hook
        expect(handleClickMock).toHaveBeenCalled();
      });
    });

    describe('when focused on a collapsed section item', () => {
      let sectionButton, collapseIcon;
      beforeEach(() => {
        // Set focus to structure nav container
        structuredNav = screen.getByTestId('structured-nav');
        structuredNav.focus();
        // Move focus to the first section in structure by pressing ArrowDown twice
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(structuredNav, { key: 'ArrowDown', keyCode: 40 });

        treeItems = screen.getAllByTestId('tree-item');
        sectionButton = treeItems[1].children[0].children[0];
        collapseIcon = treeItems[1].children[0].children[1];
        // Collapse the section
        fireEvent.keyDown(sectionButton, { key: 'ArrowLeft', keyCode: 37 });
      });

      test('renders successfully', () => {
        // First collapsible section has focus
        expect(sectionButton).toHaveTextContent('Lunchroom Manners');
        expect(sectionButton).toHaveFocus();

        // Nested child structure is collapsed
        expect(collapseIcon.children[0]).toHaveClass('arrow down');
        expect(treeItems[1].children).toHaveLength(1);
      });

      test('first ArrowRight keydown event expands the section without activation', () => {
        fireEvent.keyDown(sectionButton, { key: 'ArrowRight', keyCode: 39 });

        // Keeps the focus on section button and expands the section
        expect(sectionButton).toHaveFocus();
        expect(treeItems[1].children).toHaveLength(2);
        expect(collapseIcon.children[0]).toHaveClass('arrow up');
        expect(handleClickMock).not.toHaveBeenCalled();
      });
    });
  });
});
