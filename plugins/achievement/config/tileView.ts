import { createNumberParam, createParamGroup, TorigoyaPluginConfigSchema } from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.2.1',
  title: {
    ja: '実績プラグインアドオン: タイル表示',
  },
  help: {
    ja: dedent`
      このプラグインは「実績プラグイン」のアドオンです。
      実績プラグインより下に導入してください。

      獲得した実績の一覧画面をテキストではなく
      アイコンで表示するように変更します
    `,
  },
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createNumberParam('colsSize', {
          text: {
            ja: '表示数（横）',
          },
          description: {
            ja: dedent`
              一列に表示するアイコンの個数
            `,
          },
          min: 1,
          default: 5,
        }),
        createNumberParam('itemPadding', {
          text: {
            ja: 'アイコンの余白',
          },
          description: {
            ja: dedent`
              アイコンの周囲の余白(px)
            `,
          },
          min: 0,
          default: 5,
        }),
      ],
    }),
  ],
  base: ['TorigoyaMZ_Achievement2'],
  orderAfter: ['TorigoyaMZ_Achievement2'],
};

export const Torigoya_Achievement2_AddonTileView: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
};

export const TorigoyaMZ_Achievement2_AddonTileView: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
};
