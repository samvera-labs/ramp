import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const NODE_ENV = 'production';

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
        '@emotion/core': 'core',
      },
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    babel({
      babelHelpers: 'runtime',
      babelrc: true,
      exclude: 'node_modules/**',
    }),
    cleaner({
      targets: ['./dist/'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    resolve(),
    commonjs(),
  ],
};

export default productionRollup;
