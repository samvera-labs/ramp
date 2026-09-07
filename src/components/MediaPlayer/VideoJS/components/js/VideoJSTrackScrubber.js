import { createRef } from 'react';
import videojs from 'video.js';
import '../styles/VideoJSTrackScrubber.scss';
import '../styles/VideoJSProgress.scss';
import { roundToPrecision, timeToHHmmss } from '@Services/utility-helpers';
import { svgIconToSymbol, TrackScrubberZoomInIcon, TrackScrubberZoomOutIcon } from '@Services/svg-icons';

// Function to inject SVGs into the DOM
function injectSVGIcons() {
  const zoomOutIconSVG = svgIconToSymbol(TrackScrubberZoomOutIcon, 'zoomed-out');
  const zoomInIconSVG = svgIconToSymbol(TrackScrubberZoomInIcon, 'zoomed-in');

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
    this.zoomedOutRef.current = true;

    this.currentTrackRef = createRef();
    this.currentTrackRef.current = {};

    this.attachListeners();

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
    if (!trackScrubberRef.current) return;

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

    if (!this.playerInterval) {
      this.playerInterval = setInterval(() => {
        this.handleTimeUpdate();
      }, 100);
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
    // Calculate corresponding Canvas relative time and played percentage values within track
    const offsetTime = currentTime - currentTrackRef.current.time;
    /* For multi-source items, add the current source's altStart to the Canvas
    relative time to get the source relative time. */
    let trackoffset = srcIndex > 0 ? offsetTime + altStart : offsetTime;
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
   * For a multi-source Canvas, a click past the currently loaded source's duration needs to
   * switch the source in the VideoJS player instance before loading any corresponding active
   * tracks into the panel.
   * @param {Event} e pointer event for user interaction
   */
  handleSetProgress(e) {
    const { currentTrackRef, player, options } = this;
    if (!currentTrackRef.current || !player) {
      return;
    }

    const { altStart, srcIndex, targets } = player;

    let trackoffset = this.getTrackTime(e);

    /* Add the currentTrack's time (start time) to the track offset, as this is the Canvas
    relative time for the trackoffset derived from the pointer event. */
    const offsetTime = trackoffset + (currentTrackRef.current?.time ?? 0);

    // Find the source corresponding to the pointer click event
    const clickedTarget = targets?.length > 1
      ? targets.find((t) => offsetTime >= t.altStart && offsetTime <= t.altStart + t.duration)
      : undefined;

    /* When clicked past the currently loaded source, switch the source in the main VideoJS instance.
    This corresponds to the use-case where entire duration of the current player instance is portrayed
    in the track scrubber. i.e. when a time range not included in the structures is loaded in the
    player while the track scrubber is open. */
    if (clickedTarget && clickedTarget.sIndex !== srcIndex) {
      const playerCurrentTime = roundToPrecision(offsetTime - clickedTarget.altStart);
      options.nextItemClicked?.(clickedTarget.sIndex, playerCurrentTime);
      player.currentTime(playerCurrentTime);
    } else if (trackoffset != undefined) {
      // Calculate percentage of the progress based on the pointer position's
      // time and duration of the track
      let trackpercent = Math.min(
        100,
        Math.max(0, 100 * (trackoffset / currentTrackRef.current.duration))
      );

      this.setTrackScrubberValue(trackpercent, trackoffset);

      /* For multi-source Canvases, substract the current source's altStart from the Canvas
      relative time to get the source relative time. This is the inverse of the conversion
      done in updateTrackScrubberProgressBar(). */
      const playerCurrentTime = offsetTime - (srcIndex > 0 ? altStart : 0);
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
      progressBar.setAttribute('aria-valuenow', trackoffset || 0);
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
