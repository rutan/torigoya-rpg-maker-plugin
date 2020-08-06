const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { loadConfig } = require('../utils/loadConfig');

const { generateHeader } = require('./generateHeader');
const { generateParameterReader } = require('./generateParameterReader');

async function generateFromConfig(file) {
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

module.exports = {
  generateFromConfig,
};
