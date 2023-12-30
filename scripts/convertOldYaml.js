// 旧式のYAMLを新式に雑に変換するスクリプト

import fs from 'fs';
import YAML from 'yaml';

function convert(obj) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    switch (key) {
      case 'target': {
        if (!Array.isArray(value)) {
          obj[key] = [value];
        }
        break;
      }
      case 'body': {
        delete obj[key];
        obj['help'] = value;
        break;
      }
      case 'parameter': {
        delete obj[key];
        obj['params'] = convertParameter(value);
        break;
      }
      case 'commands': {
        obj['commands'] = convertCommands(value);
        break;
      }
      case 'structures': {
        delete obj[key];
        obj['structs'] = convertStructures(value);
        break;
      }
    }
  });
}

function convertParameter(obj) {
  return Object.keys(obj).map((name) => {
    let { type, name: text, array, desc, dummy, ...value } = obj[name];

    if (dummy) {
      return {
        name,
        type: 'string',
        text: dummy,
      };
    }

    if (type && type.match(/^[A-Z]/)) {
      value['struct'] = type;
      type = 'struct';
    }

    if (type === 'integer') {
      type = 'number';
    }

    if (type !== 'string') {
      if (typeof value['default'] === 'string') {
        try {
          value['default'] = JSON.parse(value['default']);
        } catch (_e) {
          // ignore
        }
      }
    }

    if (value.option) {
      value.options = value.option;
      delete value.option;
    }

    return {
      name,
      type: `${type || 'string'}${array ? '[]' : ''}`,
      text,
      description: desc ? desc.trim() : undefined,
      ...value,
    };
  });
}

function convertCommands(obj) {
  return Object.keys(obj).map((name) => {
    let { name: text, desc, parameter } = obj[name];

    return {
      name,
      text,
      description: desc,
      args: parameter ? convertParameter(parameter) : [],
    };
  });
}

function convertStructures(obj) {
  return Object.keys(obj).map((name) => {
    return {
      name,
      params: convertParameter(obj[name]),
    };
  });
}

(() => {
  const input = process.argv[2];
  if (!input) return;

  const src = fs.readFileSync(input, 'utf-8');
  const doc = YAML.parse(src, { merge: true });

  Object.keys(doc).forEach((key) => {
    if (!key.match(/^[A-Z]/)) {
      delete doc[key];
      return;
    }

    convert(doc[key]);
  });

  const output = YAML.stringify(doc);
  console.log(output);
})();
