import React from 'react';
import IIIFPlayer from '@Components/IIIFPlayer/IIIFPlayer';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import StructuredNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import Transcript from '@Components/Transcript/Transcript';
import MetadataDisplay from '@Components/MetadataDisplay/MetadataDisplay';
import SupplementalFiles from '@Components/SupplementalFiles/SupplementalFiles';
import './app.scss';
import 'video.js/dist/video-js.css';
import '../dist/ramp.css';

const App = ({ manifestURL }) => {
  const [userURL, setUserURL] = React.useState(manifestURL);
  const [manifestUrl, setManifestUrl] = React.useState(manifestURL);
  const [activeTab, setActiveTab] = React.useState('Details');

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

  const handleShowTab = (tab) => {
    setActiveTab(tab);
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
            <MediaPlayer enableFileDownload={true} />
            <div className="components-row">
              <StructuredNavigation />
              <div className="tabs">
                <Tab
                  activeTab={activeTab == 'Details'}
                  key={'Details'}
                  label={'Details'}
                  onClick={handleShowTab}
                >
                  <MetadataDisplay showHeading={false} />
                </Tab>
                <Tab
                  activeTab={activeTab == 'Transcripts'}
                  key={'Transcripts'}
                  label={'Transcripts'}
                  onClick={handleShowTab}
                ><Transcript
                    playerID="iiif-media-player"
                    transcripts={[
                      {
                        canvasId: 0,
                        items: [
                          {
                            title: 'From Manifest',
                            url: manifestUrl,
                          }
                        ],
                      },
                      {
                        canvasId: 1,
                        items: [
                          {
                            title: 'Listed transcript',
                            url: "http://localhost:3003/lunchroom_manners/lunchroom_manners.vtt"
                          }
                        ]
                      }
                    ]}
                  />
                </Tab>
                <Tab
                  activeTab={activeTab == 'Files'}
                  key={'Files'}
                  label={'Files'}
                  onClick={handleShowTab}
                >
                  <SupplementalFiles showHeading={false} />
                </Tab>
              </div>
            </div>
          </div>
        </IIIFPlayer>
      </div>
    </div>
  );
};

const Tab = ({ label, onClick, activeTab, children }) => {
  const onClickHandler = () => {
    onClick(label);
  };

  return (
    <div className="tab-nav">
      <input type="radio" id={label} name="tab-nav" checked={activeTab} onChange={onClickHandler} />
      <label htmlFor={label}>{label}</label>
      <div className="tab-content">
        {children}
      </div>
    </div>
  );
};

export default App;
