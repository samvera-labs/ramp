Display transcript contents from a given transcript file/IIIF annotations in the manifest.

This is an example of how the component is rendered.

```js static
import { Transcript } from 'iiif-react-media-player';
```

```jsx inside Markdown
import mockData from '../../json/mahler-symphony-audio.js';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import './Transcript.scss';

import transcript_1 from '../../json/transcript/lunchroom_1.js';
import transcript_2 from '../../json/transcript/lunchroom_2.js';

<ManifestProvider initialState={{ manifest: mockData, canvasId: 0 }}>
  <PlayerProvider>
    <Transcript
      transcripts={[
        {
          title: 'Transcript 2',
          data: transcript_2,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/lunchroom-manners.json',
        },
        {
          title: 'Transcript 1',
          data: transcript_1,
          url: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/mahler-symphony-3.json',
        },
      ]}
    />
  </PlayerProvider>
</ManifestProvider>;
```
