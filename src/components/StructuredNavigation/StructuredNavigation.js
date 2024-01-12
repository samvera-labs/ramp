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
  getCustomStart,
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

  let structureItemsRef = React.useRef();
  let canvasIsEmptyRef = React.useRef(canvasIsEmpty);

  const structureContainerRef = React.useRef();

  React.useEffect(() => {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
      try {
        let { structures, timespans } = getStructureRanges(manifest);
        structureItemsRef.current = structures;
        manifestDispatch({ structures, type: 'setStructures' });
        manifestDispatch({ timespans, type: 'setCanvasSegments' });
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
          canvasIsEmptyRef.current = structureItemsRef.current[currentCanvasIndex].isEmpty;
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

  if (!manifest) {
    return <p>No manifest - Please provide a valid manifest.</p>;
  }

  return (
    <div
      data-testid="structured-nav"
      className="ramp--structured-nav"
      key={Math.random()}
      ref={structureContainerRef}
      role="list"
      aria-label="Structural content"
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
  );
};

StructuredNavigation.propTypes = {};

export default StructuredNavigation;
