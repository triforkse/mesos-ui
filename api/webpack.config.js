var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


var config = {
  entry: [
    'babel-core/polyfill',
    'babel-core/external-helpers',
    './src/app',
  ],
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js',
    publicPath: '/static/',
  },
  externals: nodeModules,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?stage=0&externalHelpers'],
        exclude: /node_modules/,
        include: path.join(__dirname,  'src')
      },
    ],
  },
};

module.exports = config;
