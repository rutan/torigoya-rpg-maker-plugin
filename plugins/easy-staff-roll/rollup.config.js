import { defineRollupConfig } from '@rutan/torigoya-plugin-config';

export default defineRollupConfig({
  inputDir: './src',
  outputDir: '../../_dist',
  config: './config.ts',
  build: './src/_build',
  template: '../template.ejs',
});
