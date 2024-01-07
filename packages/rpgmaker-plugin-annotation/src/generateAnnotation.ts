import { PluginConfigSchema, PluginParameter } from './schema.js';

export interface BuildOptions {
  languages: string[];
  defaultLanguage: string;
}

// ISO 639 language codes
const localeKeyISO639_1 = [
  'aa',
  'ab',
  'ae',
  'af',
  'ak',
  'am',
  'an',
  'ar',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cu',
  'cv',
  'cy',
  'da',
  'de',
  'dv',
  'dz',
  'ee',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fj',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gn',
  'gu',
  'gv',
  'ha',
  'he',
  'hi',
  'ho',
  'hr',
  'ht',
  'hu',
  'hy',
  'hz',
  'ia',
  'id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'it',
  'iu',
  'ja',
  'jv',
  'ka',
  'kg',
  'ki',
  'kj',
  'kk',
  'kl',
  'km',
  'kn',
  'ko',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lu',
  'lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'na',
  'nb',
  'nd',
  'ne',
  'ng',
  'nl',
  'nn',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pi',
  'pl',
  'ps',
  'pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ru',
  'rw',
  'sa',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'ts',
  'tt',
  'tw',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zu',
];

export function generateAnnotation(config: PluginConfigSchema, { languages, defaultLanguage }: BuildOptions) {
  return languages
    .map((language) => {
      const omitLanguageSignature = language === defaultLanguage;

      function pickString(value: string | { [key: string]: string }) {
        if (typeof value === 'string') return value;
        if (Object.prototype.hasOwnProperty.call(value, defaultLanguage)) return value[language];
        if (Object.prototype.hasOwnProperty.call(value, defaultLanguage)) return value[defaultLanguage];
        return '';
      }

      function pickObject<T extends { [key: string]: any }>(value: T | { [key: string]: T }) {
        const keys = Object.keys(value);
        if (keys.length > 0 && keys.every((key) => localeKeyISO639_1.includes(key))) {
          return value[language] || value[defaultLanguage];
        } else {
          return value;
        }
      }

      function push(lines: string[], annotation: string, stringValue: string) {
        stringValue.split(/\r?\n/).forEach((line, i) => {
          lines.push(`${i === 0 ? `@${annotation} ` : ''}${line}`);
        });
      }

      function pushParameter(lines: string[], name: string, param: PluginParameter) {
        push(lines, name, param.name);

        if (param.text) push(lines, 'text', pickString(param.text));
        if (param.description) push(lines, 'desc', pickString(param.description));
        if (param.parent) push(lines, 'parent', pickString(param.parent));

        // type
        switch (param.type) {
          case 'struct':
            push(lines, 'type', `struct<${param.struct}>`);
            break;
          case 'struct[]':
            push(lines, 'type', `struct<${param.struct}>[]`);
            break;
          default:
            if (config.target.includes('MV') && param.type.startsWith('multiline_string')) {
              push(lines, 'type', param.type.replace('multiline_string', 'note'));
            } else {
              push(lines, 'type', param.type);
            }
        }

        switch (param.type) {
          case 'string':
            if (param.default) push(lines, 'default', pickString(param.default));
            break;
          case 'string[]':
            push(lines, 'default', JSON.stringify(param.default.map((n) => pickString(n))));
            break;
          case 'multiline_string':
            if (param.default) {
              if (config.target.includes('MV')) {
                push(lines, 'default', JSON.stringify(pickString(param.default)));
              } else {
                push(lines, 'default', pickString(param.default));
              }
            }
            break;
          case 'multiline_string[]':
            if (config.target.includes('MV')) {
              push(lines, 'default', JSON.stringify(param.default.map((n) => JSON.stringify(pickString(n)))));
            } else {
              push(lines, 'default', JSON.stringify(param.default.map((n) => pickString(n))));
            }
            break;
          case 'note':
            if (param.default) push(lines, 'default', JSON.stringify(pickString(param.default)));
            break;
          case 'note[]':
            push(lines, 'default', JSON.stringify(param.default.map((n) => JSON.stringify(pickString(n)))));
            break;
          case 'number':
          case 'number[]':
            if (param.min !== undefined) push(lines, 'min', param.min.toString());
            if (param.max !== undefined) push(lines, 'max', param.max.toString());
            push(lines, 'decimals', param.decimals.toString());
            push(lines, 'default', JSON.stringify(param.default));
            break;
          case 'boolean':
          case 'boolean[]':
            push(lines, 'on', pickString(param.on));
            push(lines, 'off', pickString(param.off));
            push(lines, 'default', JSON.stringify(param.default));
            break;
          case 'file':
          case 'file[]':
            push(lines, 'dir', param.dir);
            if (param.type === 'file') {
              if (param.default) push(lines, 'default', param.default);
            } else {
              push(lines, 'default', JSON.stringify(param.default));
            }
            if (config.target.includes('MV')) push(lines, 'require', '1');
            break;
          case 'select':
          case 'select[]':
            param.options.forEach((option) => {
              push(lines, 'option', pickString(option.name));
              push(lines, 'value', option.value.toString());
            });
            if (param.type === 'select') push(lines, 'default', param.default);
            else push(lines, 'default', JSON.stringify(param.default));
            break;
          case 'combo':
          case 'combo[]':
            param.options.forEach((option) => {
              push(lines, 'option', pickString(option));
            });
            if (param.type === 'combo') push(lines, 'default', param.default);
            else push(lines, 'default', JSON.stringify(param.default));
            break;
          case 'actor':
          case 'class':
          case 'skill':
          case 'item':
          case 'weapon':
          case 'armor':
          case 'enemy':
          case 'troop':
          case 'state':
          case 'animation':
          case 'tileset':
          case 'common_event':
          case 'switch':
          case 'variable':
            push(lines, 'default', param.default.toString());
            break;
          case 'actor[]':
          case 'class[]':
          case 'skill[]':
          case 'item[]':
          case 'weapon[]':
          case 'armor[]':
          case 'enemy[]':
          case 'troop[]':
          case 'state[]':
          case 'animation[]':
          case 'tileset[]':
          case 'common_event[]':
          case 'switch[]':
          case 'variable[]':
            push(lines, 'default', JSON.stringify(param.default));
            break;
          case 'struct':
            push(lines, 'default', escapeStructParam(pickObject(param.default)));
            break;
          case 'struct[]': {
            if (Array.isArray(param.default)) {
              push(lines, 'default', JSON.stringify(param.default.map((n) => escapeStructParam(pickObject(n)))));
            } else if (param.default) {
              push(
                lines,
                'default',
                JSON.stringify(
                  pickObject(param.default).map((n: Record<string, any>) => escapeStructParam(pickObject(n))),
                ),
              );
            }
            break;
          }
          default: {
            const badParameter: never = param;
            throw new Error(`unknown parameter: ${badParameter}`);
          }
        }
      }

      function endSection(lines: string[]) {
        const len = lines.length;
        if (len === 0) return;
        if (lines[len - 1] === '') return;
        lines.push('');
      }

      function generateMain() {
        const lines: string[] = [];

        // base
        config.target.forEach((target) => push(lines, 'target', target));
        push(lines, 'plugindesc', pickString(config.title));
        if (config.version) push(lines, 'version', pickString(config.version));
        push(lines, 'author', pickString(config.author));
        if (config.license) push(lines, 'license', pickString(config.license));
        if (config.url) push(lines, 'url', pickString(config.url));
        endSection(lines);

        // dependencies
        config.base?.forEach((base) => push(lines, 'base', base));
        config.orderAfter?.forEach((orderAfter) => push(lines, 'orderAfter', orderAfter));
        config.orderBefore?.forEach((orderBefore) => push(lines, 'orderBefore', orderBefore));
        endSection(lines);

        // description
        if (config.help) push(lines, 'help', pickString(config.help));
        endSection(lines);

        // assets
        config.requiredAssets?.forEach((requiredAssets) => push(lines, 'requiredAssets', requiredAssets));
        endSection(lines);

        config.requiredNoteAssets?.forEach((requiredNoteAssets) => {
          push(lines, 'noteParam', requiredNoteAssets.name);
          push(lines, 'noteDir', requiredNoteAssets.dir);
          push(lines, 'noteType', requiredNoteAssets.type);
          push(lines, 'noteData', requiredNoteAssets.data);
          endSection(lines);
        });

        // parameter
        config.params?.forEach((param) => {
          pushParameter(lines, 'param', param);
          endSection(lines);
        });

        // commands
        config.commands?.forEach((command) => {
          push(lines, 'command', command.name);
          push(lines, 'text', pickString(command.text));
          push(lines, 'desc', pickString(command.description));
          endSection(lines);

          command.args.forEach((arg) => {
            pushParameter(lines, 'arg', arg);
            endSection(lines);
          });
        });

        if (lines[lines.length - 1] === '') lines.pop();
        return `/*:${omitLanguageSignature ? '' : language}\n * ${lines.join('\n * ')}\n */`;
      }

      function generateStruct() {
        return config.structs
          .map((struct) => {
            const lines: string[] = [];

            struct.params.forEach((param) => {
              pushParameter(lines, 'param', param);
              endSection(lines);
            });

            if (lines[lines.length - 1] === '') lines.pop();
            return `/*~struct~${struct.name}:${omitLanguageSignature ? '' : language}\n * ${lines.join('\n * ')}\n */`;
          })
          .join('\n\n');
      }

      return [generateMain(), generateStruct()].filter(Boolean).join('\n\n');
    })
    .join('\n\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
}

function escapeStructParam(param: { [key: string]: any }) {
  const result: { [key: string]: string } = {};

  for (const key in param) {
    const value = param[key];
    if (Array.isArray(value)) {
      result[key] = JSON.stringify(value.map((n) => escapeStructParam(n)));
    } else if (typeof value === 'object') {
      result[key] = escapeStructParam(value);
    } else {
      result[key] = String(value);
    }
  }

  return JSON.stringify(result);
}
