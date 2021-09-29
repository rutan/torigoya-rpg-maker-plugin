import path from 'path';
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import applyTemplate from './extensions/rollup/rollup-apply-template';

const config = glob.sync(path.join(__dirname, 'src', 'entries', '*', '*', 'Torigoya*.js')).map((input) => {
  return {
    input,
    output: {
      file: `_dist/${path.basename(input)}`,
      format: 'iife',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        retainLines: true,
        babelHelpers: 'bundled',
      }),
      replace({
        globalThis: 'window',
        __entryFileName: JSON.stringify(path.basename(input).replace(/\.[^\.]+$/, '')),
        preventAssignment: false,
      }),
      applyTemplate({
        template: path.resolve(__dirname, 'src', 'templates', 'plugin.ejs'),
      }),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'EVAL') return;
      warn(warning);
    },
  };
});

export default config;
