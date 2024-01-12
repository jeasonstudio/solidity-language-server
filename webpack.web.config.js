/** @typedef {import('webpack').Configuration} WebpackConfig **/
const { createConfig } = require('./webpack.base.config');
const baseConfig = createConfig('web');

/** @type WebpackConfig */
module.exports = [
  {
    // entry: extension
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
    // entry: worker
    ...baseConfig,
    entry: {
      'web/server': './src/web/server.ts',
      'web/compiler': './src/web/compiler.ts',
    },
    output: {
      ...baseConfig.output,
      libraryTarget: 'var',
      library: 'serverExportVar',
    },
  },
];
