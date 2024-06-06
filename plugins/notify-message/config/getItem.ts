import {
  createBooleanParam,
  createDatabaseParam,
  createNumberParam,
  createParamGroup,
  createStringParam,
  createStruct,
  createStructParam,
  defineLabel,
  dd,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';
import { structSound } from './_share.js';

const structCustomSound = createStruct('CustomSound', [
  createBooleanParam('overwrite', {
    ...defineLabel({
      ja: {
        text: '効果音設定の上書き',
        description: dd`
          通知表示時に再生する効果音を
          デフォルトから上書き設定するか指定します。
        `,
      },
    }),
    on: {
      ja: '上書きする',
    },
    off: {
      ja: '上書きしない',
    },
    default: false,
  }),
  createStructParam('sound', {
    struct: structSound,
    ...defineLabel({
      ja: {
        text: '効果音',
        description: dd`
          上書き設定する効果音の内容を指定します。
          上書きしない場合、この設定は無視されます。
        `,
      },
    }),
    default: {
      name: '',
      volume: 90,
      pitch: 100,
      pan: 0,
    },
  }),
]);

export const TorigoyaMZ_NotifyMessage_AddonGetItem: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  version: '1.3.0',
  title: {
    ja: '通知メッセージアドオン: アイテム獲得表示',
  },
  help: {
    ja: dd`
      以下のイベントコマンド実行時に自動的に通知メッセージを表示します。
      ※増やす場合のみ表示されます

      ・所持金の増減
      ・アイテムの増減
      ・武器の増減
      ・防具の増減

      ------------------------------------------------------------
      ■ お金の場合は表示したくない場合
      ------------------------------------------------------------
      お金の入手メッセージはいらない！という場合は、
      お金の入手メッセージの内容を空欄にしてください。

      ------------------------------------------------------------
      ■ 一部アイテムだけ表示したくない場合
      ------------------------------------------------------------
      アイテムのメモ欄に以下のタグを記述することで、
      通知メッセージを表示しないようにできます。

      <獲得通知非表示>

      または

      <GainNotifyHidden>

      ------------------------------------------------------------
      ■ 一部の場面で表示したくない場合
      ------------------------------------------------------------
      上級者設定の「有効スイッチ」を設定しよう！
    `,
  },
  base: ['TorigoyaMZ_NotifyMessage'],
  orderAfter: ['TorigoyaMZ_NotifyMessage'],
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createStringParam('baseGainSingleMessage', {
          ...defineLabel({
            ja: {
              text: 'アイテム入手メッセージ（1つ）',
              description: dd`
                アイテムを1つ入手したときのメッセージを設定します。（\\name : アイテム名）
              `,
            },
          }),
          default: {
            ja: '\\c[2]\\name\\c[0] を手に入れた！',
          },
        }),
        createStringParam('baseGainMultiMessage', {
          ...defineLabel({
            ja: {
              text: 'アイテム入手メッセージ（複数）',
              description: dd`
                アイテムを複数入手したときのメッセージを設定します。（\\name : アイテム名  \\count : 個数）
              `,
            },
          }),
          default: {
            ja: '\\c[2]\\name\\c[0] ×\\count を手に入れた！',
          },
        }),
        createStringParam('baseGainMoneyMessage', {
          ...defineLabel({
            ja: {
              text: 'お金入手メッセージ',
              description: dd`
                お金を入手したときのメッセージを設定します。（\\gold : 獲得金額）
              `,
            },
          }),
          default: {
            ja: '\\gold\\c[4]\\G\\c[0] を手に入れた！',
          },
        }),
        createNumberParam('baseGainMoneyIcon', {
          ...defineLabel({
            ja: {
              text: 'お金入手アイコン',
              description: dd`
                お金を入手したときのアイコンIDを設定します。0の場合はアイコンを表示しません。
              `,
            },
          }),
          default: 0,
        }),
      ],
    }),

    ...createParamGroup('advanced', {
      text: {
        ja: '■ 上級者設定',
      },
      children: [
        createDatabaseParam('advancedSwitch', {
          type: 'switch',
          ...defineLabel({
            ja: {
              text: '有効スイッチ',
              description: dd`
                このスイッチがONのときのみ画面に通知するようにします。「なし」の場合は常に通知されます。
              `,
            },
          }),
        }),
        createBooleanParam('advancedShowHiddenItem', {
          ...defineLabel({
            ja: {
              text: '隠しアイテム表示',
              description: dd`
                「アイテムタイプ：隠しアイテム」の場合に通知を表示するか指定します。
              `,
            },
          }),
          on: {
            ja: '表示する',
          },
          off: {
            ja: '表示しない',
          },
          default: true,
        }),
        createStructParam('advancedGainItemSound', {
          struct: structCustomSound,
          ...defineLabel({
            ja: {
              text: 'アイテム入手効果音の上書き',
              description: dd`
                アイテムを入手したときに再生する効果音を指定します。
                上書き設定をしない場合は通常の通知音が再生されます。
              `,
            },
          }),
        }),
        createStructParam('advancedGainMoneySound', {
          struct: structCustomSound,
          ...defineLabel({
            ja: {
              text: 'お金入手効果音の上書き',
              description: dd`
                お金を入手したときに再生する効果音を指定します。
                上書き設定をしない場合は通常の通知音が再生されます。
              `,
            },
          }),
        }),
      ],
    }),
  ],
  structs: [structCustomSound, structSound],
};
