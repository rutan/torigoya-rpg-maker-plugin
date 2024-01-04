import {
  createNumberParam,
  createParamGroup,
  createSelectParam,
  createStringParam,
  createStruct,
  createStructParamArray,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

const structCategory = createStruct('Category')([
  createStringParam('name')({
    text: {
      ja: 'カテゴリ名',
    },
    description: {
      ja: dedent`
        カテゴリの名前。
        ここで設定した名前をメモ欄で指定してください。
      `,
    },
  }),
  createStringParam('prefix')({
    text: {
      ja: '自動割当のID命名規則',
    },
    description: {
      ja: dedent`
        ここに設定した文字列で始まるIDの実績を
        このカテゴリに自動割当します（空欄の場合は無し）
      `,
    },
  }),
]);

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.3.1',
  title: {
    ja: '実績プラグインアドオン: カテゴリ設定',
  },
  help: {
    ja: dedent`
      このプラグインは「実績プラグイン」のアドオンです。
      実績プラグインより下に導入してください。

      獲得した実績をカテゴリ別に表示するようにします。

      ------------------------------------------------------------
      ■ カテゴリの種類を定義する
      ------------------------------------------------------------

      このプラグインの設定で行います。
      右のプラグイン設定から、画面に従って必要なカテゴリを作成してください。

      ＜カテゴリの自動割当＞
      実績プラグインで設定する管理IDの
      先頭についている文字列を使って
      自動的にカテゴリを割当することができます。

      例えば
      ・ストーリー_ハジメ村に到着
      ・ストーリー_ハジメ村ボス撃破
      のような管理IDをつけた実績がある場合
      「ストーリー」と指定することで、個別の設定をしなくても
      カテゴリが設定できます。

      ------------------------------------------------------------
      ■ 各実績に個別にカテゴリを設定する
      ------------------------------------------------------------

      【このプラグインではなく、実績プラグインの設定】で行います。

      実績プラグインに実績を登録する画面にメモ欄があります。
      そのメモ欄に以下のように設定してください。

      <カテゴリ: カテゴリの名前>
    `,
  },
  params: [
    ...createParamGroup('base')({
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createStructParamArray('categories')<typeof structCategory>({
          struct: 'Category',
          text: {
            ja: 'カテゴリ設定',
          },
          description: {
            ja: dedent`
              カテゴリを設定します。
              必要な個数追加してください。
            `,
          },
          default: [],
        }),
        createSelectParam('position')({
          text: {
            ja: 'カテゴリ位置',
          },
          description: {
            ja: dedent`
              カテゴリリストの表示位置を設定します。
            `,
          },
          options: [
            { value: 'left', name: { ja: '左（縦向き）' } },
            { value: 'top', name: { ja: '上（横向き）' } },
            { value: 'right', name: { ja: '右（縦向き）' } },
          ] as const,
          default: 'top',
        }),
        createNumberParam('maxCols')({
          text: {
            ja: '最大列数',
          },
          description: {
            ja: dedent`
              一度に表示するカテゴリの最大数
              ※カテゴリ位置が「上」のときだけ有効
            `,
          },
          min: 1,
          default: 4,
        }),
      ],
    }),
  ],
  structs: [structCategory],
  base: ['TorigoyaMZ_Achievement2'],
  orderAfter: ['TorigoyaMZ_Achievement2'],
};

export const Torigoya_Achievement2_AddonCategory: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
};

export const TorigoyaMZ_Achievement2_AddonCategory: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
};
