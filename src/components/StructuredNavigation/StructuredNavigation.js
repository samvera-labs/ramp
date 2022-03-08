import React from 'react';
import List from '@Components/List';
import {
  usePlayerDispatch,
  usePlayerState,
} from '../../context/player-context';
import {
  useManifestState,
  useManifestDispatch,
} from '../../context/manifest-context';
import {
  getMediaFragment,
  getCanvasId,
  canvasesInManifest,
  getCustomStart,
  getCanvasTarget,
} from '@Services/iiif-parser';
import './StructuredNavigation.scss';

const StructuredNavigation = () => {
  const manifestDispatch = useManifestDispatch();
  const playerDispatch = usePlayerDispatch();

  const { isClicked, clickedUrl, player } = usePlayerState();
  const { canvasDuration, canvasIndex, hasMultiItems, targets, manifest } =
    useManifestState();

  React.useEffect(() => {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
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

  React.useEffect(() => {
    if (isClicked) {
      const canvases = canvasesInManifest(manifest);
      const canvasInManifest = canvases.find(
        (c) => getCanvasId(clickedUrl) === c.canvasId.split('/').reverse()[0]
      );

      const currentCanvasIndex = canvases.indexOf(canvasInManifest);
      const timeFragment = getMediaFragment(clickedUrl);

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
        if (canvasIndex != currentCanvasIndex) {
          manifestDispatch({
            canvasIndex: currentCanvasIndex,
            type: 'switchCanvas',
          });
        }
      }

      playerDispatch({
        startTime: timeFragment.start,
        endTime: timeFragment.end,
        type: 'setTimeFragment',
      });

      playerDispatch({
        currentTime: timeFragmentStart,
        type: 'setCurrentTime',
      });
      player.currentTime(timeFragmentStart);
    }
  }, [isClicked]);

  if (!manifest) {
    return <p>No manifest - Please provide a valid manifest.</p>;
  }

  return (
    <div
      data-testid="structured-nav"
      className="irmp--structured-nav"
      key={Math.random()}
    >
      {manifest.structures || manifest.structures?.length > 0 ? (
        manifest.structures[0] && manifest.structures[0].items?.length > 0 ? (
          manifest.structures[0].items.map((item, index) => (
            <List items={[item]} key={index} isChild={false} />
          ))
        ) : (
          <p className="irmp--no-structure">Empty structure in manifest</p>
        )
      ) : (
        <p className="irmp--no-structure">
          There are no structures in the manifest
        </p>
      )}
    </div>
  );
};

StructuredNavigation.propTypes = {};

export default StructuredNavigation;
