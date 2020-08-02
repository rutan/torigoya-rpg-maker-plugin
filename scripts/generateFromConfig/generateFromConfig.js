const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const mkdirp = require('mkdirp');

const {generateHeader} = require('./generateHeader');
const {generateParameterReader} = require('./generateParameterReader');

async function generateFromConfig(file) {
    const baseName = path.basename(file, '.yml');

    const config = YAML.parse(fs.readFileSync(file, 'utf-8'));
    const distDir = path.resolve(file, '..', '_build');
    mkdirp.sync(distDir);
    fs.writeFileSync(path.resolve(distDir, `${baseName}_header.js`), generateHeader(config));

    const parameterReader = await generateParameterReader(config);
    fs.writeFileSync(path.resolve(distDir, `${baseName}_parameter.js`), parameterReader);
    console.log(`build config: ${file}`);
}

module.exports = {
    generateFromConfig
};
