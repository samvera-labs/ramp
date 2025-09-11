import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import commonjs from 'vite-plugin-commonjs';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const isDev = process.env.NODE_ENV !== 'production';

// Utility function to copy directory recursively
function copyDirSync(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const items = readdirSync(src);
  for (const item of items) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);

    if (statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Plugin to copy only lunchroom_manners related files
function copyLunchroomMannersFiles() {
  return {
    name: 'copy-lunchroom-manners',
    closeBundle() {
      if (!isDev) {
        const publicDir = resolve(__dirname, 'public');
        const outDir = resolve(__dirname, 'demo/dist');

        // Copy lunchroom_manners resources directory
        const srcDir = join(publicDir, 'lunchroom_manners');
        const destDir = join(outDir, 'lunchroom_manners');
        if (existsSync(srcDir)) {
          copyDirSync(srcDir, destDir);
        }

        // Copy only lunchroom_manners related prod manifest
        const dir = 'prod';
        const dirPath = join(publicDir, 'manifests', dir);

        if (existsSync(dirPath)) {
          const filePath = join(dirPath, 'lunchroom_manners.json');
          if (existsSync(filePath)) {
            const destDir = join(outDir, 'manifests', dir);
            const destFile = join(destDir, 'lunchroom_manners.json');

            if (!existsSync(destDir)) {
              mkdirSync(destDir, { recursive: true });
            }
            copyFileSync(filePath, destFile);
          }
        }
      }
    }
  };
}

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
    commonjs(),
    copyLunchroomMannersFiles()
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
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
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
  // Use public directory for static assets in development mode
  publicDir: isDev ? '../public' : false,
  // Build configuration for demo build
  build: {
    outDir: './dist',
    emptyOutDir: false,

  }
});
