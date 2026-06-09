import MediaPlayer from './MediaPlayer';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import StructuredNavigation from '../StructuredNavigation/StructuredNavigation';
import config from '../../../env.js';
import { hashArgs, manifestUrlControl, videoJSLanguageOptions } from '../../../.storybook/preview.js';
import mdxDoc from './MediaPlayer.mdx';

export default {
  title: 'Components/MediaPlayer',
  component: MediaPlayer,
  parameters: {
    docs: {
      page: mdxDoc,
    },
  },
};

/* Check whether PIP is supported in the current browser, to show/hide enablePIP prop control */
const pipSupported = 'pictureInPictureEnabled' in document ? true : false;

/* Prop controls for the MediaPlayer component */
const propControls = {
  manifestUrl: manifestUrlControl,
  resumeCache: { table: { disable: true } },
  withCredentials: { table: { disable: true } },
  enablePIP: { table: { disable: !pipSupported } },
  language: {
    control: {
      type: 'select',
      labels: { ...videoJSLanguageOptions },
    },
    options: videoJSLanguageOptions ? Object.keys(videoJSLanguageOptions) : [],
  }
};

/* Default state for the MediaPlayer component */
const defaultState = {
  enablePIP: false,
  enablePlaybackRate: false,
  enableTitleLink: false,
  language: 'en',
};

export const MultiCanvas = {
  name: 'Muitiple Canvas [Playlist]',
  argTypes: {
    ...propControls,
    enableFileDownload: { table: { disable: true } },
  },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer {...args} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`
  },
};

export const SingleCanvas = {
  argTypes: { ...propControls },
  render: ({ manifestUrl, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer {...args} />
      <StructuredNavigation />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
    enableFileDownload: false,
  },
};
