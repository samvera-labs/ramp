import React from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJS/VideoJSPlayer';
import { getMediaInfo, getPlaceholderCanvas, manifestCanvasesInfo } from '@Services/iiif-parser';
import { getMediaFragment, CANVAS_MESSAGE_TIMEOUT, playerHotKeys } from '@Services/utility-helpers';
import {
  useManifestDispatch,
  useManifestState,
} from '../../context/manifest-context';
import {
  usePlayerState,
  usePlayerDispatch,
} from '../../context/player-context';
import { useErrorBoundary } from "react-error-boundary";
import './MediaPlayer.scss';
import { IS_ANDROID, IS_MOBILE, IS_SAFARI, IS_TOUCH_ONLY } from '@Services/browser';

const PLAYER_ID = "iiif-media-player";

const MediaPlayer = ({ enableFileDownload = false, enablePIP = false }) => {
  const manifestState = useManifestState();
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const manifestDispatch = useManifestDispatch();
  const { showBoundary } = useErrorBoundary();

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
    playlist,
    autoAdvance,
    hasStructure,
  } =
    manifestState;
  const { playerFocusElement, currentTime } = playerState;

  const canvasIndexRef = React.useRef();
  canvasIndexRef.current = canvasIndex;

  const autoAdvanceRef = React.useRef();
  autoAdvanceRef.current = autoAdvance;

  const lastCanvasIndexRef = React.useRef();
  lastCanvasIndexRef.current = lastCanvasIndex;

  const trackScrubberRef = React.useRef();
  const timeToolRef = React.useRef();

  let canvasMessageTimerRef = React.useRef(null);

  React.useEffect(() => {
    if (manifest) {
      try {
        /*
          Always start from the start time relevant to the Canvas only in playlist contexts,
          because canvases related to playlist items always start from the given start.
          With regular manifests, the start time could be different when using structured 
          navigation to switch between canvases.
        */
        initCanvas(canvasIndex, playlist.isPlaylist);

        // flag to identify multiple canvases in the manifest
        // to render previous/next buttons
        const { isMultiCanvas, lastIndex } = manifestCanvasesInfo(manifest);
        setIsMultiCanvased(isMultiCanvas);
        setLastCanvasIndex(lastIndex);
      } catch (e) {
        showBoundary(e);
      }
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

  /**
   * Handle the display timer for the inaccessbile message when autoplay is turned
   * on/off while the current item is a restricted item
   */
  React.useEffect(() => {
    if (canvasIsEmpty) {
      // Clear the existing timer when the autoplay is turned off when displaying
      // inaccessible message
      if (!autoAdvance && canvasMessageTimerRef.current) {
        clearCanvasMessageTimer();
      } else {
        // Create a timer to advance to the next Canvas when autoplay is turned
        // on when inaccessible message is been displayed
        createCanvasMessageTimer();
      }
    }
  }, [autoAdvance]);

  /**
   * Initialize the next Canvas to be viewed in the player instance
   * @param {Number} canvasId index of the Canvas to be loaded into the player
   * @param {Boolean} fromStart flag to indicate how to start new player instance
   */
  const initCanvas = (canvasId, fromStart) => {
    clearCanvasMessageTimer();
    try {
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
    } catch (e) {
      showBoundary(e);
    }
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
    } else if (sources.length === 0) {
      playerDispatch({
        type: 'updatePlayer'
      });
      const itemMessage = getPlaceholderCanvas(manifest, cIndex);
      setPlayerConfig({
        ...playerConfig,
        error: itemMessage
      });
      /*
        Create a timer to display the placeholderCanvas message when,
        autoplay is turned on
      */
      if (autoAdvanceRef.current) {
        createCanvasMessageTimer();
      }
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

  /**
   * Create timer to display the inaccessible Canvas message
   */
  const createCanvasMessageTimer = () => {
    canvasMessageTimerRef.current = setTimeout(() => {
      if (canvasIndexRef.current < lastCanvasIndexRef.current) {
        manifestDispatch({
          canvasIndex: canvasIndexRef.current + 1,
          type: 'switchCanvas',
        });
      }
    }, CANVAS_MESSAGE_TIMEOUT);
  };

  /**
   * Clear existing timer to display the inaccessible Canvas message
   */
  const clearCanvasMessageTimer = () => {
    if (canvasMessageTimerRef.current) {
      clearTimeout(canvasMessageTimerRef.current);
      canvasMessageTimerRef.current = null;
    }
  };

  /**
   * Switch player when navigating across canvases
   * @param {Number} index canvas index to be loaded into the player
   * @param {Boolean} fromStart flag to indicate set player start time to zero or not
   * @param {String} focusElement element to be focused within the player when using
   * next or previous buttons with keyboard
   */
  const switchPlayer = (index, fromStart, focusElement = '') => {
    if (canvasIndexRef.current != index && index <= lastCanvasIndexRef.current) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas',
      });
      initCanvas(index, fromStart);
      playerDispatch({ element: focusElement, type: 'setPlayerFocusElement' });
    }
  };

  // VideoJS instance configurations
  let videoJsOptions = !canvasIsEmpty ? {
    aspectRatio: isVideo ? '16:9' : '1:0',
    autoplay: false,
    bigPlayButton: isVideo,
    id: PLAYER_ID,
    // Setting inactivity timeout to zero in mobile and tablet devices translates to
    // user is always active. And the control bar is not hidden when user is active.
    // With this user can always use the controls when the media is playing.
    inactivityTimeout: (IS_MOBILE || IS_TOUCH_ONLY) ? 0 : 2000,
    poster: isVideo ? getPlaceholderCanvas(manifest, canvasIndex, true) : null,
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
        (hasStructure || playlist.isPlaylist) ? 'videoJSTrackScrubber' : '',
        (playerConfig.tracks.length > 0 && isVideo) ? 'subsCapsButton' : '',
        IS_MOBILE ? 'muteToggle' : 'volumePanel',
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
        currentTime: currentTime || 0,
      },
      // disable fullscreen toggle button for audio
      fullscreenToggle: !isVideo ? false : true,
    },
    sources: isMultiSource
      ? playerConfig.sources[srcIndex]
      : playerConfig.sources,
    // Enable native text track functionality in iPhones and iPads
    html5: {
      nativeTextTracks: IS_MOBILE && !IS_ANDROID
    },
    // Setting this option helps to override VideoJS's default 'keydown' event handler, whenever
    // the focus is on a native VideoJS control icon (e.g. play toggle).
    // E.g. click event on 'playtoggle' sets the focus on the play/pause button,
    // which has VideoJS's 'handleKeydown' event handler attached to it. Therefore, as long as the
    // focus is on the play/pause button the 'keydown' event will pass through VideoJS's default
    // 'keydown' event handler, without ever reaching the 'keydown' handler setup on the document
    // in Ramp code.
    // When this option is setup VideoJS's 'handleKeydown' event handler passes the event to the
    // function setup under the 'hotkeys' option when the native player controls are focused.
    // In Safari, this works without using 'hotkeys' option, therefore only set this in other browsers.
    userActions: {
      hotkeys: !IS_SAFARI
        ? function (e) {
          playerHotKeys(e, this);
        }
        : undefined
    }
  } : {}; // Empty configurations for empty canvases

  // Make the volume slider horizontal for audio in non-mobile browsers
  if (!IS_MOBILE && !canvasIsEmpty) {
    videoJsOptions = {
      ...videoJsOptions,
      controlBar: {
        ...videoJsOptions.controlBar,
        volumePanel: { inline: isVideo ? false : true }
      }
    };
  }

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
          switchPlayer,
          playerFocusElement,
        },
        videoJSNextButton: {
          canvasIndex,
          lastCanvasIndex: lastCanvasIndexRef.current,
          switchPlayer,
          playerFocusElement,
        },
      }
    };
  }
  // Iniitialize track scrubber button when the current Canvas has 
  // structure timespans or the given Manifest is a playlist Manifest
  if ((hasStructure || playlist.isPlaylist) && !canvasIsEmpty) {
    videoJsOptions = {
      ...videoJsOptions,
      controlBar: {
        ...videoJsOptions.controlBar,
        videoJSTrackScrubber: {
          trackScrubberRef,
          timeToolRef,
          isPlaylist: playlist.isPlaylist,
        }
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
            id={PLAYER_ID}
            isVideo={true}
            switchPlayer={switchPlayer}
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
          trackScrubberRef={trackScrubberRef}
          scrubberTooltipRef={timeToolRef}
          tracks={playerConfig.tracks}
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
