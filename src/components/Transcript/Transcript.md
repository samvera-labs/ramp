Display transcript data.

##### Props Explained:

Since this component is detached from the central state management system, it requires the following
props;

1. `playerID`: to enable transcript synchronization with playback for timed-text
2. `transcripts`: transcript related data in an array

   - `canvasId`: to identify transcript data associated with each Canvas in a multi-canvas IIIF Manifest used in the media player, transcript data is grouped by `canvasId` in the props
   - `items`: list of objects with `title` and `url` props for transcript data files. The `url` prop can point to any of the following file types;

     - IIIF Manifest
       - As a list annotations
       - As an external resource linked through `rendering` property
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
          // Directly feeding a plain text file from a server
          title: 'Transcript in Plain Text',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript_plain.txt',
        },
        {
          // External plain text transcript fed through `rendering` prop in a IIIF manifest
          title: 'External text transcript',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-manifest-rendering.json', // URL of the manifest
        },
        {
          // External JSON file with annotations fed through `rendering` prop in a IIIF manifest
          title: 'External JSON transcript',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-canvas-rendering.json', // URL of the manifest
        },
        {
          // Transcript data as a list of annotations within a IIIF manifest
          title: 'Transcript as Annotations',
          url: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/transcripts/transcript-annotation.json', // URL of the manifest
        },
      ],
    },
  ]}
/>;
```
