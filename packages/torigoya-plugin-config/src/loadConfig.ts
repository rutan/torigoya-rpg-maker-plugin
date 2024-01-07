import { fileURLToPath, pathToFileURL } from 'url';
import { readFile } from 'fs/promises';
import YAML from 'yaml';
import { sanitize } from '@rutan/rpgmaker-plugin-annotation';
import { TorigoyaPluginConfigSchema } from './types.js';
import createJITI, { JITI } from 'jiti';
import { resolve } from 'path';
import { I18nText } from './defineConfig.js';

const BASE_CONFIG = {
  author: {
    en: 'Rutan(ru_shalm)',
    ja: 'Ruたん（ru_shalm）',
  },
  license: 'public domain',
};

export async function loadConfig(inputPath: string): Promise<{ [key: string]: TorigoyaPluginConfigSchema }> {
  if (inputPath.endsWith('.yml') || inputPath.endsWith('.yaml')) {
    return parseYAMLConfig(inputPath);
  } else if (inputPath.endsWith('.json')) {
    return parseJSONConfig(inputPath);
  } else if (inputPath.endsWith('.ts')) {
    return parseTSConfig(inputPath);
  } else if (inputPath.endsWith('.js') || inputPath.endsWith('.cjs') || inputPath.endsWith('.mjs')) {
    return parseJSConfig(inputPath);
  } else {
    throw new Error(`Unsupported file type: ${inputPath}`);
  }
}

function pickStringFromI18nText(str: string | I18nText, lang: string) {
  if (typeof str === 'string') {
    return str;
  } else {
    return (str as any)[lang] || str.en || '';
  }
}

function injectString(
  str: string | I18nText,
  inject: {
    before?: string | I18nText;
    after?: string | I18nText;
  },
) {
  if (typeof str === 'string') {
    return `${pickStringFromI18nText(inject.before || '', 'ja')}${str}${pickStringFromI18nText(
      inject.after || '',
      'ja',
    )}`;
  } else {
    const result: I18nText = {};
    (Object.keys(str) as (keyof typeof str)[]).forEach((lang) => {
      result[lang] = `${pickStringFromI18nText(inject.before || '', lang)}${str[lang]}${pickStringFromI18nText(
        inject.after || '',
        lang,
      )}`;
    });
    return result;
  }
}

function sanitizeConfig(data: any): { [key: string]: TorigoyaPluginConfigSchema } {
  const result: { [key: string]: TorigoyaPluginConfigSchema } = {};

  Object.keys(data).forEach((key) => {
    // 大文字始まりでないkeyは除外(extends用)
    if (!key.match(/^[A-Z]/)) return;
    const item = data[key];

    const config: TorigoyaPluginConfigSchema = {
      ...sanitize({
        ...BASE_CONFIG,
        ...item,
      }),
      version: item.version || '0.0.0',
      url: item.url || `https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/${key}.js`,
    };

    // タイトル末尾にバージョンを付与
    if (config.title) {
      config.title = injectString(config.title, {
        after: ` (v.${config.version})`,
      });
    }

    // 説明文先頭にタイトルとサイトURLを付与
    if (config.help) {
      config.help = injectString(config.help, { before: '\nhttps://torigoya-plugin.rutan.dev\n\n' });
      config.help = injectString(config.help, { before: config.title });
    }

    result[key] = config;
  });

  return result;
}

async function parseYAMLConfig(inputPath: string) {
  const file = await readFile(inputPath, 'utf-8');
  const data = YAML.parse(file, { merge: true });

  return sanitizeConfig(data);
}

async function parseJSONConfig(inputPath: string) {
  const file = await readFile(inputPath, 'utf-8');
  const data = JSON.parse(file);

  return sanitizeConfig(data);
}

async function parseTSConfig(inputPath: string) {
  const __filename = fileURLToPath(import.meta.url);

  // @ts-ignore
  const jiti: JITI = createJITI(__filename);
  const data = jiti(resolve(inputPath));

  return sanitizeConfig(data);
}

async function parseJSConfig(inputPath: string) {
  const data = await import(pathToFileURL(inputPath).href);

  return sanitizeConfig(data);
}
