MetadataDisplay component, renders any available metadata in a given IIIF manifest. By default it displays metadata relevant to the Manifest, and can be customized to show Canvas level metadata using the following props. Any changes to `displayTitle` prop is applied to both Manifest and Canvas metadata. This component reads manifest data from central state management provided by Contexts. Thus it should be wrapped by context providers using `IIIFPlayer` which is the component in Ramp providing these out of the box.

`MetadataDisplay` component allows the following props;
- `displayTitle`: accepts a Boolean value, which has a default value of `true` and is _not required_. This allows to hide the title in the `MetadataDisplay` component if it's included in the metadata of the IIIF manifest. In some use-cases where the title is already visible in some other part of the page, this can  be used to avoid displaying the title in multiple places.
- `showHeading`: accepts a Boolean value, which has a default value of `true` and is _not required_. This enables to hide the `Details` heading on top of the component allowing to customize the user interface.
- `displayOnlyCanvasMetadata`: accepts a Boolean value, which has a default value of `false` and is _not required_. Setting this to `true` indicates Ramp to read and display metadata for the current Canvas  instead of Manifest.
- `displayAllMetadata`: accepts a Boolean value, which has a default value of `false` and is _not required_. Setting this to `true` indicates Ramp to read and display metadata relevant for both current Canvas and Manifest.
- `itemHeading`: accepts a String value, which has a default value of '`Item Details`' and is _not required_. This allows to customize the title for the Manifest level metadata list in the component.
- `sectionHeading`: accepts a String value, which has a default value of '`Section Details`' and is _not required_. This allows to customize the title for the Canvas level metadata list in the component

To import this component from the library;

```js static
import { MetadataDisplay } from '@samvera/ramp';
```

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './MetadataDisplay.scss';
import config from '../../../env.js';
import manifest from '../../../public/manifests/lunchroom_manners.js';

<IIIFPlayer manifest={manifest}>
    <MetadataDisplay showHeading={false}/>
</IIIFPlayer>;
```
