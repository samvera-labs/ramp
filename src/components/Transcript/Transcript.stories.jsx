import React, { useEffect, useRef } from 'react';
import Transcript from './Transcript';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import mdxDoc from './Transcript.mdx';

export default {
  title: 'Components/Transcript',
  component: Transcript,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

/* Prop controls for the Transcript component */
const propControls = {
  playerID: { table: { disable: true } },
  showMoreSettings: { table: { disable: true } },
  search: { table: { disable: true } },
  // Show more settings for cues
  enableShowMore: {
    control: { type: 'boolean' },
    description: 'Enable Show more/less toggle for long annotation texts',
    table: { category: 'showMoreSettings' },
  },
  textLineLimit: {
    control: { type: 'number', min: 1 },
    description: 'Number of lines in the cue to show before truncating',
    table: { category: 'showMoreSettings' },
  },
  // Search settings
  enableSearch: {
    control: { type: 'boolean' },
    description: 'Enable/disable the transcript search feature',
    table: { category: 'search' },
  },
  showMarkers: {
    control: { type: 'boolean' },
    description: 'Show/hide search hit markers',
    table: { category: 'search' },
  },
  matchesOnly: {
    control: { type: 'boolean' },
    description: 'Only display transcript lines with search hits',
    table: { category: 'search' },
  },
};

/* Default state for the Transcript component */
const defaultState = {
  showNotes: false,
  showMetadata: false,
  showMoreSettings: { enableShowMore: false, textLineLimit: 6 },
  manifestUrl: '',
  enableShowMore: false,
  textLineLimit: 6,
  enableSearch: false,
  showMarkers: true,
  matchesOnly: false,
};

/* Build `showMoreSettings` and `search` prop objects from the flat Storybook args structure,
  so that the individual controls take effect in Transcript component */
const buildProps = ({ enableShowMore, textLineLimit, enableSearch, showMarkers, matchesOnly, ...args }) => ({
  ...args,
  showMoreSettings: { enableShowMore, textLineLimit },
  search: enableSearch ? { showMarkers, matchesOnly } : false,
});

/* Ignore search-related controls in the hashing function because these need to only refresh the Transcript
component not the entire UI. Including them, causes a full re-render of the page which resets the other
changes the user has made in the like search queries. */
const hashStoryArgs = (args) => {
  const { enableSearch, showMarkers, matchesOnly, ...rest } = args;
  return hashArgs(rest);
};

/* List of all supported transcript formats using transcripts prop */
const transcriptsProp = {
  transcripts: [
    {
      canvasId: 0,
      items: [
        {
          title: 'Structured JSON object list', // Structured JSON blob fed directly from a server
          url: `${config.url}/transcripts/lunchroom_base.json`,
        },
        {
          title: 'WebVTT Transcript (machine generated)', // WebVTT file fed directly from a server
          url: `${config.url}/lunchroom_manners/lunchroom_manners.vtt`,
        },
        {
          title: 'Transcript in MS Word', // Directly feeding a Word document from a server
          url: `${config.url}/transcripts/transcript_ms.docx`,
        },
        {
          /* External transcripts fed through `annotations` props in a IIIF manifest.
          This Manifest has the following `supplementing` annotations: 
          - Manifest level,
            - Captions in plain text format in Manifest
          - Canvas level,
            - First External Text Transcript in Canvas (machine-generated)
            - Second External Text Transcript in Canvas (machine-generated) */
          title: 'External text transcript',
          url: `${config.url}/manifests/${config.env}/volleyball-for-boys.json`,
        },
        {
          // Transcript as multiple inline annotations, with one annotation for each transcript cue
          title: 'Multiple annotation transcript',
          url: `${config.url}/manifests/${config.env}/transcript-annotation.json`,
        },
        {
          title: 'Invalid transcript', // Annotation without supplementing motivation
          url: `${config.url}/manifests/${config.env}/invalid-annotation.json`,
        },
        {
          title: 'SRT Transcript', // SRT file
          url: `${config.url}/lunchroom_manners/lunchroom_manners.srt`,
        },
      ],
    },
  ]
};

/* Stub the media player for decoupled transcript stories. This provides a dummy DOM
  element for the Transcript's initialization process to setup the component without
  crashing. This helps to render only the Transcript component for the docs. */
const StubPlayer = ({ playerID }) => (
  <div
    id={playerID || 'iiif-media-player'}
    ref={(el) => {
      if (el && !el.player) {
        el.player = { canvasIndex: 0, currentTime: () => 0, on: () => { }, off: () => { } };
      }
    }}
  />
);

/* A plain HTML5 <video> element with a minimal player interface to demonstrate the
use of Transcript component with a non-Ramp media player. The minimal player interface
facilitates the scroll position sync with playback. */
const NonRampPlayer = ({ playerID, source }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (video && container && !container.player) {
      container.player = {
        canvasIndex: 0,
        // Acts as both a getter and a setter similar to VideoJS
        currentTime: (time) => {
          if (time === undefined) return video.currentTime;
          video.currentTime = time;
        },
        on: (event, cb) => video.addEventListener(event, cb),
        off: (event, cb) => video.removeEventListener(event, cb),
      };
    }
  }, []);

  return (
    <div id={playerID || 'iiif-media-player'} ref={containerRef}>
      <video ref={videoRef} controls data-canvasindex="0">
        <source src={source} type="video/mp4" />
      </video>
    </div>
  );
};

export const DecoupledTranscripts = {
  tags: ['!dev'], // Remove this story from side-panel and only display in docs
  argTypes: { ...propControls },
  parameters: {
    docs: {
      description: {
        story: 'Use the primary button for the main call-to-action on a page.',
      },
    },
  },
  render: (args) => (
    <div key={hashStoryArgs(args)}>
      <StubPlayer playerID={args.playerID} />
      <Transcript {...buildProps(args)} />
    </div>
  ),
  args: {
    ...defaultState,
    ...transcriptsProp
  },
};

export const DecoupledManifestUrl = {
  name: 'With manifestUrl prop and Ramp player [decoupled]',
  argTypes: {
    ...propControls,
    // Remove 'transcripts' prop from controls for this example
    transcripts: { table: { disable: true } },
    // Remove showMarkers prop from controls because without Context providers search hit markers don't work
    showMarkers: { table: { disable: true } }
  },
  render: (args) => (
    <div key={hashStoryArgs(args)}>
      <IIIFPlayer key={hashStoryArgs(args)} manifestUrl={args.manifestUrl}>
        <MediaPlayer />
      </IIIFPlayer>
      <Transcript {...buildProps(args)} />
    </div>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
};

export const WithExternalPlayer = {
  name: 'With external player [decoupled]',
  argTypes: {
    ...propControls,
    // Remove 'manifestUrl' prop from controls for this example
    manifestUrl: { table: { disable: true } },
    // Use a separate category to facilitate providing external media source URL for the non-Ramp player
    sourceUrl: {
      control: { type: 'text' },
      description: 'Media file URL used to set up the non-Ramp player (not a Transcript prop)',
      table: { category: 'external player' },
    },
    // Remove showMarkers prop from controls because without Context providers search hit markers don't work
    showMarkers: { table: { disable: true } }
  },
  render: (args) => (
    <div key={hashStoryArgs(args)}>
      <NonRampPlayer
        playerID={args.playerID}
        source={args.sourceUrl}
      />
      <Transcript {...buildProps(args)} />
    </div>
  ),
  args: {
    ...defaultState,
    transcripts: [
      {
        canvasId: 0,
        items: [
          { title: 'Structured JSON object list', url: `${config.url}/transcripts/lunchroom_base.json` },
          { title: 'WebVTT Transcript (machine generated)', url: `${config.url}/lunchroom_manners/lunchroom_manners.vtt` },
          { title: 'SRT Transcript', url: `${config.url}/lunchroom_manners/lunchroom_manners.srt` },
        ]
      }
    ],
    sourceUrl: `${config.url}/lunchroom_manners/medium/lunchroom_manners_512kb.mp4`
  },
};

export const WithStateProviders = {
  name: 'With IIIFPlayer wrapper',
  argTypes: {
    ...propControls,
    manifestUrl: manifestUrlControl,
    // Remove 'transcripts' prop from controls for this example
    transcripts: { table: { disable: true } },
  },
  render: (args) => (
    <IIIFPlayer key={hashStoryArgs(args)} manifestUrl={args.manifestUrl}>
      <MediaPlayer />
      <Transcript {...buildProps(args)} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    playerID: 'iiif-media-player',
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
};
