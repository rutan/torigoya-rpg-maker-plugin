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
import { dedent } from '@qnighy/dedent';

export function dd(str: TemplateStringsArray, ...substitutions: unknown[]) {
  return dedent(str, ...substitutions).trim();
}

export type I18nText = {
  en?: string;
  ja?: string;
};

type LabelParam = {
  text: string;
  description: string;
};

export function defineLabel(params: { ja?: LabelParam; en?: LabelParam }) {
  const result: {
    text: I18nText;
    description: I18nText;
  } = {
    text: {},
    description: {},
  };

  (Object.keys(params) as (keyof I18nText)[]).forEach((lang) => {
    result.text[lang] = params[lang]?.text;
    result.description[lang] = params[lang]?.description;
  });

  return result;
}

export function createParamGroup<T extends string, U extends PluginParameter[]>(
  name: T,
  {
    text,
    description,
    children,
  }: {
    text: string | I18nText;
    description?: string | I18nText;
    children: U;
  },
): [
  PluginParameterString & {
    name: T;
    isParamGroupHeader: true;
  },
  ...U,
] {
  return [
    {
      name,
      type: 'string',
      text,
      description,
      default: '',
      isParamGroupHeader: true,
    } as const,
    ...(children.map((child) => ({ ...child, parent: name })) as any as U),
  ];
}

export function createStringParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: string | I18nText;
  },
): PluginParameterString & {
  name: T;
} {
  return {
    name,
    type: 'string',
    text: props.text,
    description: props.description,
    default: props.default || '',
  };
}

export function createStringParamArray<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: (string | I18nText)[];
  },
): PluginParameterStringArray & {
  name: T;
} {
  return {
    name,
    type: 'string[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
  };
}

export function createNoteParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: string;
  },
): PluginParameterNote & {
  name: T;
} {
  return {
    name,
    type: 'note',
    text: props.text,
    description: props.description,
    default: props.default || '',
  };
}

export function createMultiLineStringParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: string | I18nText;
  },
): PluginParameterMultilineString & {
  name: T;
} {
  return {
    name,
    type: 'multiline_string',
    text: props.text,
    description: props.description,
    default: props.default || '',
  };
}

export function createMultiLineStringParamArray<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: (string | I18nText)[];
  },
): PluginParameterMultilineStringArray & {
  name: T;
} {
  return {
    name,
    type: 'multiline_string[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
  };
}

export function createFileParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    dir: string;
    default?: string;
  },
): PluginParameterFile & {
  name: T;
} {
  return {
    name,
    type: 'file',
    text: props.text,
    description: props.description,
    dir: props.dir,
    default: props.default || '',
  };
}

export function createFileParamArray<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    dir: string;
    default?: string[];
  },
): PluginParameterFileArray & {
  name: T;
} {
  return {
    name,
    type: 'file[]',
    text: props.text,
    description: props.description,
    dir: props.dir,
    default: props.default || [],
  };
}

export function createNumberParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    min?: number;
    max?: number;
    decimals?: number;
    default?: number;
  },
): PluginParameterNumber & {
  name: T;
} {
  return {
    name,
    type: 'number',
    text: props.text,
    description: props.description,
    min: props.min,
    max: props.max,
    decimals: props.decimals || 0,
    default: props.default || 0,
  };
}

export function createNumberParamArray<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    min?: number;
    max?: number;
    decimals?: number;
    default?: number[];
  },
): PluginParameterNumberArray & {
  name: T;
} {
  return {
    name,
    type: 'number[]',
    text: props.text,
    description: props.description,
    min: props.min,
    max: props.max,
    decimals: props.decimals || 0,
    default: props.default || [],
  };
}

export function createBooleanParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    on: string | I18nText;
    off: string | I18nText;
    default?: boolean;
  },
): PluginParameterBoolean & {
  name: T;
} {
  return {
    name,
    type: 'boolean',
    text: props.text,
    description: props.description,
    on: props.on,
    off: props.off,
    default: props.default || false,
  };
}

export function createBooleanParamArray<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    on: string | I18nText;
    off: string | I18nText;
    default?: boolean[];
  },
): PluginParameterBooleanArray & {
  name: T;
} {
  return {
    name,
    type: 'boolean[]',
    description: props.description,
    on: props.on,
    off: props.off,
    default: props.default || [],
  };
}

export function createSelectParam<
  T extends string,
  U extends {
    name: string | I18nText;
    value: string;
  }[],
>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    options: U;
    default?: U[number]['value'];
  },
): PluginParameterSelect & {
  name: T;
  default: U[number]['value'];
} {
  return {
    name,
    type: 'select',
    text: props.text,
    description: props.description,
    options: props.options,
    default: props.default || props.options[0]?.value || '',
  };
}

export function createSelectParamArray<
  T extends string,
  U extends {
    name: string | I18nText;
    value: string;
  }[],
>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    options: U;
    default?: U[number]['value'][];
  },
): PluginParameterSelectArray & {
  name: T;
  default: U[number]['value'][];
} {
  return {
    name,
    type: 'select[]',
    text: props.text,
    description: props.description,
    options: props.options,
    default: props.default || [],
  };
}

export function createComboParam<T extends string, U extends string[]>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    options: U;
    default?: U[number];
  },
): PluginParameterCombo & {
  name: T;
  default: U[number];
} {
  return {
    name,
    type: 'combo',
    text: props.text,
    description: props.description,
    options: props.options,
    default: props.default || props.options[0],
  };
}

export function createDatabaseParam<T extends string>(
  name: T,
  props: {
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
  },
): PluginParameterDatabase & {
  name: T;
} {
  return {
    name,
    type: props.type,
    text: props.text,
    description: props.description,
    default: props.default || 0,
  };
}

export function createDatabaseParamArray<T extends string>(
  name: T,
  props: {
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
  },
): PluginParameterDatabaseArray & {
  name: T;
} {
  return {
    name,
    type: `${props.type}[]`,
    text: props.text,
    description: props.description,
    default: props.default || [],
  };
}

export type StructDefaultValueType<
  T extends PluginStruct['params'] & {
    isParamGroupHeader?: boolean;
  },
> = {
  [P in T[number] as P extends {
    isParamGroupHeader: true;
  }
    ? never
    : P['name']]: P['default'];
};

function getStructDefaultValue<T extends PluginStruct>(struct: T): StructDefaultValueType<T['params']> {
  const result: any = {};

  struct.params.forEach((param) => {
    if ('isParamGroupHeader' in param) return;

    result[param.name] = param.default;
  });

  return result;
}

export function createStructParam<T extends string, U extends PluginStruct>(
  name: T,
  props: {
    struct: U;
    text: string | I18nText;
    description?: string | I18nText;
    default?: StructDefaultValueType<U['params']>;
  },
): PluginParameterStruct & {
  name: T;
} {
  return {
    name,
    type: 'struct',
    struct: props.struct.name,
    text: props.text,
    description: props.description,
    default: props.default || getStructDefaultValue(props.struct),
  };
}

export function createStructParamArray<T extends string, U extends PluginStruct>(
  name: T,
  props: {
    struct: U;
    text: string | I18nText;
    description?: string | I18nText;
    default?:
      | StructDefaultValueType<U['params']>[]
      | {
          en?: StructDefaultValueType<U['params']>[];
          ja?: StructDefaultValueType<U['params']>[];
        };
  },
): PluginParameterStructArray & {
  name: T;
} {
  return {
    name,
    type: 'struct[]',
    struct: props.struct.name,
    text: props.text,
    description: props.description,
    default: props.default || [],
  };
}

export function createStruct<T extends string, U extends PluginParameter[]>(
  name: T,
  params: U,
): {
  name: T;
  params: U;
} {
  return { name, params };
}

export function createCommand<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    args: PluginParameter[];
  },
): PluginCommand & {
  name: T;
} {
  return {
    name,
    text: props.text,
    description: props.description || '',
    args: props.args,
  };
}
