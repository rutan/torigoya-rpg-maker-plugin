import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

(async () => {
  const rootJson = JSON.parse(await readFile('./package.json', 'utf8'));

  const files = await glob(['./packages/**/package.json', './plugins/**/package.json']);
  for (const file of files) {
    if (file.includes('node_modules')) continue;

    const json = JSON.parse(await readFile(file, 'utf8'));
    if (rootJson.packageManager) json.packageManager = rootJson.packageManager;
    if (rootJson.engines) json.engines = rootJson.engines;
    delete json.volta;

    await writeFile(file, JSON.stringify(json, null, 2), 'utf8');
  }
})();
