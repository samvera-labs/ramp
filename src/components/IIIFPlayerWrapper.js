import React from 'react';
import { useManifestState } from '../context/manifest-context';
import PropTypes from 'prop-types';

export default function IIIFPlayerWrapper({
  children,
}) {
  const { manifest, manifestError } = useManifestState();

  if (manifestError?.length > 0) {
    return <p>{manifestError}</p>;
  } else if (!manifest) {
    return <p>...Loading</p>;
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
}

IIIFPlayerWrapper.propTypes = {
  children: PropTypes.node,
};
