import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Read package.json for build outputs
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Add the React Compiler Babel plugin
          ['babel-plugin-react-compiler', { target: '19' }],
        ],
      },
    }),
  ],
  // Handle .js files that contains JSX
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  // Resolve path aliases and Node.js polyfills
  resolve: {
    alias: {
      '@Components': resolve(__dirname, 'src/components'),
      '@TestData': resolve(__dirname, 'src/test_data'),
      '@Services': resolve(__dirname, 'src/services'),
      // Node.js polyfills for browser compatibility
      'stream': 'stream-browserify',
      'path': 'path-browserify',
    },
  },
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  // CSS handling
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  // Build configuration for library
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Library mode configuration
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'RampIIIF',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        return `ramp.${format}.js`;
      },
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
          'sanitize-html': 'sanitizeHTML',
          'mammoth': 'mammoth',
          'classnames': 'cx',
        },
      },
    },
    // Generate source maps
    sourcemap: true,
    // minify: 'terser',
    minify: false,
  },
  // Prevent inlcuding files from the public directory in the build
  publicDir: false,
});
