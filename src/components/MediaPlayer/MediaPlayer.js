import React from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJS/VideoJSPlayer';
import ErrorMessage from '@Components/ErrorMessage/ErrorMessage';
import { getMediaInfo, getPoster, inaccessibleItemMessage, manifestCanvasesInfo } from '@Services/iiif-parser';
import { getMediaFragment } from '@Services/utility-helpers';
import {
  useManifestDispatch,
  useManifestState,
} from '../../context/manifest-context';
import {
  usePlayerState,
  usePlayerDispatch,
} from '../../context/player-context';
import './MediaPlayer.scss';

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

  const {
    canvasIndex,
    manifest,
    canvasDuration,
    canvasIsEmpty,
    srcIndex,
    targets,
    playlist
  } =
    manifestState;
  const { player, currentTime } = playerState;

  React.useEffect(() => {
    if (manifest) {
      initCanvas(canvasIndex);

      // flag to identify multiple canvases in the manifest
      // to render previous/next buttons
      const { isMultiCanvas, lastIndex } = manifestCanvasesInfo(manifest);
      setIsMultiCanvased(isMultiCanvas);
      setLastCanvasIndex(lastIndex);
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

    setPlayerConfig({
      ...playerConfig,
      error,
      sources,
      tracks,
    });
    updatePlayerSrcDetails(canvas.duration, sources, canvasId, isMultiSource);
    setIsMultiSource(isMultiSource);

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
   * @param {Number} cIndex latest canvas index
   * @param {Boolean} isMultiSource flag indicating whether there are
   * multiple items in the canvas
   */
  const updatePlayerSrcDetails = (duration, sources, cIndex, isMultiSource) => {
    let timeFragment = {};
    if (isMultiSource) {
      playerDispatch({
        start: 0,
        end: duration,
        type: 'setPlayerRange',
      });
      manifestDispatch({ type: 'setCanvasIsEmpty', isEmpty: false });
    } else if (sources === undefined || sources.length === 0) {
      playerDispatch({
        type: 'updatePlayer'
      });
      const itemMessage = inaccessibleItemMessage(manifest, cIndex);
      setPlayerConfig({
        ...playerConfig,
        error: itemMessage
      });
      manifestDispatch({ type: 'setCanvasIsEmpty', isEmpty: true });
    } else {
      const playerSrc = sources?.length > 0
        ? sources.filter((s) => s.selected)[0]
        : null;

      if (playerSrc) {
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

        manifestDispatch({ type: 'setCanvasIsEmpty', isEmpty: false });
      }
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

  // VideoJS instance configurations
  let videoJsOptions = !canvasIsEmpty ? {
    aspectRatio: isVideo ? '16:9' : '1:0',
    autoplay: false,
    bigPlayButton: isVideo,
    poster: isVideo ? getPoster(manifest, canvasIndex) : null,
    controls: true,
    fluid: true,
    language: "en", // TODO:: fill this information from props
    controlBar: {
      // Define and order control bar controls
      // See https://docs.videojs.com/tutorial-components.html for options of what
      // seem to be supported controls
      children: [
        isMultiCanvased ? 'videoJSPreviousButton' : '',
        'playToggle',
        isMultiCanvased ? 'videoJSNextButton' : '',
        'videoJSProgress',
        'videoJSCurrentTime',
        'timeDivider',
        'durationDisplay',
        'subsCapsButton',
        'volumePanel',
        'qualitySelector',
        enablePIP ? 'pictureInPictureToggle' : '',
        enableFileDownload ? 'videoJSFileDownload' : '',
        // 'vjsYo',             custom component
      ],
      videoJSProgress: {
        duration: canvasDuration,
        srcIndex,
        targets,
        currentTime: currentTime || 0,
        nextItemClicked,
      },
      videoJSCurrentTime: {
        srcIndex,
        targets,
      },
      // make the volume slider horizontal for audio
      volumePanel: { inline: isVideo ? false : true },
      // disable fullscreen toggle button for audio
      fullscreenToggle: !isVideo ? false : true,
    },
    sources: isMultiSource
      ? playerConfig.sources[srcIndex]
      : playerConfig.sources,
    tracks: playerConfig.tracks,
    userActions: {
      hotkeys: function (event) {
        // event.which key code values found at: https://css-tricks.com/snippets/javascript/javascript-keycodes/

        // Space and k toggle play/pause
        if (event.which === 32 || event.which === 75) {
          // Prevent default browser actions so that page does not react when hotkeys are used.
          // e.g. pressing space will pause/play without scrolling the page down.
          event.preventDefault();

          if (this.paused()) {
            this.play();
          } else {
            this.pause();
          }
        }

        // Adapted from https://github.com/videojs/video.js/blob/bad086dad68d3ff16dbe12e434c15e1ee7ac2875/src/js/control-bar/mute-toggle.js#L56
        // m toggles mute
        if (event.which === 77) {
          event.preventDefault();
          const vol = this.volume();
          const lastVolume = this.lastVolume_();

          if (vol === 0) {
            const volumeToSet = lastVolume < 0.1 ? 0.1 : lastVolume;

            this.volume(volumeToSet);
            this.muted(false);
          } else {
            this.muted(this.muted() ? false : true);
          }
        }

        // f toggles fullscreen
        // Fullscreen should only be available for videos
        if (event.which === 70 && !this.isAudio()) {
          event.preventDefault();

          if (!this.isFullscreen()) {
            this.requestFullscreen();
          } else {
            this.exitFullscreen();
          }
        }

        // Right arrow seeks 5 seconds ahead
        if (event.which === 39) {
          event.preventDefault();
          this.currentTime(this.currentTime() + 5);
        }

        // Left arrow seeks 5 seconds back
        if (event.which === 37) {
          event.preventDefault();
          this.currentTime(this.currentTime() - 5);
        }

        // Up arrow raises volume by 0.1
        if (event.which === 38) {
          event.preventDefault();
          this.volume(this.volume() + 0.1);
        }

        // Down arrow lowers volume by 0.1
        if (event.which === 40) {
          event.preventDefault();
          this.volume(this.volume() - 0.1);
        }
      }
    },
  } : {}; // Empty configurations for empty canvases

  // Add file download to toolbar when it is enabled via props
  if (enableFileDownload && !canvasIsEmpty) {
    videoJsOptions = {
      ...videoJsOptions,
      controlBar: {
        ...videoJsOptions.controlBar,
        videoJSFileDownload: {
          title: 'Download Files',
          controlText: 'Alternate resource download',
          manifest,
          canvasIndex
        }
      }
    };
  }

  if (isMultiCanvased && !canvasIsEmpty) {
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

  if (canvasIsEmpty) {
    return (
      <div
        data-testid="inaccessible-item"
        className="ramp--inaccessible-item"
        key={`media-player-${cIndex}`}
        role="presentation"
      >
        <div className="ramp--no-media-message">
          <div className="message-display" data-testid="inaccessible-message"
            dangerouslySetInnerHTML={{ __html: playerConfig.error }}>
          </div>
          <VideoJSPlayer
            isVideo={true}
            switchPlayer={switchPlayer}
            handleIsEnded={handleEnded}
            {...videoJsOptions}
          />
        </div>
      </div>
    );
  } else {
    return ready ? (
      <div
        data-testid="media-player"
        className="ramp--media_player"
        key={`media-player-${cIndex}-${srcIndex}`}
        role="presentation"
      >
        <VideoJSPlayer
          isVideo={isVideo}
          isPlaylist={playlist.isPlaylist}
          switchPlayer={switchPlayer}
          handleIsEnded={handleEnded}
          {...videoJsOptions}
        />
      </div>
    ) : null;
  };
};

MediaPlayer.propTypes = {
  enableFileDownload: PropTypes.bool,
  enablePIP: PropTypes.bool
};

export default MediaPlayer;
