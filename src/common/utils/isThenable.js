export function isThenable(obj) {
  return obj && typeof obj['then'] === 'function';
}
