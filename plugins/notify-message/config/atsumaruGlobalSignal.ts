import {
  createBooleanParam,
  createCommand,
  createMultiLineStringParam,
  createNumberParam,
  createParamGroup,
  createStringParam,
  createStruct,
  createStructParamArray,
  defineLabel,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

const structEventLog = createStruct('EventLog', [
  createStringParam('key', {
    ...defineLabel({
      ja: {
        text: '種別キー',
        description: dedent`
          イベント種別の識別名です。
          ここで設定した文字列をログ送信時に指定します。
        `,
      },
    }),
  }),
  createMultiLineStringParam('message', {
    ...defineLabel({
      ja: {
        text: 'ログ文章',
        description: dedent`
          ログとして表示するメッセージを指定します。
          一部特殊な記法があります。説明を読んでね。
        `,
      },
    }),
  }),
  createNumberParam('icon', {
    ...defineLabel({
      ja: {
        text: 'アイコンID',
        description: dedent`
          通知に表示するアイコンのIDを指定します。
          0の場合は表示しません。
        `,
      },
    }),
  }),
  createMultiLineStringParam('note', {
    ...defineLabel({
      ja: {
        text: 'メモ欄',
        description: dedent`
          メモ欄です。
          ツクールのメモ欄と同様に利用できます。
        `,
      },
    }),
  }),
]);

export const TorigoyaMZ_NotifyMessage_AddonAtsumaruGlobalSignal: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  version: '1.0.2',
  title: {
    ja: '通知メッセージアドオン: アツマールグローバルシグナル通知ログ',
  },
  help: {
    ja: dedent`
      ※このプラグインはゲームアツマール用の非公式プラグインです

      ゲームアツマールのグローバルシグナルAPIを利用して
      全ユーザーで共有のイベントログを表示する機能を追加します。

      ------------------------------------------------------------
      ■ 注意事項
      ------------------------------------------------------------
      ・非公式のプラグインです。突然動かなくなる場合があります。

      ・イベントログのデータサイズが大きい場合、
      　APIのサイズ上限に引っかかり正常に送信できない場合があります

      ・他のプラグインからグローバルシグナルAPIを使用している場合
      　競合する可能性があります。ご注意ください。

      ------------------------------------------------------------
      ■ 使用方法：イベントログの設定
      ------------------------------------------------------------
      事前に表示するイベントログの種類を登録する必要があります。

      「イベントログ種別」に以下の情報を設定してください。

      ・種別キー
      イベントログの種類を表す言葉です。
      ここで設定した言葉をイベントコマンドで使用します。
      データサイズが小さい、短い英語がおすすめ！

      ・ログ文章
      イベントログの文章として表示するテンプレートを設定します。
      ここで設定した文章が通知として表示されます。
      ここには一部特殊な記法を利用することができます（後述）

      ・アイコンID
      通知に表示するアイコンを設定します

      ------------------------------------------------------------
      ■ 使用方法：通知の発行
      ------------------------------------------------------------
      通知を発行したいタイミングで
      プラグインコマンドの「イベントログの送信」を実行してください。

      種別キーには「イベントログ種別」で設定したものを指定してください。

      ------------------------------------------------------------
      ■ ログ文章の記法について
      ------------------------------------------------------------
      ログ文章には文章の表示と同様の記法を利用できます。

      ＜通知を送った人の名前について＞
      文章中に \\SIG_NAME と記述することで、
      その通知を送った人のアツマール上での名前が表示されます。

      使用例） \\SIG_NAME さんがログインしました

      ＜変数などの表示について＞
      \\V[xx] などの変数表示は自分自身のものが表示されます。
      そのため、他のプレイヤーが送ったイベント通知であっても、
      他のプレイヤーの変数ではなく自分の変数が表示されてしまいます。

      もし、他のプレイヤーの変数の中身が表示されてほしい場合は、
      \\V[xx] ではなく \\SIG_V[xx] と指定してください。

      使用例） \\SIG_NAME が \\SIG_V[1] ゴールド獲得！
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
        createStructParamArray('baseEventLogs', {
          struct: structEventLog,
          ...defineLabel({
            ja: {
              text: 'イベントログ種別',
              description: dedent`
                イベントログの種類を定義します。
              `,
            },
          }),
        }),
        createNumberParam('baseFirstFetchLimit', {
          ...defineLabel({
            ja: {
              text: '起動時に過去ログを最大何件取得するか？',
              description: dedent`
                起動時に最大何件のログを取得するか指定します。
              `,
            },
          }),
          min: 0,
          default: 5,
        }),
      ],
    }),

    ...createParamGroup('advanced', {
      text: {
        ja: '■ 上級者設定',
      },
      children: [
        createBooleanParam('advancedForceMute', {
          ...defineLabel({
            ja: {
              text: '効果音を強制無効化',
              description: dedent`
                通知の効果音を強制的に無効化するか選択できます。
                うるさいので無効化がオススメ。
              `,
            },
          }),
          on: {
            ja: '無効化する',
          },
          off: {
            ja: '無効化しない',
          },
          default: true,
        }),
        createNumberParam('advancedFetchInterval', {
          ...defineLabel({
            ja: {
              text: 'グローバルシグナルの取得間隔(秒)',
              description: dedent`
                グローバルシグナルを何秒おきに取得するか設定します。
                短くしすぎるとAPI上限に引っかかるため注意。
              `,
            },
          }),
          min: 10,
          default: 60,
        }),
      ],
    }),
  ],
  commands: [
    createCommand('sendEvent', {
      ...defineLabel({
        ja: {
          text: 'イベントログの送信',
          description: dedent`
            指定のイベントログを送信します。
          `,
        },
      }),
      args: [
        createStringParam('key', {
          ...defineLabel({
            ja: {
              text: '種別キー',
              description: dedent`
                送信するイベント種別の識別名です。
                プラグイン設定で指定したものを指定してください。
              `,
            },
          }),
        }),
        createNumberParam('variable', {
          ...defineLabel({
            ja: {
              text: 'アイコンID（変数指定）',
              description: dedent`
                通知に表示するアイコンIDが設定された変数を指定します。
                「なし」の場合はデフォルトのアイコンを使用します。
              `,
            },
          }),
        }),
      ],
    }),
  ],
  structs: [structEventLog],
};
