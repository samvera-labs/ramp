MetadataDisplay component, renders any available metadata in a given IIIF manifest. This component reads manifest data from central state management provided by Contexts. Thus it should be wrapped by context providers using `IIIFPlayer` which is the component in Ramp providing these out of the box.

`MetadataDisplay` component allows the following props;
- `displayTitle`: accepts a Boolean value, which has a default value of `true` and is _not required_. This allows to hide the title in the `MetadataDisplay` component if it's included in the metadata of the IIIF manifest. In some use-cases where the title is already visible in some other part of the page, this can  be used to avoid displaying the title in multiple places.
- `showHeading`: accepts a Boolean value, which has a default value of `true` and is _not required_. This enables to hide the `Details` heading on top of the component allowing to customize the user interface.

To import this component from the library;

```js static
import { MetadataDisplay } from '@samvera/ramp';
```

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './MetadataDisplay.scss';
import config from '../../../env.js';
import lunchroomManifest from '../../../public/manifests/lunchroom_manners.js';

<IIIFPlayer manifest={lunchroomManifest}>
    <MetadataDisplay showHeading={false}/>
</IIIFPlayer>;
```
