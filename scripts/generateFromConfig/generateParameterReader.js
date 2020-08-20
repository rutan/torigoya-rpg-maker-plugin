const path = require('path');
const prettier = require('prettier');

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');
function generateParameterReader(config) {
  const state = { paramMap: new Map(), useFunctions: new Set() };

  if (config.parameter) {
    Object.keys(config.parameter).forEach((key) => {
      const param = config.parameter[key];
      tracePickerFromParameter(config, key, param, 'parameter', state);
    });
  }

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const code = `
import { getPluginName } from '../../../../common/getPluginName';
${Array.from(state.useFunctions)
  .map((n) => `import {${n}} from '../../../../common/pickFromParameter/${n}'`)
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
    case 'note':
      return 'pickJsonValueFromParameter';
    case 'select':
    case 'combo':
    case 'string':
    case 'multiline_string':
    case 'file':
    case '':
    case undefined:
      return 'pickStringValueFromParameter';
    default:
      // struct
      return null;
  }
};

function tracePickerFromParameter(config, key, param, paramName, state) {
  if (!param.dummy) {
    let funcName = detectFuncFromType(param.type);

    if (funcName) {
      if (param.array) funcName += 'List';

      state.useFunctions.add(funcName);
      state.paramMap.set(key, `${funcName}(${paramName}, ${JSON.stringify(key)})`);
    } else {
      const type = param.type;

      const structure = config.structures[type];
      if (!structure) throw `unknown structure: ${param.type}`;

      const subState = { useFunctions: state.useFunctions, paramMap: new Map() };
      Object.keys(structure).forEach((subKey) => {
        const subParam = structure[subKey];
        tracePickerFromParameter(config, subKey, subParam, `${paramName}`, subState);
      });

      if (param.array) {
        const code = `((parameters) => {
                  if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                  return parameters.map((parameter) => {
                      if (typeof parameter === 'string') parameter = JSON.parse(parameter);
                      return {
                        ${Array.from(subState.paramMap)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(',\n')}
                      };
                  });
              })(${paramName}.${key})`;
        state.paramMap.set(key, code);
      } else {
        const code = `((parameter) => {
                  if (typeof parameter === 'string') parameter = JSON.parse(parameter);
                  return {
                      ${Array.from(subState.paramMap)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(',\n')}
                  };
              })(${paramName}.${key})`;
        state.paramMap.set(key, code);
      }
    }
  }

  return state;
}

module.exports = {
  generateParameterReader,
};
