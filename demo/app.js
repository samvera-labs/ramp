import React from 'react';

import 'video.js/dist/video-js.css';  // must be at top so it can be overridden

import IIIFPlayer from '@Components/IIIFPlayer/IIIFPlayer';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import StructuredNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import Transcript from '@Components/Transcript/Transcript';
import MetadataDisplay from '@Components/MetadataDisplay/MetadataDisplay';
import SupplementalFiles from '@Components/SupplementalFiles/SupplementalFiles';
import AutoAdvanceToggle from '@Components/AutoAdvanceToggle/AutoAdvanceToggle';
import Annotations from '@Components/Annotations/Annotations';
import './app.scss';

const App = ({ manifestURL }) => {
  const [userURL, setUserURL] = React.useState(manifestURL);
  const [manifestUrl, setManifestUrl] = React.useState(manifestURL);

  const tabValues = [
    { title: 'Details', ref: React.useRef(null) },
    { title: 'Transcripts', ref: React.useRef(null) },
    { title: 'Files', ref: React.useRef(null) },
    { title: 'Annotations', ref: React.useRef(null) },
  ];

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
    <div className='ramp-demo'>
      <div className='ramp--details' role='banner'>
        <h1>Ramp</h1>
        <p>An interactive, IIIF powered A/V player built with components
          from <a href='https://www.npmjs.com/package/@samvera/ramp'
            target='_blank'>
            @samvera/ramp
          </a> library. This player supports <em>IIIF Presentation 3.0 Manifests</em>. Please enter the URL
          of your <em>public</em> manifest to view it in the player.
        </p>
        <div className='ramp--form_container'>
          <form onSubmit={handleSubmit}>
            <div className='row'>
              <div className='col-1'>
                <label htmlFor='manifesturl' className='ramp-demo__manifest-input-label'>Manifest URL</label>
              </div>
              <div className='col-2'>
                <input type='url'
                  id='manifesturl'
                  name='manifesturl'
                  value={userURL}
                  onChange={handleUserInput}
                  placeholder='Manifest URL'
                  className='ramp-demo__manifest-input' />
                <input type='submit' value='Set Manifest' className='ramp-demo__manifest-submit' />
              </div>
            </div>
          </form>
        </div>
      </div>
      <main className='ramp--player_container'>
        <IIIFPlayer manifestUrl={manifestUrl}>
          <div className='iiif-player-demo'>
            <MediaPlayer enableFileDownload={true} enablePlaybackRate={true} />
            <div className='components-row'>
              <div className='nav'>
                <AutoAdvanceToggle />
                <StructuredNavigation showAllSectionsButton={true} />
              </div>
              <Tabs tabValues={tabValues} manifestUrl={manifestUrl} />
            </div>
          </div>
        </IIIFPlayer>
      </main>
    </div>
  );
};

/*Reference: https://accessible-react.eevis.codes/components/tabs */
const Tabs = ({ tabValues, manifestUrl }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  let tabs = [];

  const handleClick = (index) => {
    setActiveTab(index);
  };

  const handleNextTab = (firstTabInRound, nextTab, lastTabInRound) => {
    const tabToSelect =
      activeTab === lastTabInRound ? firstTabInRound : nextTab;
    setActiveTab(tabToSelect);
    tabValues[tabToSelect].ref.current.focus();
  };

  const handleKeyPress = (event) => {
    const tabCount = Object.keys(tabValues).length - 1;

    if (event.key === 'ArrowLeft') {
      const last = tabCount;
      const next = activeTab - 1;
      handleNextTab(last, next, 0);
    }
    if (event.key === 'ArrowRight') {
      const first = 0;
      const next = activeTab + 1;
      handleNextTab(first, next, tabCount);
    }
  };

  tabValues.map((t, index) => {
    tabs.push(
      <Tab
        key={index}
        id={t.title.toLowerCase()}
        tabPanelId={`${t.title.toLowerCase()}Tab`}
        index={index}
        handleChange={handleClick}
        activeTab={activeTab}
        title={t.title}
        tabRef={t.ref}
      />
    );
  });

  return (
    <section className='tabs-wrapper' role='navigation' aria-label='more Ramp components in tab'>
      <div className='switcher'>
        <ul
          role='tablist'
          className='tablist switcher'
          aria-label='more Ramp components in tabs'
          onKeyDown={handleKeyPress}>
          {tabs}
        </ul>
      </div>
      <TabPanel id='detailsTab' tabId='details' tabIndex={0} activeTab={activeTab}>
        <MetadataDisplay showHeading={false} />
      </TabPanel>
      <TabPanel id='transcriptsTab' tabId='transcripts' tabIndex={1} activeTab={activeTab}>
        <Transcript
          playerID='iiif-media-player'
          manifestUrl={manifestUrl}
          showMoreSettings={{ enableShowMore: true }}
        />
      </TabPanel>
      <TabPanel id='filesTab' tabId='files' tabIndex={2} activeTab={activeTab}>
        <SupplementalFiles showHeading={false} />
      </TabPanel>
      <TabPanel id="annotationsTab" tabId="annotations" tabIndex={3} activeTab={activeTab}>
        <Annotations showHeading={false} showMoreSettings={{ enableShowMore: true }} />
      </TabPanel>
    </section>
  );
};

const Tab = ({ id, tabPanelId, index, handleChange, activeTab, title, tabRef }) => {
  const handleClick = () => { handleChange(index); };
  return (
    <li role='presentation'>
      <button
        role='tab'
        id={id}
        aria-selected={activeTab === index}
        aria-controls={tabPanelId}
        onClick={handleClick}
        tabIndex={activeTab === index ? 0 : -1}
        ref={tabRef}
      >
        {title}
      </button>
    </li>
  );
};

const TabPanel = ({ id, tabId, activeTab, tabIndex, children }) => {
  return (
    <section
      role='tabpanel'
      id={id}
      aria-labelledby={tabId}
      hidden={activeTab !== tabIndex}
      tabIndex={-1}
      className='tabpanel'
    >
      {children}
    </section>
  );
};

export default App;
