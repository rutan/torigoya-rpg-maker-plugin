import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import { babel } from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import applyTemplate from './extensions/rollup/rollup-apply-template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = glob.sync(resolve(__dirname, 'src', 'entries', '*', '*', 'Torigoya*.js')).map((input) => {
  const isMZ = input.includes('TorigoyaMZ');

  return {
    input,
    output: {
      file: `_dist/${basename(input)}`,
      format: 'iife',
    },
    plugins: [
      nodeResolve({
        browser: true,
      }),
      commonjs(),
      isMZ ? null : babel({ babelHelpers: 'bundled' }),
      replace({
        __entryFileName: JSON.stringify(basename(input).replace(/\.[^\.]+$/, '')),
        preventAssignment: false,
      }),
      applyTemplate({
        template: resolve(__dirname, 'src', 'templates', 'plugin.ejs'),
      }),
    ].filter(Boolean),
    onwarn(warning, warn) {
      if (warning.code === 'EVAL') return;
      warn(warning);
    },
  };
});

export default config;
