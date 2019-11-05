var path = require('path');

module.exports = {
  entry: './lib/runaway.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/public/')
  }
};
