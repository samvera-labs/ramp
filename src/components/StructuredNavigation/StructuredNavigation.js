import React from 'react';
import List from './NavUtils/List';
import {
  usePlayerDispatch,
  usePlayerState,
} from '../../context/player-context';
import {
  useManifestState,
  useManifestDispatch,
} from '../../context/manifest-context';
import {
  getCanvasId,
  getStructureRanges,
  getCanvasIndex,
} from '@Services/iiif-parser';
import { getCanvasTarget, getMediaFragment } from '@Services/utility-helpers';
import { useErrorBoundary } from "react-error-boundary";
import './StructuredNavigation.scss';

const StructuredNavigation = () => {
  const manifestDispatch = useManifestDispatch();
  const playerDispatch = usePlayerDispatch();

  const { clickedUrl, isClicked, isPlaying, player } = usePlayerState();
  const { canvasDuration, canvasIndex, hasMultiItems, targets, manifest, playlist, canvasIsEmpty, canvasSegments } =
    useManifestState();

  const { showBoundary } = useErrorBoundary();

  let canvasStructRef = React.useRef();
  let structureItemsRef = React.useRef();
  let canvasIsEmptyRef = React.useRef(canvasIsEmpty);
  let hasRootRangeRef = React.useRef(false);

  const structureContainerRef = React.useRef();
  const scrollableStructure = React.useRef();

  React.useEffect(() => {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
      try {
        let { structures, timespans, markRoot } = getStructureRanges(manifest, playlist.isPlaylist);
        structureItemsRef.current = structures;
        canvasStructRef.current = structures;
        hasRootRangeRef.current = markRoot;
        // Remove root-level structure item from navigation calculations
        if (structures?.length > 0 && structures[0].isRoot) {
          canvasStructRef.current = structures[0].items;
        }
        manifestDispatch({ structures: canvasStructRef.current, type: 'setStructures' });
        manifestDispatch({ timespans, type: 'setCanvasSegments' });
        structureContainerRef.current.isScrolling = false;
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [manifest]);

  // Set currentNavItem when current Canvas is an inaccessible/empty item
  React.useEffect(() => {
    if (canvasIsEmpty && playlist.isPlaylist) {
      manifestDispatch({
        item: canvasSegments[canvasIndex],
        type: 'switchItem'
      });
    }
  }, [canvasIsEmpty, canvasIndex]);

  React.useEffect(() => {
    if (isClicked) {
      const clickedItem = canvasSegments.filter(c => c.id === clickedUrl);
      if (clickedItem?.length > 0) {
        // Only update the current nav item for timespans
        // Eliminate Canvas level items unless the structure is empty
        const { isCanvas, items } = clickedItem[0];
        if (!isCanvas || (items.length == 0 && isCanvas)) {
          manifestDispatch({ item: clickedItem[0], type: 'switchItem' });
        }
      }
      const currentCanvasIndex = getCanvasIndex(manifest, getCanvasId(clickedUrl));
      const timeFragment = getMediaFragment(clickedUrl, canvasDuration);

      // Invalid time fragment
      if (!timeFragment || timeFragment == undefined) {
        console.error(
          'StructuredNavigation -> invalid media fragment in structure item -> ', timeFragment
        );
        return;
      }
      let timeFragmentStart = timeFragment.start;

      if (hasMultiItems) {
        const { srcIndex, fragmentStart } = getCanvasTarget(
          targets,
          timeFragment,
          canvasDuration
        );

        timeFragmentStart = fragmentStart;
        manifestDispatch({ srcIndex, type: 'setSrcIndex' });
      } else {
        // When clicked structure item is not in the current canvas
        if (canvasIndex != currentCanvasIndex && currentCanvasIndex > -1) {
          manifestDispatch({
            canvasIndex: currentCanvasIndex,
            type: 'switchCanvas',
          });
          canvasIsEmptyRef.current = canvasStructRef.current[currentCanvasIndex].isEmpty;
        }
      }

      if (player && !canvasIsEmptyRef.current) {
        player.currentTime(timeFragmentStart);
        playerDispatch({
          startTime: timeFragment.start,
          endTime: timeFragment.end,
          type: 'setTimeFragment',
        });

        playerDispatch({
          currentTime: timeFragmentStart,
          type: 'setCurrentTime',
        });
        // Setting userActive to true shows timerail breifly, helps
        // to visualize the structure in player while playing
        if (isPlaying) player.userActive(true);
      } else if (canvasIsEmptyRef.current) {
        // Reset isClicked in state for
        // inaccessible items (empty canvases)
        playerDispatch({ type: 'resetClick' });
      }
    }
  }, [isClicked, player]);

  // Structured nav is populated by the time the player hook fires so we listen for
  // that to run the check on whether the structured nav is scrollable.
  React.useEffect(() => {
    if (structureContainerRef.current) {
      const elem = structureContainerRef.current;
      const structureBorder = structureContainerRef.current.parentElement;
      const structureEnd = Math.abs(elem.scrollHeight - (elem.scrollTop + elem.clientHeight)) <= 1;
      scrollableStructure.current = !structureEnd;
      if (structureBorder) { resizeObserver.observe(structureBorder); }
    }
  }, [player]);

  // Update scrolling indicators when end of scrolling has been reached
  const handleScrollable = (e) => {
    let elem = e.target;
    if (elem.classList.contains('ramp--structured-nav__border')) { elem = elem.firstChild; }
    const scrollMsg = elem.nextSibling;
    const structureEnd = Math.abs(elem.scrollHeight - (elem.scrollTop + elem.clientHeight)) <= 1;

    if (elem && structureEnd && elem.classList.contains('scrollable')) {
      elem.classList.remove('scrollable');
    } else if (elem && !structureEnd && !elem.classList.contains('scrollable')) {
      elem.classList.add('scrollable');
    }

    if (scrollMsg && structureEnd && scrollMsg.classList.contains('scrollable')) {
      scrollMsg.classList.remove('scrollable');
    } else if (scrollMsg && !structureEnd && !scrollMsg.classList.contains('scrollable')) {
      scrollMsg.classList.add('scrollable');
    }
  };

  // Update scrolling indicators when structured nav is resized
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      handleScrollable(entry);
    }
  });

  if (!manifest) {
    return <p>No manifest - Please provide a valid manifest.</p>;
  }

  // Check for scrolling on initial render and build appropriate element class
  let divClass = '';
  let spanClass = '';
  if (scrollableStructure.current) {
    divClass = "ramp--structured-nav scrollable";
    spanClass = "scrollable";
  } else {
    divClass = "ramp--structured-nav";
  }
  if (playlist?.isPlaylist) {
    divClass += " playlist-items";
  }
  divClass += hasRootRangeRef.current ? " ramp--structured-nav-with_root" : "";

  /**
   * Update isScrolling flag within structure container ref, which is
   * used by ListItem and SectionHeading components to decide to/not to
   * auto scroll the content
   * @param {Boolean} state 
   */
  const handleMouseOver = (state) => {
    structureContainerRef.current.isScrolling = state;
  };

  return (
    <div className="ramp--structured-nav__border">
      <div
        data-testid="structured-nav"
        className={divClass}
        ref={structureContainerRef}
        role="list"
        aria-label="Structural content"
        onScroll={handleScrollable}
        onMouseLeave={() => handleMouseOver(false)}
        onMouseOver={() => handleMouseOver(true)}
      >
        {structureItemsRef.current?.length > 0 ? (
          structureItemsRef.current.map((item, index) => (
            <List
              items={[item]}
              sectionRef={React.createRef()}
              key={index}
              structureContainerRef={structureContainerRef}
            />
          ))
        ) : (
          <p className="ramp--no-structure">
            There are no structures in the manifest
          </p>
        )}
      </div>
      <span className={spanClass}>
        Scroll to see more
      </span>
    </div>
  );
};

StructuredNavigation.propTypes = {};

export default StructuredNavigation;
