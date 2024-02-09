AutoAdvanceToggle component provides the ability to turn on/off auto-advance from a Canvas to the next when viewing a IIIF Manifest. It reads the `behavior` property at the Manifest-level, and then parses and stores the given values to a Boolean flag within Ramp's state management.

When `behavior` is not specified in the Manifest, this is set to not auto-advance as the default temporal behavior due to not specified being the same as `no-auto-advance` per the [IIIF Presentation 3.0 specification](https://iiif.io/api/presentation/3.0/#behavior).

`AutoAdvanceToggle` component allows the following props;
- `label`: accepts a String value, which has a default value of '`Autoplay`' and is _not required_. This allows to customize the label for the toggle.
- `showLabel`: accepts a Boolean value, which has a default value of `true` and is _not required_. This enables to hide toggle label.

To import this component from the library;

```js static
import { AutoAdvanceToggle } from '@samvera/ramp';
```

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './AutoAdvanceToggle.scss';
import config from '../../../env.js';
import manifest from '../../../public/manifests/lunchroom_manners.js';

<IIIFPlayer manifest={manifest}>
  <AutoAdvanceToggle/>
</IIIFPlayer>;
```
