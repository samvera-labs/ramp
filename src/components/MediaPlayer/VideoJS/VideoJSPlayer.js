import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import videojs from 'video.js';
import throttle from 'lodash/throttle';
import 'videojs-markers-plugin/dist/videojs-markers-plugin';
import 'videojs-markers-plugin/dist/videojs.markers.plugin.css';

require('@silvermine/videojs-quality-selector')(videojs);
import '@silvermine/videojs-quality-selector/dist/css/quality-selector.css';

import { usePlayerDispatch, usePlayerState } from '../../../context/player-context';
import { useManifestState, useManifestDispatch } from '../../../context/manifest-context';
import { checkSrcRange, getMediaFragment } from '@Services/utility-helpers';
import {
  IS_ANDROID, IS_IOS, IS_IPAD, IS_MOBILE,
  IS_SAFARI, IS_TOUCH_ONLY
} from '@Services/browser';
import { useLocalStorage } from '@Services/local-storage';
import { SectionButtonIcon } from '@Services/svg-icons';
import {
  useMediaPlayer, useSetupPlayer, useShowInaccessibleMessage, useVideoJSPlayer
} from '@Services/ramp-hooks';
import './VideoJSPlayer.scss';
import './videojs-theme.scss';

/** VideoJS custom components */
import VideoJSProgress from './components/js/VideoJSProgress';
import VideoJSCurrentTime from './components/js/VideoJSCurrentTime';
import VideoJSFileDownload from './components/js/VideoJSFileDownload';
import VideoJSNextButton from './components/js/VideoJSNextButton';
import VideoJSPreviousButton from './components/js/VideoJSPreviousButton';
import VideoJSTitleLink from './components/js/VideoJSTitleLink';
import VideoJSTrackScrubber from './components/js/VideoJSTrackScrubber';
// import vjsYo from './vjsYo';

/**
 * Module to setup VideoJS instance on initial page load and update
 * on successive player reloads on Canvas changes.
 * @param {Object} props
 * @param {Boolean} props.isVideo
 * @param {Boolean} props.isPlaylist
 * @param {Object} props.trackScrubberRef
 * @param {Object} props.scrubberTooltipRef
 * @param {Array} props.tracks
 * @param {String} props.placeholderText
 * @param {Array} props.renderingFiles
 * @param {Boolean} props.enableFileDownload
 * @param {Function} props.loadPrevOrNext
 * @param {Number} props.lastCanvasIndex
 * @param {Boolean} props.enableTitleLink
 * @param {String} props.videoJSLangMap
 * @param {Object} props.options
 */
function VideoJSPlayer({
  enableFileDownload,
  enableTitleLink,
  isVideo,
  options,
  placeholderText,
  scrubberTooltipRef,
  tracks,
  trackScrubberRef,
  videoJSLangMap,
  withCredentials,
}) {
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const manifestState = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const {
    canvasDuration,
    canvasLink,
    hasMultiItems,
    targets,
    autoAdvance,
    structures,
    canvasSegments,
  } = manifestState;
  const { hasStructure, structItems } = structures;
  const { clickedUrl, isEnded, isPlaying, currentTime } = playerState;

  const [startVolume, setStartVolume] = useLocalStorage('startVolume', 1);
  const [startMuted, setStartMuted] = useLocalStorage('startMuted', false);
  const [startCaptioned, setStartCaptioned] = useLocalStorage('startCaptioned', true);
  const [startQuality, setStartQuality] = useLocalStorage('startQuality', null);

  const videoJSRef = useRef(null);
  const captionsOnRef = useRef();
  const activeTextTrackRef = useRef();

  const { canvasIndex, canvasIsEmpty, lastCanvasIndex } = useMediaPlayer();
  const { isPlaylist, renderingFiles, srcIndex, switchPlayer }
    = useSetupPlayer({ enableFileDownload, withCredentials, lastCanvasIndex });
  const { messageTime } = useShowInaccessibleMessage({ lastCanvasIndex });

  const canvasIsEmptyRef = useRef();
  canvasIsEmptyRef.current = useMemo(() => { return canvasIsEmpty; }, [canvasIsEmpty]);

  const isEndedRef = useRef();
  isEndedRef.current = useMemo(() => { return isEnded; }, [isEnded]);

  const isPlayingRef = useRef();
  isPlayingRef.current = useMemo(() => { return isPlaying; }, [isPlaying]);

  const autoAdvanceRef = useRef();
  autoAdvanceRef.current = useMemo(() => { return autoAdvance; }, [autoAdvance]);

  const srcIndexRef = useRef();
  srcIndexRef.current = useMemo(() => { return srcIndex; }, [srcIndex]);

  const currentTimeRef = useRef();
  currentTimeRef.current = useMemo(() => { return currentTime; }, [currentTime]);

  const tracksRef = useRef();
  tracksRef.current = useMemo(() => { return tracks; }, [tracks]);

  const clickedUrlRef = useRef();
  clickedUrlRef.current = useMemo(() => { return clickedUrl; }, [clickedUrl]);

  /**
   * Setup player with player-related information parsed from the IIIF
   * Manifest Canvas. This gets called on both initial page load and each
   * Canvas switch to setup and update player respectively.
   * @param {Object} player current player instance from Video.js
   */
  const playerInitSetup = (player) => {
    player.on('ready', function () {
      console.log('Player ready');

      setControlBar(player);

      // Add this class in mobile/tablet devices to always show the control bar,
      // since the inactivityTimeout is flaky in some browsers
      if (IS_MOBILE || IS_IPAD) {
        player.controlBar.addClass('vjs-mobile-visible');
      }

      /**
       * When source is not supported in VideoJS handle re-direct the error to the
       * custom function in the 'error' event handler in this code.
       */
      if (player.error()) {
        player.trigger('error');
      } else {
        player.muted(startMuted);
        player.volume(startVolume);
        player.canvasIndex = cIndexRef.current;
        player.duration(canvasDuration);
        player.srcIndex = srcIndex;
        player.targets = targets;

        if (enableTitleLink) player.canvasLink = canvasLink;

        // Need to set this once experimentalSvgIcons option in Video.js options was enabled
        player.getChild('controlBar').qualitySelector.setIcon('cog');
      }
    });

    player.on('emptied', () => {
      /**
       * In the quality-selector plugin used in Ramp, when the player is using remote 
       * text tracks they get cleared upon quality selection.
       * This is a known issue with @silvermine/videojs-quality-selector plugin.
       * When a new source is selected this event is invoked. So, we are using this event
       * to check whether the current video player has tracks when tracks are available as
       * annotations in the Manifest and adding them back in.
       */
      if (tracksRef.current?.length > 0 && isVideo
        && player.textTracks()?.length <= tracksRef.current?.length) {
        // Remove any existing text tracks in Safari, as it handles tracks differently
        if (IS_SAFARI) {
          let oldTracks = player.remoteTextTracks();
          let i = oldTracks.length;
          while (i--) {
            player.removeRemoteTextTrack(oldTracks[i]);
          }
        }
        tracksRef.current.forEach(function (track) {
          // Enable the previously selected track and disable others (default)
          if (track.label == activeTextTrackRef.current?.label) {
            track.mode = 'showing';
          } else {
            track.mode = 'disabled';
          }
          player.addRemoteTextTrack(track, false);
        });
      }
    });
    player.on('progress', () => {
      // Reveal player if not revealed on 'loadedmetadata' event, allowing user to 
      // interact with the player since enough data is available for playback
      if (player.hasClass('vjs-disabled')) { player.removeClass('vjs-disabled'); }
    });
    player.on('canplay', () => {
      // Reset isEnded flag
      playerDispatch({ isEnded: false, type: 'setIsEnded' });
    });
    player.on('play', () => {
      playerDispatch({ isPlaying: true, type: 'setPlayingStatus' });
    });
    player.on('timeupdate', () => {
      handleTimeUpdate();
    });
    player.on('resize', () => {
      setControlBar(player);
    });
    player.on('ended', () => {
      /**
       * Checking against isReadyRef.current stops from delayed events being executed
       * when transitioning from a Canvas to the next.
       * Checking against isPlayingRef.current to distinguish whether this event
       * triggered intentionally, because Video.js seem to trigger this event when
       * switching to a media file with a shorter duration in Safari browsers.
       */
      setTimeout(() => {
        if (isReadyRef.current && isPlayingRef.current) {
          playerDispatch({ isEnded: true, type: 'setIsEnded' });
          player.pause();
          if (!canvasIsEmptyRef.current) handleEnded();
        }
      }, 100);
    });
    player.on('volumechange', () => {
      setStartMuted(player.muted());
      setStartVolume(player.volume());
    });
    /**
     * Setting 'isReady' to true triggers the 'videojs-markers' plugin to add track/playlist/search 
     * markers to the progress-bar.
     * When 'isReady' is set to true in the same event (loadedmetadata) where, player.load() is called for
     * Safari and iOS browsers, causes the player to reload after the markers are added.
     * This resets the player, causing the added markers to disppear. This is a known issue
     * of the 'videojs-markers' plugin.
     * Therefor, set 'isReady' to true in loadeddata event, which emits after player.load() is invoked.
     */
    player.on('loadeddata', function () {
      setIsReady(true);
      // Invoke timeupdate handler to update fragmentMarkers in the progress-bar
      handleTimeUpdate();
    });
    player.on('qualityRequested', (e, quality) => {
      setStartQuality(quality.label);
    });
    player.on('seeked', () => {
      /**
       * In Safari browsers, player.load() is called on 'loadeddata' event, because the player doesn't 
       * automatically reach a state where a user can scrub/seek before starting playback. This is not
       * an issue with other browsers.
       * When player.load() is called, the player gets reset undoing any seek/scrub activities performed
       * within that brief window of time. This can happen due to fast user reactions, slowed performance
       * of the browser, or network latency.
       * This code helps to store the seeked time in these scenarios and re-seek the player to the initial
       * seeked time-point on player.load() call.
       * Additional check for player.readyState() != 4 is to avoid this code block from executing when using
       * seek action to navigate to a timepoint in Annotations.
       */
      if (player.readyState() != 4 && player.currentTime() == 0
        && player.currentTime() != currentTimeRef.current) {
        player.currentTime(currentTimeRef.current);
      }
      /**
       * Use setTimeout to add dispatch action to update global state with the current time from 'seek' action,
       * to the event queue to be called when the current call stack is empty. 
       * This is needed to avoid the dispatch action from executing before the player's currentTime is updated.
       */
      setTimeout(() => {
        playerDispatch({ type: 'setCurrentTime', currentTime: player.currentTime() });
      }, 0);
    });
    // Use error event listener for inaccessible item display
    player.on('error', (e) => {
      const error = player.error();
      let errorMessage = 'Something went wrong. Please try again later or contact support for help.';
      // Handle different error codes
      switch (error.code) {
        case 1:
          console.error('MEDIA_ERR_ABORTED: The fetching process for the media resource was aborted by the user agent\
             at the user’s request.');
          break;
        case 2:
          errorMessage = 'The media could not be loaded due to a network error. Please try again later.';
          console.error('MEDIA_ERR_NETWORK: A network error caused the user agent to stop fetching the media resource,\
             after the resource was established to be usable.');
          break;
        case 3:
          errorMessage = 'Media is corrupt or has features not supported by the browser. \
          Please try a different media or contact support for help.';
          console.error('MEDIA_ERR_DECODE: An error occurred while decoding the media resource, after\
             the resource was established to be usable.');
          break;
        case 4:
          errorMessage = 'Media could not be loaded.  Network error or media format is not supported.';
          console.error('MEDIA_ERR_SRC_NOT_SUPPORTED: The media resource indicated by the src attribute was not suitable.');
          break;
        default:
          console.error('An unknown error occurred.');
          break;
      }
      // Show dismissable error display modal from Video.js
      var errorDisplay = player.getChild('ErrorDisplay');
      if (errorDisplay) {
        errorDisplay.contentEl().innerText = errorMessage;
        errorDisplay.removeClass('vjs-hidden');
        player.removeClass('vjs-error');
        player.removeClass('vjs-disabled');
      }
      e.stopPropagation();
    });
    playerLoadedMetadata(player);
  };

  /**
   * Set control bar width to offset 12px from left/right edges of player.
   * This is set on player.ready and player.resize events.
   * @param {Object} player 
   */
  const setControlBar = (player) => {
    const playerWidth = player.currentWidth();
    const controlBarWidth = playerWidth - 24;
    player.controlBar.width(`${controlBarWidth}px`);
  };

  /**
   * Update player properties and data when player is reloaded with
   * source change, i.e. Canvas change
   * @param {Object} player 
   */
  const updatePlayer = (player) => {
    player.duration(canvasDuration);
    player.src(options.sources);
    player.poster(options.poster);
    player.canvasIndex = cIndexRef.current;
    player.canvasIsEmpty = canvasIsEmptyRef.current;
    player.srcIndex = srcIndex;
    player.targets = targets;
    if (enableTitleLink) player.canvasLink = canvasLink;

    // Update textTracks in the player
    var oldTracks = player.remoteTextTracks();
    var i = oldTracks.length;
    while (i--) {
      player.removeRemoteTextTrack(oldTracks[i]);
    }
    if (tracks?.length > 0 && isVideo) {
      tracks.forEach(function (track) {
        player.addRemoteTextTrack(track, false);
      });
    }

    /*
      Update player control bar for;
       - track scrubber button
       - volume panel
       - if tracks exists: captions button for video players
       - appearance of the player: big play button and aspect ratio of the player 
        based on media type
       - file download menu
    */
    if (player.getChild('controlBar') != null && !canvasIsEmpty) {
      const controlBar = player.getChild('controlBar');
      // Index of the volumepanel/mutetoggle in the player's control bar
      const volumeIndex = IS_MOBILE
        ? controlBar.children().findIndex((c) => c.name_ == 'MuteToggle')
        : controlBar.children().findIndex((c) => c.name_ == 'VolumePanel');
      /*
        Track-scrubber button: remove if the Manifest is not a playlist manifest
        or the current Canvas doesn't have structure items. Or add back in if it's
        not present otherwise.
       */
      if (!(hasStructure || isPlaylist)) {
        controlBar.removeChild('videoJSTrackScrubber');
      } else if (!controlBar.getChild('videoJSTrackScrubber')) {
        // Add track-scrubber button after duration display if it is not available
        controlBar.addChild(
          'videoJSTrackScrubber',
          { trackScrubberRef, timeToolRef: scrubberTooltipRef },
          volumeIndex + 1
        );
      }
      /**
       * Volume panel display on desktop browsers:
       * For audio: volume panel is inline with a sticky volume slider
       * For video: volume panel is not inline.
       * For mobile devices the player uses MuteToggle for both audio
       * and video.
       */
      if (!IS_MOBILE) {
        controlBar.removeChild('volumePanel');
        controlBar.addChild('volumePanel', { inline: !isVideo }, volumeIndex);
        /* 
          Trigger ready event to reset the volume slider in the refreshed 
          volume panel. This is needed on player reload, since volume slider 
          is set on either 'ready' or 'volumechange' events.
        */
        player.trigger('volumechange');
      }

      if (tracks?.length > 0 && isVideo && !controlBar.getChild('subsCapsButton')) {
        let subsCapBtn = controlBar.addChild(
          'subsCapsButton', {}, volumeIndex + 1
        );
        // Add CSS to mark captions-on
        subsCapBtn.children_[0].addClass('captions-on');
      }

      /*
        Change player's appearance when switching between audio and video canvases.
        For audio: player height is reduced and big play button is removed
        For video: player aspect ratio is set to 16:9 and has the centered big play button
      */
      if (!isVideo) {
        player.audioOnlyMode(true);
        player.addClass('vjs-audio');
        player.height(player.controlBar.height());
        player.removeChild('bigPlayButton');
      } else {
        player.audioOnlyMode(false);
        player.removeClass('vjs-audio');
        player.aspectRatio('16:9');
        player.addChild('bigPlayButton');
      }

      if (enableFileDownload) {
        const fileDownloadIndex = controlBar.children()
          .findIndex((c) => c.name_ == 'VideoJSFileDownload') || fullscreenIndex + 1;
        controlBar.removeChild('videoJSFileDownload');

        if (renderingFiles?.length > 0) {
          const fileOptions = {
            title: 'Download Files',
            controlText: 'Alternate resource download',
            files: renderingFiles
          };
          controlBar.addChild('videoJSFileDownload', { ...fileOptions },
            fileDownloadIndex
          );
        }
      }
    }

    /**
     * Set structStart variable in the updated player to update the progressBar with the
     * correct time when using StructuredNavigation to switch between canvases.
     * Set this before loadedmetadata event, because progress-bar uses this value in the
     * update() function before that event emits.
     */
    player.structStart = currentTimeRef.current;

    playerLoadedMetadata(player);
  };

  /**
   * Setup on loadedmetadata event is broken out of initial setup function,
   * since this needs to be called when reloading the player on Canvas change
   * @param {Object} player Video.js player instance
   */
  const playerLoadedMetadata = (player) => {
    player.one('loadedmetadata', () => {
      console.log('Player loadedmetadata');

      // Update control-bar width on player reload
      setControlBar(player);

      player.duration(canvasDuration);

      /**
       * By default VideoJS instance doesn't load enough data on page load for Safari browsers,
       * to seek to timepoints using structured navigation/markers. Therefore, force the player
       * reach a ready state, where enough information is available for the user to use these
       * functionalities by invoking player.load().
       * This is especially required, when player/tab is muted for audio players in Safari.
       * Since, it is not possible to detect muted tabs in JS the condition avoids
       * checking for muted state altogether.
       * Without this, Safari will not reach player.readyState() = 4, the state
       * which indicates the player that enough data is available on the media
       * for playback.
       * Have this execute before handling player events, so that the player functions as
       * expected across all browsers.
       */
      if ((IS_SAFARI || IS_IOS) && player.readyState() != 4) {
        player.load();
      }

      isEndedRef.current ? player.currentTime(0) : player.currentTime(currentTimeRef.current);

      if (isEndedRef.current || isPlayingRef.current) {
        /*
          iOS devices lockdown the ability for unmuted audio and video media to autoplay.
          They accomplish this by capturing any programmatic play events and returning
          a rejected Promise. In certain versions of iOS, this rejected promise would
          cause a runtime error within Ramp. This error would cause the error boundary
          handling to trigger, forcing a user to reload the player/page. By silently 
          catching the rejected Promise we are able to provide a more seamless user
          experience, where the user can manually play the media or change to a different
          section.
         */
        var promise = player.play();

        if (promise !== undefined) {
          promise.then(_ => {
            // Autoplay
          }).catch(error => {
            // Prevent error from triggering error boundary
          });
        }
      }

      if (isVideo) { setUpCaptions(player); }

      /*
        Set playable duration within the given media file and alternate start time as
        player properties. These values are read by track-scrubber component to build
        and update the track-scrubber progress and time in the UI.
      */
      const mediaRange = getMediaFragment(player.src(), canvasDuration);
      if (mediaRange != undefined) {
        player.playableDuration = mediaRange.end - mediaRange.start;
        player.altStart = mediaRange.start;
      } else {
        player.playableDuration = canvasDuration;
        player.altStart = targets[srcIndex].altStart;
      }

      player.canvasIndex = cIndexRef.current;

      /**
       * Update currentNavItem on loadedmetadata event in Safari, as it doesn't 
       * trigger the 'timeupdate' event intermittently on load.
       */
      if (IS_SAFARI) {
        handleTimeUpdate();
      }

      // Reveal player if not revealed on 'progress' event, allowing user to 
      // interact with the player since enough data is available for playback
      if (player.hasClass('vjs-disabled')) { player.removeClass('vjs-disabled'); }
    });
  };

  const {
    activeId, fragmentMarker, isReadyRef, playerRef, setActiveId, setFragmentMarker, setIsReady
  } = useVideoJSPlayer({
    options, playerInitSetup, updatePlayer, startQuality, tracks, videoJSRef, videoJSLangMap
  });

  let cIndexRef = useRef();
  cIndexRef.current = useMemo(() => { return canvasIndex; }, [canvasIndex]);

  const activeIdRef = useRef();
  activeIdRef.current = useMemo(() => { return activeId; }, [activeId]);

  /**
   * Setup captions for the player based on context
   * @param {Object} player Video.js player instance
   */
  const setUpCaptions = (player) => {
    let textTracks = player.textTracks();
    /* 
      Filter the text track Video.js adds with an empty label and language 
      when nativeTextTracks are enabled for iPhones and iPads.
      Related links, Video.js => https://github.com/videojs/video.js/issues/2808 and
      in Apple => https://developer.apple.com/library/archive/qa/qa1801/_index.html
    */
    if (IS_MOBILE && !IS_ANDROID) {
      textTracks.on('addtrack', () => {
        for (let i = 0; i < textTracks.length; i++) {
          if (textTracks[i].language === '' && textTracks[i].label === '') {
            player.textTracks().removeTrack(textTracks[i]);
          }
          /**
           * This enables the caption in the native iOS player first playback.
           * Only enable caption when captions are turned on.
           * First caption is already turned on in the code block below, so read it
           * from activeTrackRef
           */
          if (startCaptioned && activeTextTrackRef.current) {
            textTracks.tracks_.filter(t =>
              t.label === activeTextTrackRef.current.label
              && t.language === activeTextTrackRef.current.language)[0].mode = 'showing';
          }

        }
      });
    }

    // Turn first caption/subtitle ON and turn captions ON indicator via CSS on first load
    if (textTracks.tracks_?.length > 0) {
      let firstSubCap = null;
      // Flag to identify first valid caption for resource
      let onFirstCap = false;
      // Disable all text tracks to avoid multiple selections and pick the first one as default
      for (let i = 0; i < textTracks.tracks_.length; i++) {
        let t = textTracks.tracks_[i];
        if ((t.kind === 'subtitles' || t.kind === 'captions') && (t.language != '' && t.label != '')) {
          t.mode = 'disabled';
          if (!onFirstCap) firstSubCap = t;
          onFirstCap = true;
        }
      }

      // Enable the first caption when captions are enabled in the session
      if (firstSubCap && startCaptioned) {
        ;
        firstSubCap.mode = 'showing';
        activeTextTrackRef.current = firstSubCap;
        handleCaptionChange(true);
      }
    }

    // Add/remove CSS to indicate captions/subtitles is turned on
    textTracks.on('change', () => {
      let trackModes = [];
      for (let i = 0; i < textTracks.tracks_.length; i++) {
        const { mode, label, kind } = textTracks[i];
        trackModes.push(textTracks[i].mode);
        if (mode === 'showing' && label != ''
          && (kind === 'subtitles' || kind === 'captions')) {
          activeTextTrackRef.current = textTracks[i];
        }
      }
      const subsOn = trackModes.includes('showing') ? true : false;
      handleCaptionChange(subsOn);
      setStartCaptioned(subsOn);
    });
  };

  /**
   * Add CSS class to icon to indicate captions are on/off in player control bar
   * @param {Boolean} subsOn flag to indicate captions are on/off
   */
  const handleCaptionChange = (subsOn) => {
    let player = playerRef.current;
    /**
     * When subsCapsButton is not setup on Video.js initialization step, and is 
     * later added in updatePlayer() function player.controlBar.getChild() method
     * needs to be used to access it.
     */
    const subsCapsBtn = player.controlBar.getChild('subsCapsButton');
    /* 
      For audio instances Video.js is setup to not to build the CC button 
      in Ramp's player control bar.
    */
    if (subsCapsBtn == undefined || !subsCapsBtn || !subsCapsBtn?.children_) {
      return;
    }
    if (subsOn) {
      subsCapsBtn.children_[0].addClass('captions-on');
      captionsOnRef.current = true;
    } else {
      subsCapsBtn.children_[0].removeClass('captions-on');
      captionsOnRef.current = false;
      // Clear active text track
      activeTextTrackRef.current = null;
    }
  };

  /**
   * Handle the 'ended' event fired by the player when a section comes to
   * an end. If there are sections ahead move onto the next canvas and
   * change the player and the state accordingly.
   * Throttle helps to cancel the delayed function call triggered by ended event and
   * load the correct item into the player, when the user clicks on a different item 
   * (not the next item in list) when the current item is coming to its end.
   */
  const handleEnded = useMemo(() => throttle(() => {
    const isLastCanvas = cIndexRef.current === lastCanvasIndex;
    /**
     * Do nothing if Canvas is not multi-sourced AND autoAdvance is turned off 
     * OR current Canvas is the last Canvas in the Manifest
     */
    if ((!autoAdvanceRef.current || isLastCanvas) && !hasMultiItems) {
      return;
    } else {
      // Remove all the existing structure related markers in the player
      if (playerRef.current && playerRef.current.markers) {
        playerRef.current.pause();
        setFragmentMarker(null);
        playerRef.current.markers.removeAll();
      }
      if (hasMultiItems) {
        // When there are multiple sources in a single canvas
        // advance to next source
        if (srcIndex + 1 < targets.length) {
          manifestDispatch({ srcIndex: srcIndex + 1, type: 'setSrcIndex' });
          playerDispatch({ currentTime: 0, type: 'setCurrentTime' });
          playerRef.current.play();
        } else {
          return;
        }
      } else if (structItems?.length > 0) {
        const nextItem = structItems[cIndexRef.current + 1];

        if (nextItem) {
          manifestDispatch({
            canvasIndex: cIndexRef.current + 1,
            type: 'switchCanvas',
          });

          // Reset startTime and currentTime to zero
          playerDispatch({ startTime: 0, type: 'setTimeFragment' });
          playerDispatch({ currentTime: 0, type: 'setCurrentTime' });

          // Get first timespan in the next canvas
          let firstTimespanInNextCanvas = canvasSegments.filter(
            (t) => t.canvasIndex === nextItem.canvasIndex && t.itemIndex === 1
          );
          // If the nextItem doesn't have an ID (a Canvas media fragment) pick the first timespan
          // in the next Canvas
          let nextFirstItem = nextItem.id != undefined ? nextItem : firstTimespanInNextCanvas[0];
          let start = 0;
          if (nextFirstItem != undefined && nextFirstItem.id != undefined) {
            start = nextFirstItem.times.start;
          }

          // If there's a timespan item at the start of the next canvas
          // mark it as the currentNavItem. Otherwise empty out the currentNavItem.
          if (start === 0) {
            manifestDispatch({ item: nextFirstItem, type: 'switchItem' });
          } else if (nextFirstItem.isEmpty) {
            // Switch the currentNavItem and clear isEnded flag
            manifestDispatch({ item: nextFirstItem, type: 'switchItem' });
            playerRef.current.currentTime(start);
            // Only play if the next item is not an inaccessible item
            if (!nextItem.isEmpty) playerRef.current.play();
          }
        }
      }
    }
  }), [cIndexRef.current]);

  /**
   * Handle the 'timeUpdate' event emitted by VideoJS player.
   * The current time of the playhead used to show structure in the player's
   * time rail as the playhead arrives at a start time of an existing structure
   * item. When the current time is inside an item, that time fragment is highlighted
   * in the player's time rail.
   * Using throttle helps for smooth updates by cancelling and cleaning up intermediate
   * delayed function calls.
   */
  const handleTimeUpdate = useMemo(() => throttle(() => {
    const player = playerRef.current;
    if (player && isReadyRef.current) {
      let playerTime = player.currentTime() ?? currentTimeRef.current;

      if (hasMultiItems && srcIndexRef.current > 0) {
        playerTime = playerTime + targets[srcIndexRef.current].altStart;
      }
      const activeSegment = getActiveSegment(playerTime);
      // the active segment has changed
      if (activeIdRef.current !== activeSegment?.id) {
        if (!activeSegment) {
          /**
           * Clear currentNavItem and other related state variables to update the tracker
           * in structure navigation and highlights within the player.
           */
          manifestDispatch({ item: null, type: 'switchItem' });
          setActiveId(null);
          setFragmentMarker(null);
        } else {
          // Set the active segment in state
          manifestDispatch({ item: activeSegment, type: 'switchItem' });
          setActiveId(activeSegment.id);

          if (!isPlaylist && player.markers) {
            const { start, end } = activeSegment.times;
            playerDispatch({ endTime: end, startTime: start, type: 'setTimeFragment' });
            if (start !== end) {
              // don't let marker extend past the end of the canvas
              let markerEnd = end > activeSegment.canvasDuration ? activeSegment.canvasDuration : end;
              setFragmentMarker({
                time: start,
                duration: markerEnd - start,
                text: start,
                class: 'ramp--track-marker--fragment'
              });
            } else { // to prevent zero duration fragments I suppose
              setFragmentMarker(null);
            }
          } else if (fragmentMarker !== null) {
            setFragmentMarker(null);
          }
        }
      }
      /**
       * Active segment is re-calculated on 'timeupdate' event. This active segment is then, used to
       * update the active timespan in StrucutredNavigation component and to enable time-rail
       * highlight for structure within the player using fragmentMarkers.
       * When playback is happening uninterrupted by StructuredNavigation, the most granular timespan
       * gets highlighted in both places if there are overlapping timespans (default behavior).
       * When structured navigation is used during playback, the clicked timespan should take
       * precedence over the above behavior to visualize the user interaction. For this, 'getActiveSegment'
       * in the above code uses 'clickedUrl' (media-fragment of the clicked timespan) global state variable
       * to filter the active segment.
       * Once player's currentTime gets out of range of the last clicked timespan,
       * clear 'clickedUrl' in global state to enable the default behavior in creating highlights 
       * and clear player.structStart used for progress updates in iOS native player.
       */
      if (clickedUrlRef.current) {
        const { start, end } = getMediaFragment(clickedUrlRef.current, player.duration);
        if (player.currentTime() < start || player.currentTime() > end) {
          playerDispatch({ type: 'clearClickedUrl' });
          player.structStart = player?.targets[0]?.start ?? 0;
        }
      }
    };
  }, 10), []);

  /**
   * Toggle play/pause on video touch for mobile browsers
   * @param {Object} e onTouchEnd event
   */
  const mobilePlayToggle = (e) => {
    const player = playerRef.current;
    if (e.changedTouches[0].clientX == touchX && e.changedTouches[0].clientY == touchY) {
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    }
  };

  /**
   * Save coordinates of touch start for comparison to touch end to prevent play/pause
   * when user is scrolling.
   * @param {Object} e onTouchStart event
   */
  let touchX = null;
  let touchY = null;
  const saveTouchStartCoords = (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  };

  /**
   * Get the segment, which encapsulates the current time of the playhead,
   * from a list of media fragments in the current canvas.
   * @param {Number} time playhead's current time
   */
  const getActiveSegment = (time) => {
    if (isPlaylist) {
      // For playlists timespans and canvasIdex are mapped one-to-one
      return canvasSegments[cIndexRef.current];
    } else {
      // Segments that contains the current time of the player
      let possibleActiveSegments = canvasSegments.filter((c) => {
        const inCanvas = checkSrcRange(c.times, c.canvasDuration);
        if (inCanvas && time >= c.times.start && time < c.times.end) {
          return c;
        }
      });
      /**
       * If the last clicked timespan is a possibly active segment, then remove others.
       * This prioritizes and visualizes user interactions with StructuredNavigation. 
       */
      if (clickedUrlRef.current) {
        const clickedSegment = possibleActiveSegments.filter((s) => s.id === clickedUrlRef.current);
        possibleActiveSegments = clickedSegment?.length > 0 ? clickedSegment : possibleActiveSegments;
      }
      // Find the relevant media segment from given possibilities
      for (let segment of possibleActiveSegments) {
        const { isCanvas, canvasDuration, canvasIndex, times } = segment;
        if (canvasIndex == cIndexRef.current + 1) {
          // Canvases without structure has the Canvas information
          // in Canvas-level item as a navigable link
          if (isCanvas) {
            return segment;
          }
          const isInRange = checkSrcRange(times, canvasDuration);
          const isInSegment = time >= times.start && time < times.end;
          if (isInSegment && isInRange) {
            return segment;
          }
        }
      }
      return null;
    }
  };

  /**
   * Click event handler for previous/next buttons in inaccessible
   * message display
   * @param {Number} c updated Canvas index upon event trigger
   */
  const handlePrevNextClick = (c) => {
    switchPlayer(c, true);
  };

  /**
   * Keydown event handler for previou/next buttons in inaccessible
   * message display.
   * IMPORTANT: btnName param should be either 'nextBtn' or 'previousBtn'
   * @param {Event} e keydown event
   * @param {Number} c update Canvas index upon event trigger
   * @param {String} btnName name of the pressed button
   */
  const handlePrevNextKeydown = (e, c, btnName) => {
    if (e.which === 32 || e.which === 13) {
      switchPlayer(c, true, btnName);
    }
  };

  return (
    <div>
      <div data-vjs-player data-canvasindex={cIndexRef.current}>
        {canvasIsEmptyRef.current && (
          <div data-testid="inaccessible-message-display"
            // These styles needs to be inline for the poster to display within the Video boundaries
            style={{
              position: !playerRef.current ? 'relative' : 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              fontSize: 'medium', textAlign: 'center',
              color: '#fff', backgroundColor: 'black',
              zIndex: 101,
              aspectRatio: !playerRef.current ? '16/9' : '',
            }}>
            <p className="ramp--media-player_inaccessible-message-content" data-testid="inaccessible-message-content"
              dangerouslySetInnerHTML={{ __html: placeholderText }}>
            </p>
            {lastCanvasIndex > 0 &&
              <div className="ramp--media-player_inaccessible-message-buttons"
                data-testid="inaccessible-message-buttons">
                {canvasIndex >= 1 &&
                  <button aria-label="Go back to previous item"
                    onClick={() => handlePrevNextClick(canvasIndex - 1)}
                    onKeyDown={(e) => handlePrevNextKeydown(e, canvasIndex - 1, 'previousBtn')}
                    data-testid="inaccessible-previous-button">
                    <SectionButtonIcon flip={true} /> Previous
                  </button>
                }
                {canvasIndex != lastCanvasIndex &&
                  <button aria-label="Go to next item"
                    onClick={() => handlePrevNextClick(canvasIndex + 1)}
                    onKeyDown={(e) => handlePrevNextKeydown(e, canvasIndex + 1, 'nextBtn')}
                    data-testid="inaccessible-next-button">
                    Next <SectionButtonIcon />
                  </button>
                }
              </div>
            }
            {canvasIndex != lastCanvasIndex && lastCanvasIndex > 0 &&
              <p data-testid="inaccessible-message-timer"
                className={cx(
                  'ramp--media-player_inaccessible-message-timer',
                  autoAdvanceRef.current ? '' : 'hidden'
                )}>
                {`Next item in ${messageTime} second${messageTime === 1 ? '' : 's'}`}
              </p>}
          </div>
        )}
        <video
          data-testid={`videojs-${isVideo ? 'video' : 'audio'}-element`}
          data-canvasindex={cIndexRef.current}
          ref={videoJSRef}
          className={cx(
            'video-js vjs-big-play-centered vjs-theme-ramp vjs-disabled',
            IS_ANDROID ? 'is-mobile' : ''
          )}
          onTouchStart={saveTouchStartCoords}
          onTouchEnd={mobilePlayToggle}
          style={{ display: `${canvasIsEmptyRef.current ? 'none' : ''}` }}
        >
        </video>
      </div>
      {(hasStructure || isPlaylist) &&
        (<div className="vjs-track-scrubber-container hidden" ref={trackScrubberRef} id="track_scrubber">
          <p className="vjs-time track-currenttime" role="presentation"></p>
          <span type="range" aria-label="Track scrubber" role="slider" tabIndex={0}
            className="vjs-track-scrubber" style={{ width: '100%' }}>
            {!IS_TOUCH_ONLY && (
              <span className="tooltiptext" ref={scrubberTooltipRef} aria-hidden={true} role="presentation"></span>)
            }
          </span>
          <p className="vjs-time track-duration" role="presentation"></p>
        </div>)
      }
    </div >
  );
};

VideoJSPlayer.propTypes = {
  enableFileDownload: PropTypes.bool,
  enableTitleLink: PropTypes.bool,
  isVideo: PropTypes.bool,
  options: PropTypes.object,
  placeholderText: PropTypes.string,
  scrubberTooltipRef: PropTypes.object,
  tracks: PropTypes.array,
  trackScrubberRef: PropTypes.object,
  videoJSLangMap: PropTypes.string,
  withCredentials: PropTypes.bool,
};

export default VideoJSPlayer;
