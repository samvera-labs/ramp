MediaPlayer component provides a player that facilitates both audio and video media files in a IIIF Manifest. It encapsulates a [VideoJS](https://videojs.com/), which is an HTML5 player framework. `MediaPlayer` component fetches data from central state management system using Context providers. Therefore this component must *always* be wrapped by `IIIFPlayer` component.

`MediaPlayer` component accepts the following props;

- `enableFileDownload` : accepts a Boolean value, which has a default value of `false` and is _not required_. Once this is set to `true` it adds an icon to the player's control bar to display `rendering` files in the Canvas and enables downloading them. This is a custom VideoJS component added to the VideoJS instance in Ramp.
- `enablePIP` : accepts a Boolean value, which has a default value of `false` and is _not required_. When this is set to `true`, it adds an icon to the player's control bar to enable Picture-In-Picture feature for the current player. This icon is a VideoJS component.
- `enablePlaybackRate`: accepts a Boolean value, which has a default value of `false` and is _not required_. When this is set to `true`, it adds an icon to the player's control bar which provides a menu to select a different playback speed for the media. The available speed options are 0.5x, 0.75x, 1x, 1.5x, and 2x. This icon is a VideoJS component.
- `enableTitleLink`: accepts a Boolean value, which has a default value of `false` and is _not required_. When this is set to `true`, it adds a title bar to the video player which displays the active canvas's `label` with an href attribute linking to the URL in the active canvas's `id`. This is a custom VideoJS component added to the VideoJS instance in Ramp.

To import and use this component from the library;
```js static
import { IIIFPlayer, MediaPlayer } from '@samvera/ramp';
import manifest from 'lunchroom_manners.js';

<IIIFPlayer manifest={manifest}>
  <MediaPlayer enableFileDownload={true} />
</IIIFPlayer>;
```

*A sample usage of this component is displayed in the `IIIFPlayer` component.*
