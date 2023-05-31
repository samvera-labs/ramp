import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSSectionButtons.scss';

const vjsComponent = videojs.getComponent('Component');

const PreviousButtonIcon = ({ scale }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'white', height: '1.25rem', width: '1.25rem', scale: scale }}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M20 4L8.66667 12L20 20V4Z" fill="#ffffff"></path>
        <path d="M4 20H6.66667V4H4V20Z" fill="#ffffff"></path>
      </g>
    </svg>
  );
};
/**
 * Custom VideoJS component for skipping to the previous canvas
 * when multiple canvases are present in the manifest
 * @param {Object} options
 * @param {Number} options.canvasIndex current canvas's index
 * @param {Function} options.switchPlayer callback function to switch to previous canvas
 */
class VideoJSPreviousButton extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'videojs-previous-button');

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
      <PreviousButton
        {...this.options}
        player={this.player} />,
      this.el()
    );
  }
}

function PreviousButton({ canvasIndex, switchPlayer, player }) {
  const handlePreviousClick = () => {
    if (canvasIndex > -1 && canvasIndex != 0) {
      switchPlayer(canvasIndex - 1);
    } else if (canvasIndex == 0) {
      player.currentTime(0);
    }
  };

  return (
    <div className="vjs-button vjs-control">
      <button className="vjs-button vjs-previous-button"
        title={canvasIndex == 0 ? "Replay" : "Previous"}
        onClick={handlePreviousClick}>
        <PreviousButtonIcon scale="0.9" />
      </button>
    </div >
  );
}

vjsComponent.registerComponent('VideoJSPreviousButton', VideoJSPreviousButton);

export default VideoJSPreviousButton;
