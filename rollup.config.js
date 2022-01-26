import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import baseUrl from 'rollup-plugin-base-url';
const webbundle = require('rollup-plugin-webbundle');
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const dotenv = require('dotenv');
const path = require('path');
const postcssSVG = require('postcss-svg');

const NODE_ENV = 'production';
const projectRootDir = path.resolve(__dirname);

// Get the root path (assuming your webpack config is in the root of your project!)
const currentPath = path.join(__dirname);

// Create the fallback path (the production .env)
const basePath = currentPath + '/.env';

// We're concatenating the environment name to our filename to specify the correct env file!
const envPath = basePath + '.' + env.ENVIRONMENT;

// Check if the file exists, otherwise fall back to the production .env
const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// Set the path parameter in the dotenv config
const fileEnv = dotenv.config({ path: finalPath }).parsed;

// reduce it to a nice object, the same as before (but with the variables from the file)
const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
  return prev;
}, {});

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
    // url({
    //   include: ['**/*.mp4', '**/*.vtt', '**/*.docx', '**/*.txt', '**/*.json'],
    //   limit: Infinity,
    //   publicPath: '/iiif-react-media-player',
    // }),
    // baseUrl({
    //   url: '/iiif-react-media-player', // the base URL prefix; optional, defaults to /
    //   // staticImports: true, // also rebases static `import _ from "…"`; optional, defaults to false
    // }),
    // webbundle({
    //   baseURL: 'https://samvera-labs.github.io/iiif-react-media-player/',
    //   static: { dir: 'static' },
    // }),
    // new webpack.DefinePlugin(envKeys),
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
