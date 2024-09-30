import React, { useEffect, useState } from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import { usePlayerDispatch } from '../context/player-context';
import PropTypes from 'prop-types';
import { getCustomStart, getRenderingFiles } from '@Services/iiif-parser';
import {
  setAppErrorMessage,
  setAppEmptyManifestMessage,
  GENERIC_ERROR_MESSAGE
} from '@Services/utility-helpers';
import { useErrorBoundary } from "react-error-boundary";
import Spinner from './Spinner';

export default function IIIFPlayerWrapper({
  manifestUrl,
  customErrorMessage,
  emptyManifestMessage,
  startCanvasId,
  startCanvasTime,
  children,
  manifest: manifestValue,
}) {
  const [manifest, setManifest] = useState(manifestValue);
  const manifestDispatch = useManifestDispatch();
  const playerDispatch = usePlayerDispatch();

  const { showBoundary } = useErrorBoundary();

  // AbortController for Manifest fetch request
  let controller;

  const fetchManifest = async (url) => {
    controller = new AbortController();
    let requestOptions = {
      // NOTE: try this in Avalon
      //credentials: 'include',
      // headers: { 'Avalon-Api-Key': '' },
    };
    /**
     * Sanitize manifest urls of query or anchor fragments included in the
     * middle of the url: hhtp://example.com/endpoint?params/manifest
     */
    const sanitizedUrl = url.replace(/[\?#].*(?=\/)/i, '');
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
        })
        .catch((error) => {
          console.log('Error fetching manifest, ', error);
          throw new Error('Failed to fetch Manifest. Please check again.');
        });
    } catch (error) {
      showBoundary(error);
    }
  };

  useEffect(() => {
    setAppErrorMessage(customErrorMessage);
    setAppEmptyManifestMessage(emptyManifestMessage);

    if (!manifest && manifestUrl) {
      fetchManifest(manifestUrl);
    }

    // Cleanup Manifest fetch request on component unmount
    return () => {
      if (controller) controller.abort();
    };
  }, []);

  useEffect(() => {
    if (manifest) {
      // Set customStart and rendering files in state before setting Manifest
      const renderingFiles = getRenderingFiles(manifest);
      manifestDispatch({ renderings: renderingFiles, type: 'setRenderingFiles' });

      const customStart = getCustomStart(manifest, startCanvasId, startCanvasTime);
      manifestDispatch({ customStart, type: 'setCustomStart' });
      if (customStart.type == 'SR') {
        playerDispatch({
          currentTime: customStart.time,
          type: 'setCurrentTime',
        });
      }
      manifestDispatch({ manifest, type: 'updateManifest' });
    }
  }, [manifest]);

  if (!manifest) {
    return <Spinner />;
  } else {
    return <>{children}</>;
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
