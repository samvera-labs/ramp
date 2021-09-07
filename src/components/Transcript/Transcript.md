Display transcript data for an A/V file. Transcript component accepts transcript data in the following formats;

- IIIF annotations in a manifest
- Word document
- Plain text
- WebVTT
  Either from a URL for a file in the transcript props. Or through `rendering` property in a manifest, in which case the URL of the manifest needs to be fed to the url prop in the input JSON object for the transcript.
  Please look at the sample code in the following markup for a detailed explanation.

This is an example of how the component is rendered with each of this options.

```js static
import { Transcript } from 'iiif-react-media-player';
```

```jsx inside Markdown
import mockData from '../../json/mahler-symphony-audio.js';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import './Transcript.scss';

import transcript_1 from '../../json/transcript/lunchroom_1.js';

<ManifestProvider initialState={{ manifest: mockData, canvasId: 0 }}>
  <PlayerProvider>
    <Transcript
      transcripts={[
        {
          // Structured JSON blob fed directly from a server
          title: 'Structured JSON object list',
          data: transcript_1,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/lunchroom_1.json',
        },
        {
          // WebVTT file fed directly from a server
          title: 'WebVTT Transcript',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
        },
        {
          // Directly feeding a Word document from a server
          title: 'Transcript in MS Word',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript_ms.docx',
        },
        {
          // Directly feeding a plain text file from a server
          title: 'Transcript in Plain Text',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript_plain.txt',
        },
        {
          // External plain text transcript fed through `rendering` prop in a IIIF manifest
          title: 'External text transcript',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-manifest-rendering.json', // URL of the manifest
        },
        {
          // External JSON file with annotations fed through `rendering` prop in a IIIF manifest
          title: 'External JSON transcript',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-canvas-rendering.json', // URL of the manifest
        },
        {
          // Transcript data as a list of annotations within a IIIF manifest
          title: 'Transcript as Annotations',
          data: null,

          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-annotation.json', // URL of the manifest
        },
      ]}
    />
  </PlayerProvider>
</ManifestProvider>;
```
