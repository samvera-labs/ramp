Annotations component, renders items from `annotations` property in a given Canvas. This component was previously known as `MarkersDisplay` and was renamed to `Annotations` in `@samvera/ramp@v4.0.0` as support was extended to display annotations with other motivations.

In `@samvera/ramp` versions prior to `4.0.0` this component only supported the display of annotations with `highlighting` motivation, and from `4.0.0` onwards this has added support to display time-synced annotations with `commenting`, `supplementing`, and `tagging` motivations.

This component reads manifest data from central state management provided by Contexts. Thus it should be wrapped by context providers using `IIIFPlayer` which is the component in Ramp providing these out of the box.

`Annotations` component allows the following props;
- `showHeading`: accepts a Boolean value, which has a default value of `true` and is _not required_. This enables hiding the `Markers` heading on top of the component allowing customization of the user interface.
- `headingText`: accepts a String value, which has a default value of `Markers` and is _not required_. This value is used in the heading of the component and enables customization of the text.
- `displayMotivations`: accepts an Array including a list of [supported motivations](https://iiif.io/api/registry/motivations/) for Annotation type resources in IIIF Presentation 3.0 spec, which has a default value of `[]` in which case will display annotations with motivations `'supplementing'/'commenting'/'tagging'` related to the Canvas and is _not required_. For playlist manifests, Ramp sets this value to `['highlighting']` overwriting any given set of values as this component is intented to markers in playlists. (**added in `@samvera/ramp@4.0.0`**)
- `showMoreSettings`: accepts a JSON object value, which has a default value of `{ enableShowMore: false, textLineLimit: 6 }` and is _not required_. When configured, it truncates lengthy texts in annotations only displaying given `textLineLimit` number of lines along with a `Show more` button, which user can click to show/hide the rest of the annotation text. If the prop is initialized partially, Ramp applies default prop values to the rest of properties. _Since the words are not getting broken in the middle in the display, sometimes the lines shown could be +/- 1 of the given `textLineLimit` value_ (**added in `@samvera/ramp@4.0.0`**)

To import this component from the library;

```js static
import { Annotations } from '@samvera/ramp';
```

Annotations with `highlighting` motivation, are displayed in a tabular format outside the player, while displaying a marker (^) on the progress bar of the player at the respective time-point for each Annotation. An example `highlighting` Annotation compatible with this format would look as follows;
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

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './Annotations.scss';
import config from '../../../env.js';
import manifest from '../../../public/manifests/playlist.js';

<IIIFPlayer manifest={manifest}>
    <Annotations showHeading={false}/>
</IIIFPlayer>;
```

`Annotations` component with extended support added in **`@samvera/ramp@4.0.0`** displays time-synced annotations with `commenting`, `supplementing`, and `tagging` motivations. These annotations are displayed in a similar manner to transcripts, which can auto-scroll with media playback. These can be either time-point or time-range annotations. Information in the `body` of the Annotation with `purpose/motivation: "tagging"` are displayed as tags next to the timestamp.
An example Annotation compatible with this format would look as follows;
```js static
  {
    "type": "Annotation",
    "motivation": ["supplementing", "commenting"],
    "body": [
      {
        "type": "TextualBody",
        "value": "[Laughter]",
        "format": "text/plain",
        "purpose": "commenting"
      },
      {
        "type": "TextualBody",
        "value": "Unknown",
        "format": "text/plain",
        "purpose": "tagging"
      }
    ],
    "target": "http://example.com/manifest/canvas#t=164820.0"
  },
```

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './Annotations.scss';
import config from '../../../env.js';
// Manifest with supplementing annotations
import lunchroom from '../../../public/manifests/lunchroom_manners.js';

<IIIFPlayer manifest={lunchroom}>
    <Annotations showHeading={false}/>
</IIIFPlayer>;
```
