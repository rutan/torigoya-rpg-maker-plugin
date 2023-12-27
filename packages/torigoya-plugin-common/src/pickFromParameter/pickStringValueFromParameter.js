export function pickStringValueFromParameter(parameter, key, defaultValue = '') {
  if (!parameter.hasOwnProperty(key)) return defaultValue;
  return `${parameter[key] || ''}`;
}
