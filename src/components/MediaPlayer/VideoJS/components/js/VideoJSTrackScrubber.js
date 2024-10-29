import { createRef } from 'react';
import videojs from 'video.js';
import '../styles/VideoJSTrackScrubber.scss';
import '../styles/VideoJSProgress.scss';
import { timeToHHmmss } from '@Services/utility-helpers';

// SVG icons for zoom-in and zoom-out icons as strings
const zoomOutIconSVG = `
<symbol id="zoomed-out" viewBox="0 0 20 20">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path fill="#ffffff" fill-rule="evenodd" d="M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 
      0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 
      7 0 009 2zM8 6.5a1 1 0 112 0V8h1.5a1 1 0 110 2H10v1.5a1 1 0 11-2 0V10H6.5a1 1 0 010-2H8V6.5z">
    </path>
  </g>
</symbol>`;

const zoomInIconSVG = `
<symbol id="zoomed-in" viewBox="0 0 20 20">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path fill="#ffffff" fill-rule="evenodd" d="M9 4a5 5 0 100 10A5 5 0 009 4zM2 9a7 
      7 0 1112.6 4.2.999.999 0 01.107.093l3 3a1 1 0 01-1.414 1.414l-3-3a.999.999 0 
      01-.093-.107A7 7 0 012 9zm10.5 0a1 1 0 00-1-1h-5a1 1 0 100 2h5a1 1 0 001-1z">
    </path>
  </g>
</symbol>`;


// Function to inject SVGs into the DOM
function injectSVGIcons() {
  const svgContainer = document.createElement('div');
  svgContainer.style.display = 'none';
  svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${zoomOutIconSVG}${zoomInIconSVG}</svg>`;
  document.body.appendChild(svgContainer);
}

// Call the function to inject SVG icons
injectSVGIcons();

const Button = videojs.getComponent('Button');

/**
 * Custom VideoJS component for displaying track view when there are 
 * tracks/structure timespans in the current Canvas.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.trackScrubberRef React ref to track scrubber element
 * @param {Number} props.options.timeToolRef React ref to time tooltip element
 * @param {Boolean} props.options.isPlaylist flag to indicate a playlist Manifest or not
 */
class VideoJSTrackScrubber extends Button {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'videojs-track-scrubber-button');
    this.addClass('vjs-button vjs-track-scrubber');
    this.controlText('Toggle track scrubber');
    this.el().innerHTML = `
      <svg class="vjs-icon-zoom" role="presentation">
        <use xlink:href="#zoomed-out"></use>
      </svg>`;

    this.options = options;
    this.player = player;
    this.playerInterval;

    this.zoomedOutRef = createRef();
    this.currentTrackRef = createRef();

    // Attach interval on first load for time updates
    this.player.on('ready', () => {
      if (this.options.trackScrubberRef.current) {
        this.playerInterval = setInterval(() => {
          this.handleTimeUpdate();
        }, 100);
      }
    });

    /* 
      When player is fully built and the trackScrubber element is initialized,
      call method to mount React component.
    */
    this.player.on('loadstart', () => {
      if (this.options.trackScrubberRef.current) {
        this.updateComponent();
        if (!this.playerInterval) {
          this.playerInterval = setInterval(() => {
            this.handleTimeUpdate();
          }, 100);
        }
      }
    });

    // Hide track scrubber if it is displayed when player is going fullscreen
    this.player.on('fullscreenchange', () => {
      if (this.player.isFullscreen() && !this.zoomedOutRef.current) {
        const tempZoom = this.zoomedOutRef.current;
        this.setZoomedOut(!tempZoom);
      }
    });

    // Clean up interval when player is disposed
    this.player.on('dispose', () => {
      clearInterval(this.playerInterval);
    });
  }

  setCurrentTrack(t) {
    this.currentTrackRef.current = t;
  }

  setZoomedOut(z) {
    this.zoomedOutRef.current = z;
    if (z) {
      this.options.trackScrubberRef.current.classList.add('hidden');
      this.el().innerHTML = `
        <svg class="vjs-icon-zoom" role="presentation">
          <use xlink:href="#zoomed-out"></use>
        </svg>`;

    } else {
      this.options.trackScrubberRef.current.classList.remove('hidden');
      this.el().innerHTML = `
        <svg class="vjs-icon-zoom" role="presentation">
          <use xlink:href="#zoomed-in"></use>
        </svg>`;
    }
  }

  attachListeners() {
    const { trackScrubberRef } = this.options;
    if (trackScrubberRef.current) {
      // Initialize the track scrubber's current time and duration
      this.populateTrackScrubber();
      this.updateTrackScrubberProgressBar();

      let pointerDragged = false;
      // Attach mouse pointer events to track scrubber progress bar
      let [_, progressBar, __] = trackScrubberRef.current.children;
      progressBar.addEventListener('mouseenter', (e) => {
        this.handleMouseMove(e);
      });
      /*
        Using pointerup, pointermove, pointerdown events instead of
        mouseup, mousemove, mousedown events to make it work with both
        mouse pointer and touch events 
      */
      progressBar.addEventListener('pointerup', (e) => {
        if (pointerDragged) {
          this.handleSetProgress(e);
        }
      });
      progressBar.addEventListener('pointermove', (e) => {
        this.handleMouseMove(e);
        pointerDragged = true;
      });
      progressBar.addEventListener('pointerdown', (e) => {
        // Only handle left click event
        if (e.which === 1) {
          this.handleSetProgress(e);
          pointerDragged = false;
        }
      });
    }
  }

  updateComponent() {
    // Reset refs to initial value
    this.zoomedOutRef.current = true;
    this.currentTrackRef.current = {};
    this.attachListeners();
  }

  /**
   * Keydown event handler for the track button on the player controls,
   * when using keyboard navigation
   * @param {Event} e keydown event
   */
  handleKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.preventDefault();
      this.handleTrackScrubberClick();
      e.stopPropagation();
    }
  };

  handleClick() {
    this.handleTrackScrubberClick();
  }

  /**
   * Click event handler for the track button on the player controls
   */
  handleTrackScrubberClick() {
    const { currentTrackRef, player, options } = this;
    // When player is not fully loaded on the page don't show the track scrubber
    if (!options.trackScrubberRef.current || !currentTrackRef.current) return;

    // If player is fullscreen exit before displaying track scrubber
    if (player.isFullscreen()) {
      player.exitFullscreen();
    }
    const tempZoom = this.zoomedOutRef.current;
    this.setZoomedOut(!tempZoom);
  }

  /**
   * Event handler for VideoJS player instance's 'timeupdate' event, which
   * updates the track scrubber from player state.
   */
  handleTimeUpdate() {
    const { player, options, zoomedOutRef } = this;
    // Hide track-scrubber for inaccessible item if it is open
    if (player.canvasIsEmpty && !zoomedOutRef.current) { this.setZoomedOut(true); }
    if (player.isDisposed() || player.ended()) return;
    /* 
      Get the current track from the player.markers created from the structure timespans.
      In playlists, markers are timepoint information representing highlighting annotations, 
      therefore omit reading markers information for track scrubber in playlist contexts. 
    */
    let playerCurrentTime = player.currentTime();
    if (player.markers && typeof player.markers !== 'function'
      && typeof player.markers.getMarkers === 'function'
      && player.markers.getMarkers()?.length > 0 && !options.isPlaylist) {
      this.readPlayerMarkers();
    } else {
      this.setCurrentTrack({
        duration: player.playableDuration ?? player.duration(),
        time: player.altStart ?? 0,
        key: '',
        text: 'Complete media file'
      });
      playerCurrentTime = player.srcIndex && player.srcIndex > 0
        ? playerCurrentTime + player.altStart
        : playerCurrentTime;
    }

    this.updateTrackScrubberProgressBar(playerCurrentTime);
  }
  /**
   * Calculate the progress and current time within the track and
   * update them accordingly when the player's 'timeupdate' event fires.
   * @param {Number} currentTime player's current time
   */
  updateTrackScrubberProgressBar(currentTime = 0) {
    const { player, currentTrackRef } = this;
    // Handle Safari which emits the timeupdate event really quickly
    if (!currentTrackRef.current) {
      if (player.markers && typeof player.markers.getMarkers === 'function') {
        this.readPlayerMarkers();
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

    this.populateTrackScrubber(trackoffset, trackpercent);
  };

  /**
   * Update the track scrubber's current time, duration and played percentage
   * when it is visible in UI. 
   * @param {Number} currentTime current time corresponding to the track
   * @param {Number} playedPercentage elapsed time percentage of the track duration
   */
  populateTrackScrubber(currentTime = 0, playedPercentage = 0) {
    const { trackScrubberRef } = this.options;
    if (!trackScrubberRef.current) { return; }

    let [currentTimeDisplay, _, durationDisplay] = trackScrubberRef.current.children;

    // Set the elapsed time percentage in the progress bar of track scrubber
    this.setTrackScrubberValue(playedPercentage, currentTime);

    // Update the track duration
    durationDisplay.innerHTML = timeToHHmmss(this.currentTrackRef.current.duration);
    // Update current time elapsed within the current track
    let cleanTime = !isNaN(currentTime) && currentTime > 0 ? currentTime : 0;
    currentTimeDisplay.innerHTML = timeToHHmmss(cleanTime);
  };

  readPlayerMarkers() {
    const tracks = this.player.markers.getMarkers()
      .filter(m => m.class == 'ramp--track-marker--fragment');
    if (tracks?.length > 0) {
      this.setCurrentTrack(tracks[0]);
    }
  };

  /**
   * Event handler for mouseenter and mousemove pointer events on the
   * the track scrubber. This sets the time tooltip value and its offset
   * position in the UI.
   * @param {Event} e pointer event for user interaction
   */
  handleMouseMove(e) {
    const { timeToolRef } = this.options;
    if (!timeToolRef.current) { return; }
    let time = this.getTrackTime(e);

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
  handleSetProgress(e) {
    const { currentTrackRef, player } = this;
    if (!currentTrackRef.current) {
      return;
    }
    let trackoffset = this.getTrackTime(e);

    if (trackoffset != undefined) {
      // Calculate percentage of the progress based on the pointer position's
      // time and duration of the track
      let trackpercent = Math.min(
        100,
        Math.max(0, 100 * (trackoffset / currentTrackRef.current.duration))
      );

      this.setTrackScrubberValue(trackpercent, trackoffset);

      /**
       * Only add the currentTrack's start time for a single source items as this is
       * the offset of the time displayed in the track scrubber.
       * For multi-source items; the start time for the currentTrack is the offset of
       * the duration displayed in the main progress-bar, which translates to 0 in the
       * track-scrubber display
       */
      const playerCurrentTime = player?.srcIndex > 0
        ? trackoffset
        : trackoffset + currentTrackRef.current.time;
      player.currentTime(playerCurrentTime);
    }
  };

  /**
   * Set the elapsed time percentage and time as aria-now in the 
   * progress bar of track scrubber
   * @param {Number} trackpercent 
   * @param {Number} trackoffset 
   */
  setTrackScrubberValue = (trackpercent, trackoffset) => {
    document.documentElement.style.setProperty(
      '--range-scrubber',
      `calc(${trackpercent}%)`
    );
    const { trackScrubberRef } = this.options;
    if (trackScrubberRef.current && trackScrubberRef.current.children) {
      // Attach mouse pointer events to track scrubber progress bar
      let [_, progressBar, __] = trackScrubberRef.current.children;
      progressBar.setAttribute('aria-valuenow', trackoffset);
    }
  };

  /**
   * Convert pointer position on track scrubber to a time value
   * @param {Event} e pointer event for user interaction
   * @returns {Number} time corresponding to the pointer position
   */
  getTrackTime(e) {
    const { currentTrackRef } = this;
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
}

videojs.registerComponent('VideoJSTrackScrubber', VideoJSTrackScrubber);

export default VideoJSTrackScrubber;
