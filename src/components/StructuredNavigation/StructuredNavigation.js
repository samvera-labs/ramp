import React, { createRef, useEffect, useRef } from 'react';
import cx from 'classnames';
import List from './NavUtils/List';
import SectionHeading from './NavUtils/SectionHeading';
import { usePlayerDispatch, usePlayerState } from '../../context/player-context';
import { useManifestState, useManifestDispatch } from '../../context/manifest-context';
import { getCanvasId, getStructureRanges } from '@Services/iiif-parser';
import { getCanvasTarget, getMediaFragment } from '@Services/utility-helpers';
import { useErrorBoundary } from "react-error-boundary";
import './StructuredNavigation.scss';
import CollapseExpandButton from './NavUtils/CollapseExpandButton';

/**
 * Parse structures property in the Manifest, and build UI as needed.
 * For playlists: structures is displayed as a list of items.
 * For all the other manifests: each Canvas Range is highlighted as a section in the
 * display and their child elements are displayed in collapsible UI elements
 * respectively.
 * @param {Object} props
 * @param {String} props.showAllSectionsButton
 */
const StructuredNavigation = ({ showAllSectionsButton = false, sectionsHeading = 'Sections' }) => {
  const manifestDispatch = useManifestDispatch();
  const playerDispatch = usePlayerDispatch();

  const { clickedUrl, isClicked, isPlaying, player } = usePlayerState();
  const {
    allCanvases,
    canvasDuration,
    canvasIndex,
    hasMultiItems,
    targets,
    manifest,
    playlist,
    canvasIsEmpty,
    canvasSegments,
  } = useManifestState();

  const { showBoundary } = useErrorBoundary();

  let canvasStructRef = useRef();
  let structureItemsRef = useRef();
  let canvasIsEmptyRef = useRef(canvasIsEmpty);
  let hasRootRangeRef = useRef(false);

  const structureContainerRef = useRef();
  const scrollableStructure = useRef();
  let hasCollapsibleStructRef = useRef(false);

  useEffect(() => {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
      try {
        let { structures, timespans, markRoot, hasCollapsibleStructure }
          = getStructureRanges(manifest, allCanvases, playlist.isPlaylist);
        structureItemsRef.current = structures;
        canvasStructRef.current = structures;
        hasRootRangeRef.current = markRoot;
        hasCollapsibleStructRef.current
          = hasCollapsibleStructure && showAllSectionsButton && !playlist.isPlaylist;
        // Remove root-level structure item from navigation calculations
        if (structures?.length > 0 && structures[0].isRoot) {
          canvasStructRef.current = structures[0].items;
        }
        // Sort timespans; helps with activeSegment calculation in VideoJSPlayer
        timespans.sort((a, b) => {
          // If end times are equal, sort them by descending order of start time
          if (a.times.end === b.times.end) {
            return b.times.start - a.times.start;
          }
          // Else, sort ascending order by end times
          return a.times.end - b.times.end;
        });
        manifestDispatch({ structures: canvasStructRef.current, type: 'setStructures' });
        manifestDispatch({ timespans, type: 'setCanvasSegments' });
        structureContainerRef.current.isScrolling = false;
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [manifest]);

  // Set currentNavItem when current Canvas is an inaccessible/empty item
  useEffect(() => {
    if (canvasIsEmpty && playlist.isPlaylist) {
      manifestDispatch({
        item: canvasSegments[canvasIndex],
        type: 'switchItem'
      });
    }
  }, [canvasIsEmpty, canvasIndex]);

  useEffect(() => {
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
      const currentCanvasIndex = allCanvases.findIndex(
        (c) => c.canvasURL === getCanvasId(clickedUrl)
      );
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

        // Use this value in iOS to set the initial progress
        // in the custom progress bar
        player.structStart = timeFragmentStart;
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
        playerDispatch({
          type: 'resetClick',
        });
      }
    }
  }, [isClicked, player]);

  // Structured nav is populated by the time the player hook fires so we listen for
  // that to run the check on whether the structured nav is scrollable.
  useEffect(() => {
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
    <div className={cx(
      'ramp--structured-nav',
      showAllSectionsButton && !playlist.isPlaylist ? ' display' : ''
    )}>
      {showAllSectionsButton && !playlist.isPlaylist &&
        <div className='ramp--structured-nav__sections'>
          <span
            className={cx(
              'ramp--structured-nav__sections-text',
              hasRootRangeRef.current && 'hidden' // hide 'Sections' text when a root Range exists
            )}>{sectionsHeading}</span>
          {hasCollapsibleStructRef.current && <CollapseExpandButton numberOfSections={structureItemsRef.current?.length} />}
        </div>
      }
      <div className="ramp--structured-nav__border">
        <div
          data-testid="structured-nav"
          className={cx(
            'ramp--structured-nav__content',
            scrollableStructure.current && 'scrollable',
            playlist?.isPlaylist && 'playlist-items',
            hasRootRangeRef.current && 'ramp--structured-nav__content-with_root'
          )}
          ref={structureContainerRef}
          role="list"
          aria-label="Structural content"
          onScroll={handleScrollable}
          onMouseLeave={() => handleMouseOver(false)}
          onMouseOver={() => handleMouseOver(true)}
        >
          <div aria-live="assertive" className="ramp--structured-nav__sr-only" />
          {structureItemsRef.current?.length > 0 ? (
            structureItemsRef.current.map((item, index) => (
              /* For playlist views omit the accordion style display of 
              structure for canvas-level items */
              item.isCanvas && !playlist.isPlaylist
                ? <SectionHeading
                  key={`${item.label}-${index}`}
                  itemIndex={index + 1}
                  duration={item.duration}
                  label={item.label}
                  sectionRef={createRef()}
                  itemId={item.id}
                  isRoot={item.isRoot}
                  structureContainerRef={structureContainerRef}
                  hasChildren={item.items?.length > 0}
                  items={item.items}
                  times={item.times}
                />
                : <List
                  items={[item]}
                  sectionRef={createRef()}
                  key={`${item.label}-${index}`}
                  structureContainerRef={structureContainerRef}
                />
            ))
          ) : (
            <p className="ramp--no-structure">
              There are no structures in the manifest
            </p>
          )}
        </div>
        <span className={cx(
          scrollableStructure.current && 'scrollable')}>
          Scroll to see more
        </span>
      </div>
    </div>
  );
};

StructuredNavigation.propTypes = {};

export default StructuredNavigation;
