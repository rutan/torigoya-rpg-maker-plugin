export function pickJsonValueFromParameter(parameter, key) {
  if (!parameter[key]) return parameter[key];
  return JsonEx.parse(parameter[key]);
}
