import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { generateParameterReaderCode } from './writeParameterReader.js';
import { TorigoyaPluginConfigSchema } from './types.js';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { rimraf } from 'rimraf';
import { fileURLToPath } from 'url';
import { mkdirp } from 'mkdirp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createTempDir() {
  const tmpdir = join(__dirname, '..', 'tmp');
  mkdirp.sync(tmpdir);
  return tmpdir;
}

async function createTempCodeFile(dir: string, code: string) {
  const filePath = join(dir, `tmp-${Date.now()}-${Math.floor(Math.random() * 99999999)}.js`);
  return writeFile(filePath, code, { encoding: 'utf8' }).then(() => filePath);
}

describe('generateParameterReaderCode', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = createTempDir();
  });

  afterAll(() => {
    if (tmpDir) rimraf.sync(tmpDir);
  });

  async function importCode(code: string) {
    const modulePath = await createTempCodeFile(tmpDir, code);
    return import(modulePath);
  }

  function mockPluginParameter(pluginParameter: any) {
    const mock = {
      parameters() {
        return pluginParameter;
      },
    };

    (window as any).PluginManager = mock as any;
  }

  describe('simple config', async () => {
    const config: TorigoyaPluginConfigSchema = {
      target: ['MZ'],
      title: 'test',
      author: 'test',
      help: '',
      url: '',
      version: '1.0.0',
      license: '',
      params: [],
      structs: [],
      commands: [],
    };
    const code = await generateParameterReaderCode(config);

    test('snapshot', async () => {
      expect(code).toMatchSnapshot();
    });

    test('parameter', async () => {
      mockPluginParameter({});
      const result = await importCode(code);
      expect(result.readParameter()).toEqual({
        version: '1.0.0',
      });
    });
  });

  describe('some config', async () => {
    const config: TorigoyaPluginConfigSchema = {
      target: ['MZ'],
      title: 'test',
      author: 'test',
      help: '',
      url: '',
      version: '1.0.0',
      license: '',
      params: [
        {
          type: 'string',
          name: 'paramString',
          default: 'test',
        },
        {
          type: 'string[]',
          name: 'paramStringArray',
          default: ['test1', 'test2'],
        },
        {
          type: 'note',
          name: 'paramNote',
          default: 'testNote1\ntestNote2',
        },
        {
          type: 'note[]',
          name: 'paramNoteArray',
          default: ['testNoteA1\ntestNoteA2', 'testNoteB1\ntestNoteB2'],
        },
        {
          type: 'multiline_string',
          name: 'paramMultilineString',
          default: 'test1\ntest2',
        },
        {
          type: 'multiline_string[]',
          name: 'paramMultilineStringArray',
          default: ['testA1\ntestA2', 'testB1\ntestB2'],
        },
        {
          type: 'file',
          name: 'paramFile',
          dir: 'img/pictures',
          default: 'test',
        },
        {
          type: 'file[]',
          name: 'paramFileArray',
          dir: 'img/pictures',
          default: ['test1', 'test2'],
        },
        {
          type: 'number',
          name: 'paramNumber',
          decimals: 0,
          default: 123,
        },
        {
          type: 'number[]',
          name: 'paramNumberArray',
          decimals: 0,
          default: [1, 2, 3],
        },
        {
          type: 'number',
          name: 'paramNumberFloat',
          decimals: 3,
          default: 123.456,
        },
        {
          type: 'number[]',
          name: 'paramNumberFloatArray',
          decimals: 3,
          default: [1.234, 2.345, 3.456],
        },
        {
          type: 'boolean',
          name: 'paramBoolean',
          on: 'on',
          off: 'off',
          default: true,
        },
        {
          type: 'boolean[]',
          name: 'paramBooleanArray',
          on: 'on',
          off: 'off',
          default: [true, false],
        },
        {
          type: 'select',
          name: 'paramSelect',
          options: [
            { name: 'test1', value: 'A' },
            { name: 'test2', value: 'B' },
            { name: 'test2', value: 'C' },
          ],
          default: 'A',
        },
        {
          type: 'select[]',
          name: 'paramSelectArray',
          options: [
            { name: 'test1', value: 'A' },
            { name: 'test2', value: 'B' },
            { name: 'test2', value: 'C' },
          ],
          default: ['A', 'B', 'C'],
        },
        {
          type: 'combo',
          name: 'paramCombo',
          options: ['A', 'B', 'C'],
          default: 'A',
        },
        {
          type: 'combo[]',
          name: 'paramComboArray',
          options: ['A', 'B', 'C'],
          default: ['A', 'B', 'C'],
        },
        {
          type: 'actor',
          name: 'paramActor',
          default: 10,
        },
        {
          type: 'actor[]',
          name: 'paramActorArray',
          default: [10, 20],
        },
        {
          type: 'struct',
          struct: 'Sample',
          name: 'paramStruct',
          default: {
            id: 123,
            name: 'test',
            child: {
              childId: 456,
              childName: 'test2',
            },
            children: [
              {
                childId: 789,
                childName: 'test3',
              },
            ],
          },
        },
        {
          type: 'struct[]',
          struct: 'Sample',
          name: 'paramStructArray',
          default: [
            {
              id: 123,
              name: 'test',
              child: {
                childId: 456,
                childName: 'test2',
              },
              children: [
                {
                  childId: 789,
                  childName: 'test3',
                },
              ],
            },
          ],
        },
      ],
      structs: [
        {
          name: 'Sample',
          params: [
            {
              type: 'number',
              name: 'id',
              decimals: 0,
              default: 0,
            },
            {
              type: 'string',
              name: 'name',
              default: '',
            },
            {
              type: 'struct',
              struct: 'Child',
              name: 'child',
              default: {
                childId: 0,
                childName: '',
              },
            },
            {
              type: 'struct[]',
              struct: 'Child',
              name: 'children',
              default: [],
            },
          ],
        },
        {
          name: 'Child',
          params: [
            {
              type: 'number',
              name: 'childId',
              decimals: 0,
              default: 0,
            },
            {
              type: 'string',
              name: 'childName',
              default: '',
            },
          ],
        },
      ],
      commands: [],
    };
    const code = await generateParameterReaderCode(config);

    test('snapshot', async () => {
      expect(code).toMatchSnapshot();
    });

    test('parameter default', async () => {
      mockPluginParameter({});
      const result = await importCode(code);
      expect(result.readParameter()).toEqual({
        version: '1.0.0',
        paramString: 'test',
        paramStringArray: ['test1', 'test2'],
        paramNote: 'testNote1\ntestNote2',
        paramNoteArray: ['testNoteA1\ntestNoteA2', 'testNoteB1\ntestNoteB2'],
        paramMultilineString: 'test1\ntest2',
        paramMultilineStringArray: ['testA1\ntestA2', 'testB1\ntestB2'],
        paramFile: 'test',
        paramFileArray: ['test1', 'test2'],
        paramNumber: 123,
        paramNumberArray: [1, 2, 3],
        paramNumberFloat: 123.456,
        paramNumberFloatArray: [1.234, 2.345, 3.456],
        paramBoolean: true,
        paramBooleanArray: [true, false],
        paramSelect: 'A',
        paramSelectArray: ['A', 'B', 'C'],
        paramCombo: 'A',
        paramComboArray: ['A', 'B', 'C'],
        paramActor: 10,
        paramActorArray: [10, 20],
        paramStruct: {
          id: 123,
          name: 'test',
          child: {
            childId: 456,
            childName: 'test2',
          },
          children: [
            {
              childId: 789,
              childName: 'test3',
            },
          ],
        },
        paramStructArray: [
          {
            id: 123,
            name: 'test',
            child: {
              childId: 456,
              childName: 'test2',
            },
            children: [
              {
                childId: 789,
                childName: 'test3',
              },
            ],
          },
        ],
      });
    });

    test('parameter input', async () => {
      mockPluginParameter({
        paramString: 'text',
        paramStringArray: '["textA","textB","textC"]',
        paramNote: '"line1\\nline2\\nline3"',
        paramNoteArray:
          '["\\"line1-1\\\\nline1-2\\\\nline1-3\\"","\\"line2-1\\\\nline2-2\\\\nline2-3\\"","\\"line3-1\\\\nline3-2\\\\nline3-3\\""]',
        paramMultilineString: 'line1\nline2\nline3',
        paramMultilineStringArray:
          '["line1-1\\nline1-2\\nline1-3","line2-1\\nline2-2\\nline2-3","line3-1\\nline3-2\\nline3-3"]',
        paramFile: 'Actor1_1',
        paramFileArray: '["Actor1_1","Actor1_2","Actor1_3"]',
        paramNumber: '123',
        paramNumberArray: '["123","456","789"]',
        paramNumberFloat: '654.321',
        paramNumberFloatArray: '["12.345","23.456"]',
        paramBoolean: 'true',
        paramBooleanArray: '["true","false","true","false"]',
        paramSelect: 'A',
        paramSelectArray: '["A","B","C"]',
        paramCombo: 'A',
        paramComboArray: '["A","C"]',
        paramActor: '1',
        paramActorArray: '["1","2","3"]',
        paramStruct:
          '{"id":"1","name":"ParentName","child":"{\\"childId\\":\\"2\\",\\"childName\\":\\"ChildName\\"}","children":"[\\"{\\\\\\"childId\\\\\\":\\\\\\"3\\\\\\",\\\\\\"childName\\\\\\":\\\\\\"ChildName3\\\\\\"}\\",\\"{\\\\\\"childId\\\\\\":\\\\\\"4\\\\\\",\\\\\\"childName\\\\\\":\\\\\\"ChildName4\\\\\\"}\\"]"}',
        paramStructArray:
          '["{\\"id\\":\\"1\\",\\"name\\":\\"ParentName\\",\\"child\\":\\"{\\\\\\"childId\\\\\\":\\\\\\"2\\\\\\",\\\\\\"childName\\\\\\":\\\\\\"ChildName\\\\\\"}\\",\\"children\\":\\"[\\\\\\"{\\\\\\\\\\\\\\"childId\\\\\\\\\\\\\\":\\\\\\\\\\\\\\"3\\\\\\\\\\\\\\",\\\\\\\\\\\\\\"childName\\\\\\\\\\\\\\":\\\\\\\\\\\\\\"ChildName3\\\\\\\\\\\\\\"}\\\\\\",\\\\\\"{\\\\\\\\\\\\\\"childId\\\\\\\\\\\\\\":\\\\\\\\\\\\\\"4\\\\\\\\\\\\\\",\\\\\\\\\\\\\\"childName\\\\\\\\\\\\\\":\\\\\\\\\\\\\\"ChildName4\\\\\\\\\\\\\\"}\\\\\\"]\\"}","{\\"id\\":\\"\\",\\"name\\":\\"\\",\\"child\\":\\"\\",\\"children\\":\\"\\"}"]',
      });
      const result = await importCode(code);
      expect(result.readParameter()).toEqual({
        version: '1.0.0',
        paramString: 'text',
        paramStringArray: ['textA', 'textB', 'textC'],
        paramNote: 'line1\nline2\nline3',
        paramNoteArray: ['line1-1\nline1-2\nline1-3', 'line2-1\nline2-2\nline2-3', 'line3-1\nline3-2\nline3-3'],
        paramMultilineString: 'line1\nline2\nline3',
        paramMultilineStringArray: [
          'line1-1\nline1-2\nline1-3',
          'line2-1\nline2-2\nline2-3',
          'line3-1\nline3-2\nline3-3',
        ],
        paramFile: 'Actor1_1',
        paramFileArray: ['Actor1_1', 'Actor1_2', 'Actor1_3'],
        paramNumber: 123,
        paramNumberArray: [123, 456, 789],
        paramNumberFloat: 654.321,
        paramNumberFloatArray: [12.345, 23.456],
        paramBoolean: true,
        paramBooleanArray: [true, false, true, false],
        paramSelect: 'A',
        paramSelectArray: ['A', 'B', 'C'],
        paramCombo: 'A',
        paramComboArray: ['A', 'C'],
        paramActor: 1,
        paramActorArray: [1, 2, 3],
        paramStruct: {
          id: 1,
          name: 'ParentName',
          child: {
            childId: 2,
            childName: 'ChildName',
          },
          children: [
            {
              childId: 3,
              childName: 'ChildName3',
            },
            {
              childId: 4,
              childName: 'ChildName4',
            },
          ],
        },
        paramStructArray: [
          {
            id: 1,
            name: 'ParentName',
            child: {
              childId: 2,
              childName: 'ChildName',
            },
            children: [
              {
                childId: 3,
                childName: 'ChildName3',
              },
              {
                childId: 4,
                childName: 'ChildName4',
              },
            ],
          },
          {
            id: 0,
            name: '',
            child: {
              childId: 0,
              childName: '',
            },
            children: [],
          },
        ],
      });
    });
  });
});
