import { writeFile } from 'fs/promises';
import { consola } from 'consola';
import { TorigoyaPluginConfigSchema } from './types.js';
import { PluginParameter } from '@rutan/rpgmaker-plugin-annotation';

export async function writeParameterReader(config: TorigoyaPluginConfigSchema, outputPath: string) {
  const pickFuncList = Array.from(new Set([...config.params.map((param) => detectFuncNameFromType(param.type))]))
    .filter(Boolean)
    .sort();

  const structCode = config.structs
    .map((struct) => {
      return `
function readStruct${struct.name}(parameters) {
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
  if (param.type === 'struct') {
    return `${param.name}: parameters[${JSON.stringify(param.name)}] === undefined ? ${JSON.stringify(
      param.default,
    )} : readStruct${param.struct}(parameters[${JSON.stringify(param.name)}])`;
  } else if (param.type === 'struct[]') {
    return `${param.name}: parameters[${JSON.stringify(param.name)}] === undefined ? ${JSON.stringify(
      param.default,
    )} : parameters[${JSON.stringify(param.name)}].map(readStruct${param.struct})`;
  } else {
    return `${param.name}: ${detectFuncNameFromType(param.type)}(parameters, '${param.name}', ${JSON.stringify(
      param.default,
    )})`;
  }
}

const detectFuncNameFromType = (type: PluginParameter['type']) => {
  switch (type) {
    case 'boolean':
      return 'pickBooleanValueFromParameter';
    case 'boolean[]':
      return 'pickBooleanValueFromParameterList';
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
      return 'pickIntegerValueFromParameter';
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
      return 'pickIntegerValueFromParameterList';
    case 'number':
      return 'pickNumberValueFromParameter';
    case 'number[]':
      return 'pickNumberValueFromParameterList';
    case 'note':
      return 'pickNoteStringValueFromParameter';
    case 'note[]':
      return 'pickNoteStringValueFromParameterList';
    case 'select':
    case 'combo':
    case 'string':
    case 'multiline_string':
    case 'file':
      return 'pickStringValueFromParameter';
    case 'select[]':
    case 'string[]':
    case 'multiline_string[]':
    case 'file[]':
      return 'pickStringValueFromParameterList';
    case 'struct':
    case 'struct[]':
      return '';
    default: {
      const error: never = type;
      throw `unknown type: ${error}`;
    }
  }
};
