/**
 * Array.prototype.flatの Ponyfill
 * @param arr
 */
export function arrayFlat<T>(arr: (T | T[])[]): T[] {
  if (arr.flat) return arr.flat() as T[];
  return ([] as T[]).concat(...arr);
}
