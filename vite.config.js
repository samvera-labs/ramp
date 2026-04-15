import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Read package.json for build outputs
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const baseAlias = {
  '@Components': resolve(__dirname, 'src/components'),
  '@TestData': resolve(__dirname, 'src/test_data'),
  '@Services': resolve(__dirname, 'src/services'),
  // Node.js polyfills for browser compatibility
  'stream': 'stream-browserify',
  'path': 'path-browserify',
};

const preactAlias = {
  ...baseAlias,
  // Alias 'react' to 'preact/compat'
  'react': 'preact/compat',
  'react-dom/client': 'preact/compat/client',
  'react-dom': 'preact/compat',
};

const isPreact = process.env.PREACT === 'true';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // React Compiler Babel plugin is incompatible with Preact
          ...(!isPreact ? [['babel-plugin-react-compiler', { target: '19' }]] : []),
        ],
      },
    }),
  ],
  // Handle .js files that contains JSX: this allows to not rename them to .jsx
  esbuild: {
    loader: 'jsx',
    include: /.*\.[jt]sx?$/,
    exclude: /node_modules/,
  },
  resolve: {
    alias: isPreact ? preactAlias : baseAlias,
  },
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  // CSS handling using the modern Dart Sass compiler API
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  // Build configuration for library
  build: isPreact ? {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/main.standalone.js'),
      name: 'RampIIIF',
      formats: ['umd'],
      fileName: () => 'ramp.standalone.umd.js',
    },
    rollupOptions: {
      // No external dependencies, bundles all aliasing react -> preact
      external: [],
      output: { globals: {} },
    },
  } : {
    outDir: 'dist',
    emptyOutDir: true,
    // Library mode configuration
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'RampIIIF',
      formats: ['esm', 'cjs', 'umd'],
      fileName: (format) => `ramp.${format}.js`,
    },
    // Rollup options for external dependencies
    rollupOptions: {
      external: [
        ...Object.keys(pkg.peerDependencies || {})
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'manifesto.js': 'manifesto',
          'mime-db': 'mimeDB',
          'dompurify': 'DOMPurify',
          'mammoth': 'mammoth',
          'classnames': 'cx'
        },
      },
    },
  },
  // Prevent including files from the public directory in the build
  publicDir: false,
});
