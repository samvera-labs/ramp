import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

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
  resolve: {
    alias: {
      '@Components': resolve(__dirname, 'src/components'),
      '@Services': resolve(__dirname, 'src/services'),
      '@TestData': resolve(__dirname, 'src/test_data')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      formats: ['umd', 'cjs', 'es'],
      name: 'RampIIIF',
      fileName: (format) => `ramp.${format}.js`,
    },
    cssCodeSplit: false, // bundle all css into a single file
    rollupOptions: {
      external: ['react', 'react-dom', 'video.js'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'video.js': 'videojs'
        },
      }
    }
  },
  // Optimize bundle by eliminating development-only code
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  // Prevent Vite from inlcuding files from the public directory in the build
  publicDir: false,
});
