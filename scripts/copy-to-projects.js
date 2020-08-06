const fs = require('fs');
const path = require('path');
const cpx = require('cpx');
const glob = require('glob');

const srcMvPlugins = path.join(__dirname, '..', '_dist', 'Torigoya_*.js');
const srcMzPlugins = path.join(__dirname, '..', '_dist', 'TorigoyaMZ_*.js');
const isWatch = process.argv.some((n) => n === '-w');

glob.sync(path.join(__dirname, '..', 'projects', '*')).forEach((projectDir) => {
  try {
    const projectType = fs.readFileSync(path.join(projectDir, 'Game.rpgproject'), 'utf-8');
    const distDir = path.join(projectDir, 'js', 'plugins');
    if (projectType.startsWith('RPGMV')) {
      // MV Project
      if (isWatch) {
        cpx.watch(srcMvPlugins, distDir);
      } else {
        cpx.copy(srcMvPlugins, distDir);
      }
    } else if (true) {
      // FIXME
      // MZ Project
      if (isWatch) {
        cpx.watch(srcMzPlugins, distDir);
      } else {
        cpx.copy(srcMzPlugins, distDir);
      }
    }
  } catch (_) {}
});
