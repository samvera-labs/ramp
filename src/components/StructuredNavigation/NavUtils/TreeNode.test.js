import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import TreeNode from './TreeNode';
import {
  withManifestProvider,
  withPlayerProvider,
} from '../../../services/testing-helpers';
import * as hooks from '@Services/ramp-hooks';

describe('TreeNode component', () => {
  const sectionRef = { current: '' };
  const setFocusedItemMock = jest.fn();
  const initialManifestState = { structures: { isCollapsed: false }, canvasIndex: 0 };
  const structureContainerRef = { current: { scrollTop: 0, querySelector: jest.fn() } };
  const updateSectionStatusMock = jest.fn();
  jest.spyOn(hooks, 'useCollapseExpandAll').mockImplementation(() => ({
    isCollapsed: false,
    updateSectionStatus: updateSectionStatusMock,
  }));

  const playlistItem =
  {
    canvasIndex: 1,
    duration: "09:32",
    id: "https://example.com/playlists/1/manifest/canvas/1#t=0.0,",
    isCanvas: true,
    isClickable: true,
    isEmpty: false,
    isRoot: false,
    isTitle: false,
    itemIndex: 1,
    items: [],
    label: "Beginning Responsibility: Lunchroom Manners",
    summary: "Mind your manners!",
    homepage: "https://example.com/playlists/1?position=1",
    rangeId: "https://example.com/playlists/1/manifest/range/1",
    canvasDuration: 0,
    sectionCount: 1,
    sectionRef: sectionRef,
    structureContainerRef,
    times: { start: 0, end: 0 },
    setFocusedItem: setFocusedItemMock,
  };
  const canvasItem =
  {
    id: undefined,
    duration: '02:00',
    rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
    isTitle: false,
    isCanvas: true,
    canvasIndex: 1,
    itemIndex: 1,
    isClickable: false,
    isEmpty: false,
    isRoot: false,
    canvasDuration: 0,
    label: 'Introduction',
    items: [
      {
        id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,45.321',
        duration: '00:45',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 1,
        isClickable: true,
        isEmpty: false,
        isRoot: false,
        label: 'Part I',
        items: [],
        canvasDuration: 572.034,
        times: { start: 0, end: 45.321 },
      },
      {
        id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=60,120.321',
        duration: '01:00',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-2',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 2,
        isClickable: true,
        isEmpty: false,
        isRoot: false,
        label: 'Part II',
        canvasDuration: 572.034,
        items: [],
        times: { start: 60, end: 12.321 },
      },
    ],
    sectionCount: 1,
    sectionRef: sectionRef,
    structureContainerRef,
    times: { start: 0, end: 0 },
    setFocusedItem: setFocusedItemMock,
  };
  const multiItem = {
    id: undefined,
    duration: '',
    rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
    isTitle: true,
    isCanvas: false,
    canvasIndex: 1,
    itemIndex: undefined,
    isClickable: false,
    isEmpty: false,
    isRoot: false,
    canvasDuration: 0,
    label: 'Washing Hands',
    items: [
      {
        id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=157,160',
        duration: '00:03',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 1,
        isClickable: true,
        isEmpty: false,
        isRoot: false,
        label: 'Using Soap',
        items: [],
        canvasDuration: 572.034,
        times: { start: 157, end: 160 },
      },
      {
        id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170',
        duration: '00:05',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-3',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 2,
        isClickable: true,
        isEmpty: false,
        isRoot: false,
        label: 'Rinsing Well',
        items: [],
        canvasDuration: 572.034,
        times: { start: 165, end: 170 },
      },
      {
        id: undefined,
        duration: '',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2',
        isTitle: true,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: undefined,
        isClickable: false,
        isEmpty: false,
        isRoot: false,
        canvasDuration: 0,
        label: 'After Washing Hands',
        items: [
          {
            id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=170,180',
            duration: '00:10',
            rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-1',
            isTitle: false,
            isCanvas: false,
            canvasIndex: 1,
            itemIndex: 3,
            isClickable: true,
            isEmpty: false,
            isRoot: false,
            label: 'Drying Hands',
            items: [],
            canvasDuration: 572.034,
            times: { start: 170, end: 180 },
          },
          {
            id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=180,190',
            duration: '00:10',
            rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2-2',
            isTitle: false,
            isCanvas: false,
            canvasIndex: 1,
            itemIndex: 4,
            isClickable: true,
            isEmpty: false,
            isRoot: false,
            label: 'Getting Ready',
            items: [],
            canvasDuration: 572.034,
            times: { start: 180, end: 190 },
          }
        ],
        times: { start: 0, end: 0 },
        setFocusedItem: setFocusedItemMock,
      }
    ],
    sectionCount: 1,
    sectionRef: sectionRef,
    structureContainerRef,
    times: { start: 0, end: 0 },
    setFocusedItem: setFocusedItemMock,
  };
  const canvasItemWithMediaFragment = {
    id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,572.32',
    duration: '09:32',
    rangeId: 'https://example.com/manifest/lunchroom_manners/range/1',
    isTitle: false,
    isCanvas: true,
    canvasIndex: 1,
    itemIndex: undefined,
    isClickable: false,
    isEmpty: false,
    isRoot: false,
    canvasDuration: 572.32,
    label: 'Lunchroom Manners',
    items: [
      {
        id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,45.321',
        duration: '00:45',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 1,
        isClickable: true,
        isEmpty: false,
        isRoot: false,
        label: 'Part I',
        items: [],
        canvasDuration: 572.034,
        times: { start: 0, end: 45.321 },
      },
      {
        id: 'https://example.com/manifest/lunchroome_manners/canvas/1#t=60,120.321',
        duration: '01:00',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-2',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 2,
        isClickable: true,
        isEmpty: false,
        isRoot: false,
        label: 'Part II',
        canvasDuration: 572.034,
        items: [],
        times: { start: 60, end: 120.321 },
      },
    ],
    sectionCount: 1,
    sectionRef: sectionRef,
    structureContainerRef,
    times: { start: 0, end: 0 },
    setFocusedItem: setFocusedItemMock,
  };

  describe('with single item', () => {
    beforeEach(() => {
      const props = {
        id: 'https://example.com/sample/transcript-annotation/canvas/1#t=0,374',
        duration: '00:01:14',
        rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1',
        isTitle: false,
        isCanvas: false,
        canvasIndex: 1,
        itemIndex: 1,
        isClickable: true,
        isEmpty: false,
        isRoot: false,
        label: 'Track 1. I Krafting',
        items: [],
        canvasDuration: 572.034,
        sectionCount: 1,
        sectionRef: sectionRef,
        structureContainerRef,
        times: { start: 0, end: 374 },
        setFocusedItem: setFocusedItemMock,
      };
      const TreeNodeWithPlayer = withPlayerProvider(TreeNode, {
        ...props,
        initialState: {},
      });
      const TreeNodeWithManifest = withManifestProvider(TreeNodeWithPlayer, {
        initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
      });
      render(<TreeNodeWithManifest />);
    });

    test('renders successfully', () => {
      expect(screen.getByTestId('tree-item'));
      expect(screen.getByText('Track 1. I Krafting (00:01:14)'));
    });
  });

  describe('with multiple items', () => {
    beforeEach(() => {
      const props = {
        ...multiItem
      };
      const TreeNodeWithPlayer = withPlayerProvider(TreeNode, {
        ...props,
        initialState: {},
      });
      const TreeNodeWithManifest = withManifestProvider(TreeNodeWithPlayer, {
        initialState: {
          ...initialManifestState,
          playlist: { isPlaylist: false },
          currentNavItem: {
            label: 'Using soap',
            canvasDuration: 572.034,
            isTitle: false,
            rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
            id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=157,160',
            isEmpty: false, isCanvas: false, items: [],
            itemIndex: 1, canvasIndex: 1,
          }
        },
      });
      render(<TreeNodeWithManifest />);
    });
    afterEach(() => {
      cleanup();
    });

    test('renders a children group if there are child ranges in manifest', () => {
      expect(screen.queryAllByTestId('tree-group')).toHaveLength(2);
      expect(screen.queryAllByTestId('tree-item').length).toEqual(6);
    });

    test('creates an anchor element and title for an item', () => {
      const anchorElement = screen.getByText('Rinsing Well (00:05)');
      expect(anchorElement.tagName).toEqual('SPAN');
      expect(anchorElement.parentElement.tagName).toEqual('A');
      expect(anchorElement.parentElement).toHaveAttribute(
        'href',
        'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170'
      );
    });

    test('shows active item in structure navigation', () => {
      // The first item (item with index zero) is the title
      const listItem = screen.getAllByTestId('tree-item')[1];
      expect(listItem).toHaveClass('ramp--structured-nav__tree-item');
      expect(listItem).toHaveClass('active');
      expect(listItem.children[0]).toHaveClass('tracker');
      expect(listItem.children[1]).toHaveTextContent('1.Using Soap (00:03)');
      expect(listItem.isClicked).toBeFalsy();
    });
  });

  describe('with canvas level structure items', () => {
    describe('for regular manifests', () => {
      describe('without media-fragment info for a section', () => {
        beforeEach(() => {
          const props = {
            ...canvasItem
          };
          const TreeNodeWithPlayer = withPlayerProvider(TreeNode, {
            ...props,
            initialState: {},
          });
          const TreeNodeWithManifest = withManifestProvider(TreeNodeWithPlayer, {
            initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
          });
          render(<TreeNodeWithManifest />);
        });
        test('renders the section as a collapsible span', () => {
          expect(screen.queryAllByTestId('tree-group')).toHaveLength(1);
          expect(screen.queryAllByTestId('tree-item').length).toEqual(3);
          expect(screen.queryAllByTestId('tree-item')[0]).toHaveAttribute('data-label', 'Introduction');

          const treeItems = screen.getAllByTestId('tree-item');
          expect(treeItems[0].children).toHaveLength(2);
          expect(treeItems[0].children[0])
            .toHaveClass('ramp--structured-nav__section ramp--structured-nav__section-head-buttons');
          expect(treeItems[0].children[0].children).toHaveLength(2);
          expect(treeItems[0].children[0].children[0])
            .toHaveClass('ramp--structured-nav__section-title not-clickable');
          expect(treeItems[0].children[0].children[1]).toHaveClass('collapse-expand-button');
        });

        test('collapse button shows/hides nested child structure', () => {
          expect(screen.queryAllByTestId('tree-item').length).toEqual(3);
          const treeItems = screen.getAllByTestId('tree-item');

          const collapseIcon = treeItems[0].children[0].children[1];

          // Expanded by default and shows the nested child structure
          expect(collapseIcon.children[0]).toHaveClass('arrow up');
          expect(treeItems[0].children).toHaveLength(2);
          expect(treeItems[0].children[1].tagName).toEqual('UL');

          fireEvent.click(collapseIcon);

          // Collapses on click and hides the nested child structure
          expect(collapseIcon.children[0]).toHaveClass('arrow down');
          expect(treeItems[0].children).toHaveLength(1);
        });
      });
      describe('with media-fragment info for a section', () => {
        beforeEach(() => {
          const props = {
            ...canvasItemWithMediaFragment
          };
          const TreeNodeWithPlayer = withPlayerProvider(TreeNode, {
            ...props,
            initialState: {},
          });
          const TreeNodeWithManifest = withManifestProvider(TreeNodeWithPlayer, {
            initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
          });
          render(<TreeNodeWithManifest />);
        });
        test('renders the section as a collapsible button', () => {
          expect(screen.queryAllByTestId('tree-group')).toHaveLength(1);
          expect(screen.queryAllByTestId('tree-item').length).toEqual(3);
          expect(screen.queryAllByTestId('tree-item')[0]).toHaveAttribute('data-label', 'Lunchroom Manners');

          const treeItems = screen.getAllByTestId('tree-item');
          expect(treeItems[0].children).toHaveLength(2);
          expect(treeItems[0].children[0])
            .toHaveClass('ramp--structured-nav__section ramp--structured-nav__section-head-buttons');
          expect(treeItems[0].children[0].children).toHaveLength(2);
          expect(treeItems[0].children[0].children[0])
            .toHaveClass('ramp--structured-nav__section-title');
          expect(treeItems[0].children[0].children[1]).toHaveClass('collapse-expand-button');
        });

        test('collapse button shows/hides nested child structure on Click event', () => {
          expect(screen.queryAllByTestId('tree-item').length).toEqual(3);
          const treeItems = screen.getAllByTestId('tree-item');

          const collapseIcon = treeItems[0].children[0].children[1];

          // Expanded by default and shows the nested child structure
          expect(collapseIcon.children[0]).toHaveClass('arrow up');
          expect(treeItems[0].children).toHaveLength(2);
          expect(treeItems[0].children[1].tagName).toEqual('UL');

          fireEvent.click(collapseIcon);

          // Collapses on click and hides the nested child structure
          expect(collapseIcon.children[0]).toHaveClass('arrow down');
          expect(treeItems[0].children).toHaveLength(1);
        });
      });
    });

    test('renders the section as link for playlist manifests', () => {
      const props = {
        ...playlistItem
      };
      const TreeNodeWithPlayer = withPlayerProvider(TreeNode, {
        ...props,
        initialState: {},
      });
      const TreeNodeWithManifest = withManifestProvider(TreeNodeWithPlayer, {
        initialState: { ...initialManifestState, playlist: { isPlaylist: true } },
      });
      render(<TreeNodeWithManifest />);
      expect(screen.queryAllByTestId('tree-item').length).toEqual(1);
      expect(screen.queryAllByTestId('tree-item')[0]).toHaveTextContent('Beginning Responsibility: Lunchroom Manners (09:32)');
      expect(screen.queryAllByTestId('tree-item')[0].getAttribute('data-label')).toEqual('Beginning Responsibility: Lunchroom Manners');
      expect(screen.queryAllByTestId('tree-item')[0].getAttribute('data-summary')).toEqual('Mind your manners!');
    });
  });

  describe('sets the anchor element link', () => {
    test('with homepage property in Canvas when specified', () => {
      const props = {
        ...playlistItem
      };
      const TreeNodeWithPlayer = withPlayerProvider(TreeNode, {
        ...props,
        initialState: {},
      });
      const TreeNodeWithManifest = withManifestProvider(TreeNodeWithPlayer, {
        initialState: { ...initialManifestState, playlist: { isPlaylist: true } },
      });
      render(<TreeNodeWithManifest />);

      expect(screen.queryAllByTestId('tree-item').length).toEqual(1);
      expect(screen.queryByText('Beginning Responsibility: Lunchroom Manners (09:32)')).toBeInTheDocument();
      const structItem = screen.getByText('Beginning Responsibility: Lunchroom Manners (09:32)');
      expect(structItem.parentElement.getAttribute('href'))
        .toEqual('https://example.com/playlists/1?position=1');
    });

    test('with Canvas media fragment when homepage is not specified', () => {
      const props = {
        ...canvasItem
      };
      const TreeNodeWithPlayer = withPlayerProvider(TreeNode, {
        ...props,
        initialState: {},
      });
      const TreeNodeWithManifest = withManifestProvider(TreeNodeWithPlayer, {
        initialState: { ...initialManifestState, playlist: { isPlaylist: false } },
      });
      render(<TreeNodeWithManifest />);
      expect(screen.queryAllByTestId('tree-group')).toHaveLength(1);
      expect(screen.queryAllByTestId('tree-item').length).toEqual(3);
      expect(screen.queryByText('Part I (00:45)')).toBeInTheDocument();
      const structItem = screen.getByText('Part I (00:45)');
      expect(structItem.parentElement.getAttribute('href'))
        .toEqual('https://example.com/manifest/lunchroome_manners/canvas/1#t=0.0,45.321');
    });
  });
});
