/**
 * PromiseLike かどうかを判定する
 * @param obj
 */
export function isThenable<T>(obj: any): obj is PromiseLike<T> {
  return obj && typeof obj['then'] === 'function';
}
