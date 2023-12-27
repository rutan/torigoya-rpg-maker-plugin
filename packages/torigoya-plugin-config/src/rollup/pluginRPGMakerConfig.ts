import { readFileSync } from 'fs';
import * as path from 'path';
import ejs from 'ejs';
import { simpleGit, LogResult } from 'simple-git';
import { loadConfig } from '../loadConfig.js';
import { writeAnnotation } from '../writeAnnotation.js';
import { writeParameterReader } from '../writeParameterReader.js';
import { Plugin, RenderedChunk } from 'rollup';
import { mkdirp } from 'mkdirp';
import { format } from 'prettier';

const git = simpleGit();

function formatDate(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(
    2,
    '0',
  )} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

async function getLatestDate(chunk: RenderedChunk) {
  const dates = (
    await Promise.all(
      Object.keys(chunk.modules).map((file) => {
        return new Promise<LogResult | null>((resolve) => {
          git
            .log({ file, multiLine: false })
            .then((result) => resolve(result))
            .catch(() => resolve(null));
        });
      }),
    )
  )
    .map((date) => new Date(date?.latest?.date || 0))
    .sort((a, b) => a.getTime() - b.getTime());

  return dates.length > 0 ? dates[dates.length - 1] : new Date();
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
        const date = process.env.NODE_ENV === 'production' ? await getLatestDate(chunk) : new Date();
        const help = readFileSync(path.resolve(chunk.facadeModuleId, '..', '_build', `${name}_header.js`), 'utf-8');

        return format(
          template({
            name,
            version: configData[name]?.version || '',
            date: formatDate(date),
            help,
            code,
          }),
          {
            parser: 'babel',
            printWidth: 120,
            tabWidth: 4,
            singleQuote: true,
          },
        );
      } else {
        return code;
      }
    },
  };
}
