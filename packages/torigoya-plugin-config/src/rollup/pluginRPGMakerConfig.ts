import { readFileSync } from 'fs';
import * as path from 'path';
import ejs from 'ejs';
import { loadConfig } from '../loadConfig.js';
import { writeAnnotation } from '../writeAnnotation.js';
import { writeParameterReader } from '../writeParameterReader.js';
import { Plugin } from 'rollup';
import { mkdirp } from 'mkdirp';
import { format } from '../format.js';

function formatJSTDate(date: Date) {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

async function buildConfig(config: string, buildDir: string) {
  const configData = await loadConfig(config);
  mkdirp.sync(buildDir);

  await Promise.all(
    Object.keys(configData)
      .map((key) => {
        const config = configData[key];

        return [
          writeAnnotation(config, `${buildDir}/${key}_header.js`),
          writeParameterReader(config, `${buildDir}/${key}_parameter.js`),
        ];
      })
      .flat(),
  );

  return configData;
}

export default async function pluginRPGMakerConfig(options: {
  template: string;
  config: string;
  buildDir: string;
}): Promise<Plugin> {
  const template = ejs.compile(readFileSync(options.template, 'utf-8'), {});
  const configFilePath = path.resolve(options.config);
  let configData = await buildConfig(configFilePath, options.buildDir);

  return {
    name: 'torigoya-plugin-config',
    buildStart() {
      this.addWatchFile(configFilePath);
    },
    async watchChange(id, _change) {
      if (id === configFilePath) {
        configData = await buildConfig(configFilePath, options.buildDir);
      }
    },
    async renderChunk(code, chunk, _options, _meta) {
      if (chunk.facadeModuleId) {
        const name = path.basename(chunk.facadeModuleId, '.js');
        const help = readFileSync(path.resolve(chunk.facadeModuleId, '..', '_build', `${name}_header.js`), 'utf-8');

        return format(
          template({
            name,
            version: configData[name]?.version || '',
            date: formatJSTDate(new Date()),
            help,
            code,
          }),
        );
      } else {
        return code;
      }
    },
  };
}
