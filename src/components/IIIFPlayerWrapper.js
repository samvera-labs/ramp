import React, { useEffect, useState } from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import PropTypes from 'prop-types';

export default function IIIFPlayerWrapper({
  manifestUrl,
  children,
  manifest: manifestValue,
}) {
  const [manifest, setManifest] = useState(manifestValue);
  const dispatch = useManifestDispatch();

  useEffect(() => {
    if (manifest) {
      dispatch({ manifest: manifest, type: 'updateManifest' });
    } else {
      fetch(manifestUrl)
        .then((result) => result.json())
        .then((data) => {
          console.log('fetch result manifest', data);
          setManifest(data);
          dispatch({ manifest: data, type: 'updateManifest' });
        });
    }
  }, []);

  if (!manifest) return <p>...Loading</p>;

  return <section className="iiif-player">{children}</section>;
}

IIIFPlayerWrapper.propTypes = {
  manifest: PropTypes.object,
  manifestUrl: PropTypes.string,
  children: PropTypes.node,
};
