import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src/core',
      format: 'esm',
      outDir: './dist/server',
      ext: 'js',
    },
  ],
  declaration: true,
  failOnWarn: false,
});
