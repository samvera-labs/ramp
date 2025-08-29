import videojs from 'video.js';
import '../styles/VideoJSFileDownload.scss';
import { fileDownload } from '../../../../../services/utility-helpers';

/**
 * @returns {Function} VideoJSFileDownload class
 */
const createVideoJSFileDownload = () => {
  const MenuButton = videojs.getComponent('MenuButton');
  const MenuItem = videojs.getComponent('MenuItem');

  /**
   * Custom component to display rendering files as downloadable 
   * associated with the current Canvas. This control is enabled
   * in the player's control-bar via 'enableFileDownload' prop in
   * MediaPlayer component.
   * @param {Object} props
   * @param {Object} props.player VideoJS player instance
   * @param {Object} props.options
   * @param {Number} props.options.files list of rendering files
   */
  class VideoJSFileDownload extends MenuButton {
    constructor(player, options) {
      super(player, options);
      // Add SVG icon through CSS class
      this.addClass("vjs-file-download");
      this.setAttribute('data-testid', 'videojs-file-download');
      // Use Video.js' stock SVG instead of setting it using CSS
      this.setIcon('file-download');
    }

    createItems() {
      const { options_, player_ } = this;
      const { files } = options_;

      if (files?.length > 0) {
        return files.map(function (file) {
          let item = new MenuItem(player_, { label: file.label });
          item.handleClick = function () {
            fileDownload(file.id, file.filename, file.fileExt);
          };
          return item;
        });
      } else {
        return [];
      }
    }
  }

  return VideoJSFileDownload;
};

// Create and register the component
let VideoJSFileDownload;
// Only register if videojs is available
if (typeof videojs !== 'undefined' && videojs.getComponent) {
  try {
    VideoJSFileDownload = createVideoJSFileDownload();
    videojs.registerComponent('VideoJSFileDownload', VideoJSFileDownload);
  } catch (e) {
    console.warn('Failed to register VideoJSFileDownload component:', e);
  }
}

export default VideoJSFileDownload;
