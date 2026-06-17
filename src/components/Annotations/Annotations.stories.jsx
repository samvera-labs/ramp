import Annotations from './Annotations';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import mdxDoc from './Annotations.mdx';

export default {
  title: 'Components/Annotations',
  component: Annotations,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

export const DefaultMarkers = {
  name: 'Playlist Markers (highlighting motivation)',
  tags: ['!dev'], // Remove this story from side-panel and only display in docs
  render: () => (
    <IIIFPlayer manifestUrl={`${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`}>
      <Annotations showHeading={false} />
    </IIIFPlayer>
  )
};

export const DefaultAnnotations = {
  name: 'Textual Annotations',
  tags: ['!dev'], // Remove this story from side-panel and only display in docs
  render: () => (
    <IIIFPlayer manifestUrl={`${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`}>
      <Annotations showHeading={false} />
    </IIIFPlayer>
  )
};

/* Prop controls for the Annotations component */
const propControls = {
  manifestUrl: manifestUrlControl,
  displayMotivations: {
    control: { type: 'check' },
    description: 'Choose one or more of the IIIF supported Annotation [motivations](https://iiif.io/api/registry/motivations/) from\
    the list to display related annotations in the Canvas.',
    options: ['highlighting', 'commenting', 'supplementing', 'tagging'],
    table: { type: { summary: 'string[] (multi-select)' } },
  },
  showMoreSettings: { table: { disable: true } },
};

export const HighlightingMotivation = {
  name: 'Highlighting motivation [Playlist Manifest]',
  argTypes: { ...propControls },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <br />
      <Annotations {...args} />
    </IIIFPlayer>
  ),
  args: {
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`,
    headingText: 'Markers',
    displayMotivations: ['highlighting'],
    showHeading: true,
  },
};

export const OtherMotivations = {
  name: 'Commenting/supplementing motivation',
  argTypes: {
    ...propControls,
    // Show more settings for textual annotations
    enableShowMore: {
      control: { type: 'boolean' },
      description: 'Enable \'Show more/less\' toggle button for long annotation texts.',
      table: { category: 'showMoreSettings' },
    },
    textLineLimit: {
      control: { type: 'number', min: 1 },
      description: 'Number of lines to show before truncating the annotation text.',
      table: { category: 'showMoreSettings' },
    },
  },
  render: ({ manifestUrl, enableShowMore, textLineLimit, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, enableShowMore, textLineLimit, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <br />
      <Annotations {...args} showMoreSettings={{ enableShowMore, textLineLimit }} />
    </IIIFPlayer>
  ),
  args: {
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
    headingText: 'Annotations',
    displayMotivations: [],
    enableShowMore: false,
    textLineLimit: 6,
    showHeading: true,
  },
};
