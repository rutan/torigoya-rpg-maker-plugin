import { expect, test } from 'vitest';
import { sanitize } from './sanitize.js';
import * as sample from '../fixture/sample.json';

test('sanitize', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = sanitize(sample as any);

  if (typeof data.title === 'string') throw 'broken';
  expect(data.title['en']).toBe('SamplePlugin');
  expect(data.title['ja']).toBe('サンプルプラグイン');
});
