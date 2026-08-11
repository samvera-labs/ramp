import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from '@Components/MediaPlayer/VideoJS/VideoJSPlayer';
import { playerHotKeys } from '@Services/utility-helpers';
import { useManifestState, useManifestDispatch } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { useErrorBoundary } from 'react-error-boundary';
import { IS_ANDROID, IS_IPAD, IS_IPHONE, IS_MOBILE, IS_SAFARI, IS_TOUCH_ONLY } from '@Services/browser';
import { useMediaPlayer, useSetupPlayer } from '@Services/ramp-hooks';
import { loadVideoJSLanguage } from '@Services/videojs-language-loader';
import { requestLogout } from '@Services/auth-service';

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
 * @param {Object} props.resumeCache
 * @param {Boolean} props.resumeCache.enable
 * @param {Number} props.resumeCache.ttlDays
 * @param {Number} props.resumeCache.maxItems
 * @param {Boolean} props.showWaveform
 */
const MediaPlayer = ({
  enableFileDownload = false,
  enablePIP = false,
  enablePlaybackRate = false,
  enableTitleLink = false,
  withCredentials = false,
  language = 'en',
  resumeCache = { enable: false, ttlDays: 30, maxItems: 200 },
  showWaveform = false,
}) => {
  const manifestState = useManifestState();
  const manifestDispatch = useManifestDispatch();
  const playerState = usePlayerState();
  const { showBoundary } = useErrorBoundary();

  const { srcIndex, playlist, structures, auth, allCanvases, waveform } = manifestState;
  const { isPlaylist } = playlist;
  const { hasStructure } = structures;
  const { currentTime } = playerState;

  /* Enable VideoJSWaveform control when 'showWaveform' is turned ON 
  and the current Canvas has a waveform */
  const enableWaveform = waveform?.data != null && showWaveform;

  /* React Refs for external UI DOM elements created in VideoJSPlayer that are referenced in
  VideoJS's custom components. e.g.: trackScrubberRef in VideoJSTrackScrubber */
  const trackScrubberRef = useRef();
  const timeToolRef = useRef();
  const waveformRef = useRef();

  let videoJSLangMap = useRef('{}');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  const { canvasIsEmpty, canvasIndex, isMultiCanvased, lastCanvasIndex, resetPlayerContainer } = useMediaPlayer();
  const authService = allCanvases[canvasIndex]?.authService ?? null;

  const {
    isMultiSourced,
    isVideo,
    playerConfig,
    ready,
    renderingFiles,
    nextItemClicked,
    switchPlayer
  } = useSetupPlayer({ enableFileDownload, lastCanvasIndex, withCredentials });

  const { error, poster, sources, targets, tracks, audioDescTracks } = playerConfig;

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
        nativeTextTracks: !IS_ANDROID && ((IS_IPAD && !IS_SAFARI) || IS_IPHONE),
        vhs: {
          // Stop VHS from retrying CORS-blocked/403 HLS manfiests indefinitely
          maxPlaylistRetries: 0,
        },
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
            (audioDescTracks.length > 0 && isVideo) ? 'videoJSADButton' : '',
            (hasStructure || isPlaylist) ? 'videoJSTrackScrubber' : '',
            enableWaveform ? 'videoJSWaveform' : '',
            'qualitySelector',
            enablePlaybackRate ? 'playbackRateMenuButton' : '',
            enablePIP ? 'pictureInPictureToggle' : '',
            enableFileDownload ? 'videoJSFileDownload' : '',
            (auth.status === 'authorized' && !isVideo) ? 'VideoJSAuthMenu' : '',
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
          VideoJSAuthMenu: (auth.status === 'authorized' && !isVideo) && {
            title: 'Authenticated',
            label: authService?.logoutService?.label,
            onLogout: () => {
              resetPlayerContainer();
              requestLogout(authService.logoutService.id);
              manifestDispatch({ type: 'logout' });
            },
          },
          videoJSPreviousButton: isMultiCanvased &&
            { canvasIndex, switchPlayer },
          videoJSNextButton: isMultiCanvased &&
            { canvasIndex, lastCanvasIndex, switchPlayer },
          videoJSTrackScrubber: (hasStructure || isPlaylist) &&
            { trackScrubberRef, timeToolRef, isPlaylist },
          videoJSWaveform: enableWaveform && { waveformRef },
          videoJSADButton: (audioDescTracks.length > 0) && { audioDescTracks }
        },
        // Only pass along the sources with access in VideoJS options
        sources: (authService && auth?.status !== 'authorized')
          ? []
          : (isMultiSourced ? [sources[srcIndex]] : sources),
        errorDisplay: {
          // Show the close button for the error modal, if more than one source OR multiple 
          // canvases are available
          uncloseable: (sources?.length > 1 || isMultiCanvased) ? false : true,
        },
      } : { ...defaultOptions, sources: [] };
  }, [isVideo, playerConfig, srcIndex, authService, auth]);

  if (((ready && videoJSOptions != undefined && languageLoaded) || canvasIsEmpty)) {
    return (
      <div
        data-testid='media-player'
        className='ramp--media_player'
        role='complementary'
        aria-label='media player'
      >
        <VideoJSPlayer
          audioDescTracks={audioDescTracks}
          enableFileDownload={enableFileDownload}
          enableTitleLink={enableTitleLink}
          isVideo={isVideo}
          options={videoJSOptions}
          placeholderText={error}
          resumeCache={resumeCache}
          scrubberTooltipRef={timeToolRef}
          tracks={tracks}
          trackScrubberRef={trackScrubberRef}
          videoJSLangMap={videoJSLangMap.current}
          waveformConfig={{ waveformRef, showWaveform }}
          withCredentials={withCredentials}
        />
      </div>
    );
  } else {
    return null;
  }
};

MediaPlayer.propTypes = {
  /** Adds the file download button for files listed in the active Canvas's `rendering` property in the player's control-bar.
   * When enabled, this button displays a dropdown menu of files and allows the user to download them.
   * This is a custom VideoJS component added to the VideoJS instance in Ramp.  */
  enableFileDownload: PropTypes.bool,
  /** Adds VideoJS's built-in Picture-in-Picture control in the player's control-bar. When enabled VideoJS's built-in
   * Picture-In-Picture functionality allows user to enable PiP playback and other functionalities.
   * This is only enabled if the current browser supports Picture-In-Picture functionality. */
  enablePIP: PropTypes.bool,
  /** Adds VideoJS's built-in playback rate control in the player's control-bar. This provides a menu with playback speed
   * options 0.5x, 0.75x, 1x, 1.5x, and 2x. (**added in `@samvera/ramp@3.2.0`**). */
  enablePlaybackRate: PropTypes.bool,
  /** Adds a title bar to the video player linking to the active Canvas. The title bar displays a text
   * `<Manifest label> - <Active Canvas label>` with an href attribute pointing to the active Canvas's URL. 
   * This is a custom VideoJS component added to the VideoJS instance in Ramp (**added in `@samvera/ramp@3.2.0`**). */
  enableTitleLink: PropTypes.bool,
  /** Includes authentication/cookie headers with XHR requests for VideoJS streaming. This requires appropriate CORS headers on the server.
   * Setting this to `true` causes the VideoJS component to include any available `Authentication` and `Cookie` headers with 
   * [XHR requests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials).
   * There are special server-side CORS requirements that go along with this option – specifically, the streaming server should
   * include an appropriate [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)
   * header, and a non-wildcard [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
   * specifying the server originating the request (**added in `@samvera/ramp@3.2.0`**). */
  withCredentials: PropTypes.bool,
  /** IANA language code for the translations of the player controls, which defaults to English (`'en'`).
   * Set the desired language as a [standard language code](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).
   * If the given language code doesn't match with any of the existing language files in VideoJS, Ramp defaults to English language. This only provides
   * the language for the in-built VideoJS player controls at the moment (**added in `@samvera/ramp@3.3.0`**). */
  language: PropTypes.string,
  /** Saves and restores playback position per Manifest using localStorage, which is disabled by default.
   * When `resumeCache.enable`is set to `true`, the player saves and restores the playback position per Manifest using the browser's `localStorage`,
   * storing the most recently active Canvas URL and playback time for each Manifest.
   * The `ttlDays` property sets how many days a saved position is retained before expiring, and `maxItems` limits the number of Manifest entries
   * stored using an LRU eviction strategy.
   * When `resumeCache.enable` is set to `false`, any previously saved positions are cleared from storage. If the prop is initialized partially,
   * Ramp applies default prop values to the rest of the properties (**added in `@samvera/ramp@5.1.0`**). */
  resumeCache: PropTypes.shape({
    enable: PropTypes.bool,
    ttlDays: PropTypes.number,
    maxItems: PropTypes.number,
  }),
  /** Adds a toggle control to the player's control-bar to turn ON/OFF waveform display panel. When this is enabled, the MediaPlayer checks if the
   * active Canvas has a waveform representation of its media attached via a 'seeAlso' or 'accompanyingCanvas' property before displaying the player
   * control in the player's control-bar. When the toggle is ON, a panel is shown beneath the player similar to track-scrubber to display the waveform
   * data (**NEXT_RELEASE**). */
  showWaveform: PropTypes.bool,
};

export default MediaPlayer;
