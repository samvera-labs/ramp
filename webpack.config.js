const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'demo/index.html'),
  filename: './index.html'
});
const isDev = process.argv.indexOf('serve') > -1 ? true : false;

module.exports = {
  entry: './demo/index.js',
  mode: isDev ? 'development' : 'production',
  output: {
    path: path.join(__dirname, 'demo/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    htmlWebpackPlugin,
    new CopyWebpackPlugin({
      patterns: [
        { from: './public' }
      ]
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "@Components": path.resolve(__dirname, 'src/components'),
      "@Json": path.resolve(__dirname, 'src/json'),
      "@Services": path.resolve(__dirname, 'src/services'),
      styles: path.resolve(__dirname, 'src/styles'),
      context: path.resolve(__dirname, 'src/context'),
    },
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    }
  },
  devServer: {
    host: 'localhost',
    port: 3003,
    liveReload: true,
    static: {
      directory: path.resolve(__dirname, "public")
    }
  },
  devtool: 'source-map',
};
