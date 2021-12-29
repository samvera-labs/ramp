import React from 'react';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo, getPoster } from '@Services/iiif-parser';
import { useManifestState } from '../../context/manifest-context';
import {
  usePlayerState,
  usePlayerDispatch,
} from '../../context/player-context';

const MediaPlayer = () => {
  const manifestState = useManifestState();
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const { player } = playerState;

  const [playerConfig, setPlayerConfig] = React.useState({
    error: '',
    sourceType: '',
    sources: [],
    tracks: [],
    poster: null,
  });

  const [ready, setReady] = React.useState(false);
  const [cIndex, setCIndex] = React.useState(canvasIndex);

  const { canvasIndex, manifest } = manifestState;

  React.useEffect(() => {
    if (manifest) {
      initCanvas(canvasIndex);
    }

    return () => {
      setReady(false);
      setCIndex(0);
      playerDispatch({
        player: null,
        type: 'updatePlayer',
      });
    };
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
    aspectRatio: playerConfig.sourceType === 'video' ? '16:9' : '1:0',
    autoplay: false,
    bigPlayButton: false,
    poster: playerConfig.sourceType === 'video' ? getPoster(manifest) : null,
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
      /* Options for controls */
      // make the volume bar vertical
      volumePanel: {
        inline: false,
      },
      // disable fullscreen toggle button for audio
      fullscreenToggle: playerConfig.sourceType === 'audio' ? false : true,
      // remove timetooltip on playhead when hovering over the time rail
      progressControl: {
        seekBar: {
          playProgressBar: {
            timeTooltip: false,
          },
        },
      },
    },
    sources: playerConfig.sources,
    tracks: playerConfig.tracks,
  };

  return ready ? (
    <div
      data-testid="media-player"
      className="irmp--media_player"
      key={`media-player-${cIndex}`}
    >
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
