import { writeFile } from 'fs/promises';
import { consola } from 'consola';
import { TorigoyaPluginConfigSchema } from './types.js';
import { PluginParameter } from '@rutan/rpgmaker-plugin-annotation';

export async function writeParameterReader(config: TorigoyaPluginConfigSchema, outputPath: string) {
  const pickFuncList = Array.from(
    new Set([
      ...config.params.map((param) => detectFuncNameFromType(param)),
      ...config.structs.map((struct) => struct.params.map((param) => detectFuncNameFromType(param))).flat(),
    ]),
  )
    .filter(Boolean)
    .sort();

  const structCode = config.structs
    .map((struct) => {
      return `
function readStruct${struct.name}(parameters) {
  parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
  return {
    ${struct.params.map(generateParameterReaderCode).join(',\n    ')}
  };
}
    `.trim();
    })
    .join('\n\n');

  const code = `
import {
  getPluginName,
  ${pickFuncList.join(',\n  ')}
} from '@rutan/torigoya-plugin-common';

${structCode}

export function readParameter() {
  const parameters = PluginManager.parameters(getPluginName());
  return {
    version: ${JSON.stringify(config.version)},
    ${config.params.map(generateParameterReaderCode).join(',\n    ')}
  };
}
`.trim();

  return writeFile(outputPath, code, { encoding: 'utf8' }).then(() => {
    consola.info(`write parameterReader: ${outputPath}`);
  });
}

function generateParameterReaderCode(param: PluginParameter) {
  const defaultValue = readDefaultValue(param.default);

  if (param.type === 'struct') {
    return `${param.name}: readStruct${param.struct}(parseStructObjectParam(parameters[${JSON.stringify(
      param.name,
    )}], ${JSON.stringify(defaultValue)}))`;
  } else if (param.type === 'struct[]') {
    return `${param.name}: parseStructObjectParam(parameters[${JSON.stringify(param.name)}], ${JSON.stringify(
      defaultValue,
    )}).map(readStruct${param.struct})`;
  } else {
    return `${param.name}: ${detectFuncNameFromType(param)}(parameters[${JSON.stringify(param.name)}], ${JSON.stringify(
      defaultValue,
    )})`;
  }
}

type I18nObject<T> = {
  [key: string]: T;
};

function isI18nObject<T>(obj: I18nObject<T> | T): obj is I18nObject<T> {
  if (typeof obj !== 'object') return false;

  obj = obj as I18nObject<T>;

  const keys = Object.keys(obj);
  if (keys.length === 0) return false;

  return keys.every((key) => key.match(/^[a-z]{2}(_[A-Z]{2})?$/));
}

function readDefaultValue<T>(value: T | I18nObject<T>) {
  if (isI18nObject(value)) {
    const keys = Object.keys(value);
    return value[keys[0]];
  } else {
    return value;
  }
}

function detectFuncNameFromType(param: PluginParameter) {
  switch (param.type) {
    case 'boolean':
      return 'parseBooleanParam';
    case 'boolean[]':
      return 'parseBooleanParamList';
    case 'variable':
    case 'switch':
    case 'actor':
    case 'weapon':
    case 'armor':
    case 'class':
    case 'skill':
    case 'item':
    case 'enemy':
    case 'troop':
    case 'state':
    case 'animation':
    case 'tileset':
    case 'common_event':
      return 'parseIntegerParam';
    case 'variable[]':
    case 'switch[]':
    case 'actor[]':
    case 'weapon[]':
    case 'armor[]':
    case 'class[]':
    case 'skill[]':
    case 'item[]':
    case 'enemy[]':
    case 'troop[]':
    case 'state[]':
    case 'animation[]':
    case 'tileset[]':
    case 'common_event[]':
      return 'parseIntegerParamList';
    case 'number':
      if (param.decimals && param.decimals > 0) return 'parseNumberParam';
      else return 'parseIntegerParam';
    case 'number[]':
      if (param.decimals && param.decimals > 0) return 'parseNumberParamList';
      else return 'parseIntegerParamList';
    case 'note':
      return 'parseNoteStringParam';
    case 'note[]':
      return 'parseNoteStringParamList';
    case 'select':
    case 'combo':
    case 'string':
    case 'multiline_string':
    case 'file':
      return 'parseStringParam';
    case 'select[]':
    case 'string[]':
    case 'multiline_string[]':
    case 'file[]':
      return 'parseStringParamList';
    case 'struct':
    case 'struct[]':
      return 'parseStructObjectParam';
    default: {
      const error: never = param;
      throw `unknown parameter: ${error}`;
    }
  }
}
