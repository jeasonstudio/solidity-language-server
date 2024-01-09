/** @typedef {import('webpack').Configuration} WebpackConfig **/
const { createConfig } = require('./webpack.base.config');
const baseConfig = createConfig('web');

/** @type WebpackConfig */
module.exports = [
  {
    ...baseConfig,
    entry: {
      'web/extension': './src/web/extension.ts',
    },
    output: {
      ...baseConfig.output,
      libraryTarget: 'commonjs',
    },
  },
  {
    ...baseConfig,
    entry: {
      'web/server': './src/web/server.ts',
    },
    output: {
      ...baseConfig.output,
      libraryTarget: 'var',
      library: 'serverExportVar',
    },
  },
];
