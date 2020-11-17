import React from 'react';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import IIIFPlayerWrapper from '@Components/IIIFPlayerWrapper';
import PropTypes from 'prop-types';

export default function IIIFPlayer({ manifestUrl, manifest, children }) {
  if (!manifestUrl && !manifest)
    return <p>Please provide a manifest or manifestUrl.</p>;

  return (
    <ManifestProvider>
      <PlayerProvider>
        <IIIFPlayerWrapper manifestUrl={manifestUrl} manifest={manifest}>
          {children}
        </IIIFPlayerWrapper>
      </PlayerProvider>
    </ManifestProvider>
  );
}

IIIFPlayer.propTypes = {
  /** A valid IIIF manifest uri */
  manifestUrl: PropTypes.string,
};

IIIFPlayer.defaultProps = {};
