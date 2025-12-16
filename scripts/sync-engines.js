import { globSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

(async () => {
  const rootJson = JSON.parse(await readFile('./package.json', 'utf8'));

  const files = globSync(['./packages/**/package.json', './plugins/**/package.json']);

  for (const file of files) {
    if (file.includes('node_modules')) continue;

    const json = JSON.parse(await readFile(file, 'utf8'));
    if (rootJson.packageManager) {
      json.packageManager = rootJson.packageManager;
    } else {
      delete json.packageManager;
    }
    if (rootJson.engines) {
      json.engines = rootJson.engines;
    } else {
      delete json.engines;
    }

    await writeFile(file, JSON.stringify(json, null, 2), 'utf8');
  }
})();
