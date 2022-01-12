Structured navigation component.

This is an example of how we can export individual components or "features".

Need to figure out the best way to feed a sample manifest in here for documentation...

```js static
import { StructuredNavigation } from 'iiif-react-media-player';
```

```jsx inside Markdown
import mockData from '../../json/lunchroom_manners.js';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import './StructuredNavigation.scss';

<ManifestProvider initialState={{ manifest: mockData, canvasId: 0 }}>
  <PlayerProvider>
    <StructuredNavigation />
  </PlayerProvider>
</ManifestProvider>;
```
