/**
 * 配列をシャッフルする
 * @param array
 */
export function arrayShuffle<T>(array: T[]): T[] {
  const arr = array.slice(0);

  for (let i = arr.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }

  return arr;
}
