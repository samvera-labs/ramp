const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'demo/index.html'),
  filename: './index.html'
});

module.exports = {
  entry: './demo/index.js',
  mode: 'development',
  output: {
    path: path.join(__dirname, 'demo/dist'),
    filename: 'bundle.js'
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
    port: 3000
  },
  devtool: 'source-map',
};
