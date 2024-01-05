import {
  createBooleanParam,
  createCommand,
  createFileParam,
  createMultiLineStringParam,
  createNumberParam,
  createParamGroup,
  createSelectParam,
  createStringParam,
  createStruct,
  createStructParam,
  createStructParamArray,
  dd,
  defineLabel,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';

const structItem = createStruct('Item', [
  createMultiLineStringParam('title', {
    text: {
      ja: 'スタッフ名',
    },
    description: {
      ja: dd`
        スタッフロールに表示するスタッフ名を入力します。
      `,
    },
  }),
  createMultiLineStringParam('description', {
    text: {
      ja: '補足文章',
    },
    description: {
      ja: dd`
        スタッフ名の下に表示する補足文章を入力します。
        URLなどを入力することを想定しています。
      `,
    },
  }),
  createFileParam('icon', {
    text: {
      ja: '画像',
    },
    description: {
      ja: dd`
        スタッフ名の上に表示するピクチャー画像を入力します。
        省略した場合は画像を表示しません。
      `,
    },
    dir: 'img/pictures',
  }),
]);

const structSection = createStruct('Section', [
  createMultiLineStringParam('title', {
    text: {
      ja: '見出し',
    },
    description: {
      ja: dd`
        見出し部分の文字列を指定します。
      `,
    },
  }),
  createStructParamArray('items', {
    struct: structItem,
    text: {
      ja: 'スタッフ名',
    },
    description: {
      ja: dd`
        スタッフロールに表示するスタッフ名を入力します。
      `,
    },
  }),
]);

const structTextConfig = createStruct('TextConfig', [
  createNumberParam('fontSize', {
    text: {
      ja: '文字サイズ',
    },
    description: {
      ja: dd`
        文字サイズを指定します(px)
      `,
    },
    min: 1,
    max: 100,
    default: 24,
  }),
  createStringParam('textColor', {
    text: {
      ja: '文字色',
    },
    description: {
      ja: dd`
        文字色をCSSの書式で指定します。
        （例：#ffffff）
      `,
    },
    default: '#ffffff',
  }),
  createBooleanParam('fontBold', {
    text: {
      ja: '太字',
    },
    description: {
      ja: dd`
        文字を太字にするか指定します。
        （※フォントによっては反映されない場合があります）
      `,
    },
    on: '太字にする',
    off: '太字にしない',
    default: false,
  }),
  createBooleanParam('fontItalic', {
    text: {
      ja: '斜体',
    },
    description: {
      ja: dd`
        文字を斜体にするか指定します。
        （※フォントによっては反映されない場合があります）
      `,
    },
    on: '斜体にする',
    off: '斜体にしない',
    default: false,
  }),
  createStringParam('outlineColor', {
    text: {
      ja: '縁取りの色',
    },
    description: {
      ja: dd`
        文字の縁取りの色をCSSの書式で指定します。
        （例：#ffffff）
      `,
    },
    default: 'rgba(0, 0, 0, 0.5)',
  }),
  createNumberParam('outlineWidth', {
    text: {
      ja: '縁取りのサイズ',
    },
    description: {
      ja: dd`
        文字の縁取りの太さを指定します。
      `,
    },
    min: 0,
    max: 100,
    default: 3,
  }),
]);

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.1.0',
  title: {
    ja: 'お手軽スタッフロールプラグイン',
  },
  help: {
    ja: dd`
      このプラグインは「実績プラグイン」のアドオンです。
      実績プラグインより下に導入してください。

      獲得した実績を選択することで、
      コモンイベントを実行できるようにします。

      ------------------------------------------------------------
      ■ 注意
      ------------------------------------------------------------
      ・コモンイベントの実行はゲーム内での実績画面でのみ動作します
      　タイトル画面から呼び出される実績画面では動きません

      ・動作としては「アイテム」の効果に
      　「コモンイベント」を設定したときと同様の動作をします。
      　つまり、一度メニューを閉じてコモンイベントが動作します。

      ------------------------------------------------------------
      ■ 設定方法
      ------------------------------------------------------------
      設定はこのプラグイン内ではなく「実績プラグイン」側で行います。

      コモンイベントを設定した実績の「メモ」欄に
      以下のように記述してください。

      <コモンイベント: 1>

      もしくは

      <CommonEvent: 1>

      「1」の部分には呼び出したいコモンイベントのIDを指定してください。

      ------------------------------------------------------------
      ■ 上級者向けの使い方
      ------------------------------------------------------------
      このプラグインを導入すると、「スクリプト」内で以下の方法で
      「最後に選択（コモンイベントを呼び出した）した実績」を獲得できます。

      Torigoya.Achievement2.Addons.RewardEvent.lastItem

      この中には以下のようなフォーマットでデータが格納されます。

      {
        "key": "実績のID",
        "title": "実績の名前",
        "description": "実績の説明文",
        "hint": "実績のヒント",
        "icon": 123,        // アイコンのID
        "isSecret": false   // 実績が秘密であるか？
      }

      ▼ 例：最後に選択した実績の名前を取得する
      Torigoya.Achievement2.Addons.RewardEvent.lastItem.title
    `,
  },
  base: ['TorigoyaMZ_Achievement2'],
  orderAfter: ['TorigoyaMZ_Achievement2'],
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createStructParamArray('baseStaffRollContent', {
          struct: structSection,
          text: {
            ja: 'スタッフロールの内容',
          },
          description: {
            ja: dd`
              スタッフロールの内容を設定します。
            `,
          },
        }),
      ],
    }),

    ...createParamGroup('design', {
      text: {
        ja: '■ 見た目設定',
      },
      children: [
        createStructParam('designSectionTitleText', {
          struct: structTextConfig,
          text: {
            ja: '見出し部分の文字設定',
          },
          description: {
            ja: dd`
              スタッフロールの見出し部分の文字設定です。
            `,
          },
          default: {
            fontSize: 28,
            textColor: '#99ffff',
            fontBold: true,
            fontItalic: false,
            outlineColor: 'rgba(0, 0, 0, 0.6)',
            outlineWidth: 5,
          },
        }),
        createNumberParam('designSectionMargin', {
          text: {
            ja: '各セクション間の余白',
          },
          description: {
            ja: dd`
              各セクション（見出しごとのブロック）の間の余白の大きさを指定します。
            `,
          },
          min: 0,
          max: 10000,
          default: 100,
        }),
        createStructParam('designItemTitleText', {
          struct: structTextConfig,
          text: {
            ja: 'スタッフ名の文字設定',
          },
          description: {
            ja: dd`
              スタッフロールのスタッフ名部分の文字設定です。
            `,
          },
          default: {
            fontSize: 24,
            textColor: '#ffffff',
            fontBold: true,
            fontItalic: false,
            outlineColor: 'rgba(0, 0, 0, 0.9)',
            outlineWidth: 3,
          },
        }),
        createStructParam('designItemDescriptionText', {
          struct: structTextConfig,
          text: {
            ja: '補足文章の文字設定',
          },
          description: {
            ja: dd`
              スタッフロールの補足文章部分の文字設定です。
            `,
          },
          default: {
            fontSize: 16,
            textColor: '#ffffff',
            fontBold: true,
            fontItalic: false,
            outlineColor: 'rgba(0, 0, 0, 0.9)',
            outlineWidth: 3,
          },
        }),
        createNumberParam('designItemMargin', {
          text: {
            ja: '各スタッフ名間の余白',
          },
          description: {
            ja: dd`
              各スタッフ名の間の余白の大きさを指定します。
            `,
          },
          min: 0,
          max: 10000,
          default: 30,
        }),
        createSelectParam('designTextAlign', {
          text: {
            ja: '文字の水平配置位置',
          },
          description: {
            ja: dd`
              見出しやスタッフ名の文字の水平方向の配置位置を指定します。
            `,
          },
          options: [
            { value: 'left', name: { ja: '左寄せ' } },
            { value: 'center', name: { ja: '中央寄せ' } },
            { value: 'right', name: { ja: '右寄せ' } },
          ] as const,
          default: 'center',
        }),
        createNumberParam('designContentHorizontalPadding', {
          text: {
            ja: '文字の水平方向の余白',
          },
          description: {
            ja: dd`
              文字の両側の余白サイズを指定します。
            `,
          },
          min: 0,
          max: 10000,
          default: 0,
        }),
      ],
    }),
  ],
  structs: [structSection, structItem, structTextConfig],
};

export const Torigoya_EasyStaffRoll: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
  help: {
    ja: dd`
      スタッフロールを表示する機能を追加します。

      ------------------------------------------------------------
      ■ 設定方法
      ------------------------------------------------------------
      プラグイン設定の「スタッフロールの内容」に
      表示する内容を設定してください。

      ------------------------------------------------------------
      ■ ゲーム中にスタッフロールを表示する
      ------------------------------------------------------------
      プラグインコマンドで表示することができます。
      以下のようなフォーマットで指定します。

      easyStaffRoll show 表示時間 ウェイトONにするか？

      ▼ 例1：スタッフロールを600フレーム(約10秒)かけて表示（ウェイトON）
      easyStaffRoll show 600 true

      ▼ 例1：スタッフロールを1200フレーム(約20秒)かけて表示（ウェイトOFF）
      easyStaffRoll show 600 false

      ------------------------------------------------------------
      ■ その他のプラグインコマンド
      ------------------------------------------------------------
      ▼ 現在表示中のスタッフロールを消去
      easyStaffRoll remove

      主に「ウェイトOFF」で使用したとき向けの機能です。

      ▼ スタッフロールの事前読み込み
      easyStaffRoll preload

      Web公開の場合など、画像読み込みに時間がかかる環境の場合に、
      このコマンドを実行すると、そのタイミングで画像類の読み込み＆生成が実行されます。
    `,
  },
};

export const TorigoyaMZ_EasyStaffRoll: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
  help: {
    ja: dd`
      スタッフロールを表示する機能を追加します。

      ------------------------------------------------------------
      ■ 設定方法
      ------------------------------------------------------------
      プラグイン設定の「スタッフロールの内容」に
      表示する内容を設定してください。

      ------------------------------------------------------------
      ■ ゲーム中にスタッフロールを表示する
      ------------------------------------------------------------
      プラグインコマンドの「スタッフロールの表示」表示することができます。

      ------------------------------------------------------------
      ■ その他のプラグインコマンド
      ------------------------------------------------------------
      ▼ スタッフロールの消去
      主に「ウェイトOFF」で使用したとき向けの機能です。

      ▼ スタッフロールのプリロード
      Web公開の場合など、画像読み込みに時間がかかる環境の場合に、
      このコマンドを実行すると、そのタイミングで画像類の読み込み＆生成が実行されます。
    `,
  },
  commands: [
    createCommand('displayStaffRoll', {
      ...defineLabel({
        ja: {
          text: 'スタッフロールの表示',
          description: 'スタッフロールを表示します。',
        },
      }),
      args: [
        createNumberParam('displayFrame', {
          ...defineLabel({
            ja: {
              text: '表示フレーム（1/60秒）',
              description: dd`
                スタッフロールを表示するフレーム数を指定します。
                60＝1秒です。
              `,
            },
          }),
          min: 1,
          max: 100000,
          default: 600,
        }),
        createBooleanParam('isWait', {
          ...defineLabel({
            ja: {
              text: '完了するまでウェイト',
              description: dd`
                スタッフロールの表示が終了するまでイベントを停止するか指定します。
              `,
            },
          }),
          on: {
            ja: 'ウェイトする',
          },
          off: {
            ja: 'ウェイトしない',
          },
          default: true,
        }),
      ],
    }),
    createCommand('removeStaffRoll', {
      ...defineLabel({
        ja: {
          text: 'スタッフロールの消去',
          description: '現在表示中のスタッフロールを消去します。',
        },
      }),
      args: [],
    }),
    createCommand('preloadStaffRoll', {
      ...defineLabel({
        ja: {
          text: 'スタッフロールのプリロード',
          description: 'スタッフロール内で使用する画像の事前読み込みを実行します。',
        },
      }),
      args: [],
    }),
  ],
};
