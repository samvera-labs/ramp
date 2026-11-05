import StructuredNavigation from './StructuredNavigation';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import mdxDoc from './StructuredNavigation.mdx';

export default {
  title: 'Components/StructuredNavigation',
  component: StructuredNavigation,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

/* Prop controls for the StructuredNavigation component */
const propControls = {
  manifestUrl: manifestUrlControl,
  structurePlayback: { table: { disable: true } },
};


/* Default state for the StructuredNavigation component */
const defaultState = {
  showAllSectionsButton: false,
  sectionsHeading: 'Sections',
};

export const Default = {
  tags: ['!dev'], // Remove this story from side-panel and only display in docs
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <StructuredNavigation {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
};

export const SingleSection = {
  name: 'Single Section Structures',
  argTypes: {
    ...propControls
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <StructuredNavigation {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
};

export const MultiSection = {
  name: 'Multiple Section Structures',
  argTypes: {
    ...propControls
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <StructuredNavigation {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/multi-canvas-manifest.json`,
  },
};

export const StructurePlayback = {
  name: 'Structure Playback in background',
  argTypes: {
    ...propControls,
    // Enable structurePlayback prop as a Boolean in propControls table
    structurePlayback: {
      control: { type: 'boolean' },
      description: 'Turns structure-only playback feature ON/OFF in the background (without toggle button in UI)',
      table: { disable: false }
    }
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <StructuredNavigation {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/multi-canvas-manifest.json`,
    structurePlayback: true
  },
};

export const StructurePlaybackCustomLabel = {
  name: 'Structure playback with UI',
  argTypes: {
    ...propControls,
    // Structure playback settings in Object format with customization
    toggleOn: {
      control: { type: 'boolean' },
      description: 'Toggle ON/OFF structure-playback at the time of intialization.',
      table: { category: 'structurePlayback' },
    },
    label: {
      control: { type: 'text' },
      description: 'Customize the label displayed next to the structure-only playback toggle button.',
      table: { category: 'structurePlayback' },
    }
  },
  render: ({ manifestUrl, label, toggleOn, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, label, toggleOn, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <StructuredNavigation {...args} structurePlayback={{ toggleOn, label }} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/multi-canvas-manifest.json`,
    toggleOn: true,
    label: 'Play structure only'
  }
};
