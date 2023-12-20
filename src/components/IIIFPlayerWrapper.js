import React from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import PropTypes from 'prop-types';
import { parseAutoAdvance } from '@Services/iiif-parser';
import { getAnnotationService, getIsPlaylist } from '@Services/playlist-parser';
import { setAppErrorMessage, GENERIC_ERROR_MESSAGE } from '@Services/utility-helpers';
import { useErrorBoundary } from "react-error-boundary";

export default function IIIFPlayerWrapper({
  manifestUrl,
  customErrorMessage,
  children,
  manifest: manifestValue,
}) {
  const [manifest, setManifest] = React.useState(manifestValue);
  const dispatch = useManifestDispatch();

  const { showBoundary } = useErrorBoundary();

  React.useEffect(() => {
    setAppErrorMessage(customErrorMessage);
    if (manifest) {
      dispatch({ manifest: manifest, type: 'updateManifest' });
    } else {
      let requestOptions = {
        // NOTE: try thin in Avalon
        //credentials: 'include',
        // headers: { 'Avalon-Api-Key': '' },
      };
      fetch(manifestUrl, requestOptions)
        .then((result) => {
          if (result.status != 200 || result.status != 201) {
            throw new Error('Failed to fetch Manifest. Please check again.');
          } else {
            return result.json();
          }
        })
        .then((data) => {
          setManifest(data);
          dispatch({ manifest: data, type: 'updateManifest' });
        })
        .catch((error) => {
          console.log('Error fetching manifest, ', error);
          showBoundary(error);
        });
    }
  }, []);

  React.useEffect(() => {
    if (manifest) {
      dispatch({ autoAdvance: parseAutoAdvance(manifest), type: "setAutoAdvance" });

      const isPlaylist = getIsPlaylist(manifest);
      dispatch({ isPlaylist: isPlaylist, type: 'setIsPlaylist' });

      const annotationService = getAnnotationService(manifest);
      dispatch({ annotationService: annotationService, type: 'setAnnotationService' });
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
  manifestUrl: PropTypes.string,
  children: PropTypes.node,
};
