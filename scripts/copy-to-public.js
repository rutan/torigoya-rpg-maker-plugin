const fs = require('fs');
const path = require('path');
const glob = require('glob');

const targetDir = process.argv[process.argv.length - 1];
if (!targetDir) process.exit(1);
if (!fs.statSync(targetDir).isDirectory()) {
  console.error(`${targetDir} is not directory`);
  process.exit(1);
}

glob.sync(path.join(__dirname, '..', '_dist', '*.js')).forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const match = content.match(/v\.\d+\.\d+\.\d+/);
  if (!match || !match[0]) {
    throw `cannot read 'version' : ${file}`;
  }

  const name = path.basename(file);
  const version = match[0].replace(/\./g, '_').replace('v_', 'v');
  const nameWithVersion = `${name.replace(/\.[^\.]+$/, '')}_${version}.js`;

  const targetWithVersion = path.join(targetDir, nameWithVersion);
  if (fs.existsSync(targetWithVersion)) return;

  console.log(file);

  fs.copyFileSync(file, targetWithVersion);
  fs.copyFileSync(file, path.join(targetDir, name));
});
