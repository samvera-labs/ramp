import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJS/VideoJSPlayer';
import { playerHotKeys } from '@Services/utility-helpers';
import { useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { useErrorBoundary } from "react-error-boundary";
import { IS_ANDROID, IS_MOBILE, IS_SAFARI, IS_TOUCH_ONLY } from '@Services/browser';
import { useMediaPlayer, useSetupPlayer } from '@Services/ramp-hooks';

// Default language for Video.js
import en from 'video.js/dist/lang/en.json';

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
  const { showBoundary } = useErrorBoundary();

  const { srcIndex, hasStructure, playlist } = manifestState;
  const { isPlaylist } = playlist;
  const { playerFocusElement, currentTime } = playerState;

  const trackScrubberRef = useRef();
  const timeToolRef = useRef();
  let videoJSLangMap = useRef('{}');

  const { canvasIsEmpty, canvasIndex, isMultiCanvased, lastCanvasIndex } = useMediaPlayer();

  const {
    isMultiSourced,
    isVideo,
    playerConfig,
    ready,
    renderingFiles,
    nextItemClicked,
    switchPlayer
  } = useSetupPlayer({ enableFileDownload, withCredentials, lastCanvasIndex });

  const { error, poster, sources, targets, tracks } = playerConfig;

  // Using dynamic imports to enforce code-splitting in webpack
  // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  const loadVideoJSLanguageMap = useMemo(() =>
    async () => {
      try {
        const resources = await import(`video.js/dist/lang/${language}.json`);
        videoJSLangMap.current = JSON.stringify(resources);
      } catch (e) {
        console.warn(`${language} is not available, defaulting to English`);
        videoJSLangMap.current = JSON.stringify(en);
      }
    }, [language]);

  useEffect(() => {
    try {
      loadVideoJSLanguageMap();
    } catch (e) {
      showBoundary(e);
    }
  }, []);

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
        poster: isVideo ? poster : null,
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
            (hasStructure || isPlaylist) ? 'videoJSTrackScrubber' : '',
            (tracks.length > 0 && isVideo) ? 'subsCapsButton' : '',
            IS_MOBILE ? 'muteToggle' : 'volumePanel'
            // 'vjsYo',             custom component
          ],
          videoJSProgress: {
            srcIndex,
            targets,
            currentTime: currentTime ?? 0,
            nextItemClicked,
          },
          videoJSCurrentTime: {
            srcIndex, targets, currentTime: currentTime || 0
          },
          videoJSFileDownload: enableFileDownload && {
            title: 'Download Files',
            controlText: 'Alternate resource download',
            files: renderingFiles,
          },
          videoJSPreviousButton: isMultiCanvased &&
            { canvasIndex, switchPlayer, playerFocusElement },
          videoJSNextButton: isMultiCanvased &&
            { canvasIndex, lastCanvasIndex, switchPlayer, playerFocusElement },
          videoJSTrackScrubber: (hasStructure || isPlaylist) &&
            { trackScrubberRef, timeToolRef, isPlaylist }
        },
        sources: isMultiSourced
          ? [sources[srcIndex]]
          : sources,
      } : { ...defaultOptions, sources: [] };
  }, [isVideo, playerConfig, srcIndex]);

  if ((ready && videoJSOptions != undefined) || canvasIsEmpty) {
    return (
      <div
        data-testid="media-player"
        className="ramp--media_player"
        role="presentation"
      >
        <VideoJSPlayer
          enableFileDownload={enableFileDownload}
          enableTitleLink={enableTitleLink}
          isVideo={isVideo}
          options={videoJSOptions}
          placeholderText={error}
          scrubberTooltipRef={timeToolRef}
          tracks={tracks}
          trackScrubberRef={trackScrubberRef}
          videoJSLangMap={videoJSLangMap.current}
          withCredentials={withCredentials}
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
