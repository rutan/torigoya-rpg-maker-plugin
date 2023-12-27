export function pickIntegerValueFromParameterList(parameter, key, defaultValue = []) {
  if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
  return JSON.parse(parameter[key]).map((n) => parseInt(n, 10));
}
