import React, { useEffect } from 'react';
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
} from '@Services/iiif-parser';
import './StructuredNavigation.scss';

const StructuredNavigation = () => {
  const manifestDispatch = useManifestDispatch();
  const manifestState = useManifestState();
  const playerDispatch = usePlayerDispatch();
  const { isClicked, clickedUrl, player } = usePlayerState();

  const { canvasId, manifest } = manifestState;

  useEffect(() => {
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
      console.log('Index of clicked canvas: ', currentCanvasIndex);

      // When clicked structure item is not in the current canvas
      if (manifestState.canvasIndex != currentCanvasIndex) {
        manifestDispatch({
          canvasIndex: currentCanvasIndex,
          type: 'switchCanvas',
        });
      }

      playerDispatch({
        startTime: timeFragment.start,
        endTime: timeFragment.stop,
        type: 'setTimeFragment',
      });
      playerDispatch({
        currentTime: timeFragment.start,
        type: 'setCurrentTime',
      });
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
      {manifest.structures ? (
        manifest.structures[0] && manifest.structures[0].items ? (
          manifest.structures[0].items.map((item, index) => (
            <List items={[item]} key={index} isChild={false} />
          ))
        ) : null
      ) : (
        <p className="irmp--no-structure">
          There are no structures in the manifest.
        </p>
      )}
    </div>
  );
};

StructuredNavigation.propTypes = {};

export default StructuredNavigation;
