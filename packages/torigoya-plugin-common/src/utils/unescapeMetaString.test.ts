import { describe, expect, test } from '@jest/globals';
import { unescapeMetaString } from './unescapeMetaString.js';

describe('unescapeMetaString', () => {
  test('<>', () => {
    expect(unescapeMetaString('&lt;br&gt;')).toBe('<br>');
  });
});
