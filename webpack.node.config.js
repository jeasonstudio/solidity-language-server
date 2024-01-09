/** @typedef {import('webpack').Configuration} WebpackConfig **/
const { createConfig } = require('./webpack.base.config');
const baseConfig = createConfig('node');

/** @type WebpackConfig */
module.exports = [
  {
    ...baseConfig,
    entry: {
      'node/extension': './src/node/extension.ts',
    },
    output: {
      ...baseConfig.output,
      libraryTarget: 'commonjs',
    },
  },
  {
    ...baseConfig,
    entry: {
      'node/server': './src/node/server.ts',
    },
    output: {
      ...baseConfig.output,
      libraryTarget: 'var',
      library: 'serverExportVar',
    },
  },
];
