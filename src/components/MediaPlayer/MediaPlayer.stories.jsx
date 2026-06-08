import MediaPlayer from './MediaPlayer';
import IIIFPlayer from '../IIIFPlayer/IIIFPlayer';
import manifest from '../../../public/manifests/lunchroom_manners.js';

export default {
  title: 'Components/MediaPlayer',
  component: MediaPlayer,
  parameters: {
    docs: {
      description: {
        component:
          'Provides a VideoJS-based player for audio and video media from a IIIF Manifest. ' +
          'Must be wrapped by IIIFPlayer. Boolean props add control bar buttons when enabled.',
      },
    },
  },
};

const videoJSLanguageOptions = {
  'ar': 'Arabic (ar)', 'az': 'Azerbaijani (az)', 'ba': 'Bashkir (ba)',
  'bg': 'Bulgarian (bg)', 'bn': 'Bengali (bn)', 'ca': 'Catalan (ca)',
  'cs': 'Czech (cs)', 'cy': 'Welsh (cy)', 'da': 'Danish (da)',
  'de': 'German (de)', 'el': 'Greek (el)', 'en': 'English (en)',
  'en-GB': 'English UK (en-GB)', 'es': 'Spanish (es)', 'et': 'Estonian (et)',
  'eu': 'Basque (eu)', 'fa': 'Persian (fa)', 'fi': 'Finnish (fi)',
  'fr': 'French (fr)', 'gd': 'Scottish Gaelic (gd)', 'gl': 'Galician (gl)',
  'he': 'Hebrew (he)', 'hi': 'Hindi (hi)', 'hr': 'Croatian (hr)',
  'hu': 'Hungarian (hu)', 'it': 'Italian (it)', 'ja': 'Japanese (ja)',
  'ko': 'Korean (ko)', 'lv': 'Latvian (lv)', 'mr': 'Marathi (mr)',
  'nb': 'Norwegian Bokmål (nb)', 'nl': 'Dutch (nl)', 'nn': 'Norwegian Nynorsk (nn)',
  'np': 'Nepali (np)', 'oc': 'Occitan (oc)', 'pl': 'Polish (pl)',
  'pt-BR': 'Portuguese Brazil (pt-BR)', 'pt-PT': 'Portuguese Portugal (pt-PT)',
  'ro': 'Romanian (ro)', 'ru': 'Russian (ru)', 'sk': 'Slovak (sk)',
  'sl': 'Slovenian (sl)', 'sr': 'Serbian (sr)', 'sv': 'Swedish (sv)',
  'te': 'Telugu (te)', 'th': 'Thai (th)', 'tr': 'Turkish (tr)',
  'uk': 'Ukrainian (uk)', 'vi': 'Vietnamese (vi)', 'zh-CN': 'Chinese Simplified (zh-CN)',
  'zh-Hans': 'Chinese Simplified Hans (zh-Hans)', 'zh-Hant': 'Chinese Traditional (zh-Hant)',
  'zh-TW': 'Chinese Taiwan (zh-TW)',
};

/* Check whether PIP is supported in the current browser, to show/hide enablePIP prop control */
const pipSupported = 'pictureInPictureEnabled' in document ? true : false;

export const Default = {
  argTypes: {
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
  },
  render: (args) => (
    <IIIFPlayer key={JSON.stringify(args)} manifest={manifest}>
      <MediaPlayer {...args} />
    </IIIFPlayer>
  ),
  args: {
    enableFileDownload: false,
    enablePIP: false,
    enablePlaybackRate: false,
    enableTitleLink: false,
    language: 'en',
  },
};
