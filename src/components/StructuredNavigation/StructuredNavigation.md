StructuredNavigation component, renders any available structural properties in a given IIIF manifest. This component reads data from state provided through Contexts, therefore it should be wrapped by the context providers (both Manifest and Player as seen below).

`StructuredNavigation` component has the following prop;
- `showAllSectionsButton`: accepts a Boolean value, which has a default value of `false` and is _not required_. This allows to display the collapse/expand all sections button above the structure for manifests with collapsible structures.

To import this component from the library;

```js static
import { IIIFPlayer, StructuredNavigation } from '@samvera/ramp';
import manifest from 'lunchroom_manners.js';

<IIIFPlayer manifest={manifest} >
  <StructuredNavigation />
</IIIFPlayer>;
```

*A sample usage of this component is displayed in the `IIIFPlayer` component.*
