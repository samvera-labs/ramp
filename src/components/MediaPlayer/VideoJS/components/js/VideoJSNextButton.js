import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import videojs from 'video.js';
import { SectionButtonIcon } from '@Services/svg-icons';
import '../styles/VideoJSSectionButtons.scss';

const vjsComponent = videojs.getComponent('Component');

/**
 * Custom VideoJS component for skipping to the next canvas
 * when multiple canvases are present in the manifest
 * @param {Object} options
 * @param {Number} options.canvasIndex current canvas's index
 * @param {Number} options.lastCanvasIndex last canvas's index
 * @param {Function} options.switchPlayer callback function switch to next canvas
 */
class VideoJSNextButton extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'videojs-next-button');
    this.addClass('vjs-play-control vjs-control');

    this.root = ReactDOMClient.createRoot(this.el());

    this.mount = this.mount.bind(this);
    this.options = options;
    this.player = player;

    /* When player src is changed, call method to mount and update next button */
    player.on('loadstart', () => {
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      this.root.unmount();
    });
  }

  mount() {
    this.root.render(
      <NextButton {...this.options} player={this.player} />
    );
  }
}

function NextButton({
  lastCanvasIndex,
  switchPlayer,
  playerFocusElement,
  player
}) {
  let nextRef = React.useRef();
  const [cIndex, setCIndex] = React.useState(player.canvasIndex || 0);

  /**
   * Use both canvasIndex and player.src() as dependecies, since the same
   * resource can appear in 2 consecutive canvases in a multi-canvas manifest.
   * E.g. 2 playlist items created from the same resource in an Avalon playlist
   * manifest.
   */
  React.useEffect(() => {
    if (player && player != undefined) {
      // When canvasIndex property is not set in the player instance use dataset.
      // This happens rarely, but when it does next button cannot be used.
      if (player.canvasIndex === undefined && player.children()?.length > 0) {
        setCIndex(Number(player.children()[0].dataset.canvasindex));
      } else {
        setCIndex(player.canvasIndex);
      }
    }
  }, [player.src(), player.canvasIndex]);

  React.useEffect(() => {
    if (playerFocusElement == 'nextBtn') {
      nextRef.current.focus();
    }
  }, []);

  const handleNextClick = (isKeyDown) => {
    if (cIndex != lastCanvasIndex) {
      switchPlayer(
        cIndex + 1,
        true,
        isKeyDown ? 'nextBtn' : '');
    }
  };

  const handleNextKeyDown = (e) => {
    if (e.which === 32 || e.which === 13) {
      e.stopPropagation();
      handleNextClick(true);
    }
  };

  return (
    <React.Fragment>
      <span className="vjs-control-text" aria-live="polite">Next</span>
      <button className="vjs-button vjs-next-button"
        role="button"
        ref={nextRef}
        tabIndex={0}
        title={"Next"}
        onClick={() => handleNextClick(false)}
        onKeyDown={handleNextKeyDown}>
        <SectionButtonIcon />
      </button>
    </React.Fragment >
  );
}

videojs.registerComponent('VideoJSNextButton', VideoJSNextButton);

export default VideoJSNextButton;
