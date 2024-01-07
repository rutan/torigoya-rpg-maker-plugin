import { z } from 'zod';

export const stringOrI18nString = z.union([z.string(), z.record(z.string())]);
export type StringOrI18nString = z.infer<typeof stringOrI18nString>;

export const pluginParameterBase = z.object({
  parent: z.string().optional(),
  name: z.string(),
  text: stringOrI18nString.optional(),
  description: stringOrI18nString.optional(),
});
export type PluginParameterBase = z.infer<typeof pluginParameterBase>;

export const pluginParameterString = pluginParameterBase.extend({
  type: z.literal('string'),
  default: stringOrI18nString.default(''),
});
export type PluginParameterString = z.infer<typeof pluginParameterString>;

export const pluginParameterStringArray = pluginParameterBase.extend({
  type: z.literal('string[]'),
  default: z.array(stringOrI18nString).default([]),
});
export type PluginParameterStringArray = z.infer<typeof pluginParameterStringArray>;

export const pluginParameterNote = pluginParameterBase.extend({
  type: z.literal('note'),
  default: stringOrI18nString.default(''),
});
export type PluginParameterNote = z.infer<typeof pluginParameterNote>;

export const pluginParameterNoteArray = pluginParameterBase.extend({
  type: z.literal('note[]'),
  default: z.array(stringOrI18nString).default([]),
});
export type PluginParameterNoteArray = z.infer<typeof pluginParameterNoteArray>;

export const pluginParameterMultilineString = pluginParameterBase.extend({
  type: z.literal('multiline_string'),
  default: stringOrI18nString.default(''),
});
export type PluginParameterMultilineString = z.infer<typeof pluginParameterMultilineString>;

export const pluginParameterMultilineStringArray = pluginParameterBase.extend({
  type: z.literal('multiline_string[]'),
  default: z.array(stringOrI18nString).default([]),
});
export type PluginParameterMultilineStringArray = z.infer<typeof pluginParameterMultilineStringArray>;

export const pluginParameterFile = pluginParameterBase.extend({
  type: z.literal('file'),
  dir: z.string(),
  default: z.string().default(''),
});
export type PluginParameterFile = z.infer<typeof pluginParameterFile>;

export const pluginParameterFileArray = pluginParameterFile.extend({
  type: z.literal('file[]'),
  default: z.array(z.string()).default([]),
});
export type PluginParameterFileArray = z.infer<typeof pluginParameterFileArray>;

export const pluginParameterNumber = pluginParameterBase.extend({
  type: z.literal('number'),
  max: z.number().optional(),
  min: z.number().optional(),
  decimals: z.number().min(0).default(0),
  default: z.number().default(0),
});
export type PluginParameterNumber = z.infer<typeof pluginParameterNumber>;

export const pluginParameterNumberArray = pluginParameterNumber.extend({
  type: z.literal('number[]'),
  default: z.array(z.number()).default([]),
});
export type PluginParameterNumberArray = z.infer<typeof pluginParameterNumberArray>;

export const pluginParameterBoolean = pluginParameterBase.extend({
  type: z.literal('boolean'),
  on: stringOrI18nString,
  off: stringOrI18nString,
  default: z.boolean(),
});
export type PluginParameterBoolean = z.infer<typeof pluginParameterBoolean>;

export const pluginParameterBooleanArray = pluginParameterBoolean.extend({
  type: z.literal('boolean[]'),
  default: z.array(z.boolean()).default([]),
});
export type PluginParameterBooleanArray = z.infer<typeof pluginParameterBooleanArray>;

export const pluginParameterSelect = pluginParameterBase.extend({
  type: z.literal('select'),
  options: z.array(
    z.object({
      name: stringOrI18nString,
      value: z.string(),
    }),
  ),
  default: z.string(),
});
export type PluginParameterSelect = z.infer<typeof pluginParameterSelect>;

export const pluginParameterSelectArray = pluginParameterSelect.extend({
  type: z.literal('select[]'),
  default: z.array(z.string()).default([]),
});
export type PluginParameterSelectArray = z.infer<typeof pluginParameterSelectArray>;

export const pluginParameterCombo = pluginParameterBase.extend({
  type: z.literal('combo'),
  options: z.array(z.string()),
  default: z.string(),
});
export type PluginParameterCombo = z.infer<typeof pluginParameterCombo>;

export const pluginParameterComboArray = pluginParameterBase.extend({
  type: z.literal('combo[]'),
  options: z.array(z.string()),
  default: z.array(z.string()).default([]),
});
export type PluginParameterComboArray = z.infer<typeof pluginParameterComboArray>;

export const pluginParameterDatabase = pluginParameterBase.extend({
  type: z.union([
    z.literal('actor'),
    z.literal('class'),
    z.literal('skill'),
    z.literal('item'),
    z.literal('weapon'),
    z.literal('armor'),
    z.literal('enemy'),
    z.literal('troop'),
    z.literal('state'),
    z.literal('animation'),
    z.literal('tileset'),
    z.literal('common_event'),
    z.literal('switch'),
    z.literal('variable'),
  ]),
  default: z.number().default(0),
});
export type PluginParameterDatabase = z.infer<typeof pluginParameterDatabase>;

export const pluginParameterDatabaseArray = pluginParameterBase.extend({
  type: z.union([
    z.literal('actor[]'),
    z.literal('class[]'),
    z.literal('skill[]'),
    z.literal('item[]'),
    z.literal('weapon[]'),
    z.literal('armor[]'),
    z.literal('enemy[]'),
    z.literal('troop[]'),
    z.literal('state[]'),
    z.literal('animation[]'),
    z.literal('tileset[]'),
    z.literal('common_event[]'),
    z.literal('switch[]'),
    z.literal('variable[]'),
  ]),
  default: z.array(z.number()).default([]),
});
export type PluginParameterDatabaseArray = z.infer<typeof pluginParameterDatabaseArray>;

export const structOrI18nStruct = z.union([z.record(z.any()), z.record(z.record(z.any()))]);
export type StructOrI18nStruct = z.infer<typeof structOrI18nStruct>;

export const pluginParameterStruct = pluginParameterBase.extend({
  type: z.literal('struct'),
  struct: z.string(),
  default: structOrI18nStruct.default({}),
});
export type PluginParameterStruct = z.infer<typeof pluginParameterStruct>;

export const structArrayOrI18nStructArray = z.union([z.array(z.record(z.any())), z.record(z.array(z.record(z.any())))]);
export type StructArrayOrI18nStructArray = z.infer<typeof structArrayOrI18nStructArray>;

export const pluginParameterStructArray = pluginParameterStruct.extend({
  type: z.literal('struct[]'),
  default: structArrayOrI18nStructArray.default([]),
});
export type PluginParameterStructArray = z.infer<typeof pluginParameterStructArray>;

export const pluginParameter = z.union([
  pluginParameterString,
  pluginParameterStringArray,
  pluginParameterMultilineString,
  pluginParameterMultilineStringArray,
  pluginParameterNote,
  pluginParameterNoteArray,
  pluginParameterFile,
  pluginParameterFileArray,
  pluginParameterNumber,
  pluginParameterNumberArray,
  pluginParameterBoolean,
  pluginParameterBooleanArray,
  pluginParameterSelect,
  pluginParameterSelectArray,
  pluginParameterCombo,
  pluginParameterComboArray,
  pluginParameterDatabase,
  pluginParameterDatabaseArray,
  pluginParameterStruct,
  pluginParameterStructArray,
]);
export type PluginParameter = z.infer<typeof pluginParameter>;

export const pluginStruct = z.object({
  name: z.string(),
  params: z.array(pluginParameter),
});
export type PluginStruct = z.infer<typeof pluginStruct>;

export const pluginCommand = z.object({
  name: z.string(),
  text: stringOrI18nString,
  description: stringOrI18nString,
  args: z.array(pluginParameter),
});
export type PluginCommand = z.infer<typeof pluginCommand>;

export const pluginNote = z.object({
  name: z.string(),
  dir: z.string(),
  type: z.literal('file'),
  data: z.union([
    z.literal('maps'),
    z.literal('events'),
    z.literal('actors'),
    z.literal('classes'),
    z.literal('skills'),
    z.literal('items'),
    z.literal('weapons'),
    z.literal('armors'),
    z.literal('enemies'),
    z.literal('states'),
    z.literal('tilesets'),
  ]),
});
export type PluginNote = z.infer<typeof pluginNote>;

export const pluginConfigSchema = z.object({
  target: z.array(z.string()),
  title: stringOrI18nString,
  author: stringOrI18nString,
  help: stringOrI18nString.optional(),
  url: stringOrI18nString.optional(),
  version: stringOrI18nString.optional(),
  license: stringOrI18nString.optional(),
  params: z.array(pluginParameter).default([]),
  structs: z.array(pluginStruct).default([]),
  commands: z.array(pluginCommand).default([]),
  base: z.array(z.string()).optional(),
  orderAfter: z.array(z.string()).optional(),
  orderBefore: z.array(z.string()).optional(),
  requiredAssets: z.array(z.string()).optional(),
  requiredNoteAssets: z.array(pluginNote).optional(),
});
export type PluginConfigSchema = z.infer<typeof pluginConfigSchema>;
