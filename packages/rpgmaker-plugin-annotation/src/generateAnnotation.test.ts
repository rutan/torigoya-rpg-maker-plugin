import { expect, test } from 'vitest';
import { generateAnnotation } from './generateAnnotation.js';
import { sanitize } from './sanitize.js';
import * as sample from '../fixture/sample.json';

test('generateAnnotation snapshot', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = sanitize(sample as any);

  const result = generateAnnotation(config, {
    languages: ['en', 'ja'],
    defaultLanguage: 'en',
  });
  expect(result).toMatchSnapshot();
});
