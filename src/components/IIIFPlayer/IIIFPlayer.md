Import IIIF Media Player components individually and adjust the layout however you want. Play around with the code below.

Components (like the player component, and navigation component for example here) must be wrapped by the parent `IIIFPlayer` component.

```js static
import {
  IIIFPlayer,
  MediaPlayer,
  StructuredNavigation,
} from 'iiif-react-media-player';
```

Props passed into `IIIFPlayer` component are as follows;

- `manifestUrl` : URL of a manifest in the wild to be fetched
- `manifest` : local manifest data, `manifest` takes precedent over the `manifestUrl`

```jsx padded
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import Transcript from '../Transcript/Transcript';
import mockData from '../../json/lunchroom_manners.js';

import transcript_1 from '../../json/transcript/lunchroom_1.js';
import transcript_2 from '../../json/transcript/lunchroom_2.js';
import './IIIFPlayer.scss';

/**
 * To use your own Manifest in the player:
 *  - provide the manifest URL for the 'manifestUrl' prop (IMPORTANT: the manifest should be public)
 *      e.g: manifestUrl="http://example.com/my-manifest.json"
 *  - remove 'manifest={mockData}' line, since local manifest takes precedent over 'manifestUrl'
 *
 **/
<IIIFPlayer
  manifestUrl="https://dlib.indiana.edu/iiif_av/mahler-symphony-3/mahler-symphony-3.json"
  manifest={mockData}
>
  <div>
    <MediaPlayer />
    <StructuredNavigation />
    <Transcript
      transcripts={[
        {
          title: 'Transcript 1',
          data: transcript_1,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/lunchroom_1.json',
        },
        {
          title: 'Transcript in WebVTT',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
        },
        {
          title: 'Transcript 3 with a really really really long long long name',
          data: transcript_1,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/lunchroom_1.json',
        },
        {
          title: 'Transcript in MS Word',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript_ms.docx',
        },
        {
          title: 'Transcript in Plain Text',
          data: null,
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript_plain.txt',
        },
      ]}
    />
  </div>
</IIIFPlayer>;
```
