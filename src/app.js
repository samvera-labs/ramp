import React from 'react';
import { ManifestProvider } from 'context/manifest-context';
import { PlayerProvider } from 'context/player-context';
import IIIFPlayerWrapper from '@Components/IIIFPlayerWrapper';
import StructureNavigation from '@Components/StructuredNavigation/StructuredNavigation';
import Transcript from '@Components/Transcript/Transcript';
import 'styles/main.scss';

function App({ manifestUrl, manifest }) {
  return (
    <ManifestProvider>
      <PlayerProvider>
        <IIIFPlayerWrapper manifestUrl={manifestUrl} manifest={manifest}>
          {children}
        </IIIFPlayerWrapper>
        <StructureNavigation />
        <Transcript
          playerID="iiif-media-player"
          transcripts={
            [
              {
                title: '',
                url: ''
              }
            ]
          }
        />
      </PlayerProvider>
    </ManifestProvider>
  );
}

export default App;
