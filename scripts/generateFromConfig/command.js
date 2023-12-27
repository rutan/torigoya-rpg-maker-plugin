import * as path from 'path';
import { fileURLToPath } from 'node:url';
import { generateFromConfig } from './generateFromConfig.js';
import { glob } from 'glob';
import chokidar from 'chokidar';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const globPath = path.resolve(dirname, '..', '..', 'src', 'entries', '**', 'config.yml');
const isWatch = process.argv.some((n) => n === '-w');

(async () => {
  if (isWatch) {
    const watcher = chokidar.watch(globPath);
    watcher.on('add', (file) => generateFromConfig(file));
    watcher.on('change', (file) => generateFromConfig(file));
  } else {
    const list = glob.sync(globPath);
    for (let file of list) {
      try {
        await generateFromConfig(file);
      } catch (e) {
        console.error(`[ERROR] ${file}`);
        console.error(e);
        console.error('');
      }
    }
  }
})();
