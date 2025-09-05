import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJS/VideoJSPlayer';
import { playerHotKeys } from '@Services/utility-helpers';
import { useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { useErrorBoundary } from 'react-error-boundary';
import { IS_ANDROID, IS_IPAD, IS_IPHONE, IS_MOBILE, IS_SAFARI, IS_TOUCH_ONLY } from '@Services/browser';
import { useMediaPlayer, useSetupPlayer } from '@Services/ramp-hooks';
import { loadVideoJSLanguage } from '@Services/videojs-language-loader';

const PLAYER_ID = 'iiif-media-player';

/**
 * Parse resource related information form the current canvas in manifest,
 * and build an options object for Video.js using that information.
 * @param {Object} props
 * @param {Boolean} props.enableFileDownload
 * @param {Boolean} props.enablePIP
 * @param {Boolean} props.enablePlaybackRate
 * @param {Boolean} props.enableTitleLink
 * @param {Boolean} props.withCredentials
 * @param {String} props.language
 */
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

  const { srcIndex, playlist, structures } = manifestState;
  const { isPlaylist } = playlist;
  const { hasStructure } = structures;
  const { currentTime } = playerState;

  const trackScrubberRef = useRef();
  const timeToolRef = useRef();
  let videoJSLangMap = useRef('{}');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  const { canvasIsEmpty, canvasIndex, isMultiCanvased, lastCanvasIndex } = useMediaPlayer();

  const {
    isMultiSourced,
    isVideo,
    playerConfig,
    ready,
    renderingFiles,
    nextItemClicked,
    switchPlayer
  } = useSetupPlayer({ enableFileDownload, lastCanvasIndex, withCredentials });

  const { error, poster, sources, targets, tracks } = playerConfig;

  // Load Video.js language map using dynamic imports
  const loadVideoJSLanguageMap = useMemo(() => {
    return async () => {
      try {
        const languageData = await loadVideoJSLanguage(language);
        videoJSLangMap.current = JSON.stringify(languageData);
        setLanguageLoaded(true);
      } catch (error) {
        showBoundary(error);
      }
    };
  }, [language]);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        await loadVideoJSLanguageMap();
      } catch (e) {
        showBoundary(e);
      }
    };

    loadLanguage();
  }, [language]);

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
      // In iOS devices the player uses native iOS player either by default or on fullscreen-mode.
      // For instance where iOS player is used for playback, native text track functionality
      // needs to be turned ON for captions to work properly between VideoJS player and
      // iOS player. 
      // Therefore, turn on 'nativeTextTracks' option for browser and OS combinations
      // where the native iOS player is used by default or on fullscreen-mode.
      // i.e. Both Safari and Chrome on iPhones, only Chrome on iPads.
      html5: {
        nativeTextTracks: !IS_ANDROID && ((IS_IPAD && !IS_SAFARI) || IS_IPHONE)
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
      videoJSTitleLink: enableTitleLink,
      sources: [],
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
            'customControlSpacer', // Spacer element from VideoJS
            IS_MOBILE ? 'muteToggle' : 'volumePanel',
            (tracks.length > 0 && isVideo) ? 'subsCapsButton' : '',
            (hasStructure || isPlaylist) ? 'videoJSTrackScrubber' : '',
            'qualitySelector',
            enablePlaybackRate ? 'playbackRateMenuButton' : '',
            enablePIP ? 'pictureInPictureToggle' : '',
            enableFileDownload ? 'videoJSFileDownload' : '',
            'fullscreenToggle',
            // 'vjsYo',             custom component
          ],
          videoJSProgress: { nextItemClicked },
          // Make the volume slider horizontal for audio in non-mobile browsers
          volumePanel: !IS_MOBILE && { inline: !isVideo },
          videoJSCurrentTime: {
            srcIndex, targets, currentTime: currentTime || 0
          },
          videoJSFileDownload: enableFileDownload && {
            title: 'Download Files',
            controlText: 'Alternate resource download',
            files: renderingFiles,
          },
          videoJSPreviousButton: isMultiCanvased &&
            { canvasIndex, switchPlayer },
          videoJSNextButton: isMultiCanvased &&
            { canvasIndex, lastCanvasIndex, switchPlayer },
          videoJSTrackScrubber: (hasStructure || isPlaylist) &&
            { trackScrubberRef, timeToolRef, isPlaylist }
        },
        sources: isMultiSourced
          ? [sources[srcIndex]]
          : sources,
        errorDisplay: {
          // Show the close button for the error modal, if more than one source OR multiple 
          // canvases are available
          uncloseable: (sources?.length > 1 || isMultiCanvased) ? false : true,
        },
      } : { ...defaultOptions, sources: [] };
  }, [isVideo, playerConfig, srcIndex]);

  if (((ready && videoJSOptions != undefined && languageLoaded) || canvasIsEmpty)) {
    return (
      <div
        data-testid='media-player'
        className='ramp--media_player'
        role='complementary'
        aria-label='media player'
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
