import React from 'react';
import videojs from 'video.js';
import '../styles/VideoJSTrackScrubber.scss';
import '../styles/VideoJSProgress.scss';
import { timeToHHmmss } from '@Services/utility-helpers';
import { IS_MOBILE, IS_IPAD } from '@Services/browser';

// SVG icons for zoom-in and zoom-out icons as strings
const zoomOutIconSVG = `
<symbol id="zoomed-out" viewBox="0 0 32 32">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path fill="#ffffff" d="M31.707 30.282l-8.845-8.899c1.894-2.262 3.034-5.18 
      3.034-8.366 0-7.189-5.797-13.018-12.986-13.018s-13.017 5.828-13.017 13.017 
      5.828 13.017 13.017 13.017c3.282 0 6.271-1.218 8.553-3.221l8.829 8.884c0.39 
      0.39 1.024 0.39 1.414 0s0.391-1.024 0-1.415zM12.893 24c-6.048 
      0-11-4.951-11-11s4.952-11 11-11c6.048 0 11 4.952 11 11s-4.951 11-11 11zM17.893 
      12h-4v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1v4h-4c-0.552 0-1 0.448-1 1s0.448 1 1 
      1h4v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4h4c0.552 0 1-0.448 1-1s-0.448-1-1-1z">
    </path>
  </g>
</symbol>`;

const zoomInIconSVG = `
<symbol id="zoomed-in" viewBox="0 0 32 32">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path fill="#ffffff" d="M31.707 30.282l-8.845-8.899c1.894-2.262 3.034-5.18 3.034-8.366 
      0-7.189-5.797-13.018-12.986-13.018s-13.017 5.828-13.017 13.017 5.828 13.017 
      13.017 13.017c3.282 0 6.271-1.218 8.553-3.221l8.829 8.884c0.39 0.39 1.024 
      0.39 1.414 0s0.391-1.024 0-1.415zM12.893 24c-6.048 0-11-4.951-11-11s4.952-11 
      11-11c6.048 0 11 4.952 11 11s-4.951 11-11 11zM17.893 12h-10c-0.552 0-1 
      0.448-1 1s0.448 1 1 1h10c0.552 0 1-0.448 1-1s-0.448-1-1-1z">
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
 * Custom VideoJS component for displaying track view when
 * there are tracks/structure timespans in the current Canvas
 * @param {Object} options
 * @param {Number} options.trackScrubberRef React ref to track scrubber element
 * @param {Number} options.timeToolRef React ref to time tooltip element
 * @param {Boolean} options.isPlaylist flag to indicate a playlist Manifest or not
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

    this.zoomedOutRef = React.createRef();
    this.currentTrackRef = React.createRef();

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
        // Hide the timetooltip on mobile/tablet devices
        if ((IS_IPAD || IS_MOBILE) && timeToolRef.current) {
          this.options.timeToolRef.current.style.display = 'none';
        }
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

  updateComponent() {
    const { trackScrubberRef } = this.options;
    // Reset refs to initial value
    this.zoomedOutRef.current = true;
    this.currentTrackRef.current = {};

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
    if (player.canvasIsEmpty && zoomedOutRef.current) { this.setZoomedOut(true); }
    if (player.isDisposed() || player.ended()) return;
    /* 
      Get the current track from the player.markers created from the structure timespans.
      In playlists, markers are timepoint information representing highlighting annotations, 
      therefore omit reading markers information for track scrubber in playlist contexts. 
    */
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
    }

    let playerCurrentTime = player.currentTime();
    playerCurrentTime = player.srcIndex && player.srcIndex > 0
      ? playerCurrentTime + player.altStart
      : playerCurrentTime;

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
    document.documentElement.style.setProperty(
      '--range-scrubber',
      `calc(${playedPercentage}%)`
    );

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
