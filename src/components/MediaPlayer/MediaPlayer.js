import React, { useEffect, useState } from 'react';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo } from '@Services/iiif-parser';
import { useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';

const MediaPlayer = () => {
  const manifestState = useManifestState();
  const playerState = usePlayerState();

  const [playerConfig, setPlayerConfig] = useState({
    error: '',
    sourceType: '',
    sources: [],
    tracks: [],
    poster: null,
  });

  const [ready, setReady] = useState(false);
  const [cIndex, setCIndex] = useState(canvasIndex);

  const { canvasIndex, manifest } = manifestState;

  useEffect(() => {
    if (manifest) {
      initCanvas(canvasIndex);
    }
  }, [manifest, canvasIndex]); // Re-run the effect when manifest changes

  if (playerConfig.error) {
    return <ErrorMessage message={playerConfig.error} />;
  }

  const initCanvas = (canvasId) => {
    const { sources, tracks, mediaType, error } = getMediaInfo({
      manifest,
      canvasIndex: canvasId,
    });
    setPlayerConfig({
      ...playerConfig,
      error,
      sourceType: mediaType,
      sources,
      tracks,
    });

    setCIndex(canvasId);
    error ? setReady(false) : setReady(true);
  };

  // Switch player when navigating across canvases
  const switchPlayer = () => {
    initCanvas(canvasIndex);
  };

  // Load next canvas in the list when current media ends
  const handleEnded = () => {
    initCanvas(canvasIndex + 1);
  };

  const videoJsOptions = {
    aspectRatio: playerConfig.sourceType === 'audio' ? '1:0' : '16:9',
    autoplay: false,
    bigPlayButton: false,
    controls: true,
    fluid: true,
    controlBar: {
      // Define and order control bar controls
      // See https://docs.videojs.com/tutorial-components.html for options of what
      // seem to be supported controls
      children: [
        'playToggle',
        'volumePanel',
        'progressControl',
        'remainingTimeDisplay',
        'subsCapsButton',
        'qualitySelector',
        'pictureInPictureToggle',
        // 'vjsYo',             custom component
      ],
      // Options for controls
      volumePanel: {
        inline: false,
      },
      fullscreenToggle: playerConfig.sourceType === 'audio' ? false : true,
    },
    sources: playerConfig.sources,
    tracks: playerConfig.tracks,
  };

  return ready ? (
    <div data-testid="media-player" key={`media-player-${cIndex}`}>
      <VideoJSPlayer
        isVideo={playerConfig.sourceType === 'video'}
        switchPlayer={switchPlayer}
        handleIsEnded={handleEnded}
        {...videoJsOptions}
      />
    </div>
  ) : null;
};

MediaPlayer.propTypes = {};

export default MediaPlayer;
