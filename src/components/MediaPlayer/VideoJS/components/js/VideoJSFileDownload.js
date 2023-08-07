import videojs from 'video.js';
import '../styles/VideoJSFileDownload.scss';
import { getRenderingFiles } from '@Services/iiif-parser';
import { fileDownload } from '@Services/utility-helpers';

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');

const VideoJSFileDownload = videojs.extend(
  MenuButton,
  {
    constructor: function (player, options) {
      MenuButton.call(this, player, options);
      // Add SVG icon through CSS class
      this.addClass("vjs-file-download-icon");
      this.setAttribute('data-testid', 'videojs-file-download');
    },
    createItems: function () {
      const { options_, player_ } = this;
      const { manifest, canvasIndex } = options_;
      const rendering = getRenderingFiles(manifest, canvasIndex);
      const files = (rendering.manifest).concat(rendering.canvas[canvasIndex]?.files);

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
    },
  }
);

videojs.registerComponent('VideoJSFileDownload', VideoJSFileDownload);

export default VideoJSFileDownload;
