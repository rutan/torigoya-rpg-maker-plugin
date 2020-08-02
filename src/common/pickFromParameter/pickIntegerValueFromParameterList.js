export function pickIntegerValueFromParameterList(parameter, key) {
  return JSON.parse(parameter[key]).map((n) => parseInt(n, 10));
}
