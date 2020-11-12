Primary export component.

```js static
import { IIIFPlayer } from 'iiif-react-media-player';
```

```jsx padded
import MediaElementContainer from '../MediaPlayer/MediaElementContainer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';

<IIIFPlayer manifestUrl="https://dlib.indiana.edu/iiif_av/mahler-symphony-3/mahler-symphony-3.json">
  <div style={{ display: 'flex' }}>
    <MediaElementContainer />
    <StructuredNavigation />
  </div>
</IIIFPlayer>;
```
