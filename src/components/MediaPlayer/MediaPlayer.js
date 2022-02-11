import React from 'react';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import {
  getMediaFragment,
  getMediaInfo,
  getPoster,
} from '@Services/iiif-parser';
import {
  useManifestDispatch,
  useManifestState,
} from '../../context/manifest-context';
import {
  usePlayerState,
  usePlayerDispatch,
} from '../../context/player-context';

const MediaPlayer = () => {
  const manifestState = useManifestState();
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const manifestDispatch = useManifestDispatch();

  const [playerConfig, setPlayerConfig] = React.useState({
    error: '',
    sourceType: '',
    sources: [],
    tracks: [],
    poster: null,
  });

  const [ready, setReady] = React.useState(false);
  const [cIndex, setCIndex] = React.useState(canvasIndex);
  const [isMultiSource, setIsMultiSource] = React.useState();

  const { srcIndex } = playerState;
  const { canvasIndex, manifest, canvasDuration, canvasTargets, targets } =
    manifestState;

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
  }, [manifest, canvasIndex, srcIndex]); // Re-run the effect when manifest changes

  if (playerConfig.error) {
    return <ErrorMessage message={playerConfig.error} />;
  }

  const initCanvas = (canvasId) => {
    const {
      isMultiSource,
      sources,
      tracks,
      canvasTargets,
      mediaType,
      canvas,
      error,
    } = getMediaInfo({
      manifest,
      canvasIndex: canvasId,
      srcIndex,
    });

    manifestDispatch({ canvasTargets, type: 'canvasTargets' });
    manifestDispatch({
      canvasDuration: canvas.duration,
      type: 'canvasDuration',
    });
    manifestDispatch({
      isMultiSource,
      type: 'hasMultipleItems',
    });

    updatePlayerSrcDetails(canvas.duration, sources, isMultiSource);
    setIsMultiSource(isMultiSource);
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

  const updatePlayerSrcDetails = (duration, sources, isMultiSource) => {
    let timeFragment = {};
    console.log(isMultiSource);
    if (isMultiSource) {
      timeFragment = canvasTargets[srcIndex];
      if (isNaN(timeFragment.end)) timeFragment.end = duration;
      playerDispatch({
        start: 0,
        end: duration,
        type: 'setPlayerRange',
      });
    } else {
      const playerSrc = sources.filter((s) => s.selected)[0];
      timeFragment = getMediaFragment(playerSrc.src);
      if (timeFragment == undefined) {
        timeFragment = { start: 0, end: duration };
      }
      manifestDispatch({
        canvasTargets: [timeFragment],
        type: 'canvasTargets',
      });

      playerDispatch({
        start: timeFragment.start,
        end: timeFragment.end,
        type: 'setPlayerRange',
      });
    }
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
        // 'progressControl',
        'videoJSProgress',
        // 'remainingTimeDisplay',
        // 'currentTimeDisplay',
        'videoJSCurrentTime',
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
      videoJSProgress: {
        times: targets[srcIndex],
        duration: canvasDuration,
        srcIndex,
        targets,
      },
      videoJSCurrentTime: {
        srcIndex,
        targets,
      },
      // currentTimeDisplay: true,
      // disable fullscreen toggle button for audio
      fullscreenToggle: playerConfig.sourceType === 'audio' ? false : true,
    },
    sources: isMultiSource
      ? playerConfig.sources[srcIndex]
      : playerConfig.sources,
    tracks: playerConfig.tracks,
  };

  return ready ? (
    <div
      data-testid="media-player"
      className="irmp--media_player"
      key={`media-player-${cIndex}-${srcIndex}`}
    >
      <VideoJSPlayer
        isVideo={playerConfig.sourceType === 'video'}
        duration={canvasDuration}
        switchPlayer={switchPlayer}
        handleIsEnded={handleEnded}
        {...videoJsOptions}
      />
    </div>
  ) : null;
};

MediaPlayer.propTypes = {};

export default MediaPlayer;
