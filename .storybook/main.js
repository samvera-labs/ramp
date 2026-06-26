import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getCodeEditorStaticDirs } from 'storybook-addon-code-editor/getStaticDirs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/components/**/*.mdx',
    '../src/components/**/*.stories.jsx',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    'storybook-addon-code-editor'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Configure static directories for Storybook to serve assets and Manifests
  staticDirs: [
    '../public',
    '../.storybook/manifests:/storybook-manifests',
    ...getCodeEditorStaticDirs(__filename),
  ],
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
