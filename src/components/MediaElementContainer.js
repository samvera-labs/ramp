import React, { useEffect, useState } from 'react';
import MediaElement from '@Components/MediaElement';
import PropTypes from 'prop-types';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo, getTracks } from '@Services/iiif-parser';

const MediaElementContainer = ({ manifest, canvasIndex }) => {
  console.log('\nMediaElementContainer()');
  // Subscribe to Redux store variable
  //const canvasIndex = useSelector((state) => state.player.canvasIndex);

  // Component state variables
  //const [manifest, setManifest] = useState(null);
  const [ready, setReady] = useState(false);
  const [sources, setSources] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [mediaType, setMediaType] = useState('audio');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (manifest) {
      const { sources, mediaType, error } = getMediaInfo(manifest, canvasIndex);
      setTracks(getTracks({ manifest }));
      setSources(sources);
      setMediaType(mediaType);
      setError(error);
      error ? setReady(false) : setReady(true);
    }
  }, [manifest]); // Re-run the effect when manifest changes

  if (error) {
    return <ErrorMessage />;
  }

  return ready ? (
    <div data-testid={`mediaelement`} id="mediaelement">
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

MediaElementContainer.propTypes = {
  manifest: PropTypes.object,
  canvasIndex: PropTypes.number,
};

export default MediaElementContainer;
