const webpack = require('webpack');

const config = {
  mode: 'production',
  entry: './src/image-snowfall.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'image-snowfall.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {'modules': false}]
              ]
            }
          }
        ],
        exclude: /node_modules/,
      }
    ]
  }
};

module.exports = config;