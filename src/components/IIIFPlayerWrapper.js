import React from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import PropTypes from 'prop-types';

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

  if (manifestError.length > 0) {
    return <p>{manifestError}</p>;
  } else if (!manifest) {
    return <p>...Loading</p>;
  } else {
    return <section className="iiif-player">{children}</section>;
  }
}

IIIFPlayerWrapper.propTypes = {
  manifest: PropTypes.object,
  manifestUrl: PropTypes.string,
  children: PropTypes.node,
};
