import { writeFile } from 'fs/promises';
import { consola } from 'consola';
import { TorigoyaPluginConfigSchema } from './types.js';

export async function writeParameterReader(config: TorigoyaPluginConfigSchema, outputPath: string) {
  const code = `
import {
  getPluginName,
} from '@rutan/torigoya-plugin-common';

export function readParameter() {
  const parameters = PluginManager.parameters(getPluginName());
  return {
    version: ${JSON.stringify(config.version)},
  };
}
`.trim();

  return writeFile(outputPath, code, { encoding: 'utf8' }).then(() => {
    consola.info(`write parameterReader: ${outputPath}`);
  });
}
