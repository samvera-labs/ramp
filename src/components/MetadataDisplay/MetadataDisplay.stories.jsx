import MetadataDisplay from './MetadataDisplay';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl } from '../../../.storybook/preview.js';
import mdxDoc from './MetadataDisplay.mdx';
import { expect, userEvent, within } from 'storybook/test';

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
  displayOnlyRangeMetadata: false,
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
    displayOnlyCanvasMetadata: true,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`,
  },
};

export const RangeMetadata = {
  name: 'Range Metadata',
  argTypes: {
    manifestUrl: manifestUrlControl
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer />
      <p style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Click on either 'Using Soap' or 'There will be Cake' Range items to display their respective Range metadata.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2em' }}>
        <StructuredNavigation />
        <MetadataDisplay {...args} />
      </div>
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    displayOnlyRangeMetadata: true,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('shows placeholder message when no Range is active', async () => {
      const metadataDisplay = await canvas.findByTestId('metadata-display');
      expect(within(metadataDisplay).getByTestId('metadata-display-message')).toBeInTheDocument();
    });

    await step('selecting a Range with metadata updates the metadata display', async () => {
      const rangeLink = await canvas.findByRole('button', { name: /Using Soap/i });
      await userEvent.click(rangeLink);

      const metadataDisplay = await canvas.findByTestId('metadata-display');
      await expect(within(metadataDisplay).findByText('Using Soap')).resolves.toBeInTheDocument();
      expect(within(metadataDisplay).getByText('Phil washed his hands well, with lots of soap.')).toBeInTheDocument();
      expect(within(metadataDisplay).queryByTestId('metadata-display-message')).not.toBeInTheDocument();
    });
  },
};
