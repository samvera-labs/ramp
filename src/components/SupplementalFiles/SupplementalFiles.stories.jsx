import SupplementalFiles from './SupplementalFiles';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import mdxDoc from './SupplementalFiles.mdx';

export default {
  title: 'Components/SupplementalFiles',
  component: SupplementalFiles,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

/* Default state for the SupplementalFiles component */
const defaultState = {
  itemHeading: 'Item Files',
  sectionHeading: 'Section Files',
  showHeading: true,
};

export const Default = {
  name: 'Both Manifest & Canvas Files',
  argTypes: {
    manifestUrl: manifestUrlControl,
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <SupplementalFiles {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
};

export const OnlyCanvasMetadata = {
  name: 'Only Canvas Files',
  argTypes: {
    manifestUrl: manifestUrlControl,
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <SupplementalFiles {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`,
  },
};
