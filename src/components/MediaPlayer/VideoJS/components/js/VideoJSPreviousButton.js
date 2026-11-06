import videojs from 'video.js';
import { getAdjacentCanvasIndex } from '@Services/utility-helpers';
import '../styles/VideoJSSectionButtons.scss';

const Button = videojs.getComponent('Button');

/**
 * Custom VideoJS button component for navigating to the previous Canvas when there
 * are multiple canvases in a given Manifest
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.canvasIndex current Canvas index
 * @param {Array} props.options.canvasLabels Canvas labels of all the Canvases in Manifest
 * @param {Function} props.options.switchPlayer callback func to update Canvas change in state
 */
class VideoJSPreviousButton extends Button {
  constructor(player, options) {
    super(player, options);
    // Use Video.js' stock SVG instead of setting it using CSS
    this.setIcon('previous-item');
    this.addClass('vjs-play-control vjs-control vjs-previous-button');
    this.setAttribute('data-testid', 'videojs-previous-button');
    this.options = options;
    this.player = player;
    this.cIndex = options.canvasIndex;

    // Handle player reload or source change events
    this.player.on(['loadstart', 'sequencechange'], () => {
      this.updateComponent();
    });
  }

  updateComponent() {
    const { player } = this;
    if (player && player != undefined) {
      // When canvasIndex property is not set in the player instance use dataset.
      // This happens rarely, but when it does previous button cannot be used.
      if (player.canvasIndex === undefined && player.children()?.length > 0) {
        this.cIndex = Number(player.children()[0].dataset.canvasindex);
      } else {
        this.cIndex = player.canvasIndex;
      }
    }

    const previousIndex = this.getPreviousIndex();
    let controlText = 'Previous Canvas';
    if (previousIndex === undefined) {
      // Set the control text to 'Replay' when on first Canvas
      controlText = 'Replay';
    } else if (this.options.canvasLabels?.[previousIndex]) {
      controlText = `Previous: ${this.options.canvasLabels[previousIndex]}`;
    }
    this.controlText(controlText);
  }

  getPreviousIndex() {
    const { canvasOrder } = this.player;
    if (canvasOrder) {
      return getAdjacentCanvasIndex(canvasOrder, this.cIndex, -1);
    } else if (this.cIndex > 0) {
      return this.cIndex + 1;
    } else {
      // Return nothing when first Canvas is reached
      return;
    }
  }

  handleClick() {
    this.handlePreviousClick();
  }

  handleKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.stopPropagation();
      this.handlePreviousClick();
    }
  }

  handlePreviousClick() {
    const previousIndex = this.getPreviousIndex();
    if (previousIndex !== undefined) {
      this.options.switchPlayer(previousIndex, true);
    } else if (this.cIndex == 0) {
      this.player.currentTime(0);
    }
  }
}

videojs.registerComponent('VideoJSPreviousButton', VideoJSPreviousButton);

export default VideoJSPreviousButton;
