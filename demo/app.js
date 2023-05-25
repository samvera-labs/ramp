import React from 'react';
import IIIFPlayer from '@Components/IIIFPlayer/IIIFPlayer';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import StructuredNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import Transcript from '@Components/Transcript/Transcript';
import DescriptiveMetadata from '@Components/DescriptiveMetadata/DescriptiveMetadata';
import './app.scss';
import 'video.js/dist/video-js.css';
import '../dist/ramp.css';

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
      <h1>Ramp</h1>
      <div className='ramp--description'>
        <p>An interactive, IIIF powered A/V player built with components
          from <a href="https://www.npmjs.com/package/@samvera/ramp"
            target="_blank">
            @samvera/ramp
          </a> library. This player supports <em>IIIF Presentation 3.0 Manifests</em>. Please enter the URL
          of your <em>public</em> manifest to view it in the player.
        </p>
      </div>
      <div className='ramp--form_container'>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <div className='col-1'>
              <label htmlFor="manifesturl">Manifest URL</label>
            </div>
            <div className='col-2'>
              <input type='url'
                id='manifesturl'
                name='manifesturl'
                value={userURL}
                onChange={handleUserInput}
                placeholder='Manifest URL' />
              <input type='submit' value='Set Manifest' />
            </div>
          </div>
        </form>
      </div>
      <div className='ramp--player_container'>
        <IIIFPlayer
          manifestUrl={manifestUrl}
        >
          <div className="iiif-player-demo">
            <div className="player-metadata-container">
              <MediaPlayer enableFileDownload={true} />
              <DescriptiveMetadata />
            </div>
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
