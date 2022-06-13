import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import './VideoJSFileDownload.scss';
import VideoJSDownloadIcon from './VideoJSDownloadIcon';
import { getLabelValue, getRenderingFiles } from '@Services/iiif-parser';

const vjsComponent = videojs.getComponent('Component');

/**
 * Custom VideoJS component for providing access to supplementing
 * files in a IIIF manifest under the `rendering` property.
 * @param {Object} options
 * @param {Object} options.manifest
 * @param {Number} options.canvasIndex
 */
class VideoJSFileDownload extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-custom-file-download');
    this.setAttribute('data-testid', 'videojs-file-download');

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
      <Downloader manifest={this.options.manifest} canvasIndex={this.options.canvasIndex} />,
      this.el()
    );
  }
}
function Downloader({ manifest, canvasIndex }) {
  const [files, setFiles] = React.useState([]);

  React.useEffect(() => {
    if (manifest) {
      const files = getRenderingFiles(manifest, canvasIndex);
      setFiles(files);
    }
  }, [manifest]);

  if (files && files.length > 0) {
    return (
      <div className="vjs-button vjs-control vjs-file-download">
        <button className="vjs-download-btn vjs-button" title="Alternate Resource Download">
          <VideoJSDownloadIcon width="1rem" />
        </button>
        <div className='vjs-menu' data-testid='videojs-file-download-menu'>
          <ul className="vjs-menu-content file-download-menu" role='menu'>
            {files.map((f, index) => {
              return <li className='vjs-menu-item' key={index}>
                <a href={f.id} className='vjs-menu-item-text' download>{f.label}</a>
              </li>;
            })}
          </ul>
        </div>
      </div >
    );
  } else {
    return null;
  }
}

vjsComponent.registerComponent('VideoJSFileDownload', VideoJSFileDownload);

export default VideoJSFileDownload;
