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
- `headingText`: accepts a String value, which has a default value of `Markers` and is _not required_. This value is used in the heading of the component, and enables to customize the text.
- `displayMotivations`: accepts an Array including a list of [supported motivations](https://iiif.io/api/presentation/3.0/#values-for-motivation) for Annotation type resources in IIIF Presentation 3.0 spec, which has a default value of `[]` in which case will display annotations with motivations `'supplementing'/'commenting'/'tagging'` related to the Canvas and is _not required_. For playlist manifests, Ramp sets this value to `['highlighting']` overwriting any given set of values as this component is intented to markers in playlists.
- `showMoreSettings`: accepts a JSON object value, which has a default value of `{ enableShowMore: false, textLineLimit: 6 }` and is _not required_. When configured, it truncates lengthy texts in annotations only displaying given `textLineLimit` number of lines along with a `Show more` button, which user can click to show/hide the rest of the annotation text. If the prop is initialized partially, Ramp applies default prop values to the rest of properties. **Since the words are not getting broken in the middle in the display, sometimes the lines shown could be +/- 1 of the given `textLineLimit` value**

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
