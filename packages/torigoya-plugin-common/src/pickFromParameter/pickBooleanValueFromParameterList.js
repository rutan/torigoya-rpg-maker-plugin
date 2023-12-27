export function pickBooleanValueFromParameterList(parameter, key, defaultValue = []) {
  if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
  return JSON.parse(parameter[key]).map((n) => `${n}` === 'true');
}
