SupplementalFiles component reads from `rendering` property at both Manifest and Canvas levels

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