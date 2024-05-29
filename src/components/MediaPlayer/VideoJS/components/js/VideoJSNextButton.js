import React from 'react';
import ReactDOM from 'react-dom';
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

    this.mount = this.mount.bind(this);
    this.options = options;
    this.player = player;

    /* When player src is changed, call method to mount and update next button */
    player.on('loadstart', () => {
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    ReactDOM.render(
      <NextButton {...this.options} player={this.player} />,
      this.el()
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

  React.useEffect(() => {
    if (player && player != undefined) {
      setCIndex(player.canvasIndex);
    }
  }, [player.src()]);

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
    <div className="vjs-button vjs-control">
      <button className="vjs-button vjs-next-button"
        role="button"
        ref={nextRef}
        tabIndex={0}
        title={"Next"}
        onClick={() => handleNextClick(false)}
        onKeyDown={handleNextKeyDown}>
        <SectionButtonIcon />
      </button>
    </div >
  );
}

videojs.registerComponent('VideoJSNextButton', VideoJSNextButton);

export default VideoJSNextButton;
