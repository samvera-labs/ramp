MarkersDisplay component, renders annotations in a Canvas with `highlighting` motivation with time information. It displays these Annotation information in a tabular format outside of the Canvas, while displaying a marker on the time-rail of the player for each Annotation.
An example Annotation compatible with the componenet looks as follows;
```js static
  {
    "type": "Annotation",
    "motivation": "highlighting",
    "body": {
      "type": "TextualBody",
      "format": "text/html",
      "value": "Marker"
    },
    "id": "http://example.com/manifest/canvas/1/marker/1",
    "target": "http://example.com/manifest/canvas/1#t=60.001"
  }
```
This component reads manifest data from central state management provided by Contexts. Thus it should be wrapped by context providers using `IIIFPlayer` which is the component in Ramp providing these out of the box.

`MarkersDisplay` component allows the following props;
- `showHeading`: accepts a Boolean value, which has a default value of `true` and is _not required_. This enables to hide the `Markers` heading on top of the component allowing to customize the user interface.

To import this component from the library;

```js static
import { MarkersDisplay } from '@samvera/ramp';
```

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './MarkersDisplay.scss';
import config from '../../../env.js';
import manifest from '../../../public/manifests/playlist.js';

<IIIFPlayer manifest={manifest}>
    <MarkersDisplay showHeading={false}/>
</IIIFPlayer>;
```
