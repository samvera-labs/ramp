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
  canvasesInManifest,
  getCustomStart,
  getStructureRanges,
} from '@Services/iiif-parser';
import { getCanvasTarget, getMediaFragment } from '@Services/utility-helpers';
import './StructuredNavigation.scss';

const StructuredNavigation = () => {
  const manifestDispatch = useManifestDispatch();
  const playerDispatch = usePlayerDispatch();

  const { clickedUrl, isClicked, isPlaying, player } = usePlayerState();
  const { canvasDuration, canvasIndex, hasMultiItems, targets, manifest, playlist, canvasIsEmpty, canvasSegments } =
    useManifestState();

  let structureItemsRef = React.useRef();

  React.useEffect(() => {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
      let { structures, timespans } = getStructureRanges(manifest);
      structureItemsRef.current = structures;
      manifestDispatch({ structures, type: 'setStructures' });
      manifestDispatch({ timespans, type: 'setCanvasSegments' });
      const customStart = getCustomStart(manifest);
      if (!customStart) {
        return;
      }
      if (customStart.type == 'SR') {
        playerDispatch({
          currentTime: customStart.time,
          type: 'setCurrentTime',
        });
      }
      manifestDispatch({
        canvasIndex: customStart.canvas,
        type: 'switchCanvas',
      });
    }
  }, [manifest]);

  // Set currentNavItem when current Canvas is an inaccessible item 
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
        manifestDispatch({ item: clickedItem[0], type: 'switchItem' });
      }
      const canvases = canvasesInManifest(manifest);
      const currentCanvasIndex = canvases
        .findIndex(
          (c) => {
            return c.canvasId === getCanvasId(clickedUrl);
          }
        );
      const timeFragment = getMediaFragment(clickedUrl, canvasDuration);

      // Invalid time fragment
      if (!timeFragment || timeFragment == undefined) {
        console.error(
          'Error retrieving time fragment object from Canvas URL in structured navigation'
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
        }
      }

      if (canvasIsEmpty) {
        // Reset isClicked in state for
        // inaccessible items (empty canvases)
        playerDispatch({ type: 'resetClick' });
      } else if (player) {
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
        player.currentTime(timeFragmentStart);
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
      role="structure"
      aria-label="Structural content"
    >
      {structureItemsRef.current?.length > 0 ? (
        structureItemsRef.current.map((item, index) => (
          <List
            items={[item]}
            sectionRef={React.createRef()}
            key={index}
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
