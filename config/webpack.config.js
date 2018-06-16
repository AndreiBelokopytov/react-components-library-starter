const path = require('path');
const _ = require('lodash');
const localPaths = require('./local_paths');

const libraryNameKebab = _.kebabCase(process.env.LIBRARY_NAME);

module.exports = {
  entry: path.join(localPaths.LIB_FOLDER, 'index.ts'),
  output: {
    path: path.resolve(localPaths.DIST_FOLDER),
    filename: `${libraryNameKebab}.js`,
    library: process.env.LIBRARY_NAME,
    libraryTarget: 'umd'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      { 
        enforce: "pre", 
        test: /\.js$/, 
        loader: "source-map-loader" 
      }
    ]
  },
  externals: {
    "react": "React"
  }
}
