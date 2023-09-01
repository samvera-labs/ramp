AutoAdvanceToggle description

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
