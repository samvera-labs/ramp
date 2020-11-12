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
import PropTypes from 'prop-types';

const StructuredNavigation = () => {
  const manifestDispatch = useManifestDispatch();
  const manifestState = useManifestState();
  const playerDispatch = usePlayerDispatch();
  const { isClicked, clickedUrl, player } = usePlayerState();

  const { canvasId, manifest } = manifestState;

  useEffect(() => {
    console.log('StructuredNavigation useEffect');
    console.log('isClicked', isClicked);
    if (isClicked) {
      const canvases = canvasesInManifest(manifest);
      const canvasInManifest = canvases.find(
        (c) => getCanvasId(clickedUrl) === c.canvasId.split('/').reverse()[0]
      );

      const currentCanvasIndex = canvases.indexOf(canvasInManifest);
      const timeFragment = getMediaFragment(clickedUrl);

      // Invalid time fragment
      if (!timeFragment) {
        console.error(
          'Error retrieving time fragment object from Canvas URL in structured navigation'
        );
      }

      // When clicked structure item is not in the current canvas
      if (manifestState.canvasIndex != currentCanvasIndex) {
        manifestDispatch({
          canvasIndex: currentCanvasIndex,
          type: 'switchCanvas',
        });
        playerDispatch({ startTime: timeFragment.start, type: 'setStartTime' });
      } else {
        // Set the playhead at the start of the time fragment
        if (player) {
          player.setCurrentTime(
            timeFragment.start,
            playerDispatch({ type: 'resetClick' })
          );
        }
      }
    }
  });

  if (!manifest) {
    return <p>No manifest - put a better UI message here</p>;
  }

  if (manifest.structures) {
    return (
      <div
        data-testid="structured-nav"
        className="structured-nav"
        key={Math.random()}
      >
        {manifest.structures[0] && manifest.structures[0].items
          ? manifest.structures[0].items.map((item, index) => (
              <List items={[item]} key={index} isChild={false} />
            ))
          : null}
      </div>
    );
  }
  return <p>There are no structures in the manifest.</p>;
};

StructuredNavigation.propTypes = {};

export default StructuredNavigation;
