import videojs from 'video.js';
import '../styles/VideoJSSectionButtons.scss';

const Button = videojs.getComponent('Button');

/**
 * Custom VideoJS button component for navigating to the previous Canvas when there
 * are multiple canvases in a given Manifest
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.canvasIndex current Canvas index
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
    this.player.on('loadstart', () => {
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
    this.controlText(this.cIndex == 0 ? 'Replay' : 'Previous');
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
    if (this.cIndex > -1 && this.cIndex != 0) {
      this.options.switchPlayer(this.cIndex - 1, true);
    } else if (this.cIndex == 0) {
      this.player.currentTime(0);
    }
  }
}

videojs.registerComponent('VideoJSPreviousButton', VideoJSPreviousButton);

export default VideoJSPreviousButton;
