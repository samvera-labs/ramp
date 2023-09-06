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
  getSegmentMap,
} from '@Services/iiif-parser';
import { getCanvasTarget, getMediaFragment } from '@Services/utility-helpers';
import './StructuredNavigation.scss';

const StructuredNavigation = () => {
  const manifestDispatch = useManifestDispatch();
  const playerDispatch = usePlayerDispatch();

  const { clickedUrl, isClicked, isPlaying, player } = usePlayerState();
  const {
    canvasDuration,
    canvasIndex,
    navItems,
    hasMultiItems,
    targets,
    manifest,
    playlist,
    canvasIsEmpty } =
    useManifestState();

  React.useEffect(() => {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
      const navItems = getSegmentMap({ manifest });
      manifestDispatch({
        navItems,
        type: 'setNavItems',
      });
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
      console.log('switchItem: ', navItems[canvasIndex].id);
      manifestDispatch({ item: navItems[canvasIndex], type: 'switchItem' });
    }
  }, [canvasIsEmpty, canvasIndex]);

  React.useEffect(() => {
    if (isClicked) {
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

  /**
   * Returns canvasId and a flag to indicate canvas has no media, used
   * to populate the structured navigation items
   * @param {Number} index canvas index
   * @returns {Object} - { canvasId: String, isEmpty: Boolean }
   */
  const canvasInfo = (index) => {
    if (manifest) {
      const canvases = canvasesInManifest(manifest);
      const info = canvases[index];
      return info;
    }
  };

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
      {manifest.structures || manifest.structures?.length > 0 ? (
        manifest.structures[0] && manifest.structures[0].items?.length > 0 ? (
          manifest.structures[0].items.map((item, index) => (
            <List
              items={[item]}
              isCanvasNode={true}
              key={index}
              isChild={false}
              canvasInfo={canvasInfo(index)}
            />
          ))
        ) : (
          <p className="ramp--no-structure">Empty structure in manifest</p>
        )
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
