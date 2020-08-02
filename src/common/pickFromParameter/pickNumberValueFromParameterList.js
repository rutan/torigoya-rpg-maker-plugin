export function pickNumberValueFromParameterList(parameter, key) {
  return JSON.parse(parameter[key]).map(parseFloat);
}
