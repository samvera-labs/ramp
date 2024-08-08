import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSTrackScrubber.scss';
import '../styles/VideoJSProgress.scss';
import { timeToHHmmss } from '@Services/utility-helpers';
import { IS_MOBILE, IS_IPAD } from '@Services/browser';
import { TrackScrubberZoomInIcon, TrackScrubberZoomOutIcon } from '@Services/svg-icons';

const vjsComponent = videojs.getComponent('Component');

/**
 * Custom VideoJS component for displaying track view when
 * there are tracks/structure timespans in the current Canvas
 * @param {Object} options
 * @param {Number} options.trackScrubberRef React ref to track scrubber element
 * @param {Number} options.timeToolRef React ref to time tooltip element
 * @param {Boolean} options.isPlaylist flag to indicate a playlist Manifest or not
 */
class VideoJSTrackScrubber extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'videojs-track-scrubber-button');
    this.addClass('vjs-track-scrubber');

    this.mount = this.mount.bind(this);
    this.options = options;
    this.player = player;

    /* 
      When player is fully built and the trackScrubber element is initialized,
      call method to mount React component.
    */
    if (this.options.trackScrubberRef.current && this.el_) {
      player.on('loadstart', () => {
        this.mount();
      });

      /* Remove React root when component is destroyed */
      this.on('dispose', () => {
        ReactDOM.unmountComponentAtNode(this.el());
      });
    }
  }

  mount() {
    ReactDOM.render(
      <TrackScrubberButton
        player={this.player}
        trackScrubberRef={this.options.trackScrubberRef}
        timeToolRef={this.options.timeToolRef}
        isPlaylist={this.options.isPlaylist}
      />,
      this.el()
    );
  }
}

/**
 * Build the track scrubber component UI and its user interactions.
 * Some of the calculations and code are extracted from the MediaElement lil' scrubber
 * plugin implementation in the Avalon code:
 * https://github.com/avalonmediasystem/avalon/blob/4040e7e61a5d648a500096e80fe2883beef5c46b/app/assets/javascripts/media_player_wrapper/mejs4_plugin_track_scrubber.es6
 * @param {Object} param0 props from the component
 * @param {obj.player} player current VideoJS player instance
 * @param {obj.trackScrubberRef} trackScrubberRef React ref to track scrubber element
 * @param {obj.timeToolRef} timeToolRef React ref to time tooltip element
 * @param {obj.isPlaylist} isPlaylist flag to indicate a playlist Manifest or not
 * @returns 
 */
function TrackScrubberButton({ player, trackScrubberRef, timeToolRef, isPlaylist }) {
  const [zoomedOut, setZoomedOut] = React.useState(true);
  const [currentTrack, _setCurrentTrack] = React.useState({});

  let currentTrackRef = React.useRef();
  const setCurrentTrack = (t) => {
    currentTrackRef.current = t;
    _setCurrentTrack(t);
  };

  let playerEventListener;

  React.useEffect(() => {
    // Hide the timetooltip on mobile/tablet devices
    if ((IS_IPAD || IS_MOBILE) && timeToolRef.current) {
      timeToolRef.current.style.display = 'none';
    }
    playerEventListener = setInterval(() => {
      timeUpdateHandler();
    }, 100);
    if (player.canvasIsEmpty) { setZoomedOut(true); }
  }, [player.src(), player.srcIndex, player.canvasIsEmpty]);

  /**
   * Keydown event handler for the track button on the player controls,
   * when using keyboard navigation
   * @param {Event} e keydown event
   */
  const handleTrackScrubberKeyDown = (e) => {
    if (e.which === 32 || e.which === 13) {
      e.preventDefault();
      handleTrackScrubberClick();
      e.stopPropagation();
    }
  };

  /**
   * Click event handler for the track button on the player controls
   */
  const handleTrackScrubberClick = () => {
    // When player is not fully loaded on the page don't show the track scrubber
    if (!trackScrubberRef.current || !currentTrackRef.current) return;

    // If player is fullscreen exit before displaying track scrubber
    if (player.isFullscreen()) {
      player.exitFullscreen();
    }
    setZoomedOut(zoomedOut => !zoomedOut);
  };

  /**
   * Listen to zoomedOut state variable changes to show/hide track scrubber
   */
  React.useEffect(() => {
    if (trackScrubberRef.current) {
      if (zoomedOut) {
        trackScrubberRef.current.classList.add('hidden');
      } else {
        // Initialize the track scrubber's current time and duration
        populateTrackScrubber();
        trackScrubberRef.current.classList.remove('hidden');

        let pointerDragged = false;
        // Attach mouse pointer events to track scrubber progress bar
        let [_, progressBar, __] = trackScrubberRef.current.children;
        progressBar.addEventListener('mouseenter', (e) => {
          handleMouseMove(e);
        });
        /*
          Using pointerup, pointermove, pointerdown events instead of
          mouseup, mousemove, mousedown events to make it work with both
          mouse pointer and touch events 
        */
        progressBar.addEventListener('pointerup', (e) => {
          if (pointerDragged) {
            handleSetProgress(e);
          }
        });
        progressBar.addEventListener('pointermove', (e) => {
          handleMouseMove(e);
          pointerDragged = true;
        });
        progressBar.addEventListener('pointerdown', (e) => {
          // Only handle left click event
          if (e.which === 1) {
            handleSetProgress(e);
            pointerDragged = false;
          }
        });
      }
    }
  }, [zoomedOut]);

  // Hide track scrubber if it is displayed when player is going fullscreen
  player.on("fullscreenchange", () => {
    if (player.isFullscreen() && !zoomedOut) {
      setZoomedOut(zoomedOut => !zoomedOut);
    }
  });

  // Clean up interval when player is disposed
  player.on('dispose', () => {
    clearInterval(playerEventListener);
  });
  /**
   * Event handler for VideoJS player instance's 'timeupdate' event, which
   * updates the track scrubber from player state.
   */
  const timeUpdateHandler = () => {
    if (player.isDisposed() || player.ended()) return;
    /* 
      Get the current track from the player.markers created from the structure timespans.
      In playlists, markers are timepoint information representing highlighting annotations, 
      therefore omit reading markers information for track scrubber in playlist contexts. 
    */
    if (player.markers && typeof player.markers !== 'function' && typeof player.markers.getMarkers === 'function'
      && player.markers.getMarkers()?.length > 0 && !isPlaylist) {
      readPlayerMarkers();
    }
    /*
      When playhead is outside a time range marker (track) or in playlist contexts, display 
      the entire playable duration of the media in the track scrubber
    */
    else if (currentTrack.key === undefined) {
      setCurrentTrack({
        duration: player.playableDuration,
        time: player.altStart,
        key: '',
        text: 'Complete media file'
      });
    }

    let playerCurrentTime = player.currentTime();
    playerCurrentTime = player.srcIndex && player.srcIndex > 0
      ? playerCurrentTime + player.altStart
      : playerCurrentTime;

    updateTrackScrubberProgressBar(playerCurrentTime, player);
  };

  /**
   * Update the track scrubber's current time, duration and played percentage
   * when it is visible in UI. 
   * @param {Number} currentTime current time corresponding to the track
   * @param {Number} playedPercentage elapsed time percentage of the track duration
   */
  const populateTrackScrubber = (currentTime = 0, playedPercentage = 0) => {
    if (!trackScrubberRef.current) { return; }

    let [currentTimeDisplay, _, durationDisplay] = trackScrubberRef.current.children;

    // Set the elapsed time percentage in the progress bar of track scrubber
    document.documentElement.style.setProperty(
      '--range-scrubber',
      `calc(${playedPercentage}%)`
    );

    // Update the track duration
    durationDisplay.innerHTML = timeToHHmmss(currentTrackRef.current.duration);
    // Update current time elapsed within the current track
    let cleanTime = !isNaN(currentTime) && currentTime > 0 ? currentTime : 0;
    currentTimeDisplay.innerHTML = timeToHHmmss(cleanTime);

  };

  /**
   * Calculate the progress and current time within the track and
   * update them accordingly when the player's 'timeupdate' event fires.
   * @param {Number} currentTime player's current time
   * @param {Object} player VideoJS player instance
   */
  const updateTrackScrubberProgressBar = (currentTime, player) => {
    // Handle Safari which emits the timeupdate event really quickly
    if (!currentTrackRef.current || currentTrackRef.current === undefined) {
      if (player.markers && typeof player.markers.getMarkers === 'function') {
        readPlayerMarkers();
      }
    }

    const { altStart, srcIndex } = player;
    // Calculate corresponding time and played percentage values within track
    let trackoffset = srcIndex > 0
      ? currentTime - currentTrackRef.current.time + altStart
      : currentTime - currentTrackRef.current.time;
    let trackpercent = Math.min(
      100,
      Math.max(0, 100 * trackoffset / currentTrackRef.current.duration)
    );

    populateTrackScrubber(trackoffset, trackpercent);
  };

  const readPlayerMarkers = () => {
    const tracks = player.markers.getMarkers().filter(m => m.class == 'ramp--track-marker--fragment');
    if (tracks?.length > 0 && tracks[0].key != currentTrack?.key) {
      setCurrentTrack(tracks[0]);
    }
  };

  /**
   * Event handler for mouseenter and mousemove pointer events on the
   * the track scrubber. This sets the time tooltip value and its offset
   * position in the UI.
   * @param {Event} e pointer event for user interaction
   */
  const handleMouseMove = (e) => {
    if (!timeToolRef.current) { return; }
    let time = getTrackTime(e);

    // When hovering over the border of the track scrubber, convertTime() returns infinity,
    // since e.target.clientWidth is zero. Use this value to not show the tooltip when this
    // occurs.
    if (isFinite(time)) {
      // Calculate the horizontal position of the time tooltip using the event's offsetX property
      let offset = e.offsetX - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
      timeToolRef.current.style.left = offset + 'px';

      // Set text in the tooltip as the time relevant to the pointer event's position
      timeToolRef.current.innerHTML = timeToHHmmss(time);
    }
  };

  /**
   * Event handler for mousedown event on the track scrubber. This sets the
   * progress percentage within track scrubber and update the player's current time
   * when user clicks on a point within the track scrubber.
   * @param {Event} e pointer event for user interaction
   */
  const handleSetProgress = (e) => {
    if (!currentTrackRef.current) {
      return;
    }
    let trackoffset = getTrackTime(e);

    if (trackoffset != undefined) {
      // Calculate percentage of the progress based on the pointer position's
      // time and duration of the track
      let trackpercent = Math.min(
        100,
        Math.max(0, 100 * (trackoffset / currentTrackRef.current.duration))
      );

      // Set the elapsed time in the scrubber progress bar
      document.documentElement.style.setProperty(
        '--range-scrubber',
        `calc(${trackpercent}%)`
      );

      // Set player's current time with respective to the alt start time of the track and offset
      const playerCurrentTime = player.srcIndex && player.srcIndex > 0
        ? trackoffset - currentTrackRef.current.time
        : trackoffset + currentTrackRef.current.time;
      player.currentTime(playerCurrentTime);
    }
  };

  /**
   * Convert pointer position on track scrubber to a time value
   * @param {Event} e pointer event for user interaction
   * @returns {Number} time corresponding to the pointer position
   */
  const getTrackTime = (e) => {
    if (!currentTrackRef.current) {
      return;
    }
    let offsetx = e.offsetX;
    if (offsetx && offsetx != undefined) {
      let time =
        (offsetx / e.target.clientWidth) * currentTrackRef.current.duration
        ;
      return time;
    }
  };

  return (
    <div className="vjs-button vjs-control">
      <button className="vjs-button vjs-track-scrubber-button"
        role="button"
        tabIndex={0}
        title={"Toggle track scrubber"}
        onClick={handleTrackScrubberClick}
        onKeyDown={handleTrackScrubberKeyDown}>
        {zoomedOut && <TrackScrubberZoomInIcon scale="0.9" />}
        {!zoomedOut && <TrackScrubberZoomOutIcon scale="0.9" />}
      </button>
    </div >
  );
}

vjsComponent.registerComponent('VideoJSTrackScrubber', VideoJSTrackScrubber);

export default VideoJSTrackScrubber;
