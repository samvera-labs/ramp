import videojs from 'video.js';
import '../styles/VideoJSSectionButtons.scss';

const Button = videojs.getComponent('Button');

class VideoJSPreviousButton extends Button {
  constructor(player, options) {
    super(player, options);
    // Use Video.js' stock SVG instead of setting it using CSS
    this.setIcon('previous-item');
    this.addClass('vjs-previous-button');
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
    if (this.options.playerFocusElement === 'previousBtn') { this.el().focus(); }
  }

  handleClick() {
    this.handlePreviousClick(false);
  }

  handleKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.stopPropagation();
      this.handlePreviousClick(true);
    }
  }

  handlePreviousClick(isKeyDown) {
    if (this.cIndex > -1 && this.cIndex != 0) {
      this.options.switchPlayer(
        this.cIndex - 1,
        true,
        isKeyDown ? 'previousBtn' : '');
    } else if (this.cIndex == 0) {
      this.player.currentTime(0);
    }
  }
}

videojs.registerComponent('VideoJSPreviousButton', VideoJSPreviousButton);

export default VideoJSPreviousButton;
