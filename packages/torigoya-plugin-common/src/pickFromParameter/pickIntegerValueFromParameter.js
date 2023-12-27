export function pickIntegerValueFromParameter(parameter, key, defaultValue = 0) {
  if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
  return parseInt(parameter[key], 10);
}
