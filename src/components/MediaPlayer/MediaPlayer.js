import React from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJS/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { canvasesInManifest, getMediaInfo, getPoster } from '@Services/iiif-parser';
import { getPlayerSrcDetails } from '@Services/utility-helpers';
import {
  useManifestDispatch,
  useManifestState,
} from '../../context/manifest-context';
import {
  usePlayerState,
  usePlayerDispatch,
} from '../../context/player-context';

const MediaPlayer = ({ enableFileDownload = false, enablePIP = false }) => {
  const manifestState = useManifestState();
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const manifestDispatch = useManifestDispatch();

  const [playerConfig, setPlayerConfig] = React.useState({
    error: '',
    sources: [],
    tracks: [],
    poster: null,
  });

  const [ready, setReady] = React.useState(false);
  const [cIndex, setCIndex] = React.useState(canvasIndex);
  const [isMultiSource, setIsMultiSource] = React.useState();
  const [isMultiCanvased, setIsMultiCanvased] = React.useState(false);
  const [lastCanvasIndex, setLastCanvasIndex] = React.useState(0);
  const [isVideo, setIsVideo] = React.useState();

  const { canvasIndex, manifest, canvasDuration, srcIndex, targets } =
    manifestState;
  const { player } = playerState;

  React.useEffect(() => {
    if (manifest) {
      initCanvas(canvasIndex);

      // flag to identify multiple canvases in the manifest
      // to render previous/next buttons
      const canvases = canvasesInManifest(manifest);
      setIsMultiCanvased(canvases.length > 1 ? true : false);
      setLastCanvasIndex(canvases.length - 1);
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

  const initCanvas = (canvasId, fromStart) => {
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

    setIsVideo(mediaType === 'video');
    manifestDispatch({ canvasTargets, type: 'canvasTargets' });
    manifestDispatch({
      canvasDuration: canvas.duration,
      type: 'canvasDuration',
    });
    manifestDispatch({
      isMultiSource,
      type: 'hasMultipleItems',
    });
    // Set the current time in player from the canvas details
    if (fromStart) {
      if (canvasTargets?.length > 0) {
        playerDispatch({ currentTime: canvasTargets[0].altStart, type: 'setCurrentTime' });
      } else {
        playerDispatch({ currentTime: 0, type: 'setCurrentTime' });
      }
    }

    updatePlayerSrcDetails(canvas.duration, sources, isMultiSource);
    setIsMultiSource(isMultiSource);
    setPlayerConfig({
      ...playerConfig,
      error,
      sources,
      tracks,
    });

    setCIndex(canvasId);
    error ? setReady(false) : setReady(true);
  };

  /**
   * Switch src in the player when seeked to a time range within a
   * different item in the same canvas
   * @param {Number} srcindex new srcIndex
   * @param {Number} value current time of the player
   */
  const nextItemClicked = (srcindex, value) => {
    playerDispatch({ currentTime: value, type: 'setCurrentTime' });
    manifestDispatch({
      srcIndex: srcindex,
      type: 'setSrcIndex',
    });
  };

  /**
   * Update contexts based on the items in the canvas(es) in manifest
   * @param {Number} duration canvas duration
   * @param {Array} sources array of sources passed into player
   * @param {Boolean} isMultiSource flag indicating whether there are
   * multiple items in the canvas
   */
  const updatePlayerSrcDetails = (duration, sources, isMultiSource) => {
    const { start, end, canvasTargets }
      = getPlayerSrcDetails(duration, sources, isMultiSource);
    playerDispatch({
      start: start,
      end: end,
      type: 'setPlayerRange',
    });
    if (!canvasDuration) {
      manifestDispatch({
        canvasTargets: canvasTargets,
        type: 'canvasTargets',
      });
    }
  };

  // Switch player when navigating across canvases
  const switchPlayer = (index, fromStart) => {
    if (canvasIndex != index) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas',
      });
    }
    initCanvas(index, fromStart);
  };

  // Load next canvas in the list when current media ends
  const handleEnded = () => {
    initCanvas(canvasIndex + 1, true);
  };

  let videoJsOptions = {
    aspectRatio: isVideo ? '16:9' : '1:0',
    autoplay: false,
    bigPlayButton: isVideo,
    poster: isVideo ? getPoster(manifest, canvasIndex) : null,
    controls: true,
    fluid: true,
    controlBar: {
      // Define and order control bar controls
      // See https://docs.videojs.com/tutorial-components.html for options of what
      // seem to be supported controls
      children: [
        isMultiCanvased ? 'videoJSPreviousButton' : '',
        'playToggle',
        isMultiCanvased ? 'videoJSNextButton' : '',
        'volumePanel',
        'videoJSProgress',
        'videoJSCurrentTime',
        'timeDivider',
        'durationDisplay',
        'subsCapsButton',
        'qualitySelector',
        enablePIP ? 'pictureInPictureToggle' : '',
        enableFileDownload ? 'videoJSFileDownload' : '',
        // 'vjsYo',             custom component
      ],
      videoJSProgress: {
        duration: canvasDuration,
        srcIndex,
        targets,
        nextItemClicked,
      },
      videoJSCurrentTime: {
        srcIndex,
        targets,
      },
      // disable fullscreen toggle button for audio
      fullscreenToggle: !isVideo ? false : true,
    },
    sources: isMultiSource
      ? playerConfig.sources[srcIndex]
      : playerConfig.sources,
    tracks: playerConfig.tracks,
  };

  // Add file download to toolbar when it is enabled via props
  if (enableFileDownload) {
    videoJsOptions = {
      ...videoJsOptions,
      controlBar: {
        ...videoJsOptions.controlBar,
        videoJSFileDownload: {
          manifest,
          canvasIndex
        }
      }
    };
  }

  if (isMultiCanvased) {
    videoJsOptions = {
      ...videoJsOptions,
      controlBar: {
        ...videoJsOptions.controlBar,
        videoJSPreviousButton: {
          canvasIndex,
          switchPlayer
        },
        videoJSNextButton: {
          canvasIndex,
          lastCanvasIndex,
          switchPlayer
        },
      }
    };
  }

  return ready ? (
    <div
      data-testid="media-player"
      className="ramp--media_player"
      key={`media-player-${cIndex}-${srcIndex}`}
    >
      <VideoJSPlayer
        isVideo={isVideo}
        switchPlayer={switchPlayer}
        handleIsEnded={handleEnded}
        {...videoJsOptions}
      />
    </div>
  ) : null;
};

MediaPlayer.propTypes = {
  enableFileDownload: PropTypes.bool,
  enablePIP: PropTypes.bool
};

export default MediaPlayer;
