import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJS/VideoJSPlayer';
import { getMediaInfo } from '@Services/iiif-parser';
import { playerHotKeys } from '@Services/utility-helpers';
import {
  useManifestDispatch,
  useManifestState,
} from '../../context/manifest-context';
import {
  usePlayerState,
  usePlayerDispatch,
} from '../../context/player-context';
import { useErrorBoundary } from "react-error-boundary";
import { IS_ANDROID, IS_MOBILE, IS_SAFARI, IS_TOUCH_ONLY } from '@Services/browser';
// Default language for Video.js
import en from 'video.js/dist/lang/en.json';
import { useMediaPlayer } from '@Services/ramp-hooks';

const PLAYER_ID = "iiif-media-player";

const MediaPlayer = ({
  enableFileDownload = false,
  enablePIP = false,
  enablePlaybackRate = false,
  enableTitleLink = false,
  withCredentials = false,
  language = 'en'
}) => {
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

  const [firstLoad, setFirstLoad] = React.useState(true);
  const [ready, setReady] = React.useState(false);
  const [cIndex, setCIndex] = React.useState(canvasIndex);
  const [isMultiSourced, setIsMultiSourced] = React.useState();
  const [isVideo, setIsVideo] = React.useState();
  const [options, setOptions] = React.useState();
  const [renderingFiles, setRenderingFiles] = React.useState();

  const {
    allCanvases,
    manifest,
    canvasIsEmpty,
    srcIndex,
    targets,
    playlist,
    autoAdvance,
    hasStructure,
    customStart,
    renderings,
  } = manifestState;
  const { playerFocusElement, currentTime } = playerState;

  const autoAdvanceRef = React.useRef();
  autoAdvanceRef.current = autoAdvance;

  const trackScrubberRef = React.useRef();
  const timeToolRef = React.useRef();

  let videoJSLangMap = React.useRef('{}');

  const {
    isMultiCanvased,
    lastCanvasIndex,
    canvasIndex,
    createCanvasMessageTimer,
    clearCanvasMessageTimer
  } = useMediaPlayer();

  // Using dynamic imports to enforce code-splitting in webpack
  // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  const loadVideoJSLanguageMap = React.useMemo(() =>
    async () => {
      try {
        const resources = await import(`video.js/dist/lang/${language}.json`);
        videoJSLangMap.current = JSON.stringify(resources);
      } catch (e) {
        console.warn(`${language} is not available, defaulting to English`);
        videoJSLangMap.current = JSON.stringify(en);
      }
    }, [language]);

  React.useEffect(() => {
    if (manifest) {
      try {
        loadVideoJSLanguageMap();
        /*
          Always start from the start time relevant to the Canvas only in playlist contexts,
          because canvases related to playlist items always start from the given start.
          With regular manifests, the start time could be different when using structured 
          navigation to switch between canvases.
        */
        if (canvasIndex == undefined || canvasIndex < 0) {
          throw new Error('Invalid canvas index. Please check your Manifest.');
        }
        initCanvas(canvasIndex, playlist.isPlaylist);
      } catch (e) {
        showBoundary(e);
      }
    }

    return () => {
      setReady(false);
      setCIndex(0);
      playerDispatch({ player: null, type: 'updatePlayer' });
    };
  }, [manifest, canvasIndex]);

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
        error,
        poster
      } = getMediaInfo({
        manifest,
        canvasIndex: canvasId,
        startTime: canvasId === customStart.startIndex && firstLoad
          ? customStart.startTime : 0,
        srcIndex,
        isPlaylist: playlist.isPlaylist,
      });

      if (withCredentials) {
        sources.map(function (source) {
          return (source.withCredentials = true);
        });
      }
      setIsVideo(mediaType === 'video');
      manifestDispatch({ canvasTargets, type: 'canvasTargets' });
      manifestDispatch({ isMultiSource, type: 'hasMultipleItems' });

      // Set the current time in player from the canvas details
      if (fromStart) {
        if (canvasTargets?.length > 0) {
          playerDispatch({ currentTime: canvasTargets[0].altStart, type: 'setCurrentTime' });
        } else {
          playerDispatch({ currentTime: 0, type: 'setCurrentTime' });
        }
      }

      setPlayerConfig({ ...playerConfig, error, sources, tracks, poster });

      const currentCanvas = allCanvases.find((c) => c.canvasIndex === canvasId);
      if (!currentCanvas.isEmpty) {
        // Manifest is taken from manifest state, and is a basic object at this point
        // lacking the getLabel() function so we manually retrieve the first label.
        let manifestLabel = manifest.label ? Object.values(manifest.label)[0][0] : '';
        // Filter out falsy items in case canvas.label is null or an empty string
        let titleText = [manifestLabel, currentCanvas.label].filter(Boolean).join(' - ');
        manifestDispatch({ canvasDuration: currentCanvas.duration, type: 'canvasDuration' });
        manifestDispatch({
          canvasLink: { label: titleText, id: currentCanvas.canvasId },
          type: 'canvasLink',
        });
        manifestDispatch({ type: 'setCanvasIsEmpty', isEmpty: false });
      } else {
        playerDispatch({ type: 'updatePlayer' });
        manifestDispatch({ type: 'setCanvasIsEmpty', isEmpty: true });
        // Set poster as playerConfig.error to be used for empty Canvas message in VideoJSPlayer
        setPlayerConfig({ ...playerConfig, error: poster });
        // Create timer to display the message when autoadvance is ON
        if (autoAdvanceRef.current) {
          createCanvasMessageTimer();
        }
      }
      setIsMultiSourced(isMultiSource || false);

      setCIndex(canvasId);

      if (enableFileDownload && renderings != {}) {
        setRenderingFiles(
          (renderings.manifest)
            .concat(renderings.canvas[canvasId]?.files)
        );
      }
      error ? setReady(false) : setReady(true);
      // Reset firstLoad flag after customStart is used on initial load
      setFirstLoad(false);
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
   * Switch player when navigating across canvases
   * @param {Number} index canvas index to be loaded into the player
   * @param {Boolean} fromStart flag to indicate set player start time to zero or not
   * @param {String} focusElement element to be focused within the player when using
   * next or previous buttons with keyboard
   */
  const switchPlayer = (index, fromStart, focusElement = '') => {
    if (index != undefined && index > -1 && index <= lastCanvasIndex) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas',
      });
      initCanvas(index, fromStart);
      playerDispatch({ element: focusElement, type: 'setPlayerFocusElement' });
    }
  };

  // Default VideoJS options not updated with the Canvas data
  const defaultOptions = useMemo(() => {
    return {
      autoplay: false,
      id: PLAYER_ID,
      playbackRates: enablePlaybackRate ? [0.5, 0.75, 1, 1.5, 2] : [],
      experimentalSvgIcons: true,
      controls: true,
      fluid: true,
      language: language,
      // Setting inactivity timeout to zero in mobile and tablet devices translates to
      // user is always active. And the control bar is not hidden when user is active.
      // With this user can always use the controls when the media is playing.
      inactivityTimeout: (IS_MOBILE || IS_TOUCH_ONLY) ? 0 : 2000,
      // Enable native text track functionality in iPhones and iPads
      html5: {
        nativeTextTracks: IS_MOBILE && !IS_ANDROID
      },
      // Make error display modal dismissable
      errorDisplay: {
        uncloseable: false,
      },
      /* 
        Setting this option helps to override VideoJS's default 'keydown' event handler, whenever
        the focus is on a native VideoJS control icon (e.g. play toggle).
        E.g. click event on 'playtoggle' sets the focus on the play/pause button,
        which has VideoJS's 'handleKeydown' event handler attached to it. Therefore, as long as the
        focus is on the play/pause button the 'keydown' event will pass through VideoJS's default
        'keydown' event handler, without ever reaching the 'keydown' handler setup on the document
        in Ramp code.
        When this option is setup VideoJS's 'handleKeydown' event handler passes the event to the
        function setup under the 'hotkeys' option when the native player controls are focused.
        In Safari, this works without using 'hotkeys' option, therefore only set this in other browsers.
      */
      userActions: {
        hotkeys: !IS_SAFARI
          ? function (e) {
            playerHotKeys(e, this);
          }
          : undefined
      },
      videoJSTitleLink: enableTitleLink
    };
  }, [language, enablePlaybackRate, enableTitleLink]);

  // Build VideoJS options for the current Canvas from defaultOptions
  const videoJSOptions = useMemo(() => {
    return !canvasIsEmpty
      ? {
        ...defaultOptions,
        aspectRatio: isVideo ? '16:9' : '1:0',
        audioOnlyMode: !isVideo,
        bigPlayButton: isVideo,
        poster: isVideo ? playerConfig.poster : null,
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
            // These icons are in reverse order to support `float: inline-end` in CSS
            'fullscreenToggle',
            enableFileDownload ? 'videoJSFileDownload' : '',
            enablePIP ? 'pictureInPictureToggle' : '',
            enablePlaybackRate ? 'playbackRateMenuButton' : '',
            'qualitySelector',
            (hasStructure || playlist.isPlaylist) ? 'videoJSTrackScrubber' : '',
            (playerConfig.tracks.length > 0 && isVideo) ? 'subsCapsButton' : '',
            IS_MOBILE ? 'muteToggle' : 'volumePanel'
            // 'vjsYo',             custom component
          ],
          videoJSProgress: {
            srcIndex,
            targets,
            currentTime: currentTime || 0,
            nextItemClicked,
          },
          videoJSCurrentTime: { srcIndex, targets, currentTime: currentTime || 0 },
          videoJSFileDownload: enableFileDownload && {
            title: 'Download Files',
            controlText: 'Alternate resource download',
            files: renderingFiles,
          },
          videoJSPreviousButton: isMultiCanvased &&
            { canvasIndex, switchPlayer, playerFocusElement },
          videoJSNextButton: isMultiCanvased &&
            { canvasIndex, lastCanvasIndex, switchPlayer, playerFocusElement },
          videoJSTrackScrubber: (hasStructure || playlist.isPlaylist) &&
            { trackScrubberRef, timeToolRef, isPlaylist: playlist.isPlaylist }
        },
        sources: isMultiSourced
          ? [playerConfig.sources[srcIndex]]
          : playerConfig.sources,
      } : { ...defaultOptions, sources: [] };
  }, [isVideo, playerConfig]);

  if ((ready && videoJSOptions != undefined) || canvasIsEmpty) {
    return (
      <div
        data-testid="media-player"
        className="ramp--media_player"
        role="presentation"
      >
        <VideoJSPlayer
          isVideo={isVideo}
          hasMultipleCanvases={isMultiCanvased}
          isPlaylist={playlist.isPlaylist}
          trackScrubberRef={trackScrubberRef}
          scrubberTooltipRef={timeToolRef}
          tracks={playerConfig.tracks}
          placeholderText={playerConfig.error}
          renderingFiles={renderingFiles}
          enableFileDownload={enableFileDownload}
          loadPrevOrNext={switchPlayer}
          lastCanvasIndex={lastCanvasIndex}
          enableTitleLink={enableTitleLink}
          videoJSLangMap={videoJSLangMap.current}
          options={videoJSOptions}
        />
      </div>
    );
  } else {
    return null;
  }
};

MediaPlayer.propTypes = {
  enableFileDownload: PropTypes.bool,
  enablePIP: PropTypes.bool,
  enablePlaybackRate: PropTypes.bool,
  enableTitleLink: PropTypes.bool,
  withCredentials: PropTypes.bool,
  language: PropTypes.string,
};

export default MediaPlayer;
