export function pickStructObject(parameters, key, defaultValue) {
  const value = parameters[key];
  if (value === undefined || value === '') return defaultValue;
  if (typeof value === 'string') return JSON.parse(value);
  return value;
}
