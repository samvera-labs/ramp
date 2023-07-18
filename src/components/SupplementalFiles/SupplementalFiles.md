SupplementalFiles component reads from `rendering` property and `supplementing` annotations in the Manifest. This component reads manifest data from central state management provided by Contexts. Thus it should be wrapped by context providers using `IIIFPlayer` which is the component in Ramp providing these out of the box.

`SupplementalFiles` component allows the following props;
- `itemHeading`: accepts a String value, which has a default value of '`Item files`' and is _not required_. This allows to customize the title for the Manifest level file list in the component.
- `sectionHeading`: accepts a String value, which has a default value of '`Section files`' and is _not required_. This allows to customize the title for the Canvas level file list(s) in the component
- `showHeading`: accepts a Boolean value, which has a default value of `true` and is _not required_. This enables to hide the '`Files`' heading on top of the component allowing to customize the user interface.

To import this component from the library;

```js static
import { SupplementalFiles } from '@samvera/ramp';
```

```jsx inside Markdown
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import './SupplementalFiles.scss';
import config from '../../../env.js';
import manifest from '../../../public/manifests/lunchroom_manners.js';

<IIIFPlayer manifest={manifest}>
  <SupplementalFiles showHeading={false} />
</IIIFPlayer>;
```
