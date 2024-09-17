import {
  createBooleanParam,
  createCommand,
  createDatabaseParam,
  createMultiLineStringParam,
  createNumberParam,
  createParamGroup,
  createStringParam,
  createStruct,
  createStructParamArray,
  dd,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';

const paramFileName = createStringParam('fileName', {
  text: {
    ja: '本棚のファイル名',
  },
  description: {
    ja: dd`
      読み込むテキストのファイル名を指定してください。
      フォルダ(bookshelf)の名前は含める必要ありません。
    `,
  },
});

const structMenuItem = createStruct('MenuItem', [
  createStringParam('name', {
    text: {
      ja: '項目名',
    },
    description: {
      ja: dd`
        メニューに表示される項目の名前
      `,
    },
  }),
  paramFileName,
  createDatabaseParam('switchId', {
    type: 'switch',
    text: {
      ja: '有効スイッチ',
    },
    description: {
      ja: dd`
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
      ja: dd`
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
      ja: 'メモ欄',
    },
    description: {
      ja: dd`
        メモ欄です。
        ツクールのメモ欄同様に使えます。
      `,
    },
  }),
]);

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.2.2',
  title: {
    ja: 'テキスト本棚プラグイン',
  },
  help: {
    ja: dd`
      テキストファイルから本棚シーンを作成します。
      使い方の詳細は解説ページをご覧ください。
      https://torigoya-plugin.rutan.dev/system/bookshelf/

      ------------------------------------------------------------
      ■ 基本的な使い方
      ------------------------------------------------------------
      (1) 本棚テキストを置くフォルダをつくる

      プロジェクトのフォルダ（img などの横）に、
      bookshelf
      という名前のフォルダを作成してください。

      (2) 本棚用のテキストファイルを作成する

      後述の形式のテキストファイルを bookshelf フォルダ内に作成してください。
      テキストはいくつでも設置できます。

      (3) プラグインコマンドで呼び出す

      本棚を呼び出したいイベントから
      プラグインコマンドで表示したいテキストファイルを指定します。

      ■ MZの場合
      プラグインコマンドから「本棚の表示」を選んでください
      パラメータ欄にテキストファイルの名前を指定します

      ■ MVの場合
      プラグインコマンドに以下のように記述してください

      本棚表示 xxxxx

      xxxxx の部分は読み込みたいテキストファイルの名前にしてください

      ------------------------------------------------------------
      ■ テキストの書き方
      ------------------------------------------------------------
      ※見づらいので、解説ページを見ることをオススメします＞＜

      テキストファイル内で本棚のタイトルを指定できます。
      以下のように、シャープ1個を先頭につけ、その後ろにタイトルを記述してください。

      # ここに本棚のタイトル

      なお、タイトルが未設定の場合は、
      本棚画面でタイトル欄が非表示になります。


      ■ 本棚の中に本を追加する
      以下のように、シャープ2個を先頭につけた行が本のタイトルになり、
      その次の行からが本の中身になります。
      本の中身には、「文章の表示」同様に \\c[2] などのコマンドが使えます。

      ## 1冊目の本のタイトル
      ここに本文
      ここに本文

      ## 2冊目の本のタイトル
      ここに本文
      文章の表示同様に\\c[2]文字の色を変えたり\\c[0]できます


      ■ 本のページを増やす
      このプラグインは文章がはみ出しても
      自動的にページを切り替えたりはしません。
      手動でページ切り替えを記述する必要があります。
      ページ切り替えをしたい場所で、
      以下のようにハイフンを3個以上並べてください。

      ## 本のタイトル
      1ページ目の本文

      ----------

      2ページ目の本文


      ■ 本文の中に画像を表示する
      本文の中に以下のように記述することで、
      文章の間に顔グラやピクチャーを表示できます。

      \\bookFace 顔グラ画像の名前, 番号

      \\bookPicture ピクチャーの名前
    `,
  },
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createNumberParam('bookshelfTitleFontSize', {
          text: {
            ja: '本棚名の文字サイズ',
          },
          description: {
            ja: dd`
              本棚の名前のフォントサイズを指定します。
            `,
          },
          min: 1,
          default: 22,
        }),
        createNumberParam('bookshelfWidth', {
          text: {
            ja: '本の一覧の横幅',
          },
          description: {
            ja: dd`
              本棚画面の本の一覧の横幅を指定します。
              0の場合、UI領域をすべて使用します。
            `,
          },
          min: 0,
          default: 400,
        }),
        createNumberParam('bookshelfMaxHeight', {
          text: {
            ja: '本の一覧の最大縦幅',
          },
          description: {
            ja: dd`
              本棚画面の本の一覧の最大縦幅を指定します。
              0の場合、UI領域をすべて使用します。
            `,
          },
          min: 0,
          default: 0,
        }),
        createNumberParam('bookContentFontSize', {
          text: {
            ja: '本の中身の文字サイズ',
          },
          description: {
            ja: dd`
              本の中身ウィンドウのフォントサイズを指定します。
            `,
          },
          min: 1,
          default: 24,
        }),
        createNumberParam('bookContentWidth', {
          text: {
            ja: '本の中身の横幅',
          },
          description: {
            ja: dd`
              本の中身ウィンドウの横幅を指定します。
              0の場合、UI領域をすべて使用します。
            `,
          },
          min: 0,
          default: 0,
        }),
        createNumberParam('bookContentHeight', {
          text: {
            ja: '本の中身の縦幅',
          },
          description: {
            ja: dd`
              本の中身ウィンドウの縦幅を指定します。
              0の場合、UI領域をすべて使用します。
            `,
          },
          min: 0,
          default: 0,
        }),
      ],
    }),

    ...createParamGroup('menu', {
      text: {
        ja: '■ メニュー設定',
      },
      children: [
        createStructParamArray('menuItems', {
          struct: structMenuItem,
          text: {
            ja: 'メニューに本棚を追加',
          },
        }),
      ],
    }),
  ],
  structs: [structMenuItem],
};

export const Torigoya_Bookshelf: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
};

export const TorigoyaMZ_Bookshelf: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
  commands: [
    createCommand('openBookshelf', {
      text: {
        ja: '本棚の表示',
      },
      description: {
        ja: dd`
          指定ファイルを読み込み、本棚を表示します
        `,
      },
      args: [paramFileName],
    }),
  ],
};
