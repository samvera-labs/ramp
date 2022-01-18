const path = require('path');

module.exports = {
  exampleMode: 'expand',
  skipComponentsWithoutExample: true,
  styleguideDir: 'docs',
  assetsDir: 'public/',
  require: [
    // 'babel-polyfill',
    path.join(__dirname, 'node_modules/video.js/dist/video-js.css'),
  ],
  webpackConfig: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@Components': path.resolve(__dirname, 'src/components/'),
        '@Services': path.resolve(__dirname, 'src/services/'),
      },
    },
    module: {
      // Enable sourcemaps for debugging webpack's output.
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/transform-runtime'],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ],
    },
  },
};
