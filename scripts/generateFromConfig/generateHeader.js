const defaultConfig = {
  author: {
    en: 'Rutan(ru_shalm)',
    ja: 'Ruたん（ru_shalm）',
  },
  license: 'public domain',
};

export function generateHeader(config) {
  const locales = Object.keys(config.title);
  const target = config.target;

  // descriptions
  const descriptions = locales
    .map((lang, i) => {
      const lines = [];
      const pluginName = `${config.title[lang]}${config.version ? ` (v.${config.version})` : ''}`;

      // info
      if (target) lines.push(`@target ${target}`);
      lines.push(`@plugindesc ${pluginName}`);
      lines.push(`@author ${(config.author || defaultConfig.author)[lang]}`);
      lines.push(`@license ${config.license || defaultConfig.license}`);
      if (config.version) lines.push(`@version ${config.version}`);
      if (config.url) lines.push(`@url ${config.url}`);
      ['base', 'orderAfter', 'orderBefore'].forEach((key) => {
        const items = config[key];
        if (!items) return;
        if (Array.isArray(items)) {
          items.forEach((item) => {
            lines.push(`@${key} ${item}`);
          });
        } else {
          lines.push(`@${key} ${items}`);
        }
      });

      lines.push('@help');
      lines.push(pluginName);
      lines.push('https://torigoya-plugin.rutan.dev');
      lines.push('');
      config.body[lang]
        .trim()
        .split(/\r?\n/)
        .forEach((l) => lines.push(l));

      if (config.parameter && Object.keys(config.parameter).length > 0) {
        lines.push('');
        lines.push(generateProperties(config.parameter, lang, target));
      }

      // commands
      if (config.commands) {
        Object.keys(config.commands)
          .map((commandKey) => {
            const command = config.commands[commandKey];
            lines.push('');
            lines.push(`@command ${commandKey}`);
            lines.push(generateProp('text', lang, command['name']));
            if (command['desc']) {
              generateMultilineProp('desc', lang, command['desc']).forEach((line) => lines.push(line));
            }

            if (command.parameter) {
              lines.push('');
              // :(
              lines.push(generateProperties(command.parameter, lang).replace(/@param\s+/g, '@arg '));
            }
          })
          .join('\n\n');
      }

      return `/*:${i === 0 ? '' : lang}
 * ${lines.join('\n * ')}
 */`;
    })
    .join('\n\n');

  // struct
  const structures = config.structures
    ? locales
        .map((lang, i) => {
          return Object.keys(config.structures)
            .map((structureKey) => {
              const structure = config.structures[structureKey];
              const lines = [];

              lines.push(generateProperties(structure, lang));

              return `/*~struct~${structureKey}:${i === 0 ? '' : lang}
 * ${lines.join('\n * ')}
 */`;
            })
            .join('\n\n');
        })
        .join('\n\n')
    : '';

  return [descriptions, structures].filter(Boolean).join('\n\n');
}

function generateProperties(properties, lang, target = '') {
  const lines = [];

  Object.keys(properties).forEach((key, i) => {
    const { name, dummy, desc, type, array, ...others } = properties[key];

    if (i > 0) lines.push('');

    if (dummy) {
      lines.push(`@param ${key}`);
      if (typeof dummy === 'object') {
        lines.push(`@text ${dummy[lang]}`);
      } else {
        lines.push(`@text ${dummy}`);
      }
      return;
    }

    lines.push(`@param ${key}`);
    if (name) lines.push(generateProp('text', lang, name));
    if (desc) {
      generateMultilineProp('desc', lang, desc).forEach((line) => lines.push(line));
    }

    if (type) {
      if (type.match(/^[A-Z]/)) {
        lines.push(`@type struct<${type}>${array ? '[]' : ''}`);
      } else {
        const realType = convertType(type, target);
        lines.push(`@type ${realType}${array ? '[]' : ''}`);
        switch (type) {
          case 'file':
          case 'animation':
            lines.push('@require true');
            break;
        }
      }
    } else {
      lines.push('@type string');
    }

    Object.keys(others).forEach((key) => {
      const item = others[key];
      if (key === 'default' && array) {
        lines.push(generateProp(key, lang, JSON.stringify(item)));
      } else if (key === 'option' && Array.isArray(item)) {
        item.forEach((subItem) => {
          Object.keys(subItem).forEach((subKey) => {
            const subValue = subItem[subKey];
            lines.push(generateProp(subKey === 'name' ? 'option' : subKey, lang, subValue));
          });
        });
      } else {
        (Array.isArray(item) ? item : [item]).forEach((value) => {
          lines.push(generateProp(key, lang, value));
        });
      }
    });
  });

  return lines.join('\n * ');
}

function convertType(type, target = '') {
  switch (type) {
    case 'integer':
      return 'number';
    case 'multiline_string':
      return target === 'MV' ? 'note' : type;
    default:
      return type;
  }
}

function generateProp(propName, lang, value, defaultValue = null) {
  if (typeof value === 'object') {
    return `@${propName} ${value[lang].toString().replace(/\r?\n/g, '')}`;
  } else if (value !== undefined) {
    return `@${propName} ${value.toString().replace(/\r?\n/g, '')}`;
  } else if (defaultValue !== undefined) {
    return `@${propName} ${defaultValue.toString().replace(/\r?\n/g, '')}`;
  } else {
    return '';
  }
}

function generateMultilineProp(propName, lang, value, defaultValue = null) {
  const valueResult = (() => {
    if (typeof value === 'object') return value[lang];
    else if (value !== undefined) return value;
    else if (defaultValue !== undefined) return defaultValue;
    else return '';
  })()
    .toString()
    .trim()
    .split(/\r?\n/);

  return [`@${propName} ${valueResult.shift()}`, ...valueResult];
}
