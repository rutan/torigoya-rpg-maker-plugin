const fs = require('fs');
const path = require('path');
const cpx = require('cpx');
const glob = require('glob');

const srcMvPlugins = path.join(__dirname, '..', '_dist', 'Torigoya_*.js');
const srcMzPlugins = path.join(__dirname, '..', '_dist', 'TorigoyaMZ_*.js');
const isWatch = process.argv.some((n) => n === '-w');

function isMvProject(projectDir) {
  try {
    const projectType = fs.readFileSync(path.join(projectDir, 'Game.rpgproject'), 'utf-8');
    return projectType.startsWith('RPGMV');
  } catch (_) {
    return false;
  }
}

function isMzProject(projectDir) {
  try {
    const projectType = fs.readFileSync(path.join(projectDir, 'Game.rmmzproject'), 'utf-8');
    return projectType.startsWith('RPGMZ');
  } catch (_) {
    return false;
  }
}

glob.sync(path.join(__dirname, '..', 'projects', '*')).forEach((projectDir) => {
  try {
    const distDir = path.join(projectDir, 'js', 'plugins');
    if (isMvProject(projectDir)) {
      if (isWatch) {
        cpx.watch(srcMvPlugins, distDir);
      } else {
        cpx.copy(srcMvPlugins, distDir);
      }
    } else if (isMzProject(projectDir)) {
      if (isWatch) {
        cpx.watch(srcMzPlugins, distDir);
      } else {
        cpx.copy(srcMzPlugins, distDir);
      }
    }
  } catch (e) {
    console.error(e);
  }
});
