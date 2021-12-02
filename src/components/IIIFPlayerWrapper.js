import React from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import PropTypes from 'prop-types';

export default function IIIFPlayerWrapper({
  manifestUrl,
  children,
  manifest: manifestValue,
}) {
  const [manifest, setManifest] = React.useState(manifestValue);
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
