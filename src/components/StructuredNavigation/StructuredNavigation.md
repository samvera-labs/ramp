Structured navigation component, renders any available structural properties in a given IIIF manifest. This component reads manifest data from central state management provided by Contexts. Thus it should be wrapped by context providers using `IIIFPlayer` which is the component in Ramp providing these out of the box.

`StructuredNavigation` component fetches data from Context providers, so it doesn't require any props.

To import this component from the library;

```js static
import { StructuredNavigation } from '@samvera/ramp';
```

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './StructuredNavigation.scss';
import config from '../../../env.js';


<IIIFPlayer manifestUrl={`${config.url}/manifests/${config.env}/lunchroom_manners.json`}>
    <StructuredNavigation />
</IIIFPlayer>;
```
