export function pickNoteStringValueFromParameter(parameter, key, defaultValue = '') {
  if (!parameter.hasOwnProperty(key)) return defaultValue;
  return (parameter[key].startsWith('"') ? JSON.parse(parameter[key]) : parameter[key]) || '';
}
