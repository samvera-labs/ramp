import { createRef } from 'react';
import videojs from 'video.js';
import '../styles/VideoJSWaveform.scss';
import { svgIconToSymbol, WaveformToggleIcon } from '@Services/svg-icons';

// Function to inject SVGs into the DOM
function injectSVGIcons() {
  const waveformIconSVG = svgIconToSymbol(WaveformToggleIcon, 'waveform-toggle');

  const svgContainer = document.createElement('div');
  svgContainer.style.display = 'none';
  svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${waveformIconSVG}</svg>`;
  document.body.appendChild(svgContainer);
}

// Call the function to inject SVG icons
injectSVGIcons();

const Button = videojs.getComponent('Button');

/**
 * Custom VideoJS component for toggling the waveform diplay panel for the current Canvas.
 * The waveform is expected to be refrenced via either 'seeAlso'/'accompanyingCanvas'
 * at the Canvas level.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Object} props.options.waveformRef React ref to the waveform panel element
 */
class VideoJSWaveform extends Button {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'videojs-waveform-button');
    this.addClass('vjs-button vjs-waveform-toggle');
    this.controlText('Toggle waveform display');
    this.el().innerHTML = `
      <svg class="vjs-icon-waveform" role="presentation">
        <use xlink:href="#waveform-toggle"></use>
      </svg>`;

    this.options = options;
    this.player = player;
    this.playerInterval;

    this.hiddenRef = createRef();
    this.hiddenRef.current = true;

    this.waveformData = null;

    this.canvas = null;
    this.progressCanvas = null;
    this.resizeObserver = null;

    // Initial panel setup and waveform draw on the state changes as the player loads
    this.attachListeners();
    this.refreshWaveformData();

    // Refresh the waveform data and visualization on Canvas switches
    this.player.on('waveformupdated', () => {
      this.refreshWaveformData();
    });

    // Unblock the waveform panel
    this.player.on('seeked', () => {
      const { waveformRef } = this.options;
      if (waveformRef.current && waveformRef.current.classList.contains('vjs-disabled')) {
        waveformRef.current?.classList.remove('vjs-disabled');
      }
    });

    // Hide waveform panel if it is displayed when player is going fullscreen
    this.player.on('fullscreenchange', () => {
      if (this.player.isFullscreen() && !this.hiddenRef.current) {
        this.setHidden(true);
      }
    });

    // Clean up interval and observers when player is disposed
    this.player.on('dispose', () => {
      clearInterval(this.playerInterval);
      this.resizeObserver?.disconnect();
    });
  }

  /**
   * Attach pointer event listeners to the waveform panel for click/seek actions
   */
  attachListeners() {
    const { waveformRef } = this.options;
    if (!waveformRef.current) return;

    let pointerDragged = false;
    waveformRef.current.addEventListener('pointerup', (e) => {
      if (pointerDragged) {
        this.handleSetProgress(e);
      }
    });
    waveformRef.current.addEventListener('pointermove', (e) => {
      pointerDragged = true;
    });
    waveformRef.current.addEventListener('pointerdown', (e) => {
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

  setHidden(h) {
    this.hiddenRef.current = h;
    const { waveformRef } = this.options;
    if (!waveformRef.current) return;

    if (h) {
      waveformRef.current.classList.add('hidden');
    } else {
      waveformRef.current.classList.remove('hidden');
    }
  }

  /**
   * Keydown event handler for the waveform toggle button, when using
   * keyboard navigation.
   * @param {Event} e keydown event
   */
  handleKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.preventDefault();
      this.handleWaveformToggleClick();
      e.stopPropagation();
    }
  }

  handleClick() {
    this.handleWaveformToggleClick();
  }

  /**
   * Click event handler for the waveform toggle button on the player controls
   */
  handleWaveformToggleClick() {
    const { player } = this;

    // If player is fullscreen exit before displaying waveform panel
    if (player.isFullscreen()) {
      player.exitFullscreen();
    }
    const tempHidden = this.hiddenRef.current;
    this.setHidden(!tempHidden);
  }

  /**
   * Refresh waveform data and the current visualization in the canvas in the panel 
   * when the Canvas switches in VideoJS.
   */
  refreshWaveformData() {
    const { player, options } = this;
    const waveform = player.waveform;
    const panel = options.waveformRef.current;

    // Block the waveform panel on refresh
    panel.classList.add('vjs-disabled');

    // Clean existing waveform visualization canvases and observers
    if (panel) {
      panel.style.backgroundImage = '';
      panel.style.removeProperty('--waveform-image-url');
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.waveformData = null;

    if (this.progressCanvas) {
      this.progressCanvas.remove();
      this.progressCanvas = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (!panel) return;
    if (!waveform) return;

    // If the current waveform is an image set it as the background of the panel
    if (waveform.type === 'image') {
      panel.style.backgroundImage = `url(${waveform.url})`;
      panel.style.setProperty('--waveform-image-url', `url(${waveform.url})`);
      return;
    }

    // If the current waveform is a dataset re-initialize the canvases and observers
    if (waveform.type === 'peaks') {
      const canvas = videojs.dom.createEl('canvas', {
        className: 'vjs-waveform-canvas',
        role: 'presentation',
      });
      const progressCanvas = videojs.dom.createEl('canvas', {
        className: 'vjs-waveform-canvas vjs-waveform-progress-canvas',
        role: 'presentation',
      });
      panel.appendChild(canvas);
      this.canvas = canvas;
      panel.appendChild(progressCanvas);
      this.progressCanvas = progressCanvas;
      this.waveformData = waveform.data;

      this.resizeObserver = new ResizeObserver(() => {
        this.drawWaveform();
      });
      this.resizeObserver.observe(panel);

      // Draw the waveform visualization in canvas
      this.drawWaveform();
    }
  }

  /**
   * Draw the waveform image using the data from the WaveformData instance
   * using CanvasAPI.
   */
  drawWaveform() {
    const { canvas, progressCanvas, waveformData } = this;
    if (!canvas || !progressCanvas || !waveformData) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const channel = width < waveformData.length
      ? waveformData.resample({ width }).channel(0)
      : waveformData.channel(0);

    const scaleY = (amplitude, height) => {
      const range = 256;
      const offset = 128;
      return height - ((amplitude + offset) * height) / range;
    };

    /* Draw the waveform on both base canvas and progress canvas at in the
    same loop. Add stroke and fill styles to the progress canvas to indicate
    playback progress. */
    [canvas, progressCanvas].forEach((c) => {
      c.width = width;
      c.height = height;
      const ctx = c.getContext('2d');
      ctx.beginPath();

      // Loop forwards, drawing the upper half of the waveform
      for (let x = 0; x < width; x++) {
        const max = channel.max_sample(x);
        ctx.lineTo(x + 0.5, scaleY(max, c.height) + 0.5);
      }

      // Loop backwards, drawing the lower half of the waveform
      for (let x = width - 1; x >= 0; x--) {
        const min = channel.min_sample(x);
        ctx.lineTo(x + 0.5, scaleY(min, c.height) + 0.5);
      }

      // Set stroke and fill colors for played progress in the waveform
      ctx.strokeStyle = c === progressCanvas ? '#80a590' : '#ffffff';
      ctx.fillStyle = c === progressCanvas ? '#80a590' : '#ffffff';

      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    });
  }

  /**
   * Event handler for VideoJS player instance's 'timeupdate' event, which
   * updates the played progress in the waveform canvas from player state.
   */
  handleTimeUpdate() {
    const { player, hiddenRef } = this;
    // Hide waveform toggle for inaccessible item if it is open
    if (player.canvasIsEmpty && !hiddenRef.current) { this.setHidden(true); }
    if (player.isDisposed() || player.ended()) return;

    const duration = player.playableDuration ?? player.duration();
    if (!duration) return;

    let playerCurrentTime = player.currentTime();
    if (player.srcIndex && player.srcIndex > 0) {
      playerCurrentTime += player.altStart ?? 0;
    }
    const played = Math.min(100, Math.max(0, 100 * (playerCurrentTime / duration)));
    document.documentElement.style.setProperty('--range-progress', `calc(${played}%)`);
  }

  /**
   * Event handler for pointerdown/pointerup events on the waveform panel.
   * This updates the player's current time when user clicks on a point
   * within the panel.
   * @param {Event} e pointer event for user interaction
   */
  handleSetProgress(e) {
    const { player } = this;
    const duration = player.playableDuration ?? player.duration();
    if (!duration) return;

    const offsetx = e.offsetX;
    if (offsetx == undefined || !e.target.clientWidth) return;

    const time = (offsetx / e.target.clientWidth) * duration;
    player.currentTime(time);
  }
}

videojs.registerComponent('VideoJSWaveform', VideoJSWaveform);

export default VideoJSWaveform;
