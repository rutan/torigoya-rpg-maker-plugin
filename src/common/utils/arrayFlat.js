export function arrayFlat(arr) {
  if (arr.flat) return arr.flat();
  return [].concat(...arr);
}
