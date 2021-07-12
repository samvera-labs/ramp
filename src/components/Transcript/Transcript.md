Display transcript contents from a given transcript file/IIIF annotations in the manifest.

This is an example of how the component is rendered.

```js static
import { Transcript } from 'iiif-react-media-player';
```

```jsx inside Markdown
import mockData from '../../json/mahler-symphony-audio.js';
import { ManifestProvider } from '../../context/manifest-context';
import { PlayerProvider } from '../../context/player-context';
import './Transcript.scss';

import transcript from '../../json/transcript/lunchroom.js';

<ManifestProvider initialState={{ manifest: mockData, canvasId: 0 }}>
  <PlayerProvider>
    <Transcript transcript={transcript} />
  </PlayerProvider>
</ManifestProvider>;
```
