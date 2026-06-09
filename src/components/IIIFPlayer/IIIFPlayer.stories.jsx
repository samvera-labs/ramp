import IIIFPlayer from './IIIFPlayer';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import manifest from '../../../.storybook/manifests/lunchroom_manners.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import config from '../../../env.js';
import mdxDoc from './IIIFPlayer.mdx';

export default {
  title: 'Components/IIIFPlayer',
  component: IIIFPlayer,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

export const WithManifestObject = {
  name: 'With manifest object',
  tags: ['!dev'], // Remove this story from side-panel and only display in docs
  render: (args) => (
    <IIIFPlayer {...args}>
      <div className="iiif-player-demo">
        <MediaPlayer />
      </div>
    </IIIFPlayer>
  ),
  args: { manifest },
};

export const WithManifestUrl = {
  name: 'With manifestUrl',
  argTypes: {
    manifestUrl: manifestUrlControl,
    manifest: { table: { disable: true } },
  },
  render: (args) => (
    <IIIFPlayer key={hashArgs(args)} {...args}>
      <div className="iiif-player-demo">
        <MediaPlayer />
        <StructuredNavigation />
      </div>
    </IIIFPlayer>
  ),
  args: {
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
};
