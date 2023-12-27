export function arrayShuffle(array) {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
}
