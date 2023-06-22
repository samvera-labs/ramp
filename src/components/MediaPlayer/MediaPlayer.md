MediaPlayer component provides a player that facilitates both audio and video media files in a IIIF Manifest. It encapsulates a [VideoJS](https://videojs.com/), which is an HTML5 player framework. `MediaPlayer` component fetches data from central state management system using Context providers. Therefore this component must *always* be wrapped by `IIIFPlayer` component.

`MediaPlayer` component accepts the following props;

- `enableFileDownload` : accepts a Boolean value, which has a default value of `false` and is not required. Once this is set to `true` it adds an icon to the player's toolbar to display `rendering` files in the Canvas and enables downloading them. This is a custom feature added to the VideoJS instance in Ramp.
- `enablePIP` : accepts a Boolean value, which has a default value of `false` and is not required. When this is set to `true`, it adds an icon to the player's toolbar to enable Picture-In-Picture feature for the current player. This icon is a VideoJS feature.


To import this component from the librayr;
```js static
import { MediaPlayer } from '@samvera/ramp';
```

```jsx padded
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import config from '../../../env.js';

<IIIFPlayer
  manifestUrl={`${config.url}/manifests/${config.env}/lunchroom_manners.json`}
>
  <MediaPlayer enableFileDownload={true} />
</IIIFPlayer>;
```
