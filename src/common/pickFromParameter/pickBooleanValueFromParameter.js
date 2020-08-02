export function pickBooleanValueFromParameter(parameter, key) {
  return `${parameter[key]}` === 'true';
}
