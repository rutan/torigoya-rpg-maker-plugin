import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import {
  checkExistPlugin,
  checkPluginVersion,
  isVersionString,
  parseVersion,
  isGreaterThanOrEqualVersion,
} from './version';

describe('checkExistPlugin', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('exist', () => {
    expect(() => checkExistPlugin({}, 'message')).not.toThrow();
  });

  test('not exist', () => {
    expect(() => checkExistPlugin(undefined, 'message')).toThrow('message');
  });
});

describe('checkPluginVersion', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('valid', () => {
    expect(() => checkPluginVersion('1.2.3', '1.2.3', 'message')).not.toThrow();
    expect(() => checkPluginVersion('1.2.5', '1.2.3', 'message')).not.toThrow();
    expect(() => checkPluginVersion('1.3.0', '1.2.3', 'message')).not.toThrow();
    expect(() => checkPluginVersion('2.0.0', '1.2.3', 'message')).not.toThrow();
  });

  test('invalid', () => {
    expect(() => checkPluginVersion('1.2.1', '1.2.3', 'message')).toThrow('message');
    expect(() => checkPluginVersion('1.1.9', '1.2.3', 'message')).toThrow('message');
    expect(() => checkPluginVersion('0.9.5', '1.2.3', 'message')).toThrow('message');
  });
});

describe('isVersionString', () => {
  test('valid', () => {
    expect(isVersionString('1.2.3')).toBe(true);
    expect(isVersionString('2.10.220')).toBe(true);
  });

  test('invalid', () => {
    expect(isVersionString('1')).toBe(false);
    expect(isVersionString('1.2')).toBe(false);
    expect(isVersionString('1.2.3-a')).toBe(false);
    expect(isVersionString('1.2.3.4')).toBe(false);
    expect(isVersionString('Hello')).toBe(false);
  });
});

describe('parseVersion', () => {
  test('x.y.z', () => {
    expect(parseVersion('1.2.3')).toEqual([1, 2, 3]);
    expect(parseVersion('2.10.220')).toEqual([2, 10, 220]);
  });

  test('invalid', () => {
    expect(() => parseVersion('1.2' as any)).toThrow(new Error('invalid version: 1.2'));
    expect(() => parseVersion('waiwai' as any)).toThrow(new Error('invalid version: waiwai'));
  });
});

describe('isGreaterThanOrEqualVersion', () => {
  test('valid', () => {
    expect(isGreaterThanOrEqualVersion('1.2.3', '1.2.3')).toBe(true);
    expect(isGreaterThanOrEqualVersion('1.2.3', '1.2.4')).toBe(true);
    expect(isGreaterThanOrEqualVersion('1.2.3', '1.3.0')).toBe(true);
    expect(isGreaterThanOrEqualVersion('1.2.3', '1.10.0')).toBe(true);
    expect(isGreaterThanOrEqualVersion('1.2.3', '2.0.0')).toBe(true);
  });

  test('invalid', () => {
    expect(isGreaterThanOrEqualVersion('1.2.3', '1.2.2')).toBe(false);
    expect(isGreaterThanOrEqualVersion('1.2.3', '1.1.9')).toBe(false);
    expect(isGreaterThanOrEqualVersion('1.2.3', '0.9.9')).toBe(false);
  });
});
