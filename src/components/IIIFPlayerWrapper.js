import React, { useEffect, useState } from 'react';
import MediaElementContainer from '@Components/MediaPlayer/MediaPlayer';
import { useManifestDispatch } from '../context/manifest-context';
import StructuredNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import PropTypes from 'prop-types';

export default function IIIFPlayerWrapper({ manifestUrl, children }) {
  const [manifest, setManifest] = useState();
  const dispatch = useManifestDispatch();

  useEffect(() => {
    fetch(manifestUrl)
      .then((result) => result.json())
      .then((data) => {
        console.log('fetch result manifest', data);
        setManifest(data);
        dispatch({ manifest: data, type: 'updateManifest' });
      });
  }, []);

  if (!manifest) return <p>...Loading</p>;

  return <section className="iiif-player">{children}</section>;
}

IIIFPlayerWrapper.propTypes = {
  manifestUrl: PropTypes.string,
  children: PropTypes.node,
};
