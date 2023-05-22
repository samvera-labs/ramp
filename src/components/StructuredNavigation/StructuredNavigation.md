Structured navigation component, renders any available structural properties in a given IIIF manifest. This component reads data from state provided through Contexts, therefore it should be wrapped by the context providers (both Manifest and Player as seen below).

`StructuredNavigation` component fetches data from Context providers, so it doesn't require any props.

To import this component from the library;

```js static
import { StructuredNavigation } from '@samvera/ramp';
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
