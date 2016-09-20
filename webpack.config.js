var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
    style: './src/css/style.js'
  },
  output: {
    path: path.join(__dirname, 'public', 'assets', 'bundle'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.s(a|c)ss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  devtool: 'inline-source-map'
}
