const _ = require('lodash');
const config = require('./webpack.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const libraryNameKebab = _.kebabCase(process.env.LIBRARY_NAME);

module.exports = {
  ...config,
  output: {
    ...config.output,
    filename: `${libraryNameKebab}.min.js`
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
};
