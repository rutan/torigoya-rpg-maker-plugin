import {
  createFileParamArray,
  createNumberParam,
  createParamGroup,
  createStringParam,
  createStruct,
  createStructParamArray,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

const structRewardPicture = createStruct('rewardPicture', [
  createStringParam('key', {
    text: {
      ja: '実績ID',
    },
    description: {
      ja: dedent`
        ご褒美ピクチャーを設定する対象の
        実績プラグインで設定した実績IDを指定してください。
      `,
    },
  }),
  createFileParamArray('picture', {
    text: {
      ja: 'ご褒美の画像',
    },
    description: {
      ja: dedent`
        ご褒美として表示する画像を選択してください。
        画像は複数枚指定可能です。
      `,
    },
    dir: 'img/pictures',
  }),
]);

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.1.1',
  title: {
    ja: '実績プラグインアドオン: ご褒美ピクチャー',
  },
  help: {
    ja: dedent`
      このプラグインは「実績プラグイン」のアドオンです。
      実績プラグインより下に導入してください。

      実績を獲得した人だけが見られるご褒美画像を設定できるようにします。
      画像ファイルはピクチャー用のフォルダに入れてください。

      ------------------------------------------------------------
      ■ 設定方法（ちょっとめんどい）
      ------------------------------------------------------------
      このプラグインの右側の設定で、
      「どの実績IDに、何の画像を指定するか」を設定できます。

      実績プラグイン本体のほうで設定した各実績のIDに
      ピクチャー画像を紐付ける形で登録してください。
      （画像を登録していない実績があっても大丈夫です）
    `,
  },
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createStructParamArray('baseRewardData', {
          struct: structRewardPicture,
          text: {
            ja: 'ご褒美ピクチャーの登録',
          },
          default: [],
        }),
      ],
    }),
  ],
  structs: [structRewardPicture],
  base: ['TorigoyaMZ_Achievement2'],
  orderAfter: ['TorigoyaMZ_Achievement2'],
};

export const Torigoya_Achievement2_AddonRewardPicture: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
};

export const TorigoyaMZ_Achievement2_AddonRewardPicture: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
};
