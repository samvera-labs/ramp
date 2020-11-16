import React, { useEffect, useState } from 'react';
import MediaElement from '@Components/MediaPlayer/MediaElement';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo, getTracks } from '@Services/iiif-parser';
import { useManifestState } from '../../context/manifest-context';

const MediaPlayer = () => {
  const manifestState = useManifestState();
  const [ready, setReady] = useState(false);
  const [sources, setSources] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [mediaType, setMediaType] = useState('audio');
  const [error, setError] = useState(null);

  const { canvasIndex, manifest } = manifestState;

  useEffect(() => {
    if (manifest) {
      const { sources, mediaType, error } = getMediaInfo({
        manifest,
        canvasIndex,
      });
      setTracks(getTracks({ manifest }));
      setSources(sources);
      setMediaType(mediaType);
      setError(error);
      error ? setReady(false) : setReady(true);
    }
  }, [manifest]); // Re-run the effect when manifest changes

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return ready ? (
    <div data-testid='media-player' id="media-player">
      <MediaElement
        controls
        crossorigin="anonymous"
        height={manifest.height || 360}
        id="avln-mediaelement-component"
        mediaType={mediaType}
        options={JSON.stringify({})}
        poster=""
        preload="auto"
        sources={JSON.stringify(sources)}
        tracks={JSON.stringify(tracks)}
        width={manifest.width || 480}
      />
    </div>
  ) : null;
};

MediaPlayer.propTypes = {};

export default MediaPlayer;
