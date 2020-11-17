import React, { useEffect, useState } from 'react';
import MediaElementContainer from '@Components/MediaPlayer/MediaPlayer';
import { useManifestDispatch } from '../context/manifest-context';
import StructuredNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import PropTypes from 'prop-types';

export default function IIIFPlayerWrapper({ manifestUrl, children, manifest }) {
  const [manifestValue, setManifestValue] = useState(manifest);
  const dispatch = useManifestDispatch();

  useEffect(() => {
    if (manifestValue) {
      dispatch({ manifest: manifestValue, type: 'updateManifest' });
    } else {
      fetch(manifestUrl)
        .then((result) => result.json())
        .then((data) => {
          console.log('fetch result manifest', data);
          setManifestValue(data);
          dispatch({ manifest: data, type: 'updateManifest' });
        });
    }
  }, []);

  if (!manifestValue) return <p>...Loading</p>;

  return <section className="iiif-player">{children}</section>;
}

IIIFPlayerWrapper.propTypes = {
  manifest: PropTypes.object,
  manifestUrl: PropTypes.string,
  children: PropTypes.node,
};
