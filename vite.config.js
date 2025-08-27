import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        presets: [
          '@babel/preset-react',
          '@babel/preset-env'
        ],
        plugins: [
          /**
           * React complier must go before other Babel plugins because it needs to analyze and transform
           * components before other plugins modify the code.
           * If this order is reveresed, the code could be changed in ways by other plugins that would prevent
           * React compiler from recognizing React patterns, resulting in missed optimization opportunities
           * or potential compilation errors.
           */
          'babel-plugin-react-compiler',
          [
            '@babel/plugin-transform-runtime',
            {
              helpers: true,
              regenerator: true
            }
          ]
        ]
      }
    })
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
      name: 'samvera/ramp'
    },
    cssCodeSplit: false, // bundle all css into a single file
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'react',
        'react-dom'
      ],
      output: [
        {
          format: 'es',
          entryFileNames: 'ramp.esm.js',
          assetFileNames: 'ramp.css',
          inlineDynamicImports: true
        },
        {
          format: 'cjs',
          entryFileNames: 'ramp.cjs.js',
          assetFileNames: 'ramp.css',
          inlineDynamicImports: true
        },
        {
          format: 'umd',
          entryFileNames: 'ramp.umd.js',
          assetFileNames: 'ramp.css',
          inlineDynamicImports: true,
          name: 'samvera/ramp',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'manifesto.js': 'manifesto'
          }
        }
      ]
    }
  },
  // Optimize bundle by eliminating development-only code
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
