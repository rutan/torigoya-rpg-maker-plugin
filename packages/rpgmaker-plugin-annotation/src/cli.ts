#!/usr/bin/env node
import { program } from 'commander';
import * as fs from 'fs';
import { version } from '../package.json';
import { generateAnnotation } from './generateAnnotation';
import { sanitize } from './sanitize';

(() => {
  program.version(`v.${version}`);

  program
    .argument('<input>')
    .option('-o --out <out>', 'output file')
    .option('-l --languages <languages...>', 'languages')
    .option('--defaultLanguage <defaultLanguage>', 'default language')
    .showHelpAfterError()
    .action((input, options, _command) => {
      const languages = options.languages || ['en', 'ja'];
      const defaultLanguage = options.defaultLanguage || languages[0];

      const json = fs.readFileSync(input, 'utf-8');
      const data = JSON.parse(json);
      const result = generateAnnotation(sanitize(data), { languages, defaultLanguage });

      if (options.out) {
        fs.writeFileSync(options.out, result, 'utf-8');
      } else {
        console.log(result);
      }
    });

  program.parse(process.argv);
})();
