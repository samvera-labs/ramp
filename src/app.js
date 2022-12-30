import React from 'react';
import IIIFPlayer from '@Components/IIIFPlayer/IIIFPlayer';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import StructuredNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import Transcript from '@Components/Transcript/Transcript';
import config from '../env';
import './app.scss';
import 'video.js/dist/video-js.css';
import '../dist/iiif-react-media-player.css';

function App({ manifestUrl, manifest }) {
  return (
    <IIIFPlayer
      manifestUrl={manifestUrl}
      manifest={manifest}
    >
      <div className="iiif-player-demo">
        <MediaPlayer enableFileDownload={true} />
        <StructuredNavigation />
        <Transcript
          playerID="iiif-media-player"
          transcripts={[
            {
              canvasId: 0,
              items: [
                {
                  title: 'WebVTT Transcript',
                  url: `${config.url}/lunchroom_manners/lunchroom_manners.vtt`,
                },
                {
                  title: 'External Text transcript',
                  url: `${config.url}/manifests/${config.env}/volleyball-for-boys.json`,
                },
              ],
            },
          ]}
        />
      </div>
    </IIIFPlayer>
  );
}

export default App;
