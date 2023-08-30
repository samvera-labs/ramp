import React from 'react';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import IIIFPlayerWrapper from '@Components/IIIFPlayerWrapper';
import PropTypes from 'prop-types';
import '../../styles/main.scss';

export default function IIIFPlayer({ manifestUrl, manifest, children }) {

  if (!manifestUrl && !manifest)
    return <p>Please provide a valid manifest.</p>;

  return (
    <ManifestProvider manifestUrl={manifestUrl} manifest={manifest}>
      <PlayerProvider>
        <IIIFPlayerWrapper>
          {children}
        </IIIFPlayerWrapper>
      </PlayerProvider>
    </ManifestProvider>
  );
}

IIIFPlayer.propTypes = {
  /** A valid IIIF manifest uri */
  manifestUrl: PropTypes.string,
  manifest: PropTypes.object,
};

IIIFPlayer.defaultProps = {};
