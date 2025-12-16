import { readFileSync, globSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { watch } from 'chokidar';
import { consola } from 'consola';
import cpx from 'cpx2';

const curerntDirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(curerntDirname, '..');
const projectsDir = join(rootDir, 'projects');

function isMvProject(projectDir) {
  try {
    const projectType = readFileSync(join(projectDir, 'Game.rpgproject'), 'utf-8');
    return projectType.startsWith('RPGMV');
  } catch (_) {
    return false;
  }
}

function isMzProject(projectDir) {
  try {
    const projectType = readFileSync(join(projectDir, 'Game.rmmzproject'), 'utf-8');
    return projectType.startsWith('RPGMZ');
  } catch (_) {
    return false;
  }
}

function copyFile(filePath, projects) {
  const fileName = basename(filePath);
  projects.forEach(({ dir, type }) => {
    if (fileName.startsWith('Torigoya_') && type === 'mv') {
      cpx.copySync(filePath, join(dir, 'js', 'plugins'));
      consola.success(`Copy ${fileName} to ${dir}`);
    } else if (fileName.startsWith('TorigoyaMZ_') && type === 'mz') {
      cpx.copySync(filePath, join(dir, 'js', 'plugins', 'torigoya'));
      consola.success(`Copy ${fileName} to ${dir}`);
    }
  });
}

(() => {
  const isWatch = process.argv.some((n) => n === '-w');
  const projects = globSync(join(projectsDir, '*'))
    .map((projectDir) => {
      if (isMvProject(projectDir)) {
        return { dir: projectDir, type: 'mv' };
      } else if (isMzProject(projectDir)) {
        return { dir: projectDir, type: 'mz' };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  if (isWatch) {
    const watcher = watch(join(rootDir, '_dist'));
    watcher.on('add', (filePath) => copyFile(filePath, projects));
    watcher.on('change', (filePath) => copyFile(filePath, projects));
  } else {
    globSync(join(rootDir, '_dist', '*.js')).forEach((filePath) => copyFile(filePath, projects));
  }
})();
