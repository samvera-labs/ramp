Transcript component displays any available transcript data in a given IIIF manifest. This component is detached from the Context providers that provides state management, therefore it requires a set of props to respond to the events fired by other components.

`Transcript` component **requires** the following props;

- `playerID`: to enable transcript synchronization with playback for timed-text.

   **Important**: _When using with a different media player (not the IIIFPlayer), the player should have a `dataset` property called, `data-canvasindex` (starts with 0) which points to the current canvas rendered from the IIIF manfiest._
- `manifestUrl`: URL of the Manifest used with the player pointed by the `playerID` prop. `Supplementing` annotations within the Manifest for each Canvas are parsed into a list of transcripts by the component (**added in `@samvera/ramp@3.0.0`**) 
- `showNotes`: display NOTE comments in SRT/VTT timed-text files, which has a default value of `false` and is _not required_. (**added in `@samvera/ramp@3.2.0`**)
- `showMetadata`: display embedded metadata according to the [FADGI guidelines](https://www.digitizationguidelines.gov/guidelines/FADGI_WebVTT_embed_guidelines_v0.1_2024-04-18.pdf) in the header of a given WebVTT file, which has a default value of `false` and is _not required_. (**added in `@samvera/ramp@4.0.1`**)
- `showMoreSettings`: accepts a JSON object value, which has a default value of `{ enableShowMore: false, textLineLimit: 6 }` and is _not required_. When configured, it truncates lengthy cues in **timed transcripts** to only display the given `textLineLimit` number of lines along with a `Show more` button, which user can click to show/hide the rest of the transcript cue. If the prop is initialized partially, Ramp applies default prop values to the rest of properties. _Since the words are not getting broken in the middle in the display, sometimes the lines shown could be +/- 1 of the given `textLineLimit` value_ (**future release**)
- `transcripts`: transcript related data as an array of JSON objects for each Canvas in the Manifest with the following props;

   - `canvasId`: to identify transcript data associated with each Canvas in a multi-canvas IIIF Manifest used in the media player, transcript data is grouped by `canvasId` in the props
   - `items`: list of objects with `title` and `url` props for transcript data files. The `url` prop can point to any of the following file types;

     - IIIF Manifest
       - As a list of `supplementing` annotations
       - As an external resource linked through `annotations` property with `supplementing` motivation
     - Word document (.docx)
     - Plain text file
     - WebVTT
     - SRT
    
    `transcripts` prop has a default value of an empty array.

     **_Identifying machine generated transcripts_**: To identify machine generated transcripts the Transcript component checks for `(Machine generated/machine-generated)` text disregarding case-sensitivity in the given title in the props or in the label in the `annotations`.

__Either `manifestUrl` or `transcripts` is REQUIRED. If both props are given then `transcripts` takes *precedence* over `manifestUrl`__

To import this component from the library;
```js static
import { Transcript } from '@samvera/ramp';
```

```jsx inside Markdown
import config from '../../../env.js';

<Transcript
  playerID="iiif-media-player"
  showNotes={false}
  transcripts={[
    {
      canvasId: 0,
      items: [
        {
          // Structured JSON blob fed directly from a server
          title: 'Structured JSON object list',
          url: `${config.url}/transcripts/lunchroom_base.json`,
        },
        {
          // WebVTT file fed directly from a server
          title: 'WebVTT Transcript (machine generated)',
          url: `${config.url}/lunchroom_manners/lunchroom_manners.vtt`,
        },
        {
          // Directly feeding a Word document from a server
          title: 'Transcript in MS Word',
          url: `${config.url}/transcripts/transcript_ms.docx`,
        },
        {
          // External plain text transcript fed through `annotations` prop in a IIIF manifest
          title: 'External text transcript',
          url: `${config.url}/manifests/${config.env}/volleyball-for-boys.json`, // URL of the manifest
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
        {
          // SRT file
          title: 'SRT Transcript',
          url: `${config.url}/lunchroom_manners/lunchroom_manners.srt`,
        },
      ],
    },
  ]}
/>;
```
