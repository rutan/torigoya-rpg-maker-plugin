import * as fs from 'fs';
import * as path from 'path';
import cpx from 'cpx2';
import globPkg from 'glob';
const { glob } = globPkg;
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const srcMvPlugins = path.join(dirname, '..', '_dist', 'Torigoya_*.js');
const srcMzPlugins = path.join(dirname, '..', '_dist', 'TorigoyaMZ_*.js');
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

glob.sync(path.join(dirname, '..', 'projects', '*')).forEach((projectDir) => {
  try {
    if (isMvProject(projectDir)) {
      const distDir = path.join(projectDir, 'js', 'plugins');
      if (isWatch) {
        cpx.watch(srcMvPlugins, distDir);
      } else {
        cpx.copy(srcMvPlugins, distDir);
      }
    } else if (isMzProject(projectDir)) {
      const distDir = path.join(projectDir, 'js', 'plugins', 'torigoya');
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
