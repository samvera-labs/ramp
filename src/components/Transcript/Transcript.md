Displays transcript data. This component doesn't use central state management to communicate with other component. i.e. this is detached from the other components.

##### Props Explained:

This component is detached from the central state management system, so it requires the following
props;

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

Please look at the sample code below to get an understanding of different transcript data formats.

This is an example of how the component is rendered with each of this options.

```js static
import { Transcript } from 'iiif-react-media-player';
```

```jsx inside Markdown
import Transcript from '../Transcript/Transcript';

<Transcript
  playerID="iiif-media-player"
  transcripts={[
    {
      canvasId: 0,
      items: [
        {
          // Structured JSON blob fed directly from a server
          title: 'Structured JSON object list',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/lunchroom_base.json',
        },
        {
          // WebVTT file fed directly from a server
          title: 'WebVTT Transcript',
          url: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
        },
        {
          // Directly feeding a Word document from a server
          title: 'Transcript in MS Word',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript_ms.docx',
        },
        {
          // External plain text transcript fed through `annotations` prop in a IIIF manifest
          title: 'External text transcript',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-manifest.json', // URL of the manifest
        },
        {
          // External WebVTT file fed through `annotations` prop in a IIIF manifest
          title: 'External WebVTT transcript',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-canvas.json', // URL of the manifest
        },
        {
          // Transcript as multiple annotations, with one annotation for each transcript fragment
          title: 'Transcript as Annotations',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-annotation.json', // URL of the manifest
        },
        {
          // Annotation without supplementing motivation
          title: 'Invalid transcript',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/rendering-manifest.json', // URL of the manifest
        },
      ],
    },
  ]}
/>;
```
