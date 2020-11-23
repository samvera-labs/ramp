Import IIIF Media Player components individually and adjust the layout however you want. Play around with the code below.

Components (like the player component, and navigation component for example here) must be wrapped by the parent `IIIFPlayer` component.

```js static
import {
  IIIFPlayer,
  MediaPlayer,
  StructuredNavigation,
} from 'iiif-react-media-player';
```

```jsx padded
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import Playlist from '../Playlist/Playlist';
import playlistData from '../../json/playlist-data';
import mockData from '../../json/test-start-option.js';
import '../Playlist/Playlist.scss';

<IIIFPlayer
  manifestUrl="https://dlib.indiana.edu/iiif_av/mahler-symphony-3/mahler-symphony-3.json"
  // manifest={mockData}
>
  <div style={{ display: 'flex' }}>
    <div>
      <MediaPlayer />
      <Playlist manifest={playlistData} />
    </div>
    <div style={{ marginLeft: '40px' }}>
      <h2>Create your own custom navigation title in HTML</h2>
      <StructuredNavigation />
    </div>
  </div>

  {/* Standard usage maybe?
  <MediaPlayer />
  <StructuredNavigation />
  */}
</IIIFPlayer>;
```
