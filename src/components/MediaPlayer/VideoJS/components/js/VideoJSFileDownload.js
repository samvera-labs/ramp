import videojs from 'video.js';
import '../styles/VideoJSFileDownload.scss';
import { fileDownload } from '@Services/utility-helpers';

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');

class VideoJSFileDownload extends MenuButton {
  constructor(player, options) {
    super(player, options);
    // Add SVG icon through CSS class
    this.addClass("vjs-file-download-icon");
    this.setAttribute('data-testid', 'videojs-file-download');
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

videojs.registerComponent('VideoJSFileDownload', VideoJSFileDownload);

export default VideoJSFileDownload;
