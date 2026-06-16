import AutoAdvanceToggle from './AutoAdvanceToggle';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import mdxDoc from './AutoAdvanceToggle.mdx';

export default {
  title: 'Components/AutoAdvanceToggle',
  component: AutoAdvanceToggle,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

export const Default = {
  tags: ['!dev'], // Remove this story from side-panel and only display in docs
  render: (args) => (
    <IIIFPlayer manifestUrl={`${config.url}/storybook-manifests/${config.env}/multi-canvas-manifest.json`}>
      <AutoAdvanceToggle {...args} />
    </IIIFPlayer>
  ),
  args: {
    label: 'Autoplay',
    showLabel: true,
  },
};

export const MultiCanvasManifest = {
  name: 'Multi-Canvas with Autoplay',
  argTypes: {
    manifestUrl: manifestUrlControl,
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <br />
      <AutoAdvanceToggle {...args} />
    </IIIFPlayer>
  ),
  args: {
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/multi-canvas-manifest.json`,
    label: 'Autoplay',
    showLabel: true,
  },
};

export const PlaylistManifest = {
  name: 'Playlist Manifest with Autoplay',
  argTypes: {
    manifestUrl: manifestUrlControl,
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <br />
      <AutoAdvanceToggle {...args} />
    </IIIFPlayer>
  ),
  args: {
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`,
    label: 'Autoplay',
    showLabel: true,
  },
};
