import * as webpack from 'webpack';
import path from 'path';

export default {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: [path.resolve(__dirname, './lib/index.ts')],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: 'CancelableAPI',
    libraryTarget: 'umd',
  },
  externals: [
    'axios',
    'p-cancelable'
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts'],
  },
} as webpack.Configuration;
