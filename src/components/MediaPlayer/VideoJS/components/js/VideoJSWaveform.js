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

    this.hiddenRef = createRef();
    this.hiddenRef.current = true;

    this.canvas = null;
    this.waveformData = null;

    // Initial panel setup and waveform draw on the state changes as the player loads
    this.initializePanel();

    // Refresh the waveform data and visualization on Canvas switches
    this.player.on('waveformUpdated', () => {
      this.refreshWaveformData();
    });

    // Hide waveform panel if it is displayed when player is going fullscreen
    this.player.on('fullscreenchange', () => {
      if (this.player.isFullscreen() && !this.hiddenRef.current) {
        this.setHidden(true);
      }
    });
  }

  initializePanel() {
    const { waveformRef } = this.options;
    if (!waveformRef.current) return;

    this.refreshWaveformData();
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

    // Clean existing waveform visualization canvases and observers
    if (panel) {
      panel.style.backgroundImage = '';
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.waveformData = null;

    if (!panel) return;
    if (!waveform) return;

    // If the current waveform is an image set it as the background of the panel
    if (waveform.type === 'image') {
      panel.style.backgroundImage = `url(${waveform.url})`;
      return;
    }

    // If the current waveform is a dataset re-initialize the canvases and observers
    if (waveform.type === 'peaks') {
      const canvas = videojs.dom.createEl('canvas', {
        className: 'vjs-waveform-canvas',
        role: 'presentation',
      });
      panel.appendChild(canvas);
      this.canvas = canvas;
      this.waveformData = waveform.data;

      // Draw the waveform visualization in canvas
      this.drawWaveform();
    }
  }

  /**
   * Draw the waveform image using the data from the WaveformData instance
   * using CanvasAPI.
   */
  drawWaveform() {
    const { canvas, waveformData } = this;
    if (!canvas || !waveformData) return;

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

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();

    // Loop forwards, drawing the upper half of the waveform
    for (let x = 0; x < width; x++) {
      const max = channel.max_sample(x);
      ctx.lineTo(x + 0.5, scaleY(max, canvas.height) + 0.5);
    }

    // Loop backwards, drawing the lower half of the waveform
    for (let x = width - 1; x >= 0; x--) {
      const min = channel.min_sample(x);
      ctx.lineTo(x + 0.5, scaleY(min, canvas.height) + 0.5);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

videojs.registerComponent('VideoJSWaveform', VideoJSWaveform);

export default VideoJSWaveform;
