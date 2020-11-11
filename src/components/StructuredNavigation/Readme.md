Structured navigation component.

This is an example of how we can export individual components or "features".

Need to figure out the best way to feed a sample manifest in here for documentation...

```js static
import { StructuredNavigation } from 'iiif-react-media-player';
```

```jsx inside Markdown
import mockData from '../../json/mahler-symphony-audio.js';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';

<ManifestProvider>
  <PlayerProvider>
    <StructuredNavigation manifest={mockData} />
  </PlayerProvider>
</ManifestProvider>;
```
