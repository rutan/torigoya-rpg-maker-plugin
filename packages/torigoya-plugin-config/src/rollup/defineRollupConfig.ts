import { basename } from 'node:path';
import { glob } from 'glob';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import pluginRPGMakerConfig from './pluginRPGMakerConfig.js';

export function defineRollupConfig({
  config,
  build,
  inputDir,
  outputDir,
  template,
}: {
  inputDir: string;
  outputDir: string;
  config: string;
  build: string;
  template: string;
}) {
  return glob.sync(`${inputDir}/Torigoya*.js`).map((input) => {
    const isMZ = input.includes('TorigoyaMZ');

    return {
      input,
      output: {
        file: `${outputDir}/${basename(input)}`,
        format: 'iife',
      },
      plugins: [
        nodeResolve({
          browser: true,
        }),
        isMZ ? null : babel({ babelHelpers: 'bundled' }),
        // @ts-ignore
        replace({
          __entryFileName: JSON.stringify(basename(input).replace(/\.[^\.]+$/, '')),
          preventAssignment: false,
        }),
        pluginRPGMakerConfig({
          config,
          buildDir: build,
          template,
        }),
      ].filter(Boolean),
      onwarn(warning: any, warn: (obj: any) => void) {
        if (warning.code === 'EVAL') return;
        warn(warning);
      },
    };
  });
}
