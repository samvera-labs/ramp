import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  root: './demo',
  plugins: [
    react({
      babel: {
        plugins: [
          // Add the React Compiler Babel plugin
          ['babel-plugin-react-compiler', { target: '19' }],
        ],
      },
    }),
    commonjs()
  ],
  // Handle .js files that contains JSX
  esbuild: {
    loader: 'jsx',
    include: /.*\.js$/,
    exclude: /node_modules/,
  },
  // Resolve path aliases and Node.js polyfills
  resolve: {
    alias: {
      '@Components': resolve(__dirname, 'src/components'),
      '@TestData': resolve(__dirname, 'src/test_data'),
      '@Services': resolve(__dirname, 'src/services'),
      styles: resolve(__dirname, 'src/styles'),
      context: resolve(__dirname, 'src/context'),
      'path': 'path-browserify',
      'stream': 'stream-browserify',
      'buffer': 'buffer',
    }
  },
  // Environment variables and polyfills
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  // CSS handling using the modern Dart Sass compiler API
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  // Dev server configuration
  server: {
    host: '0.0.0.0',
    port: 3003,
  },
  // Use public directory for static assets
  publicDir: '../public',
  // Build configuration for demo build
  build: {
    outDir: './dist',
    emptyOutDir: true,
  }
});
