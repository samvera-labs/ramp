import React from 'react';
import IIIFPlayer from '@Components/IIIFPlayer/IIIFPlayer';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import StructuredNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import Transcript from '@Components/Transcript/Transcript';
import './app.scss';
import 'video.js/dist/video-js.css';
import '../dist/iiif-react-media-player.css';

const App = ({ manifestURL }) => {
  const [userURL, setUserURL] = React.useState(manifestURL);
  const [manifestUrl, setManifestUrl] = React.useState(manifestURL);

  React.useEffect(() => {
    setManifestUrl(manifestUrl);
  }, [manifestUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setManifestUrl(userURL);
  };

  const handleUserInput = (e) => {
    setManifestUrl();
    setUserURL(e.target.value);
  };

  return (
    <div className='iiif-demo'>
      <h1>React IIIF Media Player</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-25">
              <label htmlFor="manifesturl">Manifest URL</label>
            </div>
            <div className="col-75">
              <input type="url"
                id="manifesturl"
                name="manifesturl"
                value={userURL}
                onChange={handleUserInput}
                placeholder="Manifest URL" />
              <input type="submit" value="Set Manifest" />
            </div>
          </div>
        </form>
      </div>
      <div className="player-container">
        <IIIFPlayer
          manifestUrl={manifestUrl}
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
                      title: 'Manifest linked Transcript',
                      url: manifestUrl,
                    }
                  ],
                },
              ]}
            />
          </div>
        </IIIFPlayer>
      </div>
    </div>
  );
};

export default App;
