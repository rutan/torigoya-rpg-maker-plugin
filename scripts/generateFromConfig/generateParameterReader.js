const path = require('path');
const prettier = require('prettier');

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');
function generateParameterReader(config) {
  const state = { paramMap: new Map(), useFunctions: new Set() };
  config.parameter.forEach((param) => {
    tracePickerFromParameter(config, param, 'parameter', state);
  });

  return prettier.resolveConfig(prettierConfig).then((options) => {
    const code = `
import { getPluginName } from '../../../../common/getPluginName';
${Array.from(state.useFunctions)
  .map((n) => `import {${n}} from '../../../common/pickFromParameter/${n}'`)
  .join('\n')}

export function readParameter() {
  const parameter = PluginManager.parameters(getPluginName());
  return {
    version: ${JSON.stringify(config.version)},
    ${Array.from(state.paramMap)
      .map(([k, v]) => `${k}: ${v}`)
      .join(',\n')}
  };
}
        `;

    return prettier.format(code, options);
  });
}

const detectFuncFromType = (type) => {
  if (!type) return;
  switch (type) {
    case 'boolean':
      return 'pickBooleanValueFromParameter';
    case 'integer':
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
    case 'number':
      return 'pickNumberValueFromParameter';
    case 'select':
    case 'combo':
    case 'string':
    case 'note':
    case 'file':
    case '':
    case undefined:
      return 'pickStringValueFromParameter';
    default:
      // struct
      return null;
  }
};

function tracePickerFromParameter(config, param, paramName, state) {
  if (!param.dummy) {
    let funcName = detectFuncFromType(param.type);
    if (funcName) {
      if (param.array) funcName += 'List';

      state.useFunctions.add(funcName);
      state.paramMap.set(param.key, `${funcName}(${paramName}, ${JSON.stringify(param.key)})`);
    } else {
      const structure = config.structure.find((structure) => structure.name === param.type);
      if (!structure) throw `unknown structure: ${param.type}`;

      const subState = { useFunctions: state.useFunctions, paramMap: new Map() };
      structure.properties.forEach((subParam) => {
        tracePickerFromParameter(config, subParam, `${paramName}.${param.key}`, subState);
      });

      const code = `((parameter) => {
                ${
                  paramName.includes('.')
                    ? ''
                    : `if (typeof parameter === 'string') parameter = JSON.parse(parameter);\n`
                }return {
                    ${Array.from(subState.paramMap)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(',\n')}
                };
            })(${paramName}.${param.key})`;
      state.paramMap.set(param.key, code);
    }
  }

  return state;
}

module.exports = {
  generateParameterReader,
};
