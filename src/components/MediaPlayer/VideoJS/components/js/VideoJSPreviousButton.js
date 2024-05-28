import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import { SectionButtonIcon } from '@Services/svg-icons';
import '../styles/VideoJSSectionButtons.scss';

const vjsComponent = videojs.getComponent('Component');

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

    /* When player src is changed, call method to mount and update previous button */
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
      <PreviousButton
        {...this.options}
        player={this.player} />,
      this.el()
    );
  }
}

function PreviousButton({
  switchPlayer,
  playerFocusElement,
  player
}) {
  let previousRef = React.useRef();
  const [cIndex, setCIndex] = React.useState(player.canvasIndex || 0);

  React.useEffect(() => {
    if (player && player != undefined) {
      setCIndex(player.canvasIndex);
    }
  }, [player.src()]);

  React.useEffect(() => {
    if (playerFocusElement == 'previousBtn') {
      previousRef.current.focus();
    }
  }, []);

  const handlePreviousClick = (isKeyDown) => {
    if (cIndex > -1 && cIndex != 0) {
      switchPlayer(
        cIndex - 1,
        true,
        isKeyDown ? 'previousBtn' : '');
    } else if (cIndex == 0) {
      player.currentTime(0);
    }
  };

  const handlePreviousKeyDown = (e) => {
    if (e.which === 32 || e.which === 13) {
      e.stopPropagation();
      handlePreviousClick(true);
    }
  };

  return (
    <div className="vjs-button vjs-control">
      <button className="vjs-button vjs-previous-button"
        role="button"
        ref={previousRef}
        tabIndex={0}
        title={cIndex == 0 ? "Replay" : "Previous"}
        onClick={() => handlePreviousClick(false)}
        onKeyDown={handlePreviousKeyDown}>
        <SectionButtonIcon flip={true} />
      </button>
    </div>
  );
}

vjsComponent.registerComponent('VideoJSPreviousButton', VideoJSPreviousButton);

export default VideoJSPreviousButton;
