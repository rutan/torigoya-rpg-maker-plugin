import { globSync, statSync, readFileSync, existsSync, copyFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirname = dirname(fileURLToPath(import.meta.url));

const targetDir = process.argv[process.argv.length - 1];
if (!targetDir) process.exit(1);
if (!statSync(targetDir).isDirectory()) {
  console.error(`${targetDir} is not directory`);
  process.exit(1);
}

globSync(join(currentDirname, '..', '_dist', '*.js')).forEach((file) => {
  const content = readFileSync(file, 'utf-8');
  const match = content.match(/v\.\d+\.\d+\.\d+/);
  if (!match || !match[0]) {
    throw `cannot read 'version' : ${file}`;
  }

  const name = basename(file);
  const version = match[0].replace(/\./g, '_').replace('v_', 'v');
  const nameWithVersion = `${name.replace(/\.[^\.]+$/, '')}_${version}.js`;

  const targetWithVersion = join(targetDir, nameWithVersion);
  if (existsSync(targetWithVersion)) return;

  console.log(file);

  copyFileSync(file, targetWithVersion);
  copyFileSync(file, join(targetDir, name));
});
