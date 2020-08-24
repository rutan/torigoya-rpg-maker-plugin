export function pickStringValueFromParameterList(parameter, key) {
  return parameter[key] ? JSON.parse(parameter[key]) : [];
}
