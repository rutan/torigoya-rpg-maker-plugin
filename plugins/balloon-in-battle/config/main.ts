import {
  createCommand,
  createDatabaseParam,
  createFileParam,
  createMultiLineStringParam,
  createNumberParam,
  createParamGroup,
  createStringParam,
  createStruct,
  createStructParamArray,
  createStructParam,
  TorigoyaPluginConfigSchema,
  createBooleanParam,
  createSelectParam,
  dd,
} from '@rutan/torigoya-plugin-config';

const structSound = createStruct('Sound', [
  createFileParam('name', {
    text: {
      ja: '再生する音声',
    },
    description: {
      ja: dd`
        再生する音声（ボイスなど）を選択します。
        指定しない場合は何も再生されません。
      `,
    },
    dir: 'audio/se',
  }),
  createNumberParam('volume', {
    text: {
      ja: '音量',
    },
    description: {
      ja: dd`
        効果音の音量を指定します。
         0～100で指定してください。
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

const paramMessage = createStringParam('message', {
  text: {
    ja: 'セリフ',
  },
  description: {
    ja: dd`
      表示するセリフを入力してください。
      \\n で改行ができます。
    `,
  },
});

const paramMessageWithSkill = createStringParam('message', {
  text: {
    ja: 'セリフ',
  },
  description: {
    ja: dd`
      表示するセリフを入力してください。
      \\n : 改行   \\skill : スキル名
    `,
  },
});

const paramMessageWithItem = createStringParam('message', {
  text: {
    ja: 'セリフ',
  },
  description: {
    ja: dd`
      表示するセリフを入力してください。
      \\n : 改行   \\item : アイテム名
    `,
  },
});

const paramSound = createStructParam('sound', {
  struct: structSound,
  text: {
    ja: '再生する音声',
  },
  description: {
    ja: dd`
      セリフと同時に再生する音声を指定します。
      ボイスなどを想定しています。
    `,
  },
  default: {
    name: '',
    volume: 90,
    pitch: 100,
    pan: 0,
  },
});

const paramNote = createMultiLineStringParam('note', {
  text: {
    ja: 'メモ欄',
  },
  description: {
    ja: dd`
      メモ欄です。
      ツクールのメモ欄同様に使えます。
    `,
  },
});

const structTalkItemWithTroop = createStruct('TalkItemWithTroop', [
  paramMessage,
  ...createParamGroup('optional', {
    text: {
      ja: '■ オプション',
    },
    children: [
      createDatabaseParam('troopId', {
        type: 'troop',
        text: {
          ja: '対象のトループ',
        },
        description: {
          ja: dd`
            この戦闘でしか使用したくない！
            という場合は指定してください
          `,
        },
      }),
      paramSound,
      paramNote,
    ],
  }),
]);

const structTalkItemWithFrom = createStruct('TalkItemWithFrom', [
  paramMessage,
  ...createParamGroup('optional', {
    text: {
      ja: '■ オプション',
    },
    children: [
      createDatabaseParam('actorId', {
        type: 'actor',
        text: {
          ja: '対象の相手(味方)',
        },
        description: {
          ja: dd`
            この味方からの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      createDatabaseParam('enemyId', {
        type: 'enemy',
        text: {
          ja: '対象の相手(敵)',
        },
        description: {
          ja: dd`
            この敵からの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      paramSound,
      paramNote,
    ],
  }),
]);

const structTalkItemForSkill = createStruct('TalkItemForSkill', [
  createDatabaseParam('skillId', {
    type: 'skill',
    text: {
      ja: 'スキルのID',
    },
    description: {
      ja: dd`
        このセリフを出すスキルを選択します。
        なしの場合は未設定のスキルで使用します。
      `,
    },
  }),
  paramMessageWithSkill,
  ...createParamGroup('optional', {
    text: {
      ja: '■ オプション',
    },
    children: [
      createDatabaseParam('actorId', {
        type: 'actor',
        text: {
          ja: '対象の相手(味方)',
        },
        description: {
          ja: dd`
            この味方がターゲットの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      createDatabaseParam('enemyId', {
        type: 'enemy',
        text: {
          ja: '対象の相手(敵)',
        },
        description: {
          ja: dd`
            この敵がターゲットの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      paramSound,
      paramNote,
    ],
  }),
]);

const structTalkItemForItem = createStruct('TalkItemForItem', [
  createDatabaseParam('itemId', {
    type: 'item',
    text: {
      ja: 'アイテムのID',
    },
    description: {
      ja: dd`
        このセリフを出すアイテムを選択します。
        なしの場合は未設定のアイテムで使用します。
      `,
    },
  }),
  paramMessageWithItem,
  ...createParamGroup('optional', {
    text: {
      ja: '■ オプション',
    },
    children: [
      createDatabaseParam('actorId', {
        type: 'actor',
        text: {
          ja: '対象の相手(味方)',
        },
        description: {
          ja: dd`
            この味方がターゲットの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      createDatabaseParam('enemyId', {
        type: 'enemy',
        text: {
          ja: '対象の相手(敵)',
        },
        description: {
          ja: dd`
            この敵がターゲットの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      paramSound,
      paramNote,
    ],
  }),
]);

const structTalkItemForState = createStruct('TalkItemForState', [
  createDatabaseParam('stateId', {
    type: 'state',
    text: {
      ja: 'ステートのID',
    },
    description: {
      ja: dd`
        このセリフを出すステートを選択します。
        なしの場合は未設定のステートで使用します。
      `,
    },
  }),
  paramMessage,
  ...createParamGroup('optional', {
    text: {
      ja: '■ オプション',
    },
    children: [
      createDatabaseParam('actorId', {
        type: 'actor',
        text: {
          ja: '対象の相手(味方)',
        },
        description: {
          ja: dd`
            この味方からの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      createDatabaseParam('enemyId', {
        type: 'enemy',
        text: {
          ja: '対象の相手(敵)',
        },
        description: {
          ja: dd`
            この敵からの時にしか使いたくない！
            という場合は指定してください
          `,
        },
      }),
      paramSound,
      paramNote,
    ],
  }),
]);

const structTalkItemAdvanced = createStruct('TalkItemAdvanced', [
  createStringParam('type', {
    text: {
      ja: '拡張タイプ',
    },
    description: {
      ja: dd`
        このセリフの拡張タイプIDを指定します。
      `,
    },
  }),
  paramMessage,
  paramSound,
  paramNote,
]);

const structTalkSet = createStruct('TalkSet', [
  createStringParam('id', {
    text: {
      ja: 'セリフセットID',
    },
    description: {
      ja: dd`
        このセリフセットのIDを設定します(重複×)
        このIDをアクターのメモ欄で使用します
      `,
    },
  }),
  ...createParamGroup('talk', {
    text: {
      ja: '■ セリフ',
    },
    children: [
      createStructParamArray('talkBattleStart', {
        struct: structTalkItemWithTroop,
        text: {
          ja: '[セリフ] 戦闘開始',
        },
        description: {
          ja: dd`
            戦闘開始時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkVictory', {
        struct: structTalkItemWithTroop,
        text: {
          ja: '[セリフ] 勝利',
        },
        description: {
          ja: dd`
            戦闘勝利時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkInput', {
        struct: structTalkItemWithTroop,
        text: {
          ja: '[セリフ] 行動選択中',
        },
        description: {
          ja: dd`
            行動選択時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkUseSkill', {
        struct: structTalkItemForSkill,
        text: {
          ja: '[セリフ] スキル',
        },
        description: {
          ja: dd`
            スキル使用時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkUseItem', {
        struct: structTalkItemForItem,
        text: {
          ja: '[セリフ] アイテム',
        },
        description: {
          ja: dd`
            アイテム使用時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkDamage', {
        struct: structTalkItemWithFrom,
        text: {
          ja: '[セリフ] ダメージ',
        },
        description: {
          ja: dd`
            ダメージを受けた時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkDead', {
        struct: structTalkItemWithTroop,
        text: {
          ja: '[セリフ] 戦闘不能',
        },
        description: {
          ja: dd`
            戦闘不能時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkSubstitute', {
        struct: structTalkItemWithFrom,
        text: {
          ja: '[セリフ] 身代わりした',
        },
        description: {
          ja: dd`
            味方を身代わりした時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkProtected', {
        struct: structTalkItemWithFrom,
        text: {
          ja: '[セリフ] 身代わりされた',
        },
        description: {
          ja: dd`
            味方に身代わりされた時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkRecovery', {
        struct: structTalkItemWithFrom,
        text: {
          ja: '[セリフ] 回復',
        },
        description: {
          ja: dd`
            味方に回復された時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkRemoveState', {
        struct: structTalkItemForState,
        text: {
          ja: '[セリフ] ステート回復',
        },
        description: {
          ja: dd`
            味方にステートを回復された時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkMissed', {
        struct: structTalkItemWithFrom,
        text: {
          ja: '[セリフ] 敵攻撃がミス',
        },
        description: {
          ja: dd`
            敵の攻撃がミス時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkEvasion', {
        struct: structTalkItemWithFrom,
        text: {
          ja: '[セリフ] 敵攻撃を回避',
        },
        description: {
          ja: dd`
            敵の攻撃回避時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
      createStructParamArray('talkCounter', {
        struct: structTalkItemWithFrom,
        text: {
          ja: '[セリフ] カウンター',
        },
        description: {
          ja: dd`
            敵にカウンター時に表示するセリフを登録します
            複数登録時はどれか1つがランダムに表示されます
          `,
        },
      }),
    ],
  }),
  ...createParamGroup('advanced', {
    text: {
      ja: '■ 拡張用',
    },
    children: [
      createStructParamArray('talkAdvanced', {
        struct: structTalkItemAdvanced,
        text: {
          ja: '拡張データ',
        },
        description: {
          ja: dd`
            拡張用データです。通常利用では設定は不要です。
            プラグインコマンドや別プラグイン等から利用されます。
          `,
        },
      }),
    ],
  }),
  paramNote,
]);

export const TorigoyaMZ_BalloonInBattle2: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  version: '1.7.2',
  title: {
    ja: '戦闘中セリフ表示プラグイン',
  },
  help: {
    ja: dd`
      戦闘中にセリフを吹き出しでキャラクターの上に表示します。

      ------------------------------------------------------------
      ■ 使い方
      ------------------------------------------------------------

      (1) セリフセットを登録する

      プラグイン設定からセリフセットを登録します。
      「セリフセットの登録」を選択し、必要な分だけ登録してください。

      ここで設定したセリフセットIDを後で使うため、
      わかりやすい名前にすると良いです（例: プリシア用　など）

      (2) アクターやエネミーにセリフセットを反映する

      アクターやエネミーのメモ欄に、
      以下のような書き方で使いたいセリフセットのIDを設定します。

      <セリフセット: プリシア用>

      これで設定は完了です。

      ------------------------------------------------------------
      ■ よくある質問
      ------------------------------------------------------------
      Q. フロントビューで味方のセリフが出ない…！

      残念ながら、デフォルトでは出ません(´・ω・｀)
      バトラーの位置にあわせて吹き出しが表示されているため、
      いわゆる「XP風バトル」のようなプラグインの力が必要です。

      例えば、以下のプラグインを一緒に使うことで、
      フロントビューでも味方のセリフを表示できます・

      フロントビューで味方側にも戦闘アニメを表示プラグイン
      https://torigoya-plugin.rutan.dev/battle/displayAnimationInFrontView/

      ----------

      Q. セリフ全部登録しないとだめ？

      使う分だけ登録すれば大丈夫です。
      例えば「勝利時のセリフはいらないなぁ」と思ったら
      勝利セリフは空っぽにしていても大丈夫です。

      ----------

      Q. スキルのセリフ入れたら防御のときにもしゃべって困る…

      そのスキル専用のセリフを登録し、セリフの欄を空っぽにしてください。
      例えば「防御（スキルID:2）」の場合は、
      スキルのセリフ登録で「スキルのID： 2」にして、
      セリフの欄は空っぽにすることで、
      防御のときはしゃべらなくなります。

      ----------

      Q. スキルやアイテムのセリフにスキル名やアイテム名を入れたいです！

      \\skill や \\item のように記入した部分が
      自動的に使ったスキルやアイテムの名前になります。

      ----------

      Q. セリフの途中で色変えたりとかできますか？

      できます！
      普通の文章表示イベントと同様に \\c[2] などを使うことができます。

      ----------

      Q. 拡張データって何？

      プラグインコマンドや別のプラグインから使うための
      データを登録できる欄です。
      基本的な使い方では登録する必要はありません。

      ------------------------------------------------------------
      ■ プロ向け
      ------------------------------------------------------------

      ● セリフの中に使える秘密の記法

      いくつか秘密の記法があります。
      が、状況によっては使えないこともあるためご注意ください。

      \\target
      　スキルやアイテムを使う相手の名前が入ります
      　全体スキルなどの場合は先頭の人の名前が入ります

      \\from
      　スキルやアイテムを使ってきた相手の名前が入ります
      　相手が特定できない場合は空欄になります
      　※バトルイベントによるものなど

      ----------

      ● セリフごとに条件を設定する

      各セリフのメモ欄に <条件: ～～> の形式で
      少し特別な条件を記述することができます。
      条件部分にはダメージ計算式と同じような記述ができます。

      例1）スイッチ1がONのときのみ有効
      <条件: $gameSwitches.value(1)>

      例2）HPが瀕死のときのみ有効
      <条件: a.isDying()>

      また options という変数に色々な情報が詰まっています。
      例えばスキルのセリフの場合は options.usingItem に
      使用スキルのオブジェクトが入っています。

      例）スキルIDが2のときに有効
      <条件: options.usingItem.id === 2>

      ただし、内部処理に近い部分を触ってしまうため、
      今後のプラグインのアップデートで動かなくなる可能性があります。
      自己責任！

      ----------

      ● セリフの優先度を設定する

      各セリフのメモ欄に以下のように記述すると
      優先度を設定できます。

      <優先度: 10>

      優先度の数値が一番高いものが選択されます。
      優先度が同じ場合は、その中からランダムに選択されます。
      なお、メモ欄で設定しない場合の優先度は 1 になります。

      以下のように条件式と組み合わせることで、
      「HPが瀕死のときは、このセリフしか言わない」のような
      設定をすることができます。

      <条件: a.isDying()>
      <優先度: 100>

      ----------

      ● 吹き出しの位置(横/高さ)を調整する
      アクターやエネミーのメモ欄に以下のように記述することで
      吹き出しの位置を変えることができます。

      ■ 横方向に動かす場合
      <セリフ位置X: 50>

      マイナスの値を指定すると左方向に動きます。

      ■ 縦方向に動かす場合
      <セリフ位置Y: -50>

      マイナスの値を指定すると上方向に動きます。

      なお、画面外にはみ出す場合は自動的に調整されます。

      ----------

      ● ゲーム中にセリフセットを切り替える

      ゲーム中に特定のキャラが劇的な変貌を遂げるなど
      セリフセットを切り替えたくなることもありますよね。

      プラグインコマンドを使うことで、
      ゲーム中にキャラに設定されている
      セリフセットを別のものに切り替えることができます。
      （この変更はセーブデータに反映されます）

      ----------

      ● 戦闘中のイベントなどで任意のセリフを表示する

      プラグインコマンドを使用することで、
      戦闘中のイベント中に任意のセリフを表示することができます。
    `,
  },
  params: [
    ...createParamGroup('base', {
      text: {
        ja: '■ 基本設定',
      },
      children: [
        createStructParamArray('talkConfig', {
          struct: structTalkSet,
          text: {
            ja: 'セリフセットの登録',
          },
        }),
      ],
    }),

    ...createParamGroup('balloon', {
      text: {
        ja: '■ 表示設定',
      },
      children: [
        createFileParam('balloonImage', {
          text: {
            ja: '吹き出し用の画像',
          },
          description: {
            ja: dd`
              吹き出しに使用するウィンドウ画像を指定します。
            `,
          },
          dir: 'img/system',
          default: 'Window',
        }),
        createNumberParam('balloonFontSize', {
          text: {
            ja: '文字サイズ',
          },
          description: {
            ja: dd`
              セリフの文字のサイズの標準値を指定します。
            `,
          },
          min: 1,
          default: 22,
        }),
        createNumberParam('balloonPadding', {
          text: {
            ja: 'ウィンドウの余白',
          },
          description: {
            ja: dd`
              吹き出しの余白の大きさを指定します。
            `,
          },
          min: 0,
          default: 8,
        }),
        createBooleanParam('balloonTail', {
          text: {
            ja: 'ウィンドウのしっぽ',
          },
          description: {
            ja: dd`
              しっぽ部分を表示するかどうか
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
        createNumberParam('balloonTailY', {
          text: {
            ja: 'しっぽの位置調整',
          },
          description: {
            ja: dd`
              しっぽ用の表示位置(高さ)を調整します。
              マイナスにすると上に移動します。
            `,
          },
          min: -10000,
          max: 10000,
          default: 4,
        }),
        createNumberParam('balloonActorX', {
          text: {
            ja: '味方吹き出しの位置調整（横）',
          },
          description: {
            ja: dd`
              味方側の吹き出しの表示位置(横)を調整します。
              マイナスにすると左、プラスにすると右に移動します。
            `,
          },
          min: -10000,
          max: 10000,
          default: 0,
        }),
        createNumberParam('balloonActorY', {
          text: {
            ja: '味方吹き出しの位置調整（高さ）',
          },
          description: {
            ja: dd`
              味方側の吹き出しの表示位置(高さ)を調整します。
              マイナスにすると上に移動します。
            `,
          },
          min: -10000,
          max: 10000,
          default: 0,
        }),
        createNumberParam('balloonEnemyX', {
          text: {
            ja: '敵の吹き出しの位置調整（横）',
          },
          description: {
            ja: dd`
              敵側の吹き出しの表示位置(横)を調整します。
              マイナスにすると左、プラスにすると右に移動します。
            `,
          },
          min: -10000,
          max: 10000,
          default: 0,
        }),
        createNumberParam('balloonEnemyY', {
          text: {
            ja: '敵の吹き出しの位置調整（高さ）',
          },
          description: {
            ja: dd`
              敵側の吹き出しの表示位置(高さ)を調整します。
              マイナスにすると上に移動します。
            `,
          },
          min: -10000,
          max: 10000,
          default: 0,
        }),
      ],
    }),

    ...createParamGroup('advanced', {
      text: {
        ja: '■ 上級者設定',
      },
      children: [
        createNumberParam('advancedLifeTime', {
          text: {
            ja: '表示時間：通常',
          },
          description: {
            ja: dd`
              通常のセリフの表示時間（ウェイト）を指定します。
              60＝1秒です。-1の場合は別のセリフが出るまで消えません。
            `,
          },
          min: -1,
          default: 90,
        }),
        createNumberParam('advancedDamageLifeTime', {
          text: {
            ja: '表示時間：被ダメ',
          },
          description: {
            ja: dd`
              被ダメージ系セリフの表示時間（ウェイト）を指定します。
              60＝1秒です。-1の場合は別のセリフが出るまで消えません。
            `,
          },
          min: -1,
          default: 30,
        }),
        createNumberParam('advancedInputLifeTime', {
          text: {
            ja: '表示時間：行動選択',
          },
          description: {
            ja: dd`
              行動選択セリフの表示時間（ウェイト）を指定します。
              60＝1秒です。-1の場合は別のセリフが出るまで消えません。
            `,
          },
          min: -1,
          default: -1,
        }),
        createNumberParam('advancedVictoryLifeTime', {
          text: {
            ja: '表示時間：勝利',
          },
          description: {
            ja: dd`
              勝利セリフの表示時間（ウェイト）を指定します。
              60＝1秒です。-1の場合は別のセリフが出るまで消えません。
            `,
          },
          min: -1,
          default: -1,
        }),
        createSelectParam('advancedLayerPosition', {
          text: {
            ja: '表示レイヤー位置',
          },
          description: {
            ja: dd`
              セリフ表示レイヤーの位置を変更します。
            `,
          },
          options: [
            { value: 'normal', name: { ja: '通常' } },
            { value: 'overlayWindow', name: { ja: 'ウィンドウ類より上' } },
          ] as const,
          default: 'normal',
        }),
      ],
    }),
  ],
  structs: [
    structTalkSet,
    structTalkItemWithTroop,
    structTalkItemWithFrom,
    structTalkItemForSkill,
    structTalkItemForItem,
    structTalkItemForState,
    structTalkItemAdvanced,
    structSound,
  ],
  commands: [
    createCommand('changeTalkSet', {
      text: {
        ja: 'セリフセットの変更',
      },
      description: {
        ja: dd`
          セリフセットを別のものに変更します。
          変更内容はセーブデータに反映されます。
        `,
      },
      args: [
        createDatabaseParam('actorId', {
          type: 'actor',
          text: {
            ja: 'アクター',
          },
          description: {
            ja: dd`
              セリフセットを変更するアクター
            `,
          },
        }),
        createStringParam('actorId', {
          text: {
            ja: 'セリフセットID',
          },
          description: {
            ja: dd`
              変更後のセリフセットのID。
              プラグイン設定で登録したものを指定してください。
            `,
          },
        }),
      ],
    }),
    createCommand('resetTalkSet', {
      text: {
        ja: 'セリフセットの初期化',
      },
      description: {
        ja: dd`
          セリフセットをメモ欄で指定しているものに戻します
        `,
      },
      args: [
        createDatabaseParam('actorId', {
          type: 'actor',
          text: {
            ja: 'アクター',
          },
          description: {
            ja: dd`
              セリフセットをもとに戻すアクター
            `,
          },
        }),
      ],
    }),
    createCommand('talkActorByText', {
      text: {
        ja: '[戦闘中のみ] 指定文章の味方セリフを表示',
      },
      description: {
        ja: dd`
          指定した内容のセリフを表示します
        `,
      },
      args: [
        createDatabaseParam('actorId', {
          type: 'actor',
          text: {
            ja: 'セリフを表示するアクター',
          },
          description: {
            ja: dd`
              セリフを表示するアクターを選択します。
              0の場合は現在行動中のアクターに表示します。
            `,
          },
        }),
        createStringParam('text', {
          text: {
            ja: 'セリフ本文',
          },
          description: {
            ja: dd`
              表示するセリフを入力してください
              \\n : 改行
            `,
          },
        }),
      ],
    }),
    createCommand('talkEnemyByText', {
      text: {
        ja: '[戦闘中のみ] 指定文章の敵セリフを表示',
      },
      description: {
        ja: dd`
          指定した内容のセリフを表示します
        `,
      },
      args: [
        createNumberParam('enemyIndex', {
          text: {
            ja: 'セリフを表示する敵',
          },
          description: {
            ja: dd`
              セリフを表示する敵の番号を指定します。
              0の場合は現在行動中の敵に表示します。
            `,
          },
        }),
        createStringParam('text', {
          text: {
            ja: 'セリフ本文',
          },
          description: {
            ja: dd`
              表示するセリフを入力してください
              \\n : 改行
            `,
          },
        }),
      ],
    }),
    createCommand('talkActorByType', {
      text: {
        ja: '[戦闘中のみ] 指定タイプの味方セリフを表示',
      },
      description: {
        ja: dd`
          指定したタイプのセリフを表示します。
          事前に拡張用データを登録する必要があります。
        `,
      },
      args: [
        createDatabaseParam('actorId', {
          type: 'actor',
          text: {
            ja: 'セリフを表示するアクター',
          },
          description: {
            ja: dd`
              セリフを表示するアクターを選択します。
              0の場合は現在行動中のアクターに表示します。
            `,
          },
        }),
        createStringParam('type', {
          text: {
            ja: 'メッセージタイプ',
          },
          description: {
            ja: dd`
              拡張用データに登録した拡張タイプを指定します。
            `,
          },
        }),
      ],
    }),
    createCommand('talkEnemyByType', {
      text: {
        ja: '[戦闘中のみ] 指定タイプの敵セリフを表示',
      },
      description: {
        ja: dd`
          指定したタイプのセリフを表示します。
          事前に拡張用データを登録する必要があります。
        `,
      },
      args: [
        createNumberParam('enemyIndex', {
          text: {
            ja: 'セリフを表示する敵',
          },
          description: {
            ja: dd`
              セリフを表示する敵の番号を指定します。
              0の場合は現在行動中の敵に表示します。
            `,
          },
        }),
        createStringParam('type', {
          text: {
            ja: 'メッセージタイプ',
          },
          description: {
            ja: dd`
              拡張用データに登録した拡張タイプを指定します。
            `,
          },
        }),
      ],
    }),
  ],
  orderBefore: ['TorigoyaMZ_DisplayAnimationInFrontView'],
};
