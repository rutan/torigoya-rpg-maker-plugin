const path = require('path');
const glob = require('glob');
const chokidar = require('chokidar');

const { generateFromConfig } = require('./generateFromConfig');

const globPath = path.resolve(__dirname, '..', '..', 'src', 'entries', '**', '*.yml');
const isWatch = process.argv.some((n) => n === '-w');

if (isWatch) {
    const watcher = chokidar.watch(globPath);
    watcher.on('add', (file) => generateFromConfig(file));
    watcher.on('change', (file) => generateFromConfig(file));
} else {
    glob.sync(globPath).forEach((file) => generateFromConfig(file));
}
