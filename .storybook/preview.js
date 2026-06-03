import 'video.js/dist/video-js.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      disableSaveFromUI: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
