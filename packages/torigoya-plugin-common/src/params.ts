export function parseBooleanParam(value: string | boolean | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return String(value) === 'true';
}

export function parseBooleanParamList(value: string | boolean[] | undefined, defaultValue: boolean[]): boolean[] {
  if (value === undefined || value === '') return defaultValue;
  return (Array.isArray(value) ? value : JSON.parse(String(value))).map((n: unknown) => String(n) === 'true');
}

export function parseIntegerParam(value: string | number | undefined, defaultValue: number): number {
  if (value === undefined || value === '') return defaultValue;
  const intValue = Number.parseInt(String(value), 10);
  return isNaN(intValue) ? defaultValue : intValue;
}

export function parseIntegerParamList(value: string | number[] | undefined, defaultValue: number[]): number[] {
  if (value === undefined || value === '') return defaultValue;
  return (Array.isArray(value) ? value : JSON.parse(String(value))).map((n: unknown) => Number.parseInt(String(n), 10));
}

export function parseNoteStringParam(value: string | undefined, defaultValue: string): string {
  if (value === undefined) return defaultValue;
  const str = String(value);
  return str.startsWith('"') ? JSON.parse(str) : str;
}

export function parseNoteStringParamList(value: string | undefined, defaultValue: string[]): string[] {
  if (value === undefined || value === '') return defaultValue;
  return (Array.isArray(value) ? value : JSON.parse(String(value))).map((n: unknown) => String(n));
}

export function parseNumberParam(value: string | number | undefined, defaultValue: number): number {
  if (value === undefined || value === '') return defaultValue;
  const floatValue = Number.parseFloat(String(value));
  return isNaN(floatValue) ? defaultValue : floatValue;
}

export function parseNumberParamList(value: string | number[] | undefined, defaultValue: number[]): number[] {
  if (value === undefined || value === '') return defaultValue;
  return (Array.isArray(value) ? value : JSON.parse(String(value))).map((n: unknown) => Number.parseFloat(String(n)));
}

export function parseStringParam(value: string | undefined, defaultValue: string): string {
  if (value === undefined) return defaultValue;
  return String(value);
}

export function parseStringParamList(value: string | string[] | undefined, defaultValue: string[]): string[] {
  if (value === undefined || value === '') return defaultValue;
  return (Array.isArray(value) ? value : JSON.parse(String(value))).map((n: unknown) => String(n));
}

export function parseStructObjectParam<T>(value: string | T | undefined, defaultValue: T): T {
  if (value === undefined || value === '') return defaultValue;
  if (typeof value === 'string') return JSON.parse(value);
  return value;
}
