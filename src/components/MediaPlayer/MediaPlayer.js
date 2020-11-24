import React, { useEffect, useState } from 'react';
import MediaElement from '@Components/MediaPlayer/MediaElement';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo, getTracks, getStartTime } from '@Services/iiif-parser';
import { useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { getDuration } from '@Services/iiif-parser';

const MediaPlayer = () => {
  const manifestState = useManifestState();
  const playerState = usePlayerState();

  const [playerConfig, setPlayerConfig] = useState({
    error: '',
    sourceType: '',
    sources: [],
    tracks: [],
  });

  const [ready, setReady] = useState(false);
  const [cIndex, setCIndex] = useState(canvasIndex);

  const { canvasIndex, manifest } = manifestState;
  const { isClicked, isPlaying, player, startTime } = playerState;

  useEffect(() => {
    if (manifest) {
      initCanvas(canvasIndex);
    }
  }, [manifest, canvasIndex]); // Re-run the effect when manifest changes

  if (playerConfig.error) {
    return <ErrorMessage message={playerConfig.error} />;
  }

  const initCanvas = (canvasId) => {
    const { sources, mediaType, error } = getMediaInfo({
      manifest,
      canvasIndex: canvasId,
    });
    setPlayerConfig({
      ...playerConfig,
      error,
      sourceType: mediaType,
      sources,
      tracks: getTracks({ manifest }),
    });

    setCIndex(canvasId);
    error ? setReady(false) : setReady(true);
    return { mediaType, sources };
  };

  const switchPlayer = (oldPlayer) => {
    switchPlayerHelper(oldPlayer, canvasIndex);

    if (isPlaying) {
      player.play();
    }
  };

  const handleEnded = (oldPlayer) => {
    switchPlayerHelper(oldPlayer, canvasIndex + 1);
    player.play();
  };

  const switchPlayerHelper = (oldPlayer, canvasId) => {
    const { sources, mediaType } = initCanvas(canvasId);
    if (mediaType !== playerConfig.sourceType) {
      oldPlayer.reset();
    } else {
      player.src(sources);

      // Update player duration
      const duration = getDuration(manifest, canvasIndex);
      player.duration(duration);

      player.load();
    }
  };

  const videoJsOptions = {
    aspectRatio: playerConfig.sourceType === 'audio' ? '12:1' : '16:9',
    autoplay: false,
    bigPlayButton: false,
    controls: true,
    controlBar: {
      // Define and order control bar controls
      // See https://docs.videojs.com/tutorial-components.html for options of what
      // seem to be supported controls
      /**
       children: [
        'playToggle',
        'volumePanel',
        'progressControl',
        'remainingTimeDisplay',
        'fullscreenToggle',
      ],
      */
      // Options for controls
      volumePanel: {
        inline: false,
      },
    },
    sources: playerConfig.sources,
    tracks: playerConfig.tracks,
  };

  return ready ? (
    <div data-testid="media-player">
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
