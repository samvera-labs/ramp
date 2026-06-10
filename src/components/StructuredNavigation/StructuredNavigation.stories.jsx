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
    manifestUrl: manifestUrlControl,
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
    manifestUrl: manifestUrlControl,
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
