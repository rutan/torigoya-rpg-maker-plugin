import { describe, expect, test } from '@jest/globals';
import {
  parseBooleanParam,
  parseBooleanParamList,
  parseIntegerParam,
  parseIntegerParamList,
  parseNoteStringParam,
  parseNoteStringParamList,
  parseNumberParam,
  parseNumberParamList,
  parseStringParam,
  parseStringParamList,
  parseStructObjectParam,
} from './params.js';

describe('parseBooleanParam', () => {
  test('boolean', () => {
    expect(parseBooleanParam(true, false)).toBe(true);
    expect(parseBooleanParam(false, true)).toBe(false);
  });

  test('string', () => {
    expect(parseBooleanParam('true', false)).toBe(true);
    expect(parseBooleanParam('TRUE', false)).toBe(true);
    expect(parseBooleanParam('false', true)).toBe(false);
    expect(parseBooleanParam('FALSE', true)).toBe(false);
  });

  test('default value', () => {
    expect(parseBooleanParam(undefined, true)).toBe(true);
    expect(parseBooleanParam(undefined, false)).toBe(false);
  });
});

describe('parseBooleanParamList', () => {
  test('boolean', () => {
    expect(parseBooleanParamList([true, false], [])).toEqual([true, false]);
    expect(parseBooleanParamList([], [true])).toEqual([]);
  });

  test('string', () => {
    expect(parseBooleanParamList('["true","false","true","false"]', [true])).toEqual([true, false, true, false]);
  });

  test('default value', () => {
    expect(parseBooleanParamList(undefined, [false, true])).toEqual([false, true]);
  });
});

describe('parseIntegerParam', () => {
  test('number', () => {
    expect(parseIntegerParam(0, -1)).toBe(0);
    expect(parseIntegerParam(123, -1)).toBe(123);
    expect(parseIntegerParam(-32, -1)).toBe(-32);
    expect(parseIntegerParam(12.5, -1)).toBe(12);
  });

  test('string', () => {
    expect(parseIntegerParam('0', -1)).toBe(0);
    expect(parseIntegerParam('123', -1)).toBe(123);
    expect(parseIntegerParam('-32', -1)).toBe(-32);
    expect(parseIntegerParam('12.5', -1)).toBe(12);
  });

  test('default value', () => {
    expect(parseIntegerParam(undefined, -100)).toBe(-100);
    expect(parseIntegerParam('Hello, World', -200)).toBe(-200);
  });
});

describe('parseIntegerParamList', () => {
  test('number', () => {
    expect(parseIntegerParamList([0, 1, 2, 3], [])).toEqual([0, 1, 2, 3]);
  });

  test('string', () => {
    expect(parseIntegerParamList('["123","456","789"]', [])).toEqual([123, 456, 789]);
  });

  test('default value', () => {
    expect(parseIntegerParamList(undefined, [3, 2, 1])).toEqual([3, 2, 1]);
    expect(parseIntegerParamList('', [3, 2, 1])).toEqual([3, 2, 1]);
  });
});

describe('parseNumberParam', () => {
  test('number', () => {
    expect(parseNumberParam(0, -1)).toBe(0);
    expect(parseNumberParam(-12.345, -1)).toBe(-12.345);
  });

  test('string', () => {
    expect(parseNumberParam('0', -1)).toBe(0);
    expect(parseNumberParam('3.14', -1)).toBe(3.14);
  });

  test('default', () => {
    expect(parseNumberParam('', 3.14)).toBe(3.14);
    expect(parseNumberParam(undefined, 3.14)).toBe(3.14);
  });
});

describe('parseNumberParamList', () => {
  test('number', () => {
    expect(parseNumberParamList([12.3, 45.6], [])).toEqual([12.3, 45.6]);
  });

  test('string', () => {
    expect(parseNumberParamList('["12.3","45.6","78.9"]', [])).toEqual([12.3, 45.6, 78.9]);
  });

  test('default', () => {
    expect(parseNumberParamList('', [1.2, 3.4])).toEqual([1.2, 3.4]);
    expect(parseNumberParamList(undefined, [1.2, 3.4])).toEqual([1.2, 3.4]);
  });
});

describe('parseStringParam', () => {
  test('string', () => {
    expect(parseStringParam('aaa', '')).toBe('aaa');
    expect(parseStringParam('', 'default')).toBe('');
  });

  test('default', () => {
    expect(parseStringParam(undefined, 'default')).toBe('default');
  });
});

describe('parseStringParamList', () => {
  test('string', () => {
    expect(parseStringParamList('["textA","textB","textC"]', [])).toEqual(['textA', 'textB', 'textC']);
    expect(parseStringParamList('[]', ['default1', 'default2'])).toEqual([]);
  });

  test('default', () => {
    expect(parseStringParamList('', ['default1', 'default2'])).toEqual(['default1', 'default2']);
    expect(parseStringParamList(undefined, ['default1', 'default2'])).toEqual(['default1', 'default2']);
  });
});

describe('parseNoteStringParam', () => {
  test('string', () => {
    expect(parseNoteStringParam('"line1\\nline2\\nline3"', '')).toBe('line1\nline2\nline3');
  });

  test('default', () => {
    expect(parseNoteStringParam(undefined, 'default')).toBe('default');
  });
});

describe('parseNoteStringParamList', () => {
  test('string', () => {
    expect(
      parseNoteStringParamList(
        '["\\"line1-1\\\\nline1-2\\\\nline1-3\\"","\\"line2-1\\\\nline2-2\\\\nline2-3\\"","\\"line3-1\\\\nline3-2\\\\nline3-3\\""]',
        [''],
      ),
    ).toEqual(['line1-1\nline1-2\nline1-3', 'line2-1\nline2-2\nline2-3', 'line3-1\nline3-2\nline3-3']);
  });

  test('default', () => {
    expect(parseNoteStringParamList(undefined, ['default1', 'default2'])).toEqual(['default1', 'default2']);
  });
});

describe('parseStructObjectParam', () => {
  test('string', () => {
    expect(
      parseStructObjectParam(
        '{"id":"1","name":"ParentName","child":"{\\"childId\\":\\"2\\",\\"childName\\":\\"ChildName\\"}","children":"[\\"{\\\\\\"childId\\\\\\":\\\\\\"3\\\\\\",\\\\\\"childName\\\\\\":\\\\\\"ChildName3\\\\\\"}\\",\\"{\\\\\\"childId\\\\\\":\\\\\\"4\\\\\\",\\\\\\"childName\\\\\\":\\\\\\"ChildName4\\\\\\"}\\"]"}',
        {},
      ),
    ).toEqual({
      id: '1',
      name: 'ParentName',
      child: '{"childId":"2","childName":"ChildName"}',
      children:
        '["{\\"childId\\":\\"3\\",\\"childName\\":\\"ChildName3\\"}","{\\"childId\\":\\"4\\",\\"childName\\":\\"ChildName4\\"}"]',
    });
  });

  test('object', () => {
    expect(parseStructObjectParam({ id: 123.45 }, {})).toEqual({
      id: 123.45,
    });
  });

  test('default', () => {
    expect(parseStructObjectParam(undefined, { id: '1' })).toEqual({ id: '1' });
    expect(parseStructObjectParam('', { id: '1' })).toEqual({ id: '1' });
  });
});
