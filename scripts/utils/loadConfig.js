const fs = require('fs');
const YAML = require('yaml');

function loadConfig(configPath) {
  const config = YAML.parse(fs.readFileSync(configPath, 'utf-8'), { merge: true });

  Object.keys(config).forEach((key) => {
    // 大文字始まりでないkeyは削除 (extends用)
    if (!key.match(/^[A-Z]/)) {
      delete config[key];
      return;
    }

    const currentConfig = config[key];
    switch (currentConfig.target || 'MV') {
      case 'MV':
        convertConfigForMV(currentConfig);
        break;
      case 'MZ':
        convertConfigForMZ(currentConfig);
        break;
    }
  });

  return config;
}

function convertConfigForMV(config) {
  Object.keys(config).forEach((key) => {
    const item = config[key];
    if (key === 'type') {
      // multiline_string -> note
      if (item === 'multiline_string') {
        config[key] = 'note';
      }
    } else if (typeof item === 'object' && !Array.isArray(item)) {
      convertConfigForMV(item);
    }
  });
}

function convertConfigForMZ(config) {
  // nothing to do
}

module.exports = {
  loadConfig,
};
