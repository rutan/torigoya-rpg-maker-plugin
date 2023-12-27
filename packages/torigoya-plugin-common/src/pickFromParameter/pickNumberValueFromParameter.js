export function pickNumberValueFromParameter(parameter, key, defaultValue = 0) {
  if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
  return parseFloat(parameter[key]);
}
