import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSSectionButtons.scss';

const vjsComponent = videojs.getComponent('Component');

const NextButtonIcon = ({ scale }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)"
      style={{ fill: 'white', height: '1.25rem', width: '1.25rem', scale: scale }}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
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

function NextButton({ canvasIndex, lastCanvasIndex, switchPlayer }) {
  const handleNextClick = () => {
    if (canvasIndex != lastCanvasIndex) {
      switchPlayer(canvasIndex + 1);
    }
  };

  return (
    <div className="vjs-button vjs-control">
      <button className="vjs-button vjs-next-button"
        title={"Next"}
        onClick={handleNextClick}>
        <NextButtonIcon scale="0.9" />
      </button>
    </div >
  );
}

vjsComponent.registerComponent('VideoJSNextButton', VideoJSNextButton);

export default VideoJSNextButton;
