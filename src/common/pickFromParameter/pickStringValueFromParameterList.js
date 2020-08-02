export function pickStringValueFromParameterList(parameter, key) {
  return JSON.parse(parameter[key]);
}
