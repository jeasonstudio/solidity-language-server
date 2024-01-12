/** @typedef {import('webpack').Configuration} WebpackConfig **/
const path = require('path');
const webpack = require('webpack');

const projectRoot = process.cwd();

const createConfig = (target) => ({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'none',
  target: target === 'node' ? 'node' : 'webworker',
  output: {
    filename: '[name].js',
    path: path.join(projectRoot, 'dist'),
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.mjs'],
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      http: false,
      https: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: { fullySpecified: false },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // disable chunks by default since web extensions must be a single bundle
    }),
    new webpack.ProvidePlugin({
      process: target === 'node' ? 'process' : 'process/browser', // provide a shim for the global `process` variable
    }),
  ],
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
  },
  performance: {
    hints: false,
  },
  devtool:
    process.env.NODE_ENV === 'production' ? 'eval-cheap-source-map' : 'cheap-module-source-map', // create a source map that points to the original source file
  infrastructureLogging: {
    level: 'log', // enables logging required for problem matchers
  },
  stats: 'minimal',
});

/** @type WebpackConfig */
module.exports = createConfig('web');
module.exports.createConfig = createConfig;
