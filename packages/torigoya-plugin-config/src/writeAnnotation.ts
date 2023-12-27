import { generateAnnotation, PluginConfigSchema } from '@rutan/rpgmaker-plugin-annotation';
import { writeFile } from 'fs/promises';
import { consola } from 'consola';

export async function writeAnnotation(config: PluginConfigSchema, outputPath: string) {
  const languages = typeof config.title === 'object' ? Object.keys(config.title) : ['ja'];
  const annotation = generateAnnotation(config, {
    languages,
    defaultLanguage: languages[0],
  });

  return writeFile(outputPath, annotation, 'utf-8').then(() => {
    consola.info(`write annotation: ${outputPath}`);
  });
}
