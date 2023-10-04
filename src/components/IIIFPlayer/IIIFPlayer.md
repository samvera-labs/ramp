IIIFPlayer component, provides a wrapper consisting of the Context providers containing state management that allows the components to communicate with each other. 

`IIIFPlayer` component accepts the following props;
- `manifestUrl` : URL of a manifest in the wild to be fetched
- `manifest` : manifest data as a JSON object

** __Either `manifestUrl` or `manifest` are REQUIRED. If both props are given then `manifest` takes *precedence* over `manifestUrl`__

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
import manifest from '../../../public/manifests/lunchroom_manners.js';

/**
 * To test your own IIIF Prezi3 manifest in this component, please use the demo site;
 * https://ramp.avalonmediasystem.org/
 **/
<IIIFPlayer
  manifest={manifest}
>
  <div className="iiif-player-demo">
    <MediaPlayer enableFileDownload={true} />
    <StructuredNavigation />
  </div>
</IIIFPlayer>;
```
