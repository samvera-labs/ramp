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
- `manifest` : local manifest data, `manifest` takes precedence over the `manifestUrl`

```jsx padded
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import Transcript from '../Transcript/Transcript';
import mockData from '../../json/multi-canvas.js';

import './IIIFPlayer.scss';

/**
 * To use your own Manifest in the player:
 *  - provide the manifest URL for the 'manifestUrl' prop (IMPORTANT: the manifest should be public)
 *      e.g: manifestUrl="http://example.com/my-manifest.json"
 *  - remove 'manifest={mockData}' line, since local manifest takes precedence over 'manifestUrl'
 *
 **/
<IIIFPlayer
  manifestUrl="https://dlib.indiana.edu/iiif_av/mahler-symphony-3/mahler-symphony-3.json"
  manifest={mockData}
>
  <div className="iiif-player-demo">
    <MediaPlayer />
    <StructuredNavigation />
    <Transcript
      playerID="iiif-media-player"
      transcripts={[
        {
          canvasId: 0,
          items: [
            {
              title: 'WebVTT Transcript',
              url: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
            },
            {
              title: 'External Text transcript',
              url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-manifest.json',
            },
            {
              title: 'Multiple Transcript Manifest',
              url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/rendering-manifest.json',
            },
          ],
        },
      ]}
    />
  </div>
</IIIFPlayer>;
```
