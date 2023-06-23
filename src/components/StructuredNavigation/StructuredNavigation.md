StructuredNavigation component, renders any available structural properties in a given IIIF manifest. This component reads data from state provided through Contexts, therefore it should be wrapped by the context providers (both Manifest and Player as seen below).

`StructuredNavigation` component fetches data from Context providers, so it doesn't require any props.

A sample usage of this component is displayed in the `IIIFPlayer` component.

To import this component from the library;

```js static
import { IIIFPlayer, StructuredNavigation } from '@samvera/ramp';

<IIIFPlayer manifestUrl={manifest_url} manifest={manifest} >
  <StructuredNavigation />
</IIIFPlayer>;
```
