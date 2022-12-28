import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const path = require('path');
const projectRootDir = path.resolve(__dirname);

let demoRollup = {
  input: 'demo/index.js',
  output: {
    file: 'demo/dist/bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'manifesto.js': 'manifesto',
      mammoth: 'mammoth',
    }
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'react'
  ],
  plugins: [
    alias({
      entries: [
        {
          find: '@Components',
          replacement: path.resolve(projectRootDir, 'src/components'),
        },
        {
          find: '@Json',
          replacement: path.resolve(projectRootDir, 'src/json'),
        },
        {
          find: '@Services',
          replacement: path.resolve(projectRootDir, 'src/services'),
        },
        {
          find: 'context',
          replacement: path.resolve(projectRootDir, 'src/context'),
        },
        {
          find: 'styles',
          replacement: path.resolve(projectRootDir, 'src/styles'),
        }
      ],
    }),
    babel({
      babelHelpers: 'runtime',
      babelrc: true,
      exclude: 'node_modules/**',
    }),
    cleaner({
      targets: ['./demo/dist/'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      preventAssignment: true
    }),
    postcss(),
    resolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    json(),
    serve({
      open: true,
      verbose: true,
      contentBase: ["demo"],
      host: "localhost",
      port: 3000,
    }),
    livereload({ watch: "/demo/dist" }),
  ],
};

export default demoRollup;
