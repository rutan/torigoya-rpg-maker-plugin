import {
  createParamGroup,
  createBooleanParam,
  createNumberParam,
  createStringParam,
  createFileParam,
  createSelectParam,
  createDatabaseParam,
  createStruct,
  createStructParam,
  createStructParamArray,
  createCommand,
  dd,
  TorigoyaPluginConfigSchema,
  createMultiLineStringParam,
} from '@rutan/torigoya-plugin-config';

const structColor = createStruct('Color', [
  createNumberParam('red', {
    text: {
      ja: '赤',
    },
    description: {
      ja: dd`
        赤色の強さを設定します。
        -255から255の範囲で指定してください。
      `,
    },
    min: -255,
    max: 255,
    default: 0,
  }),
  createNumberParam('green', {
    text: {
      ja: '緑',
    },
    description: {
      ja: dd`
        緑色の強さを設定します。
        -255から255の範囲で指定してください。
      `,
    },
    min: -255,
    max: 255,
    default: 0,
  }),
  createNumberParam('blue', {
    text: {
      ja: '青',
    },
    description: {
      ja: dd`
        青色の強さを設定します。
        -255から255の範囲で指定してください。
      `,
    },
    min: -255,
    max: 255,
    default: 0,
  }),
]);

const structColorCustomize = createStruct('ColorCustomize', [
  createBooleanParam('isUse', {
    text: {
      ja: '使用するか？',
    },
    description: {
      ja: dd`
        個別設定を使用するか指定します。
        使用しない場合は共通設定の色になります。
      `,
    },
    on: {
      ja: '使用する',
    },
    off: {
      ja: '使用しない',
    },
    default: false,
  }),
  ...structColor.params,
]);

const structSound = createStruct('Sound', [
  createFileParam('name', {
    text: {
      ja: '効果音ファイル',
    },
    description: {
      ja: dd`
        効果音ファイルを選択します。
      `,
    },
    dir: 'audio/se',
    default: '',
  }),
  createNumberParam('volume', {
    text: {
      ja: '音量',
    },
    description: {
      ja: dd`
        効果音の音量を指定します。
        0から100の範囲で指定してください。
      `,
    },
    min: 0,
    max: 100,
    default: 90,
  }),
  createNumberParam('pitch', {
    text: {
      ja: 'ピッチ',
    },
    description: {
      ja: dd`
        効果音のピッチを指定します。
        100が通常です。
      `,
    },
    min: 0,
    max: 200,
    default: 100,
  }),
  createNumberParam('pan', {
    text: {
      ja: 'パン',
    },
    description: {
      ja: dd`
        効果音のパンを指定します。
        0が通常です。
      `,
    },
    min: -100,
    max: 100,
    default: 0,
  }),
]);

const cutinSetCommonParams = [
  ...createParamGroup('render', {
    text: {
      ja: '■ キャラ画像設定',
    },
    children: [
      createFileParam('picture', {
        text: {
          ja: 'キャラ画像',
        },
        description: {
          ja: dd`
            カットインで表示するキャラクターの画像を設定します。
            画像はピクチャー用のフォルダに入れてください。
          `,
        },
        dir: 'img/pictures',
        default: '',
      }),
      createNumberParam('pictureX', {
        text: {
          ja: 'キャラ画像位置:X',
        },
        description: {
          ja: dd`
            キャラ画像の表示位置（横方向）を調整します。
            マイナスだと左、プラスだと右にずらします。
          `,
        },
        min: -10000,
        max: 10000,
        default: 0,
      }),
      createNumberParam('pictureY', {
        text: {
          ja: 'キャラ画像位置:Y',
        },
        description: {
          ja: dd`
            キャラ画像の表示位置（縦方向）を調整します。
            マイナスだと上、プラスだと下にずらします。
          `,
        },
        min: -10000,
        max: 10000,
        default: 0,
      }),
      createNumberParam('pictureScale', {
        text: {
          ja: 'キャラ画像:拡大率',
        },
        description: {
          ja: dd`
            キャラ画像の拡大率を指定します。
            1を指定した場合は1倍なのでそのまま表示されます。
          `,
        },
        decimals: 2,
        min: 0.01,
        default: 1,
      }),
    ],
  }),

  ...createParamGroup('advanced', {
    text: {
      ja: '■ 個別設定（省略可）',
    },
    children: [
      createStringParam('backColor1', {
        text: {
          ja: '背景色1',
        },
        description: {
          ja: dd`
            カットイン表示領域の背景色を設定します。
            省略した場合は共通設定が使用されます。
          `,
        },
        default: '',
      }),
      createStringParam('backColor2', {
        text: {
          ja: '背景色2',
        },
        description: {
          ja: dd`
            カットイン表示領域の背景色を設定します。
            空欄の場合は背景色1と一緒になります。
          `,
        },
        default: '',
      }),
      createStructParam('backTone', {
        struct: structColorCustomize,
        text: {
          ja: 'エフェクト色調1',
        },
        description: {
          ja: dd`
            背景エフェクトの色調を設定します。
            ※RPGツクールMZのみ有効
          `,
        },
        default: {
          isUse: false,
          red: -128,
          green: -128,
          blue: 128,
        },
      }),
      createStructParam('borderTone', {
        struct: structColorCustomize,
        text: {
          ja: 'エフェクト色調2',
        },
        description: {
          ja: dd`
            境界線エフェクトの色調を設定します。
            ※RPGツクールMZのみ有効
          `,
        },
        default: {
          isUse: false,
          red: 0,
          green: 0,
          blue: 0,
        },
      }),
      createFileParam('backImage1', {
        text: {
          ja: '背景画像1',
        },
        description: {
          ja: dd`
            背景全体に表示される画像を指定します。
            空欄の場合は共通設定を使用します。
          `,
        },
        dir: 'img/pictures',
        default: '',
      }),
      createFileParam('backImage2', {
        text: {
          ja: '背景画像2',
        },
        description: {
          ja: dd`
            キャラクターの背景部分に表示される画像を指定します。
            空欄の場合は共通設定を使用します。
          `,
        },
        dir: 'img/pictures',
        default: '',
      }),
      createFileParam('borderImage', {
        text: {
          ja: '境界線画像',
        },
        description: {
          ja: dd`
            カットインの境界線部分に表示される画像を指定します。
            空欄の場合は共通設定を使用します。
          `,
        },
        dir: 'img/pictures',
        default: '',
      }),
      createSelectParam('borderBlendMode', {
        text: {
          ja: '境界線画像のブレンド',
        },
        description: {
          ja: dd`
            境界線画像のブレンドモードを指定します。
            省略の場合は共通設定を使用します。
          `,
        },
        options: [
          {
            name: {
              ja: '省略',
            },
            value: '',
          },
          {
            name: {
              ja: '通常',
            },
            value: 'normal',
          },
          {
            name: {
              ja: '加算',
            },
            value: 'add',
          },
        ],
        default: '',
      }),
      createStructParam('sound', {
        struct: structSound,
        text: {
          ja: '効果音',
        },
        description: {
          ja: dd`
            カットイン表示時の効果音を設定します。
            指定しない場合は共通設定を使用します。
          `,
        },
        default: {
          name: '',
          volume: 90,
          pitch: 100,
          pan: 0,
        },
      }),
    ],
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
    default: '',
  }),
] as const;

const structActorCutinSet = createStruct('ActorCutinSet', [
  ...createParamGroup('base', {
    text: {
      ja: '■ 対象設定',
    },
    children: [
      createDatabaseParam('actorId', {
        type: 'actor',
        text: {
          ja: 'アクターのID',
        },
        description: {
          ja: dd`
            カットイン対象のアクターを設定します。
          `,
        },
        default: 0,
      }),
      createDatabaseParam('skillId', {
        type: 'skill',
        text: {
          ja: 'スキルのID',
        },
        description: {
          ja: dd`
            カットイン対象のスキルを設定します。
          `,
        },
        default: 0,
      }),
    ],
  }),

  ...cutinSetCommonParams,
]);

const structEnemyCutinSet = createStruct('EnemyCutinSet', [
  ...createParamGroup('base', {
    text: {
      ja: '■ 対象設定',
    },
    children: [
      createDatabaseParam('enemyId', {
        type: 'enemy',
        text: {
          ja: '敵のID',
        },
        description: {
          ja: dd`
            カットイン対象の敵を設定します。
          `,
        },
        default: 0,
      }),
      createDatabaseParam('skillId', {
        type: 'skill',
        text: {
          ja: 'スキルのID',
        },
        description: {
          ja: dd`
            カットイン対象のスキルを設定します。
          `,
        },
        default: 0,
      }),
    ],
  }),

  ...cutinSetCommonParams,
] as const);

const common: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.3.2',
  title: {
    ja: 'スキル発動前カットイン表示プラグイン',
  },
  help: {
    ja: dd`
      このプラグインは「Tweenアニメーションプラグイン」が必要です。
      Tweenアニメーションプラグインより下に入れてください。
      
      指定スキルの発動前にカットインを表示する機能を追加します。
      
      ------------------------------------------------------------
      ■ 基本的な使い方
      ------------------------------------------------------------
      
      (1) カットイン用の共通画像を用意する
      
      ・カットイン用の背景画像1
      ・カットイン用の背景画像2
      ・カットイン用の境界線画像
      
      上記3種類の画像を用意して
      ピクチャー用のフォルダ（img/pictures）に入れる必要があります。
      以下のページで自由に使える画像素材を配布しています。
      
      https://torigoya-plugin.rutan.dev/battle/skillCutIn
      
      (2) カットイン用のキャラの画像を用意する
      
      カットインを表示したいキャラの画像を好きなだけ用意します。
      キャラの画像もピクチャー用のフォルダ（img/pictures）に入れてください。
      
      (3) カットインの設定をする
      
      プラグイン設定から「味方のカットイン設定」を開き、
      設定したい分だけ項目を追加してください。
      
      ■ 対象設定
      
      「どのキャラが」「何のスキルを使った」を設定します。
      例えば「ハロルド」が「スターライトⅡ」を使った、のような設定をします。
      
      ここで設定した条件を満たしたときにカットインが表示されます。
      
      ■ キャラ画像
      
      表示するキャラクターの画像ファイルの選択や
      表示位置・サイズの調整ができます
      
      ■ 個別設定（省略可）
      
      このカットインだけ色を変えたい！みたいな場合は設定してください。
      不要な場合は省略して大丈夫です。
      
      ■ メモ欄
      
      メモ欄です。自由にメモをすることができます。
      また、一部の特殊な設定を記述できます。
      
      -----
      
      これで基本的な設定は完了です。
      対象のキャラでスキルを使うとカットインが表示されます。
      
      ------------------------------------------------------------
      ■ プロ向けの使い方
      ------------------------------------------------------------
      
      各カットイン設定の中にあるメモ欄に
      特殊な記載をすることで、少し複雑な使い方ができます。
      
      ● カットインの角度を変える
      
      デフォルトでは斜め下からキャラカットインが表示されますが、
      メモ欄に以下のように書くことで角度を変えることができます。
      
      <角度: 45>
      
      角度は0～360で指定してください。
      角度が0の場合は左から、90の場合は上から、
      180の場合は右から、270の場合は下から
      それぞれキャラカットインが表示されます。
      
      ● カットインの表示条件を複雑にする
      
      例えば、HPが50%以下のときだけカットインを表示したい場合は
      メモ欄に以下のように記述します。
      
      <条件: a.hp <= a.mhp * 0.5>
      
      条件として書かれた内容が真のときのみ、
      該当のカットインが表示されます。
      ダメージ計算式と同じように a に自分自身が入ります。
      ただし b （相手）はありません。
      
      ● スキルではなくアイテム使用時にカットインを出す
      
      まず、カットインの設定でスキルIDを「なし」にします。
      そして、カットイン設定のメモ欄に以下のように記述してください。
      
      <アイテム: 7>
      
      こうすると、アイテムID:7のアイテムを使ったときに
      カットインが表示されるようになります。
      
      ● マップでカットインを表示する
      
      プラグインコマンドで呼び出すことができます。
      なお、呼び出すカットインには
      事前に呼び出し名を付けておく必要があります。
      呼び出し名は、カットイン設定のメモ欄に以下のように記述してください。
      
      <呼び出し名: myCutIn>
      
      「myCutIn」の部分は好きな名前にしてください。
      この名前をプラグインコマンドで指定することで、
      マップでもカットインを表示できます。
      呼び出し方法の詳細は解説ページをご覧ください。
    `,
  },
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ カットイン設定',
      },
      children: [
        createStructParamArray('actorConfig', {
          struct: structActorCutinSet,
          text: {
            ja: '味方のカットイン設定',
          },
          description: {
            ja: dd`
              アクター用のカットイン設定です。
              上にあるものから優先されます。
            `,
          },
          default: [],
        }),
        createStructParamArray('enemyConfig', {
          struct: structEnemyCutinSet,
          text: {
            ja: '敵のカットイン設定',
          },
          description: {
            ja: dd`
              敵用のカットイン設定です。
              上にあるものから優先されます。
            `,
          },
          default: [],
        }),
      ],
    }),

    ...createParamGroup('common', {
      text: {
        ja: '■ 共通設定',
      },
      children: [
        createFileParam('commonBackImage1', {
          text: {
            ja: '背景画像1',
          },
          description: {
            ja: dd`
              背景全体に表示される画像を指定します。
            `,
          },
          dir: 'img/pictures',
          default: 'CutIn_back1',
        }),
        createFileParam('commonBackImage2', {
          text: {
            ja: '背景画像2',
          },
          description: {
            ja: dd`
              キャラクターの背景部分に表示される画像を指定します。
            `,
          },
          dir: 'img/pictures',
          default: 'CutIn_back2',
        }),
        createFileParam('commonBorderImage', {
          text: {
            ja: '境界線画像',
          },
          description: {
            ja: dd`
              カットインの境界線部分に表示される画像を指定します。
            `,
          },
          dir: 'img/pictures',
          default: 'CutIn_border',
        }),
        createSelectParam('commonBorderBlendMode', {
          text: {
            ja: '境界線画像のブレンド',
          },
          description: {
            ja: dd`
              境界線画像のブレンドモードを指定します
              ※RPGツクールMZのみ有効
            `,
          },
          options: [
            {
              name: {
                ja: '通常',
              },
              value: 'normal',
            },
            {
              name: {
                ja: '加算',
              },
              value: 'add',
            },
          ],
          default: 'add',
        }),
        createNumberParam('commonBorderSpeed', {
          text: {
            ja: '境界線画像の移動速度',
          },
          description: {
            ja: dd`
              境界線画像が移動する速度を指定します
            `,
          },
          default: 30,
        }),
        createStructParam('commonSound', {
          struct: structSound,
          text: {
            ja: '効果音',
          },
          description: {
            ja: dd`
              カットイン表示時の効果音を設定します。
              各カットイン内で指定がある場合は、そちらを優先します。
            `,
          },
          default: {
            name: 'Skill2',
            volume: 90,
            pitch: 100,
            pan: 0,
          },
        }),
        createSelectParam('cutInLayer', {
          text: {
            ja: 'カットインの表示レイヤー',
          },
          description: {
            ja: dd`
              カットインが表示されるレイヤーを指定します。
              省略の場合は共通設定を使用します。
            `,
          },
          options: [
            {
              name: {
                ja: '常に最前面',
              },
              value: 'foreground',
            },
            {
              name: {
                ja: 'ウィンドウの上',
              },
              value: 'upperWindow',
            },
            {
              name: {
                ja: 'ウィンドウの下',
              },
              value: 'lowerWindow',
            },
          ],
          default: 'foreground',
        }),
        createNumberParam('cutInOpenAndCloseTime', {
          text: {
            ja: 'カットイン表示開始/終了アニメーション時間',
          },
          description: {
            ja: dd`
              カットインの表示開始/終了アニメーションの再生時間を指定します。
              60＝1秒です。
            `,
          },
          default: 25,
        }),
        createNumberParam('cutInStopTime', {
          text: {
            ja: 'カットイン停止時間',
          },
          description: {
            ja: dd`
              カットイン表示が画面にとどまる時間を指定します。
              60＝1秒です。
            `,
          },
          default: 10,
        }),
      ],
    }),

    ...createParamGroup('commonActor', {
      text: {
        ja: '■ 味方用の共通設定',
      },
      children: [
        createStringParam('actorBackColor1', {
          text: {
            ja: '味方: 背景色1',
          },
          description: {
            ja: dd`
              味方のカットイン表示領域の背景色を設定します。
            `,
          },
          default: '#000033',
        }),
        createStringParam('actorBackColor2', {
          text: {
            ja: '味方: 背景色2',
          },
          description: {
            ja: dd`
              味方のカットイン表示領域の背景色を設定します。
              空欄の場合は背景色1と一緒になります。
            `,
          },
          default: '#6666ff',
        }),
        createStructParam('actorBackTone', {
          struct: structColor,
          text: {
            ja: '味方: エフェクト色調1',
          },
          description: {
            ja: dd`
              味方の背景エフェクトの色調を設定します。
              ※RPGツクールMZのみ有効
            `,
          },
          default: {
            red: -128,
            green: -128,
            blue: 128,
          },
        }),
        createStructParam('actorBorderTone', {
          struct: structColor,
          text: {
            ja: '味方: エフェクト色調2',
          },
          description: {
            ja: dd`
              味方の境界線エフェクトの色調を設定します。
              ※RPGツクールMZのみ有効
            `,
          },
          default: {
            red: 0,
            green: 0,
            blue: 0,
          },
        }),
      ],
    }),

    ...createParamGroup('commonEnemy', {
      text: {
        ja: '■ 敵用の共通設定',
      },
      children: [
        createStringParam('enemyBackColor1', {
          text: {
            ja: '敵: 背景色1',
          },
          description: {
            ja: dd`
              敵のカットイン表示領域の背景色を設定します。
            `,
          },
          default: '#330000',
        }),
        createStringParam('enemyBackColor2', {
          text: {
            ja: '敵: 背景色2',
          },
          description: {
            ja: dd`
              敵のカットイン表示領域の背景色を設定します。
              空欄の場合は背景色1と一緒になります。
            `,
          },
          default: '#ff6666',
        }),
        createStructParam('enemyBackTone', {
          struct: structColor,
          text: {
            ja: '敵: エフェクト色調1',
          },
          description: {
            ja: dd`
              敵の背景エフェクトの色調を設定します。
              ※RPGツクールMZのみ有効
            `,
          },
          default: {
            red: 128,
            green: -128,
            blue: -128,
          },
        }),
        createStructParam('enemyBorderTone', {
          struct: structColor,
          text: {
            ja: '敵: エフェクト色調2',
          },
          description: {
            ja: dd`
              敵の境界線エフェクトの色調を設定します。
              ※RPGツクールMZのみ有効
            `,
          },
          default: {
            red: 0,
            green: 0,
            blue: 0,
          },
        }),
      ],
    }),
  ],
  structs: [structActorCutinSet, structEnemyCutinSet, structColor, structColorCustomize, structSound],
};

export const Torigoya_SkillCutIn: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...common,
};

export const TorigoyaMZ_SkillCutIn: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...common,
  commands: [
    createCommand('showActorCutIn', {
      text: '味方カットインの表示',
      description: '味方のカットインを表示します。',
      args: [
        createStringParam('name', {
          text: '使用カットイン名',
          description: dd`
            カットイン設定のメモ欄で指定した呼び出し名を指定します。
            条件判定はすべてスキップされます
          `,
        }),
      ],
    }),
    createCommand('showEnemyCutIn', {
      text: '敵カットインの表示',
      description: '敵のカットインを表示します。',
      args: [
        createStringParam('name', {
          text: '使用カットイン名',
          description: dd`
            カットイン設定のメモ欄で指定した呼び出し名を指定します。
            条件判定はすべてスキップされます
          `,
        }),
      ],
    }),
  ],
  base: ['TorigoyaMZ_FrameTween'],
  orderAfter: ['TorigoyaMZ_FrameTween'],
};
