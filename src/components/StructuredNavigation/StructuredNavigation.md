StructuredNavigation component, renders any available structural properties in a given IIIF manifest. This component reads data from state provided through Contexts, therefore it should be wrapped by the context providers (both Manifest and Player as seen below).

`StructuredNavigation` component fetches data from Context providers, so it doesn't require any props.

To import this component from the library;

```js static
import { StructuredNavigation } from '@samvera/ramp';
```

```jsx inside Markdown
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import config from '../../../env.js';

<IIIFPlayer
  manifestUrl={`${config.url}/manifests/${config.env}/lunchroom_manners.json`}
>
  <StructuredNavigation />
</IIIFPlayer>;
```
