import * as fs from 'fs';
import * as path from 'path';
import { mkdirp } from 'mkdirp';
import { loadConfig } from '../utils/loadConfig.js';
import { generateHeader } from './generateHeader.js';
import { generateParameterReader } from './generateParameterReader.js';

export async function generateFromConfig(file) {
  const config = loadConfig(file);
  const distDir = path.resolve(file, '..', '_build');
  mkdirp.sync(distDir);

  for (let key of Object.keys(config)) {
    const currentConfig = config[key];
    fs.writeFileSync(path.resolve(distDir, `${key}_header.js`), generateHeader(currentConfig));

    const parameterReader = await generateParameterReader(currentConfig);
    fs.writeFileSync(path.resolve(distDir, `${key}_parameter.js`), parameterReader);
  }

  console.log(`build config: ${file}`);
  console.log('');
}
