import React from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import { usePlayerDispatch } from '../context/player-context';
import PropTypes from 'prop-types';
import { getCustomStart } from '@Services/iiif-parser';
import { setAppErrorMessage, setAppEmptyManifestMessage, GENERIC_ERROR_MESSAGE } from '@Services/utility-helpers';
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

    const controller = new AbortController();

    if (manifest) {
      manifestDispatch({ manifest: manifest, type: 'updateManifest' });
    } else {
      let requestOptions = {
        // NOTE: try thin in Avalon
        //credentials: 'include',
        // headers: { 'Avalon-Api-Key': '' },
      };
      /**
       * Sanitize manifest urls of query or anchor fragments included in the
       * middle of the url: hhtp://example.com/endpoint?params/manifest
       */
      const sanitizedUrl = manifestUrl.replace(/[\?#].*(?=\/)/i, '');
      try {
        await fetch(sanitizedUrl, requestOptions, { signal: controller.signal })
          .then((result) => {
            if (result.status != 200 && result.status != 201) {
              throw new Error('Failed to fetch Manifest. Please check again.');
            } else {
              return result.json();
            }
          })
          .then((data) => {
            if (!data) {
              throw new Error(GENERIC_ERROR_MESSAGE);
            }

            setManifest(data);

            const customStart = getCustomStart(data, startCanvasId, startCanvasTime);
            manifestDispatch({ customStart, type: 'setCustomStart' });
            if (customStart.type == 'SR') {
              playerDispatch({
                currentTime: customStart.time,
                type: 'setCurrentTime',
              });
            }
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

    // Cleanup Manifest fetch request
    return () => {
      controller.abort();
    };
  }, []);

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
