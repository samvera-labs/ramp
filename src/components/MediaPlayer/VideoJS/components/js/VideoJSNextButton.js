import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSSectionButtons.scss';

const vjsComponent = videojs.getComponent('Component');

const NextButtonIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)"
      style={{ fill: 'white', height: '1.25rem', width: '1.25rem' }}>
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20L15.3333 12L4 4V20Z" fill="#ffffff"></path>
        <path d="M20 4H17.3333V20H20V4Z" fill="#ffffff"></path>
      </g>
    </svg>
  );
};

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

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    ReactDOM.render(
      <NextButton {...this.options} />,
      this.el()
    );
  }
}

function NextButton({
  canvasIndex,
  lastCanvasIndex,
  switchPlayer,
  playerFocusElement,
}) {
  let nextRef = React.useRef();

  React.useEffect(() => {
    if (playerFocusElement == 'nextBtn') {
      nextRef.current.focus();
    }
  }, []);

  const handleNextClick = (isKeyDown) => {
    if (canvasIndex != lastCanvasIndex) {
      switchPlayer(
        canvasIndex + 1,
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
        <NextButtonIcon />
      </button>
    </div >
  );
}

vjsComponent.registerComponent('VideoJSNextButton', VideoJSNextButton);

export default VideoJSNextButton;
