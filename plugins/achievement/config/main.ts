import {
  createBooleanParam,
  createCommand,
  createFileParam,
  createMultiLineStringParam,
  createNoteParam,
  createNumberParam,
  createParamGroup,
  createSelectParam,
  createStringParam,
  createStruct,
  createStructParamArray,
  createStructParam,
  I18nText,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

const structAchievement = createStruct('Achievement')([
  createStringParam('key')({
    text: {
      ja: '管理ID',
    },
    description: {
      ja: dedent`
        実績獲得時に指定する名前（例: ゲームクリア）
        数字でも日本語でもOK / 他の実績と被るのはNG
      `,
    },
  }),
  createStringParam('title')({
    text: {
      ja: '表示名',
    },
    description: {
      ja: dedent`
        実績に画面に表示するときの実績名
        （例：激闘の果てに魔王を倒した…ッ！）
      `,
    },
  }),
  createMultiLineStringParam('description')({
    text: {
      ja: '実績の説明文',
    },
    description: {
      ja: dedent`
        実績に画面に表示する説明文（2行程度）
      `,
    },
  }),
  createNumberParam('icon')({
    text: {
      ja: '実績のアイコンID',
    },
    description: {
      ja: dedent`
        実績に使用するアイコンの番号。
      `,
    },
  }),
  createMultiLineStringParam('hint')({
    text: {
      ja: '実績獲得のヒント',
    },
    description: {
      ja: dedent`
        未取得の場合に取得方法を表示できます（2行程度）
        空欄の場合は通常の説明文を表示します
      `,
    },
  }),
  createBooleanParam('isSecret')({
    text: {
      ja: '秘密実績フラグ',
    },
    description: {
      ja: dedent`
        この実績の存在を秘密にします。
        未獲得の場合に一覧に表示されなくなります。
      `,
    },
    on: {
      ja: '秘密にする',
    },
    off: {
      ja: '秘密にしない',
    },
    default: false,
  }),
  createNoteParam('note')({
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

const structSound = createStruct('Sound')([
  createFileParam('soundName')({
    text: {
      ja: '効果音ファイル名',
    },
    description: {
      ja: dedent`
        実績獲得ポップアップ表示時に再生する効果音ファイル。
        空っぽの場合は効果音なしになります。
      `,
    },
    dir: 'audio/se',
    default: 'Saint5',
  }),
  createNumberParam('soundVolume')({
    text: {
      ja: '効果音の音量',
    },
    description: {
      ja: '実績獲得ポップアップ表示時に再生する効果音の音量',
    },
    min: 0,
    max: 100,
    default: 90,
  }),
]);

const createBase = (params: { pluginCommandDescription?: string | I18nText }): Partial<TorigoyaPluginConfigSchema> => ({
  version: '1.7.0',
  title: {
    ja: '実績プラグイン',
  },
  help: {
    ja: dedent`
      実績・トロフィー的なシステムを定義します。

      ------------------------------------------------------------
      ■ 設定方法
      ------------------------------------------------------------

      このプラグインの設定から実績を登録してください。
      ここでの並び順の順番で画面に表示されます。
      （並び順は後から並び替えても問題ありません）

      ------------------------------------------------------------
      ■ ゲーム中に実績を獲得する
      ------------------------------------------------------------

      ${params.pluginCommandDescription}

      ------------------------------------------------------------
      ■ その他の使い方・アドオンについて
      ------------------------------------------------------------
      以下の記事をご確認ください。
      https://torigoya-plugin.rutan.dev/system/achievement2/
    `,
  },
  params: [
    // 基本設定
    ...createParamGroup('base')({
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createStructParamArray('baseAchievementData')<typeof structAchievement>({
          struct: 'Achievement',
          text: {
            ja: '実績情報の登録',
          },
          default: [],
        }),
        createStringParam('baseSaveSlot')({
          text: {
            ja: 'セーブデータのスロット名',
          },
          default: 'achievement',
        }),
      ],
    }),

    // ポップアップ設定
    ...createParamGroup('popup')({
      text: {
        ja: '■ ポップアップ設定',
      },
      children: [
        createBooleanParam('popupEnable')({
          text: {
            ja: 'ポップアップ表示のON/OFF',
          },
          description: {
            ja: dedent`
              実績を獲得した時にポップアップ表示を行うか？
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
        createSelectParam('popupPosition')({
          text: {
            ja: '表示位置',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップの表示位置
            `,
          },
          options: [
            { value: 'leftUp', name: { ja: '左上' } },
            { value: 'rightUp', name: { ja: '右上' } },
          ] as const,
          default: 'leftUp',
        }),
        createNumberParam('popupTopY')({
          text: {
            ja: '表示位置: 上端',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップ表示位置の上端
            `,
          },
          min: 0,
          default: 10,
        }),
        createSelectParam('popupAnimationType')({
          text: {
            ja: 'アニメーション',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップのアニメーション方法。
              「なめらか」はTorigoya_FrameTween.jsが必要です。
            `,
          },
          options: [
            { value: 'tween', name: { ja: 'なめらか' } },
            { value: 'open', name: { ja: 'その場に表示' } },
          ] as const,
          default: 'tween',
        }),
        createNumberParam('popupWait')({
          text: {
            ja: '表示時間',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップの表示時間（秒）
              ※アニメーションの時間は含みません
            `,
          },
          decimals: 2,
          min: 0,
          default: 1.25,
        }),
        createNumberParam('popupWidth')({
          text: {
            ja: 'ポップアップの横幅',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップの横幅（px）
              小さすぎると文字がはみ出します
            `,
          },
          min: 200,
          default: 300,
        }),
        createNumberParam('popupPadding')({
          text: {
            ja: 'ポップアップの余白',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップの余白サイズ
            `,
          },
          min: 0,
          default: 10,
        }),
        createNumberParam('popupTitleFontSize')({
          text: {
            ja: '実績名の文字サイズ',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップに表示される
              取得した実績名の文字サイズ
            `,
          },
          min: 16,
          default: 20,
        }),
        createNumberParam('popupTitleColor')({
          text: {
            ja: '実績名の文字の色番号',
          },
          description: {
            ja: dedent`
              実績名の文字表示に使用する色
              ※\\c[数字] ←の数字欄に入れる数字
            `,
          },
          min: 0,
          default: 1,
        }),
        createStringParam('popupMessage')({
          text: {
            ja: 'メッセージの内容',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップに表示される
              獲得メッセージの内容
            `,
          },
          default: {
            ja: '実績を獲得しました',
          },
        }),
        createNumberParam('popupMessageFontSize')({
          text: {
            ja: 'メッセージの文字サイズ',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップに表示される
              獲得メッセージの文字サイズ
            `,
          },
          min: 12,
          default: 16,
        }),
        createStructParam('popupSound')<typeof structSound>({
          struct: 'Sound',
          text: {
            ja: '効果音',
          },
          description: {
            ja: dedent`
              実績獲得時に再生する効果音の設定
            `,
          },
          default: {
            soundName: 'Saint5',
            soundVolume: 90,
          },
        }),
        createFileParam('popupWindowImage')({
          text: {
            ja: 'ウィンドウ画像',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップのウィンドウ画像
            `,
          },
          dir: 'img/system',
          default: 'Window',
        }),
        createNumberParam('popupOpacity')({
          text: {
            ja: 'ウィンドウ背景の透明度',
          },
          description: {
            ja: dedent`
              ウィンドウ背景の透明度(0～255)
              -1の場合はデフォルトの透明度を使用します。
            `,
          },
          min: -1,
          max: 255,
          default: -1,
        }),
      ],
    }),

    // タイトル / メニュー画面設定
    ...createParamGroup('titleMenu')({
      text: {
        ja: 'ポップアップ表示のON/OFF',
      },
      children: [
        createBooleanParam('titleMenuUseInTitle')({
          text: {
            ja: 'タイトル画面に表示',
          },
          description: {
            ja: dedent`
              タイトル画面に実績メニューを表示するか？
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
        createBooleanParam('titleMenuUseInMenu')({
          text: {
            ja: 'メニュー画面に表示',
          },
          description: {
            ja: dedent`
              メニュー画面に実績メニューを表示するか？
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
        createStringParam('titleMenuText')({
          text: {
            ja: '項目名',
          },
          description: {
            ja: dedent`
              タイトルやメニューに表示する際の
              実績メニューの項目名
            `,
          },
          default: {
            ja: '実績',
          },
        }),
      ],
    }),

    // 実績画面設定
    ...createParamGroup('achievementMenu')({
      text: {
        ja: '■ 実績画面設定',
      },
      children: [
        createStringParam('achievementMenuHiddenTitle')({
          text: {
            ja: '未獲得実績の表示名',
          },
          description: {
            ja: dedent`
              実績画面で未取得の実績の欄に
              表示する名前
            `,
          },
          default: {
            ja: '？？？？？',
          },
        }),
        createNumberParam('achievementMenuHiddenIcon')({
          text: {
            ja: '未獲得実績のアイコンID',
          },
          description: {
            ja: dedent`
              実績画面で未取得の実績の欄に
              表示するアイコンのID
            `,
          },
          default: 0,
        }),
      ],
    }),

    // 上級者向け設定
    ...createParamGroup('advanced')({
      text: {
        ja: '■ 上級者向け設定',
      },
      children: [
        createStringParam('advancedFontFace')({
          text: {
            ja: 'ポップアップのフォント',
          },
          description: {
            ja: dedent`
              実績獲得ポップアップ表示のフォント名を指定します。
              空欄の場合は他のウィンドウと同じフォントを使用します。
            `,
          },
          default: '',
        }),
        createBooleanParam('advancedOverwritable')({
          text: {
            ja: '獲得済み実績の再取得',
          },
          description: {
            ja: dedent`
              既に獲得済みの実績でも再取得できるようにします
            `,
          },
          on: {
            ja: 'する',
          },
          off: {
            ja: 'しない',
          },
          default: false,
        }),
      ],
    }),
  ],
  structs: [structAchievement, structSound],
});

export const Torigoya_Achievement2: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...createBase({
    pluginCommandDescription: dedent`
      プラグインコマンドに以下のように入力してください

      実績 ここに管理ID

      ※ここに管理IDの部分に、プラグイン設定画面で登録した管理IDを指定してください
    `,
  }),
};

export const TorigoyaMZ_Achievement2: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...createBase({
    pluginCommandDescription: dedent`
      プラグインコマンドから獲得処理を呼び出すことができます。
    `,
  }),
  commands: [
    createCommand('gainAchievement')({
      text: {
        ja: '実績の獲得',
      },
      description: {
        ja: dedent`
          指定した実績を獲得します。
        `,
      },
      args: [
        createStringParam('key')({
          text: {
            ja: '実績の管理ID',
          },
          description: {
            ja: dedent`
              獲得したい実績に設定したIDを指定
            `,
          },
        }),
      ],
    }),
    createCommand('openSceneAchievement')({
      text: {
        ja: '実績画面の表示',
      },
      description: {
        ja: dedent`
          獲得済み実績の一覧画面を表示します。
        `,
      },
      args: [],
    }),
    createCommand('resetAchievement')({
      text: {
        ja: '全実績の削除（注意！）',
      },
      description: {
        ja: dedent`
          すべての実績を獲得前の状態に戻します。
          気をつけて使おう！
        `,
      },
      args: [],
    }),
  ],
};
