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
  console.log(file);
  const name = path.basename(file);

  const targetCurrent = path.join(targetDir, name);
  if (fs.existsSync(targetCurrent)) return;

  fs.copyFileSync(file, targetCurrent);

  const latestName = name.replace(/_v\d+_\d+_\d+\.js$/, '.js');
  fs.copyFileSync(file, path.join(targetDir, latestName));
});
