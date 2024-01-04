import {
  PluginParameter,
  PluginParameterString,
  PluginParameterStringArray,
  PluginParameterMultilineString,
  PluginParameterMultilineStringArray,
  PluginParameterBoolean,
  PluginParameterBooleanArray,
  PluginParameterFile,
  PluginParameterFileArray,
  PluginParameterNote,
  PluginParameterNumber,
  PluginParameterNumberArray,
  PluginParameterSelect,
  PluginParameterSelectArray,
  PluginParameterCombo,
  PluginParameterDatabase,
  PluginParameterDatabaseArray,
  PluginParameterStruct,
  PluginParameterStructArray,
  PluginStruct,
  PluginCommand,
} from '@rutan/rpgmaker-plugin-annotation';

export type I18nText = {
  ja?: string;
  en?: string;
};

export function createParamGroup<T extends string>(
  name: T,
): <U extends PluginParameter[]>(props: {
  text: string | I18nText;
  description?: string | I18nText;
  children: U;
}) => [PluginParameterString & { name: T; isParamGroupHeader: true }, ...U] {
  return ({ text, description, children }) => [
    {
      name,
      type: 'string',
      text,
      description,
      default: '',
      isParamGroupHeader: true,
    } as const,
    ...children,
  ];
}

export function createStringParam<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  default?: string | I18nText;
}) => PluginParameterString & { name: T } {
  return (props) => ({
    name,
    type: 'string',
    text: props.text,
    description: props.description,
    default: props.default || '',
  });
}

export function createStringParamArray<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  default?: (string | I18nText)[];
}) => PluginParameterStringArray & { name: T } {
  return (props) => ({
    name,
    type: 'string[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
  });
}

export function createNoteParam<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  default?: string;
}) => PluginParameterNote & { name: T } {
  return (props) => ({
    name,
    type: 'note',
    text: props.text,
    description: props.description,
    default: props.default || '',
  });
}

export function createMultiLineStringParam<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  default?: string | I18nText;
}) => PluginParameterMultilineString & { name: T } {
  return (props) => ({
    name,
    type: 'multiline_string',
    text: props.text,
    description: props.description,
    default: props.default || '',
  });
}

export function createMultiLineStringParamArray<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  default?: (string | I18nText)[];
}) => PluginParameterMultilineStringArray & { name: T } {
  return (props) => ({
    name,
    type: 'multiline_string[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
  });
}

export function createFileParam<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  dir: string;
  default?: string;
}) => PluginParameterFile & { name: T } {
  return (props) => ({
    name,
    type: 'file',
    text: props.text,
    description: props.description,
    dir: props.dir,
    default: props.default || '',
  });
}

export function createFileParamArray<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  dir: string;
  default?: string[];
}) => PluginParameterFileArray & { name: T } {
  return (props) => ({
    name,
    type: 'file[]',
    text: props.text,
    description: props.description,
    dir: props.dir,
    default: props.default || [],
  });
}

export function createNumberParam<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  min?: number;
  max?: number;
  decimals?: number;
  default?: number;
}) => PluginParameterNumber & { name: T } {
  return (props) => ({
    name,
    type: 'number',
    text: props.text,
    description: props.description,
    min: props.min,
    max: props.max,
    decimals: props.decimals || 0,
    default: props.default || 0,
  });
}

export function createNumberParamArray<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  min?: number;
  max?: number;
  decimals?: number;
  default?: number[];
}) => PluginParameterNumberArray & { name: T } {
  return (props) => ({
    name,
    type: 'number[]',
    text: props.text,
    description: props.description,
    min: props.min,
    max: props.max,
    decimals: props.decimals || 0,
    default: props.default || [],
  });
}

export function createBooleanParam<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  on: string | I18nText;
  off: string | I18nText;
  default?: boolean;
}) => PluginParameterBoolean & { name: T } {
  return (props) => ({
    name,
    type: 'boolean',
    description: props.description,
    on: props.on,
    off: props.off,
    default: props.default || false,
  });
}

export function createBooleanParamArray<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  on: string | I18nText;
  off: string | I18nText;
  default?: boolean[];
}) => PluginParameterBooleanArray & { name: T } {
  return (props) => ({
    name,
    type: 'boolean[]',
    description: props.description,
    on: props.on,
    off: props.off,
    default: props.default || [],
  });
}

export function createSelectParam<T extends string>(
  name: T,
): <U extends { name: string | I18nText; value: string }[]>(props: {
  text: string | I18nText;
  description?: string | I18nText;
  options: U;
  default?: U[number]['value'];
}) => PluginParameterSelect & { name: T; default: U[number]['value'] } {
  return (props) => ({
    name,
    type: 'select',
    text: props.text,
    description: props.description,
    options: props.options,
    default: props.default || props.options[0]?.value || '',
  });
}

export function createSelectParamArray<T extends string>(
  name: T,
): <U extends { name: string | I18nText; value: string }[]>(props: {
  text: string | I18nText;
  description?: string | I18nText;
  options: U;
  default?: U[number]['value'][];
}) => PluginParameterSelectArray & { name: T; default: U[number]['value'][] } {
  return (props) => ({
    name,
    type: 'select[]',
    text: props.text,
    description: props.description,
    options: props.options,
    default: props.default || [],
  });
}

export function createComboParam<T extends string>(
  name: T,
): <U extends string[]>(props: {
  text: string | I18nText;
  description?: string | I18nText;
  options: U;
  default?: U[number];
}) => PluginParameterCombo & { name: T; default: U[number] } {
  return (props) => ({
    name,
    type: 'combo',
    text: props.text,
    description: props.description,
    options: props.options,
    default: props.default || props.options[0],
  });
}

export function createDatabaseParam<T extends string>(
  name: T,
): (props: {
  type:
    | 'actor'
    | 'class'
    | 'skill'
    | 'item'
    | 'weapon'
    | 'armor'
    | 'enemy'
    | 'troop'
    | 'state'
    | 'animation'
    | 'tileset'
    | 'common_event'
    | 'switch'
    | 'variable';
  text: string | I18nText;
  description?: string | I18nText;
  default?: number;
}) => PluginParameterDatabase & { name: T } {
  return (props) => ({
    name,
    type: props.type,
    text: props.text,
    description: props.description,
    default: props.default || 0,
  });
}

export function createDatabaseParamArray<T extends string>(
  name: T,
): (props: {
  type:
    | 'actor'
    | 'class'
    | 'skill'
    | 'item'
    | 'weapon'
    | 'armor'
    | 'enemy'
    | 'troop'
    | 'state'
    | 'animation'
    | 'tileset'
    | 'common_event'
    | 'switch'
    | 'variable';
  text: string | I18nText;
  description?: string | I18nText;
  default?: number[];
}) => PluginParameterDatabaseArray & { name: T } {
  return (props) => ({
    name,
    type: `${props.type}[]`,
    text: props.text,
    description: props.description,
    default: props.default || [],
  });
}

export type StructDefaultValueType<T extends PluginStruct['params'] & { isParamGroupHeader?: boolean }> = {
  [P in T[number] as P extends { isParamGroupHeader: true } ? never : P['name']]: P['default'];
};

export function createStructParam<T extends string>(
  name: T,
): <U extends PluginStruct>(props: {
  struct: U['name'];
  text: string | I18nText;
  description?: string | I18nText;
  default: StructDefaultValueType<U['params']>;
}) => PluginParameterStruct & { name: T } {
  return (props) => ({
    name,
    type: 'struct',
    struct: props.struct,
    text: props.text,
    description: props.description,
    default: props.default,
  });
}

export function createStructParamArray<T extends string>(
  name: T,
): <U extends PluginStruct>(props: {
  struct: U['name'];
  text: string | I18nText;
  description?: string | I18nText;
  default?: StructDefaultValueType<U['params']>[];
}) => PluginParameterStructArray & { name: T } {
  return (props) => ({
    name,
    type: 'struct[]',
    struct: props.struct,
    text: props.text,
    description: props.description,
    default: props.default || [],
  });
}

export function createStruct<T extends string>(
  name: T,
): <U extends PluginParameter[]>(
  params: U,
) => {
  name: T;
  params: U;
} {
  return (params) => ({ name, params });
}

export function createCommand<T extends string>(
  name: T,
): (props: {
  text: string | I18nText;
  description?: string | I18nText;
  args: PluginParameter[];
}) => PluginCommand & { name: T } {
  return (props) => ({
    name,
    text: props.text,
    description: props.description || '',
    args: props.args,
  });
}
