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
  },
  // Resume cache settings
  enable: {
    control: { type: 'boolean' },
    description: 'Enable/disable saving playback position in localStorage for the last partially played Canvas --omit saving playback times\
    within the first and last 5 second range of the media-- in the current Manifest.',
    table: { category: 'resumeCache' },
  },
  ttlDays: {
    control: { type: 'number', min: 1 },
    description: 'Number of days a saved Manifest entry is retained before it is removed from localStorage due to LRU eviction or expiration.',
    table: { category: 'resumeCache' },
  },
};

/* Default state for the MediaPlayer component */
const defaultState = {
  enablePIP: false,
  enablePlaybackRate: false,
  enableTitleLink: false,
  language: 'en',
  enable: false,
  ttlDays: 30,
  maxItems: 200,
};

export const MultiCanvas = {
  name: 'Muitiple Canvas [Playlist]',
  argTypes: {
    ...propControls,
    enableFileDownload: { table: { disable: true } },
  },
  render: ({ manifestUrl, enable, ttlDays, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, enable, ttlDays, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer {...args} resumeCache={{ enable, ttlDays }} />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/playlist-manifest.json`
  },
};

export const SingleCanvas = {
  argTypes: { ...propControls },
  render: ({ manifestUrl, enable, ttlDays, ...args }) => (
    <IIIFPlayer key={hashArgs({ manifestUrl, enable, ttlDays, ...args })} manifestUrl={manifestUrl}>
      <MediaPlayer {...args} resumeCache={{ enable, ttlDays }} />
      <StructuredNavigation />
    </IIIFPlayer>
  ),
  args: {
    ...defaultState,
    manifestUrl: `${config.url}/storybook-manifests/${config.env}/lunchroom-manners.json`,
    enableFileDownload: false,
  },
};
