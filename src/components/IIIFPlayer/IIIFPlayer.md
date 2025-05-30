IIIFPlayer component, provides a wrapper consisting of the Context providers containing state management that allows the components to communicate with each other. 

`IIIFPlayer` component accepts the following props;
- `manifestUrl` : accepts a URL of a manifest in the wild to be fetched
- `manifest` : accepts a JSON object representing data in a IIIF Manifest

** __Either `manifestUrl` or `manifest` is REQUIRED. If both props are given then `manifest` takes *precedence* over `manifestUrl`__

- `customErrorMessage`: accepts a message to display to the user in the unlikely event of the component crashing. The message can include HTML markup. This prop has default value for a generic message and it is _not required_ to initialize the component. (**added in `@samvera/ramp@3.0.0`**)
- `emptyManifestMessage`: accepts a message text to display to the user when the given Manifest has no canvases in it yet. An example situation: a playlist manifest without any items added to it yet. This prop has default value for a generic message and it is _not required_ to initialize the component. (**added in `@samvera/ramp@3.2.0`**)
- `startCanvasId`: accepts a valid Canvas ID that exists within the given Manifest, this can specify the Canvas to show in Ramp on initialization. This can be mapped to the [`start` property](https://iiif.io/api/presentation/3.0/#start) in a IIIF Manifest. (**added in `@samvera/ramp@3.0.0`**)
- `startCanvasTime`: accepts a valid number for a time in seconds to start playback  in the Canvas shown in Ramp on initialization. (**added in `@samvera/ramp@3.0.0`**)

** __`startCanvasId` and `startCanvasTime` props takes *precedence* over the `start` property in a given IIIF Manifest. Defining either prop in the IIIFPlayer component overrides the `start` property in the IIIF Manifest.__

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
