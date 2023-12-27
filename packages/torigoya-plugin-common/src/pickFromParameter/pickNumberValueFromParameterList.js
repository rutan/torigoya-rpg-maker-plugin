export function pickNumberValueFromParameterList(parameter, key, defaultValue = []) {
  if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
  return JSON.parse(parameter[key]).map(parseFloat);
}
