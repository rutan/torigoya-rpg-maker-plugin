export function pickBooleanValueFromParameterList(parameter, key) {
  return JSON.parse(parameter[key]).map((n) => `${n}` === 'true');
}
