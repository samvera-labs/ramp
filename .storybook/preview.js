import 'video.js/dist/video-js.css';
import '../src/styles/main.scss';

/**
 * Generate a hash for the given arguments. Used in IIIFPlayer component on storybook stories to create a unique key for
 * each prop configuration, which forces React to re-render the component as the user changes the props using controls.
 * @param {Object} args props from component
 * @returns {String}
 */
export const hashArgs = (args) =>
  JSON.stringify(args)
    .split('')
    .reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0)
    .toString(36);

/********** Shared Storybook Controls **********/
export const manifestUrlControl = {
  control: { type: 'text' },
  description: 'IIIF Manifest URL for creating state in Context Providers in Ramp',
  table: { category: 'IIIFPlayer' },
};

export const videoJSLanguageOptions = {
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


/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      disableSaveFromUI: true,
      expanded: true,
    },
    docs: {
      // Display a code tab in the controls panel
      codePanel: true
    },
    options: {
      storySort: {
        method: 'alphabetical', // Sorts items without a specified order alphabetically
        order: [
          'Introduction', ['Getting Started', 'Contributing', 'Releasing'],
          'Components', ['IIIFPlayer', 'MediaPlayer', 'StructuredNavigation', 'Transcript', 'Annotations']]
      },
    },
  },
};

export default preview;
