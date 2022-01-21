import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import baseUrl from 'rollup-plugin-base-url';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const path = require('path');
const postcssSVG = require('postcss-svg');

const NODE_ENV = 'production';
const projectRootDir = path.resolve(__dirname);

let productionRollup = {
  input: 'src/main.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'cjs',
      plugins: [terser()],
    },
    { file: pkg.module, format: 'es' },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'nulibAdminUIComponents',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'manifesto.js': 'manifesto',
      },
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
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
      ],
    }),
    url({
      include: ['**/*.mp4', '**/*.vtt', '**/*.docx', '**/*.txt', '**/*.json'],
      limit: Infinity,
      publicPath: '/public',
    }),
    baseUrl({
      url: '/iiif-react-media-player/', // the base URL prefix; optional, defaults to /
    }),
    babel({
      babelHelpers: 'runtime',
      babelrc: true,
      exclude: 'node_modules/**',
    }),
    cleaner({
      targets: ['./dist/'],
    }),
    postcss({ extract: path.resolve('dist/iiif-react-media-player.css') }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    resolve(),
    commonjs(),
  ],
};

export default productionRollup;
