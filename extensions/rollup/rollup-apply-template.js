import * as fs from 'fs';
import * as path from 'path';
import ejs from 'ejs';
import simpleGit from 'simple-git';
import { loadConfig } from '../../scripts/utils/loadConfig.js';

const git = simpleGit();

function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(
    2,
    '0'
  )} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

async function getLatestDate(chunk) {
  const dates = (
    await Promise.all(
      Object.keys(chunk.modules).map((file) => {
        return new Promise((resolve) => {
          git
            .log({ file, multiLine: false })
            .then((result) => resolve(result))
            .catch(() => resolve({}));
        });
      })
    )
  )
    .filter((date) => date.latest)
    .map((date) => new Date(date.latest.date))
    .sort((a, b) => a - b);
  return dates.length > 0 ? dates[dates.length - 1] : new Date();
}

export default function applyTemplate(options = {}) {
  const template = ejs.compile(fs.readFileSync(options.template, 'utf-8'), {});
  return {
    name: 'applyTemplate',
    async renderChunk(code, chunk) {
      if (chunk.facadeModuleId) {
        const name = path.basename(chunk.facadeModuleId, '.js');
        const date = process.env.NODE_ENV === 'production' ? await getLatestDate(chunk) : new Date();
        const help = fs.readFileSync(path.resolve(chunk.facadeModuleId, '..', '_build', `${name}_header.js`), 'utf-8');
        const config = loadConfig(path.resolve(chunk.facadeModuleId, '..', 'config.yml'))[name];

        return template({
          name,
          version: config.version,
          date: formatDate(date),
          help,
          code,
        });
      } else {
        return code;
      }
    },
  };
}
