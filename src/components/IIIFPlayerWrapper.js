import React from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import { usePlayerDispatch } from '../context/player-context';
import PropTypes from 'prop-types';
import { getCustomStart, parseAutoAdvance } from '@Services/iiif-parser';
import { getAnnotationService, getIsPlaylist } from '@Services/playlist-parser';
import { setAppErrorMessage, setAppEmptyManifestMessage } from '@Services/utility-helpers';
import { useErrorBoundary } from "react-error-boundary";

export default function IIIFPlayerWrapper({
  manifestUrl,
  customErrorMessage,
  emptyManifestMessage,
  startCanvasId,
  startCanvasTime,
  children,
  manifest: manifestValue,
}) {
  const [manifest, setManifest] = React.useState(manifestValue);
  const manifestDispatch = useManifestDispatch();
  const playerDispatch = usePlayerDispatch();

  const { showBoundary } = useErrorBoundary();

  React.useEffect(async () => {
    setAppErrorMessage(customErrorMessage);
    setAppEmptyManifestMessage(emptyManifestMessage);

    if (manifest) {
      manifestDispatch({ manifest: manifest, type: 'updateManifest' });
    } else {
      let requestOptions = {
        // NOTE: try thin in Avalon
        //credentials: 'include',
        // headers: { 'Avalon-Api-Key': '' },
      };
      try {
        await fetch(manifestUrl, requestOptions)
          .then((result) => {
            if (result.status != 200 && result.status != 201) {
              throw new Error('Failed to fetch Manifest. Please check again.');
            } else {
              return result.json();
            }
          })
          .then((data) => {
            setManifest(data);
            manifestDispatch({ manifest: data, type: 'updateManifest' });
          })
          .catch((error) => {
            console.log('Error fetching manifest, ', error);
            throw new Error('Failed to fetch Manifest. Please check again.');
          });
      } catch (error) {
        showBoundary(error);
      }
    }
  }, []);

  React.useEffect(() => {
    if (manifest) {
      manifestDispatch({ autoAdvance: parseAutoAdvance(manifest), type: "setAutoAdvance" });

      const isPlaylist = getIsPlaylist(manifest);
      manifestDispatch({ isPlaylist: isPlaylist, type: 'setIsPlaylist' });

      const annotationService = getAnnotationService(manifest);
      manifestDispatch({ annotationService: annotationService, type: 'setAnnotationService' });

      const customStart = getCustomStart(manifest, startCanvasId, startCanvasTime);
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

  if (!manifest) {
    return <p>...Loading</p>;
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
}

IIIFPlayerWrapper.propTypes = {
  manifest: PropTypes.object,
  customErrorMessage: PropTypes.string,
  emptyManifestMessage: PropTypes.string,
  manifestUrl: PropTypes.string,
  startCanvasId: PropTypes.string,
  startCanvasTime: PropTypes.number,
  children: PropTypes.node,
};
