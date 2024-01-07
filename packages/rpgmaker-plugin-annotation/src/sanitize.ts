import { pluginConfigSchema } from './internal/schemaDefine.js';
import { PluginConfigSchema } from './schema.js';

export function sanitize(pluginConfig: PluginConfigSchema) {
  return pluginConfigSchema.parse(pluginConfig);
}
