import MetadataDisplay from './MetadataDisplay';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import mdxDoc from './MetadataDisplay.mdx';

export default {
  title: 'Components/MetadataDisplay',
  component: MetadataDisplay,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

/* Default state for the MetadataDisplay component */
const defaultState = {
  displayOnlyCanvasMetadata: false,
  displayAllMetadata: false,
  displayTitle: true,
  showHeading: true,
  itemHeading: 'Item Details',
  sectionHeading: 'Section Details',
};

export const ManifestMetadata = {
  name: 'Manifest Metadata',
  argTypes: {
    manifestUrl: manifestUrlControl
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MetadataDisplay {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
};

export const CanvasMetadata = {
  name: 'Canvas Metadata',
  argTypes: {
    manifestUrl: manifestUrlControl
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MetadataDisplay {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`,
  },
};

