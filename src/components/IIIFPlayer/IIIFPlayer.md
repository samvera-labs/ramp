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
import mockData from '../../json/mahler-symphony-audio.js';

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
  </div>
</IIIFPlayer>;
```
