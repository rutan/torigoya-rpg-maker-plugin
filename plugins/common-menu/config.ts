import {
  createBooleanParam,
  createDatabaseParam,
  createMultiLineStringParam,
  createParamGroup,
  createStringParam,
  createStruct,
  createStructParamArray,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

const structMenuItem = createStruct('MenuItem', [
  createStringParam('name', {
    text: {
      ja: '項目名',
    },
    description: {
      ja: 'メニューに表示される項目の名前',
    },
  }),
  createDatabaseParam('commonEvent', {
    type: 'common_event',
    text: {
      ja: '呼び出すコモンイベント',
    },
    description: {
      ja: 'メニュー選択時に呼び出すコモンイベント',
    },
  }),
  createDatabaseParam('switchId', {
    type: 'switch',
    text: {
      ja: '有効スイッチ',
    },
    description: {
      ja: dedent`
        このスイッチがONのときのみ選択できるようにします。
        なしの場合は、常に選択できます。
      `,
    },
  }),
  createBooleanParam('visibility', {
    text: {
      ja: '無効時に表示するか',
    },
    description: {
      ja: dedent`
        有効スイッチがONじゃないときに
        項目をメニューに表示するか設定できます。
      `,
    },
    on: {
      ja: '表示する',
    },
    off: {
      ja: '表示しない',
    },
    default: true,
  }),
  createMultiLineStringParam('note', {
    text: {
      ja: 'メモ',
    },
    description: {
      ja: dedent`
        メモ欄です。
        ツクールのメモ欄同様に使えます。
      `,
    },
  }),
]);

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.2.0',
  title: {
    ja: 'メニューからコモンイベント呼び出しプラグイン',
  },
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createStructParamArray('baseItems', {
          struct: structMenuItem,
          text: {
            ja: 'メニューに追加する項目',
          },
        }),
      ],
    }),
  ],
};

export const Torigoya_CommonMenu: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
  help: {
    ja: dedent`
      メニューにコモンイベントを呼び出す項目を追加します

      ------------------------------------------------------------
      ■ 設定方法
      ------------------------------------------------------------

      このプラグインの設定からメニュー項目を登録してください。
      ここでの並び順の順番で画面に表示されます。
    `,
  },
};

export const TorigoyaMZ_CommonMenu: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
  help: {
    ja: dedent`
      メニューにコモンイベントを呼び出す項目を追加します

      ------------------------------------------------------------
      ■ 設定方法
      ------------------------------------------------------------

      このプラグインの設定からメニュー項目を登録してください。
      ここでの並び順の順番で画面に表示されます。

      ------------------------------------------------------------
      ■ PluginCommonBase.js 連携
      ------------------------------------------------------------

      このプラグインは PluginCommonBase.js に対応しています。
      PluginCommonBase.js を導入している場合、
      メニュー項目の名前に変数（\\V[123]）など一部の制御文字を利用できます。
    `,
  },
};
