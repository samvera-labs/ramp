import videojs from 'video.js';

const Button = videojs.getComponent('Button');

class VideoJSNextButton extends Button {
  constructor(player, options) {
    super(player, options);
    // Use Video.js' stock SVG instead of setting it using CSS
    this.setIcon('next-item');
    this.addClass('vjs-play-control vjs-control');
    this.setAttribute('data-testid', 'videojs-next-button');
    this.controlText('Next');

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
    if (this.options.playerFocusElement === 'nextBtn') { this.el().focus(); }
  }

  handleClick() {
    this.handleNextClick(false);
  }

  handleKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.stopPropagation();
      this.handleNextClick(true);
    }
  }

  handleNextClick(isKeyDown) {
    if (this.cIndex != this.options.lastCanvasIndex) {
      this.options.switchPlayer(
        this.cIndex + 1,
        true,
        isKeyDown ? 'nextBtn' : '');
    }
  }
}

videojs.registerComponent('VideoJSNextButton', VideoJSNextButton);

export default VideoJSNextButton;
