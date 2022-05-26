import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import './VideoJSFileDownload.scss';
import VideoJSDownloadIcon from './VideoJSDownloadIcon';
import { parseTranscriptData } from '@Services/transcript-parser';

function Downloader({ transcripts }) {
  return (
    <div className="vjs-button vjs-control vjs-file-download">
      <button className="vjs-download-btn vjs-button" title="Supplementing File Download">
        <VideoJSDownloadIcon width="1rem" />
      </button>
      <div className="vjs-menu-content">
        <a href="http://localhost:6060/lunchroom_manners/lunchroom_manners.vtt" download>Link 1</a>
        <a href="http://localhost:6060/manifests/development/lunchroom_base.json" download>Link 2</a>
      </div>
    </div>
  );
}

const vjsComponent = videojs.getComponent('Component');

class VideoJSFileDownload extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.mount = this.mount.bind(this);
    // this.getSupplementFiles = this.getSupplementFiles.bind(this);

    this.state = { transcripts: [] };

    this.options = options;

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
      // this.getSupplementFiles();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  // async getSupplementFiles() {
  //   console.log(this.options.manifest.id);
  //   const transcripts = await parseTranscriptData(this.options.manifest.id, this.options.canvasIndex);
  //   console.log(transcripts);
  //   this.setState({ transcripts });
  // }

  mount() {
    ReactDOM.render(
      <Downloader transcripts={this.state.transcripts} />,
      this.el()
    );
  }
}

vjsComponent.registerComponent('VideoJSFileDownload', VideoJSFileDownload);

export default VideoJSFileDownload;
