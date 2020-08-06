const path = require('path');
const glob = require('glob');
const chokidar = require('chokidar');

const { generateFromConfig } = require('./generateFromConfig');

const globPath = path.resolve(__dirname, '..', '..', 'src', 'entries', '**', 'config.yml');
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
