var path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public', 'assets', 'js'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map'
}