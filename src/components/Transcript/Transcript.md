Transcript component displays any available transcript data in a given IIIF manifest. This component is detached from the Context providers that provides state management, therefore it requires a set of props to respond to the events fired by other components.

`Transcript` component **requires** the following props;

1. `playerID`: to enable transcript synchronization with playback for timed-text.

   **Important**: _When using with a different media player (not the IIIFPlayer), the player should have a `dataset` property called, `data-canvasindex` (starts with 0) which points to the current canvas rendered from the IIIF manfiest._

2. `transcripts`: transcript related data as an array of objects with the following props.

   - `canvasId`: to identify transcript data associated with each Canvas in a multi-canvas IIIF Manifest used in the media player, transcript data is grouped by `canvasId` in the props
   - `items`: list of objects with `title` and `url` props for transcript data files. The `url` prop can point to any of the following file types;

     - IIIF Manifest
       - As a list annotations
       - As an external resource linked through `annotations` property
     - Word document
     - Plain text file
     - WebVTT

To import this component from the library;
```js static
import { Transcript } from '@samvera/ramp';
```

```jsx inside Markdown
import config from '../../../env.js';

<Transcript
  playerID="iiif-media-player"
  transcripts={[
    {
      canvasId: 0,
      items: [
        {
          // Structured JSON blob fed directly from a server
          title: 'Structured JSON object list',
          url: `${config.url}/manifests/${config.env}/lunchroom_base.json`,
        },
        {
          // WebVTT file fed directly from a server
          title: 'WebVTT Transcript',
          url: `${config.url}/lunchroom_manners/lunchroom_manners.vtt`,
        },
        {
          // Directly feeding a Word document from a server
          title: 'Transcript in MS Word',
          url: `${config.url}/transcript_ms.docx`,
        },
        {
          // External plain text transcript fed through `annotations` prop in a IIIF manifest
          title: 'External text transcript',
          url: `${config.url}/manifests/${config.env}/volleyball-for-boys.json`, // URL of the manifest
        },
        {
          // External WebVTT file fed through `annotations` prop in a IIIF manifest
          title: 'External WebVTT transcript',
          url: `${config.url}/manifests/${config.env}/lunchroom_manners.json`, // URL of the manifest
        },
        {
          // Transcript as multiple annotations, with one annotation for each transcript fragment
          title: 'Multiple annotation transcript',
          url: `${config.url}/manifests/${config.env}/transcript-annotation.json`, // URL of the manifest
        },
        {
          // Annotation without supplementing motivation
          title: 'Invalid transcript',
          url: `${config.url}/manifests/${config.env}/invalid-annotation.json`, // URL of the manifest
        },
      ],
    },
  ]}
/>;
```
