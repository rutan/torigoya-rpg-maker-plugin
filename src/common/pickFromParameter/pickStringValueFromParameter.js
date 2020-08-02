export function pickStringValueFromParameter(parameter, key) {
  return `${parameter[key] || ''}`;
}
