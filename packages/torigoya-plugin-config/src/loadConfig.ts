import { fileURLToPath, pathToFileURL } from 'url';
import { readFile } from 'fs/promises';
import YAML from 'yaml';
import { sanitize } from '@rutan/rpgmaker-plugin-annotation';
import { TorigoyaPluginConfigSchema } from './types.js';
import createJITI, { JITI } from 'jiti';
import { resolve } from 'path';

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

function sanitizeConfig(data: any): { [key: string]: TorigoyaPluginConfigSchema } {
  const result: { [key: string]: TorigoyaPluginConfigSchema } = {};

  Object.keys(data).forEach((key) => {
    // 大文字始まりでないkeyは除外(extends用)
    if (!key.match(/^[A-Z]/)) return;
    const item = data[key];

    result[key] = {
      ...sanitize({
        ...BASE_CONFIG,
        ...item,
      }),
      version: item.version || '0.0.0',
    };
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
