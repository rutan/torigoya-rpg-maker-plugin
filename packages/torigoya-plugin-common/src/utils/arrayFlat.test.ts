import { describe, expect, test } from '@jest/globals';
import { arrayFlat } from './arrayFlat.js';

describe('arrayFlat', () => {
  test('use original', () => {
    const array = [1, 2, 3, [4, 5, 6], [7, 8, 9, [10, 11, 12]]];
    expect(arrayFlat(array)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, [10, 11, 12]]);
  });

  test('use polyfill', () => {
    const array = [1, 2, 3, [4, 5, 6], [7, 8, 9, [10, 11, 12]]];
    (array as any).flat = undefined;
    expect(arrayFlat(array)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, [10, 11, 12]]);
  });
});
