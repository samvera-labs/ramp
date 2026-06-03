import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.jsx'],
  addons: [
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Serve public/ assets at root
  staticDirs: ['../public'],
  async viteFinal(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@Components': resolve(__dirname, '../src/components'),
      '@Services': resolve(__dirname, '../src/services'),
    };
    return config;
  },
};

export default config;
