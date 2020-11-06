import React from 'react';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import IIIFPlayerWrapper from '@Components/IIIFPlayerWrapper';
import PropTypes from 'prop-types';
import '../../App.scss';

export default function IIIFPlayer({ manifestUrl, showNav }) {
  if (!manifestUrl) return <p>You must pass in a manifest url</p>;

  return (
    <ManifestProvider>
      <PlayerProvider>
        <IIIFPlayerWrapper manifestUrl={manifestUrl} showNav={showNav} />
      </PlayerProvider>
    </ManifestProvider>
  );
}

IIIFPlayer.propTypes = {
  /** A valid IIIF manifest uri */
  manifestUrl: PropTypes.string,
  /** Show structured navigation underneath the player */
  showNav: PropTypes.bool,
};

IIIFPlayer.defaultProps = {
  showNav: false,
};
