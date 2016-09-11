var path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map'
}