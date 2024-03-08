import {
  createBooleanParam,
  createCommand,
  createDatabaseParam,
  createMultiLineStringParam,
  createNumberParam,
  createNoteParam,
  createParamGroup,
  createSelectParam,
  createStringParam,
  createStructParam,
  defineLabel,
  dd,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';
import { structSound } from './_share.js';

export const TorigoyaMZ_NotifyMessage: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  version: '1.5.1',
  title: {
    ja: '通知メッセージプラグイン',
  },
  help: {
    ja: dd`
      画面の左下から通知メッセージを表示する機能を追加します。
      通知メッセージはプラグインコマンドで表示できます。

      ------------------------------------------------------------
      ■ メモ欄を使ったカスタマイズ
      ------------------------------------------------------------
      プラグインコマンドのメモ欄に以下の記述を行うことで
      通知ごとに一部動作をカスタマイズすることができます。

      ▼ 表示時の効果音を無しにする
      <noSound>

      ------------------------------------------------------------
      ■ 上級者設定：UIエリア余白
      ------------------------------------------------------------
      通知メッセージの表示位置を調整するための設定です。
      指定した値の分だけ、上下に余白を追加することができます。

      例えば、上端に100、下端に100のような値を設定すると、
      画面の真ん中の部分だけに通知が表示されるようになります。

      なお、上端と下端の合計値が画面の高さを超えてしまうと、
      通知が正常に表示されなくなってしまうためご注意ください。
    `,
  },
  base: ['TorigoyaMZ_FrameTween'],
  orderAfter: ['TorigoyaMZ_FrameTween'],
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createSelectParam('baseAnimationDirection', {
          ...defineLabel({
            ja: {
              text: '通知の表示方向',
              description: dd`
                通知の表示方向を指定します。
              `,
            },
          }),
          options: [
            { value: 'bottomToTop', name: { ja: '下から上へ' } },
            { value: 'topToBottom', name: { ja: '上から下へ' } },
          ],
          default: 'bottomToTop',
        }),
        createNumberParam('baseAppearTime', {
          ...defineLabel({
            ja: {
              text: '登場/退場時間',
              description: dd`
                通知が画面にスクロールイン/アウトする時間（フレーム数/60＝1秒）を指定します。
              `,
            },
          }),
          min: 0,
          default: 15,
        }),
        createNumberParam('baseViewTime', {
          ...defineLabel({
            ja: {
              text: '表示時間',
              description: dd`
                通知の表示時間（フレーム数/60＝1秒）を指定します。0にすると画面外に押し出されるまで消えなくなります。
              `,
            },
          }),
          min: 0,
          default: 90,
        }),
        createNumberParam('baseFontSize', {
          ...defineLabel({
            ja: {
              text: '文字サイズ',
              description: dd`
                通知メッセージの文字サイズを指定します
              `,
            },
          }),
          min: 1,
          default: 22,
        }),
        createNumberParam('basePadding', {
          ...defineLabel({
            ja: {
              text: '余白サイズ',
              description: dd`
                通知メッセージの全体的な余白サイズを指定します
              `,
            },
          }),
          min: 0,
          default: 4,
        }),
        createNumberParam('baseLeftPadding', {
          ...defineLabel({
            ja: {
              text: '左側の追加余白サイズ',
              description: dd`
                通知メッセージの左側の余白サイズを指定します。
                全体の余白サイズに加え、この分が余白に追加されます。
              `,
            },
          }),
          min: 0,
          default: 0,
        }),
        createNumberParam('baseRightPadding', {
          ...defineLabel({
            ja: {
              text: '右側の追加余白サイズ',
              description: dd`
                通知メッセージの右側の余白サイズを指定します。
                全体の余白サイズに加え、この分が余白に追加されます。
              `,
            },
          }),
          min: 0,
          default: 30,
        }),
        createNumberParam('baseItemPadding', {
          ...defineLabel({
            ja: {
              text: 'アイコンと文章の余白',
              description: dd`
                通知アイコンとメッセージの間の余白サイズを指定します。
              `,
            },
          }),
          min: 0,
          default: 5,
        }),
        createStructParam('baseSound', {
          struct: structSound,
          ...defineLabel({
            ja: {
              text: '効果音',
              description: dd`
                通知表示時の効果音を指定します。
              `,
            },
          }),
          default: {
            name: 'Item1',
            volume: 90,
            pitch: 100,
            pan: 0,
          },
        }),
      ],
    }),

    ...createParamGroup('advanced', {
      text: {
        ja: '■ 上級者設定',
      },
      children: [
        createDatabaseParam('advancedVisibleSwitch', {
          type: 'switch',
          ...defineLabel({
            ja: {
              text: '有効スイッチ',
              description: dd`
                このスイッチがONのときのみ画面に通知を表示するようにします。「なし」の場合は常に表示されます。
              `,
            },
          }),
        }),
        createStringParam('advancedBackgroundColor1', {
          ...defineLabel({
            ja: {
              text: '背景グラデーション:左端',
              description: dd`
                背景グラデーションの左端の色を指定します。
                色はCSSの記法で指定できます。
              `,
            },
          }),
          default: 'rgba(0, 0, 64, 0.6)',
        }),
        createStringParam('advancedBackgroundColor2', {
          ...defineLabel({
            ja: {
              text: '背景グラデーション:右端',
              description: dd`
                背景グラデーションの右端の色を指定します。
                色はCSSの記法で指定できます。
              `,
            },
          }),
          default: 'rgba(0, 32, 64, 0)',
        }),
        createNumberParam('advancedUiPaddingTop', {
          ...defineLabel({
            ja: {
              text: 'UIエリア余白: 上端',
              description: dd`
                通知メッセージ表示位置の上側の余白を指定します。
              `,
            },
          }),
          default: 5,
        }),
        createNumberParam('advancedUiPaddingBottom', {
          ...defineLabel({
            ja: {
              text: 'UIエリア余白: 下端',
              description: dd`
                通知メッセージ表示位置の下側の余白を指定します。
              `,
            },
          }),
          default: 5,
        }),
        createBooleanParam('advancedKeepMessage', {
          ...defineLabel({
            ja: {
              text: 'シーン遷移しても表示をキープ',
              description: dd`
                【危険：環境によってはONにすると不具合の原因となります】シーン遷移してもメッセージを全消ししないようにします。
              `,
            },
          }),
          on: { ja: 'キープする（危険）' },
          off: { ja: 'キープしない（安全）' },
          default: false,
        }),
      ],
    }),
  ],
  structs: [structSound],
  commands: [
    createCommand('notify', {
      ...defineLabel({
        ja: {
          text: '通知の表示',
          description: dd`
            指定内容の通知を表示します
          `,
        },
      }),
      args: [
        createMultiLineStringParam('message', {
          ...defineLabel({
            ja: {
              text: 'メッセージ',
              description: dd`
                通知に表示する文章を指定します。「文章の表示」のコマンドが一部利用できます。
              `,
            },
          }),
        }),
        createNumberParam('icon', {
          ...defineLabel({
            ja: {
              text: 'アイコンID',
              description: dd`
                通知に表示するアイコンのIDを指定します。
                0の場合は表示しません。
              `,
            },
          }),
        }),
        createNoteParam('note', {
          ...defineLabel({
            ja: {
              text: 'メモ欄',
              description: dd`
                メモ欄です。
                ツクールのメモ欄と同様に利用できます。
              `,
            },
          }),
        }),
      ],
    }),
    createCommand('notifyWithVariableIcon', {
      ...defineLabel({
        ja: {
          text: '通知の表示(アイコン変数指定)',
          description: dd`
            指定内容の通知を表示します。アイコンのIDを変数で指定します。
          `,
        },
      }),
      args: [
        createMultiLineStringParam('message', {
          ...defineLabel({
            ja: {
              text: 'メッセージ',
              description: dd`
                通知に表示する文章を指定します。「文章の表示」のコマンドが一部利用できます。
              `,
            },
          }),
        }),
        createDatabaseParam('iconVariable', {
          type: 'variable',
          ...defineLabel({
            ja: {
              text: 'アイコンID（変数指定）',
              description: dd`
                通知に表示するアイコンIDが設定された変数を指定します。
                変数の中身が0またはマイナスの場合は表示しません。
              `,
            },
          }),
        }),
        createNoteParam('note', {
          ...defineLabel({
            ja: {
              text: 'メモ欄',
              description: dd`
                メモ欄です。
                ツクールのメモ欄と同様に利用できます。
              `,
            },
          }),
        }),
      ],
    }),
    createCommand('forceExitNotifications', {
      ...defineLabel({
        ja: {
          text: '表示中の全通知を強制終了',
          description: dd`
            現在表示中の全通知を強制終了します。
          `,
        },
      }),
      args: [],
    }),
  ],
};
