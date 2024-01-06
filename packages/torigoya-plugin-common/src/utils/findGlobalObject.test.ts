import { describe, expect, test } from '@jest/globals';
import { findGlobalObject } from './findGlobalObject.js';

describe('findGlobalObject', () => {
  test('missing', () => {
    expect(findGlobalObject('Torigoya')).toBe(null);
    expect(findGlobalObject('Torigoya.Hoge')).toBe(null);
  });

  test('looked', () => {
    (window as any).Torigoya = { Item: { test: 123 } };
    expect(findGlobalObject('Torigoya')).toEqual({ Item: { test: 123 } });
    expect(findGlobalObject('Torigoya.Item')).toEqual({ test: 123 });
    expect(findGlobalObject('Torigoya.Item.test')).toBe(123);
    expect(findGlobalObject('Torigoya.Unknown')).toBe(null);
  });
});
