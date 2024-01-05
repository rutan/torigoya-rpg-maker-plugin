import { pluginConfigSchema } from './internal/schemaDefine';
import { PluginConfigSchema } from './schema';

export function sanitize(pluginConfig: PluginConfigSchema) {
  return pluginConfigSchema.parse(pluginConfig);
}
