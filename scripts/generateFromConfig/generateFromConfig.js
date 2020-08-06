const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const mkdirp = require('mkdirp');

const { generateHeader } = require('./generateHeader');
const { generateParameterReader } = require('./generateParameterReader');

async function generateFromConfig(file) {
  const config = YAML.parse(fs.readFileSync(file, 'utf-8'));
  const distDir = path.resolve(file, '..', '_build');
  mkdirp.sync(distDir);

  for (let key in Object.keys(config)) {
    if (!key.match(/^[A-Z]/)) continue;

    const currentConfig = config[key];
    fs.writeFileSync(path.resolve(distDir, `${key}_header.js`), generateHeader(currentConfig));

    const parameterReader = await generateParameterReader(currentConfig);
    fs.writeFileSync(path.resolve(distDir, `${key}_parameter.js`), parameterReader);
  }

  console.log(`build config: ${file}`);
}

module.exports = {
  generateFromConfig,
};
