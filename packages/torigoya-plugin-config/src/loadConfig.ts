import { pathToFileURL } from 'url';
import { readFile } from 'fs/promises';
import YAML from 'yaml';
import { sanitize } from '@rutan/rpgmaker-plugin-annotation';
import { TorigoyaPluginConfigSchema } from './types.js';

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
  } else if (inputPath.endsWith('.js') || inputPath.endsWith('.cjs') || inputPath.endsWith('.mjs')) {
    return parseJSConfig(inputPath);
  } else {
    throw new Error(`Unsupported file type: ${inputPath}`);
  }
}

function sanitizeConfig(data: any): TorigoyaPluginConfigSchema {
  return {
    ...sanitize({
      ...BASE_CONFIG,
      ...data,
    }),
    version: data.version || '0.0.0',
  };
}

async function parseYAMLConfig(inputPath: string) {
  const file = await readFile(inputPath, 'utf-8');
  const data = YAML.parse(file, { merge: true });
  const result: { [key: string]: TorigoyaPluginConfigSchema } = {};

  Object.keys(data).forEach((key) => {
    // 大文字始まりでないkeyは除外(extends用)
    if (!key.match(/^[A-Z]/)) return;

    result[key] = sanitizeConfig(data[key]);
  });

  return result;
}

async function parseJSONConfig(inputPath: string) {
  const file = await readFile(inputPath, 'utf-8');
  const data = JSON.parse(file);

  const result: { [key: string]: TorigoyaPluginConfigSchema } = {};

  Object.keys(data).forEach((key) => {
    result[key] = sanitizeConfig(data[key]);
  });

  return result;
}

async function parseJSConfig(inputPath: string) {
  const data = await import(pathToFileURL(inputPath).href);

  const result: { [key: string]: TorigoyaPluginConfigSchema } = {};

  Object.keys(data).forEach((key) => {
    result[key] = sanitizeConfig(data[key]);
  });

  return result;
}
