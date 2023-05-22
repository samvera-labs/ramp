IIIFPlayer component, provides a wrapper consisting of the Context providers containing state management that allows the components to communicate with each other. 

`IIIFPlayer` component accepts the following props;

- `manifestUrl` : URL of a manifest in the wild to be fetched
- `manifest` : local manifest data, `manifest` takes precedence over the `manifestUrl`


Import Ramp components individually and adjust the layout however you want. Play around with the code below.

*Components (like the `MediaPlayer` component, and `StructuredNavigation` component for example here) must be wrapped by the parent `IIIFPlayer` component.*


To import this component from the librayr;
```js static
import { IIIFPlayer } from '@samvera/ramp';
```

```jsx padded
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import config from '../../../env.js';
import mockData from '../../json/lunchroom_manners.js';

import './IIIFPlayer.scss';

/**
 * To test your own IIIF Prezi3 manifest in this component, please use the demo site;
 * https://iiif-react-media-player.netlify.app/
 * OR
 * In the code snippet below;
 *  - provide the manifest URL for the 'manifestUrl' prop (IMPORTANT: the manifest should be public)
 *      e.g: manifestUrl="http://example.com/my-manifest.json"
 *  - remove 'manifest={mockData}' line, since local manifest takes precedence over 'manifestUrl'
 **/
<IIIFPlayer
  manifestUrl={`${config.url}/manifests/${config.env}/volleyball-for-boys.json`}
  manifest={mockData}
>
  <div className="iiif-player-demo">
    <MediaPlayer enableFileDownload={true} />
    <StructuredNavigation />
  </div>
</IIIFPlayer>;
```
