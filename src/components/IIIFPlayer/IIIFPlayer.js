import React from 'react';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import IIIFPlayerWrapper from '@Components/IIIFPlayerWrapper';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import '../../styles/main.scss';

export default function IIIFPlayer({
  manifestUrl,
  manifest,
  customErrorMessage,
  emptyManifestMessage,
  startCanvasId,
  startCanvasTime,
  children
}) {
  if (!manifestUrl && !manifest)
    return <p>Please provide a valid manifest.</p>;

  return (
    <ManifestProvider>
      <PlayerProvider>
        <ErrorMessage >
          <IIIFPlayerWrapper
            manifestUrl={manifestUrl}
            manifest={manifest}
            customErrorMessage={customErrorMessage}
            emptyManifestMessage={emptyManifestMessage}
            startCanvasId={startCanvasId}
            startCanvasTime={startCanvasTime}>
            {children}
          </IIIFPlayerWrapper>
        </ErrorMessage>
      </PlayerProvider>
    </ManifestProvider>
  );
}

IIIFPlayer.propTypes = {
  /** A valid IIIF manifest uri */
  manifestUrl: PropTypes.string,
  manifest: PropTypes.object,
  customErrorMessage: PropTypes.string,
  emptyManifestMessage: PropTypes.string,
  startCanvasId: PropTypes.string,
  startCanvasTime: PropTypes.number,
};

IIIFPlayer.defaultProps = {};
