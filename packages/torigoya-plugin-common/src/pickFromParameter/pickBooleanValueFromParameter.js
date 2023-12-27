export function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
  return `${parameter[key] || defaultValue}` === 'true';
}
