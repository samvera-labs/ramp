import React from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { canvasesInManifest, getMediaInfo, getPoster } from '@Services/iiif-parser';
import { getMediaFragment } from '@Services/utility-helpers';
import {
  useManifestDispatch,
  useManifestState,
} from '../../context/manifest-context';
import {
  usePlayerState,
  usePlayerDispatch,
} from '../../context/player-context';

const MediaPlayer = ({ enableFileDownload = false }) => {
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
  const [isMultiCanvased, setIsMultiCanvased] = React.useState(false);
  const [lastCanvasIndex, setLastCanvasIndex] = React.useState(0);

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
    let timeFragment = {};
    if (isMultiSource) {
      playerDispatch({
        start: 0,
        end: duration,
        type: 'setPlayerRange',
      });
    } else {
      const playerSrc = sources.filter((s) => s.selected)[0];
      timeFragment = getMediaFragment(playerSrc.src, duration);
      if (timeFragment == undefined) {
        timeFragment = { start: 0, end: duration };
      }
      timeFragment.altStart = timeFragment.start;
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
  const switchPlayer = (index) => {
    if (canvasIndex != index) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas',
      });
    }
    initCanvas(index);
  };

  // Load next canvas in the list when current media ends
  const handleEnded = () => {
    initCanvas(canvasIndex + 1);
  };

  let videoJsOptions = {
    aspectRatio: playerConfig.sourceType === 'video' ? '16:9' : '1:0',
    autoplay: false,
    bigPlayButton: false,
    poster: playerConfig.sourceType === 'video' ? getPoster(manifest, canvasIndex) : null,
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
        'subsCapsButton',
        'qualitySelector',
        'pictureInPictureToggle',
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
      fullscreenToggle: (playerConfig.sourceType === 'audio' || playerConfig.sourceType === 'sound') ? false : true,
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
        isVideo={playerConfig.sourceType === 'video'}
        switchPlayer={switchPlayer}
        handleIsEnded={handleEnded}
        {...videoJsOptions}
      />
    </div>
  ) : null;
};

MediaPlayer.propTypes = {
  enableFileDownload: PropTypes.bool
};

export default MediaPlayer;
