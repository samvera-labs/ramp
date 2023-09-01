import React from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import PropTypes from 'prop-types';
import { parseAutoAdvance, getIsPlaylist } from '@Services/iiif-parser';

export default function IIIFPlayerWrapper({
  manifestUrl,
  children,
  manifest: manifestValue,
}) {
  const [manifest, setManifest] = React.useState(manifestValue);
  const [manifestError, setManifestError] = React.useState('');
  const dispatch = useManifestDispatch();

  React.useEffect(() => {
    if (manifest) {
      dispatch({ manifest: manifest, type: 'updateManifest' });
    } else {
      fetch(manifestUrl)
        .then((result) => result.json())
        .then((data) => {
          setManifest(data);
          dispatch({ manifest: data, type: 'updateManifest' });
        })
        .catch((error) => {
          console.log('Error fetching manifest, ', error);
          setManifestError('Failed to fetch Manifest. Please check again.');
        });
    }
  }, []);

  React.useEffect(() => {
    if (manifest) {
      dispatch({ autoAdvance: parseAutoAdvance(manifest), type: "setAutoAdvance" });

      const isPlaylist = getIsPlaylist(manifest);
      dispatch({ isPlaylist: isPlaylist, type: 'setIsPlaylist' });
    }
  }, [manifest]);

  if (manifestError.length > 0) {
    return <p>{manifestError}</p>;
  } else if (!manifest) {
    return <p>...Loading</p>;
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
}

IIIFPlayerWrapper.propTypes = {
  manifest: PropTypes.object,
  manifestUrl: PropTypes.string,
  children: PropTypes.node,
};
