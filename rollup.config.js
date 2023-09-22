import * as path from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import applyTemplate from './extensions/rollup/rollup-apply-template.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config = glob.sync(path.join(dirname, 'src', 'entries', '*', '*', 'Torigoya*.js')).map((input) => {
  const isMZ = input.includes('TorigoyaMZ');

  return {
    input,
    output: {
      file: `_dist/${path.basename(input)}`,
      format: 'iife',
    },
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      isMZ ? null : babel({babelHelpers: 'bundled'}),
      replace({
        __entryFileName: JSON.stringify(path.basename(input).replace(/\.[^\.]+$/, '')),
        preventAssignment: false,
      }),
      applyTemplate({
        template: path.resolve(dirname, 'src', 'templates', 'plugin.ejs'),
      }),
    ].filter(Boolean),
    onwarn(warning, warn) {
      if (warning.code === 'EVAL') return;
      warn(warning);
    },
  };
});

export default config;
