import {
  PluginConfigSchema,
  PluginParameter,
  PluginParameterNote,
  PluginParameterNoteArray,
} from '@rutan/rpgmaker-plugin-annotation';
import { TorigoyaPluginConfigSchema } from './types.js';

type Config = PluginConfigSchema | TorigoyaPluginConfigSchema;

export function convertForSupportVersion<T extends Config>(config: T): T {
  if (config.target.includes('MV')) return convertForMv(config);

  return config;
}

function convertMultilineStringToNote(param: PluginParameter): PluginParameter {
  switch (param.type) {
    case 'multiline_string':
      return {
        ...param,
        type: 'note',
      } satisfies PluginParameterNote;
    case 'multiline_string[]':
      return {
        ...param,
        type: 'note[]',
      } satisfies PluginParameterNoteArray;
    default:
      return param;
  }
}

function convertForMv<T extends Config>(config: T): T {
  return {
    ...config,
    params: config.params.map(convertMultilineStringToNote),
    structs: config.structs.map((struct) => {
      return {
        ...struct,
        params: struct.params.map(convertMultilineStringToNote),
      };
    }),
  };
}
