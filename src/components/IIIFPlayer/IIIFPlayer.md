IIIFPlayer component, provides a wrapper consisting of the Context providers containing state management that allows the components to communicate with each other. 

`IIIFPlayer` component accepts the following props;
- `manifestUrl` : accepts a URL of a manifest in the wild to be fetched
- `manifest` : accepts a JSON object representing data in a IIIF Manifest

** __Either `manifestUrl` or `manifest` is REQUIRED. If both props are given then `manifest` takes *precedence* over `manifestUrl`__

- `customErrorMessage`: accepts a messagge to display to the user in the unlikely event of the component crashing, this has a default error message and it is _not required_. The message can include HTML markup.
- `startCanvasId`: accepts a valid Canvas ID that exists within the given Manifest, this can specify the Canvas to show in Ramp on initialization. This can be mapped to the [`start` property](https://iiif.io/api/presentation/3.0/#start) in a IIIF Manifest.
- `startCanvasTime`: accepts a valid number for a time in seconds to start playback  in the Canvas shown in Ramp on initialization.

** __If the given Manifest has a `start` property defined in it, then it takes *precedence* over the `startCanvasId` and `startCanvasTime` props__

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
