import React from 'react';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import IIIFPlayerWrapper from '@Components/IIIFPlayerWrapper';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import '../../styles/main.scss';

/**
 * Component with wrapped in React Contexts to provide access
 * to global state across its children
 * @param {Object} props
 * @param {String} props.manifestUrl
 * @param {Object} props.manifest
 * @param {String} props.customErrorMessage
 * @param {String} props.emptyManifestMessage
 * @param {String} props.startCanvasId
 * @param {String} props.startCanvasTime 
 */
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
    <ErrorMessage >
      <ManifestProvider>
        <PlayerProvider>
          <IIIFPlayerWrapper
            manifestUrl={manifestUrl}
            manifest={manifest}
            customErrorMessage={customErrorMessage}
            emptyManifestMessage={emptyManifestMessage}
            startCanvasId={startCanvasId}
            startCanvasTime={startCanvasTime}>
            {children}
          </IIIFPlayerWrapper>
        </PlayerProvider>
      </ManifestProvider>
    </ErrorMessage>
  );
}

IIIFPlayer.propTypes = {
  /** URL of a IIIF Manifest to fetch. Either this or `manifest` is _required_. When both props are provided,
   * `manifest` takes precedence. */
  manifestUrl: PropTypes.string,
  /** A IIIF Manifest JSON object. Takes precedence over `manifestUrl` when both are provided. */
  manifest: PropTypes.object,
  /** Custom message shown to the user in the unlikely event of the components crashing. The message can include
   * HTML markup (**added in `@samvera/ramp@3.0.0`**). */
  customErrorMessage: PropTypes.string,
  /** Message text to be shown when a given Manifest has no canvases in it yet (e.g. an empty playlist)
   * (**added in `@samvera/ramp@3.0.0`**) */
  emptyManifestMessage: PropTypes.string,
  /** A valid Canvas ID in the given Manifest to show in Ramp on initialization. This can be mapped to the
   * [`start` property](https://iiif.io/api/presentation/3.0/#start) in a IIIF Manifest. This prop value overrides
   * a defined `start` property in the given Manfiest, this value overrides it (**added in `@samvera/ramp@3.0.0`**). */
  startCanvasId: PropTypes.string,
  /** A valid numer for a time in seconds to start playback in Ramp on initialization. Similar to the previous prop,
   * this can be used to override the `start` property in the Manifest (**added in `@samvera/ramp@3.0.0`**). */
  startCanvasTime: PropTypes.number,
};

/* Default prop values for IIIFPlayer component in Storybook */
IIIFPlayer.defaultProps = {
  customErrorMessage: 'Error encountered. Please check your Manifest.',
  emptyManifestMessage: 'No media resource(s). Please check your Manifest.',
};

