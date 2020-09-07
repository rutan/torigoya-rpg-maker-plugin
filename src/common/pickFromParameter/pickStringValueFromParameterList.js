export function pickStringValueFromParameterList(parameter, key, defaultValue = []) {
  if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
  return parameter[key] ? JSON.parse(parameter[key]) : [];
}
