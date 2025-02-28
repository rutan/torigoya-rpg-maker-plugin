/*---------------------------------------------------------------------------*
 * TorigoyaMZ_BalloonInBattle2.js v.1.7.2
 *---------------------------------------------------------------------------*
 * Build Date: 2025/02/28 22:53:02 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 戦闘中セリフ表示プラグイン (v.1.7.2)
 * @version 1.7.2
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_BalloonInBattle2.js
 *
 * @orderBefore TorigoyaMZ_DisplayAnimationInFrontView
 *
 * @help 戦闘中セリフ表示プラグイン (v.1.7.2)
 * https://torigoya-plugin.rutan.dev
 *
 * 戦闘中にセリフを吹き出しでキャラクターの上に表示します。
 *
 * ------------------------------------------------------------
 * ■ 使い方
 * ------------------------------------------------------------
 *
 * (1) セリフセットを登録する
 *
 * プラグイン設定からセリフセットを登録します。
 * 「セリフセットの登録」を選択し、必要な分だけ登録してください。
 *
 * ここで設定したセリフセットIDを後で使うため、
 * わかりやすい名前にすると良いです（例: プリシア用　など）
 *
 * (2) アクターやエネミーにセリフセットを反映する
 *
 * アクターやエネミーのメモ欄に、
 * 以下のような書き方で使いたいセリフセットのIDを設定します。
 *
 * <セリフセット: プリシア用>
 *
 * これで設定は完了です。
 *
 * ------------------------------------------------------------
 * ■ よくある質問
 * ------------------------------------------------------------
 * Q. フロントビューで味方のセリフが出ない…！
 *
 * 残念ながら、デフォルトでは出ません(´・ω・｀)
 * バトラーの位置にあわせて吹き出しが表示されているため、
 * いわゆる「XP風バトル」のようなプラグインの力が必要です。
 *
 * 例えば、以下のプラグインを一緒に使うことで、
 * フロントビューでも味方のセリフを表示できます・
 *
 * フロントビューで味方側にも戦闘アニメを表示プラグイン
 * https://torigoya-plugin.rutan.dev/battle/displayAnimationInFrontView/
 *
 * ----------
 *
 * Q. セリフ全部登録しないとだめ？
 *
 * 使う分だけ登録すれば大丈夫です。
 * 例えば「勝利時のセリフはいらないなぁ」と思ったら
 * 勝利セリフは空っぽにしていても大丈夫です。
 *
 * ----------
 *
 * Q. スキルのセリフ入れたら防御のときにもしゃべって困る…
 *
 * そのスキル専用のセリフを登録し、セリフの欄を空っぽにしてください。
 * 例えば「防御（スキルID:2）」の場合は、
 * スキルのセリフ登録で「スキルのID： 2」にして、
 * セリフの欄は空っぽにすることで、
 * 防御のときはしゃべらなくなります。
 *
 * ----------
 *
 * Q. スキルやアイテムのセリフにスキル名やアイテム名を入れたいです！
 *
 * \skill や \item のように記入した部分が
 * 自動的に使ったスキルやアイテムの名前になります。
 *
 * ----------
 *
 * Q. セリフの途中で色変えたりとかできますか？
 *
 * できます！
 * 普通の文章表示イベントと同様に \c[2] などを使うことができます。
 *
 * ----------
 *
 * Q. 拡張データって何？
 *
 * プラグインコマンドや別のプラグインから使うための
 * データを登録できる欄です。
 * 基本的な使い方では登録する必要はありません。
 *
 * ------------------------------------------------------------
 * ■ プロ向け
 * ------------------------------------------------------------
 *
 * ● セリフの中に使える秘密の記法
 *
 * いくつか秘密の記法があります。
 * が、状況によっては使えないこともあるためご注意ください。
 *
 * \target
 * 　スキルやアイテムを使う相手の名前が入ります
 * 　全体スキルなどの場合は先頭の人の名前が入ります
 *
 * \from
 * 　スキルやアイテムを使ってきた相手の名前が入ります
 * 　相手が特定できない場合は空欄になります
 * 　※バトルイベントによるものなど
 *
 * ----------
 *
 * ● セリフごとに条件を設定する
 *
 * 各セリフのメモ欄に <条件: ～～> の形式で
 * 少し特別な条件を記述することができます。
 * 条件部分にはダメージ計算式と同じような記述ができます。
 *
 * 例1）スイッチ1がONのときのみ有効
 * <条件: $gameSwitches.value(1)>
 *
 * 例2）HPが瀕死のときのみ有効
 * <条件: a.isDying()>
 *
 * また options という変数に色々な情報が詰まっています。
 * 例えばスキルのセリフの場合は options.usingItem に
 * 使用スキルのオブジェクトが入っています。
 *
 * 例）スキルIDが2のときに有効
 * <条件: options.usingItem.id === 2>
 *
 * ただし、内部処理に近い部分を触ってしまうため、
 * 今後のプラグインのアップデートで動かなくなる可能性があります。
 * 自己責任！
 *
 * ----------
 *
 * ● セリフの優先度を設定する
 *
 * 各セリフのメモ欄に以下のように記述すると
 * 優先度を設定できます。
 *
 * <優先度: 10>
 *
 * 優先度の数値が一番高いものが選択されます。
 * 優先度が同じ場合は、その中からランダムに選択されます。
 * なお、メモ欄で設定しない場合の優先度は 1 になります。
 *
 * 以下のように条件式と組み合わせることで、
 * 「HPが瀕死のときは、このセリフしか言わない」のような
 * 設定をすることができます。
 *
 * <条件: a.isDying()>
 * <優先度: 100>
 *
 * ----------
 *
 * ● 吹き出しの位置(横/高さ)を調整する
 * アクターやエネミーのメモ欄に以下のように記述することで
 * 吹き出しの位置を変えることができます。
 *
 * ■ 横方向に動かす場合
 * <セリフ位置X: 50>
 *
 * マイナスの値を指定すると左方向に動きます。
 *
 * ■ 縦方向に動かす場合
 * <セリフ位置Y: -50>
 *
 * マイナスの値を指定すると上方向に動きます。
 *
 * なお、画面外にはみ出す場合は自動的に調整されます。
 *
 * ----------
 *
 * ● ゲーム中にセリフセットを切り替える
 *
 * ゲーム中に特定のキャラが劇的な変貌を遂げるなど
 * セリフセットを切り替えたくなることもありますよね。
 *
 * プラグインコマンドを使うことで、
 * ゲーム中にキャラに設定されている
 * セリフセットを別のものに切り替えることができます。
 * （この変更はセーブデータに反映されます）
 *
 * ----------
 *
 * ● 戦闘中のイベントなどで任意のセリフを表示する
 *
 * プラグインコマンドを使用することで、
 * 戦闘中のイベント中に任意のセリフを表示することができます。
 *
 * @param base
 * @text ■ 基本設定
 * @type string
 *
 * @param talkConfig
 * @text セリフセットの登録
 * @parent base
 * @type struct<TalkSet>[]
 * @default []
 *
 * @param balloon
 * @text ■ 表示設定
 * @type string
 *
 * @param balloonImage
 * @text 吹き出し用の画像
 * @desc 吹き出しに使用するウィンドウ画像を指定します。
 * @parent balloon
 * @type file
 * @dir img/system
 * @default Window
 *
 * @param balloonFontSize
 * @text 文字サイズ
 * @desc セリフの文字のサイズの標準値を指定します。
 * @parent balloon
 * @type number
 * @min 1
 * @decimals 0
 * @default 22
 *
 * @param balloonPadding
 * @text ウィンドウの余白
 * @desc 吹き出しの余白の大きさを指定します。
 * @parent balloon
 * @type number
 * @min 0
 * @decimals 0
 * @default 8
 *
 * @param balloonTail
 * @text ウィンドウのしっぽ
 * @desc しっぽ部分を表示するかどうか
 * @parent balloon
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param balloonTailY
 * @text しっぽの位置調整
 * @desc しっぽ用の表示位置(高さ)を調整します。
 * マイナスにすると上に移動します。
 * @parent balloon
 * @type number
 * @min -10000
 * @max 10000
 * @decimals 0
 * @default 4
 *
 * @param balloonActorX
 * @text 味方吹き出しの位置調整（横）
 * @desc 味方側の吹き出しの表示位置(横)を調整します。
 * マイナスにすると左、プラスにすると右に移動します。
 * @parent balloon
 * @type number
 * @min -10000
 * @max 10000
 * @decimals 0
 * @default 0
 *
 * @param balloonActorY
 * @text 味方吹き出しの位置調整（高さ）
 * @desc 味方側の吹き出しの表示位置(高さ)を調整します。
 * マイナスにすると上に移動します。
 * @parent balloon
 * @type number
 * @min -10000
 * @max 10000
 * @decimals 0
 * @default 0
 *
 * @param balloonEnemyX
 * @text 敵の吹き出しの位置調整（横）
 * @desc 敵側の吹き出しの表示位置(横)を調整します。
 * マイナスにすると左、プラスにすると右に移動します。
 * @parent balloon
 * @type number
 * @min -10000
 * @max 10000
 * @decimals 0
 * @default 0
 *
 * @param balloonEnemyY
 * @text 敵の吹き出しの位置調整（高さ）
 * @desc 敵側の吹き出しの表示位置(高さ)を調整します。
 * マイナスにすると上に移動します。
 * @parent balloon
 * @type number
 * @min -10000
 * @max 10000
 * @decimals 0
 * @default 0
 *
 * @param advanced
 * @text ■ 上級者設定
 * @type string
 *
 * @param advancedLifeTime
 * @text 表示時間：通常
 * @desc 通常のセリフの表示時間（ウェイト）を指定します。
 * 60＝1秒です。-1の場合は別のセリフが出るまで消えません。
 * @parent advanced
 * @type number
 * @min -1
 * @decimals 0
 * @default 90
 *
 * @param advancedDamageLifeTime
 * @text 表示時間：被ダメ
 * @desc 被ダメージ系セリフの表示時間（ウェイト）を指定します。
 * 60＝1秒です。-1の場合は別のセリフが出るまで消えません。
 * @parent advanced
 * @type number
 * @min -1
 * @decimals 0
 * @default 30
 *
 * @param advancedInputLifeTime
 * @text 表示時間：行動選択
 * @desc 行動選択セリフの表示時間（ウェイト）を指定します。
 * 60＝1秒です。-1の場合は別のセリフが出るまで消えません。
 * @parent advanced
 * @type number
 * @min -1
 * @decimals 0
 * @default -1
 *
 * @param advancedVictoryLifeTime
 * @text 表示時間：勝利
 * @desc 勝利セリフの表示時間（ウェイト）を指定します。
 * 60＝1秒です。-1の場合は別のセリフが出るまで消えません。
 * @parent advanced
 * @type number
 * @min -1
 * @decimals 0
 * @default -1
 *
 * @param advancedLayerPosition
 * @text 表示レイヤー位置
 * @desc セリフ表示レイヤーの位置を変更します。
 * @parent advanced
 * @type select
 * @option 通常
 * @value normal
 * @option ウィンドウ類より上
 * @value overlayWindow
 * @default normal
 *
 * @command changeTalkSet
 * @text セリフセットの変更
 * @desc セリフセットを別のものに変更します。
 * 変更内容はセーブデータに反映されます。
 *
 * @arg actorId
 * @text アクター
 * @desc セリフセットを変更するアクター
 * @type actor
 * @default 0
 *
 * @arg actorId
 * @text セリフセットID
 * @desc 変更後のセリフセットのID。
 * プラグイン設定で登録したものを指定してください。
 * @type string
 *
 * @command resetTalkSet
 * @text セリフセットの初期化
 * @desc セリフセットをメモ欄で指定しているものに戻します
 *
 * @arg actorId
 * @text アクター
 * @desc セリフセットをもとに戻すアクター
 * @type actor
 * @default 0
 *
 * @command talkActorByText
 * @text [戦闘中のみ] 指定文章の味方セリフを表示
 * @desc 指定した内容のセリフを表示します
 *
 * @arg actorId
 * @text セリフを表示するアクター
 * @desc セリフを表示するアクターを選択します。
 * 0の場合は現在行動中のアクターに表示します。
 * @type actor
 * @default 0
 *
 * @arg text
 * @text セリフ本文
 * @desc 表示するセリフを入力してください
 * \n : 改行
 * @type string
 *
 * @command talkEnemyByText
 * @text [戦闘中のみ] 指定文章の敵セリフを表示
 * @desc 指定した内容のセリフを表示します
 *
 * @arg enemyIndex
 * @text セリフを表示する敵
 * @desc セリフを表示する敵の番号を指定します。
 * 0の場合は現在行動中の敵に表示します。
 * @type number
 * @decimals 0
 * @default 0
 *
 * @arg text
 * @text セリフ本文
 * @desc 表示するセリフを入力してください
 * \n : 改行
 * @type string
 *
 * @command talkActorByType
 * @text [戦闘中のみ] 指定タイプの味方セリフを表示
 * @desc 指定したタイプのセリフを表示します。
 * 事前に拡張用データを登録する必要があります。
 *
 * @arg actorId
 * @text セリフを表示するアクター
 * @desc セリフを表示するアクターを選択します。
 * 0の場合は現在行動中のアクターに表示します。
 * @type actor
 * @default 0
 *
 * @arg type
 * @text メッセージタイプ
 * @desc 拡張用データに登録した拡張タイプを指定します。
 * @type string
 *
 * @command talkEnemyByType
 * @text [戦闘中のみ] 指定タイプの敵セリフを表示
 * @desc 指定したタイプのセリフを表示します。
 * 事前に拡張用データを登録する必要があります。
 *
 * @arg enemyIndex
 * @text セリフを表示する敵
 * @desc セリフを表示する敵の番号を指定します。
 * 0の場合は現在行動中の敵に表示します。
 * @type number
 * @decimals 0
 * @default 0
 *
 * @arg type
 * @text メッセージタイプ
 * @desc 拡張用データに登録した拡張タイプを指定します。
 * @type string
 */

/*~struct~TalkSet:
 * @param id
 * @text セリフセットID
 * @desc このセリフセットのIDを設定します(重複×)
 * このIDをアクターのメモ欄で使用します
 * @type string
 *
 * @param talk
 * @text ■ セリフ
 * @type string
 *
 * @param talkBattleStart
 * @text [セリフ] 戦闘開始
 * @desc 戦闘開始時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithTroop>[]
 * @default []
 *
 * @param talkVictory
 * @text [セリフ] 勝利
 * @desc 戦闘勝利時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithTroop>[]
 * @default []
 *
 * @param talkInput
 * @text [セリフ] 行動選択中
 * @desc 行動選択時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithTroop>[]
 * @default []
 *
 * @param talkUseSkill
 * @text [セリフ] スキル
 * @desc スキル使用時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemForSkill>[]
 * @default []
 *
 * @param talkUseItem
 * @text [セリフ] アイテム
 * @desc アイテム使用時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemForItem>[]
 * @default []
 *
 * @param talkDamage
 * @text [セリフ] ダメージ
 * @desc ダメージを受けた時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithFrom>[]
 * @default []
 *
 * @param talkDead
 * @text [セリフ] 戦闘不能
 * @desc 戦闘不能時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithTroop>[]
 * @default []
 *
 * @param talkSubstitute
 * @text [セリフ] 身代わりした
 * @desc 味方を身代わりした時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithFrom>[]
 * @default []
 *
 * @param talkProtected
 * @text [セリフ] 身代わりされた
 * @desc 味方に身代わりされた時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithFrom>[]
 * @default []
 *
 * @param talkRecovery
 * @text [セリフ] 回復
 * @desc 味方に回復された時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithFrom>[]
 * @default []
 *
 * @param talkRemoveState
 * @text [セリフ] ステート回復
 * @desc 味方にステートを回復された時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemForState>[]
 * @default []
 *
 * @param talkMissed
 * @text [セリフ] 敵攻撃がミス
 * @desc 敵の攻撃がミス時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithFrom>[]
 * @default []
 *
 * @param talkEvasion
 * @text [セリフ] 敵攻撃を回避
 * @desc 敵の攻撃回避時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithFrom>[]
 * @default []
 *
 * @param talkCounter
 * @text [セリフ] カウンター
 * @desc 敵にカウンター時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @parent talk
 * @type struct<TalkItemWithFrom>[]
 * @default []
 *
 * @param advanced
 * @text ■ 拡張用
 * @type string
 *
 * @param talkAdvanced
 * @text 拡張データ
 * @desc 拡張用データです。通常利用では設定は不要です。
 * プラグインコマンドや別プラグイン等から利用されます。
 * @parent advanced
 * @type struct<TalkItemAdvanced>[]
 * @default []
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 */

/*~struct~TalkItemWithTroop:
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください。
 * \n で改行ができます。
 * @type string
 *
 * @param optional
 * @text ■ オプション
 * @type string
 *
 * @param troopId
 * @text 対象のトループ
 * @desc この戦闘でしか使用したくない！
 * という場合は指定してください
 * @parent optional
 * @type troop
 * @default 0
 *
 * @param sound
 * @text 再生する音声
 * @desc セリフと同時に再生する音声を指定します。
 * ボイスなどを想定しています。
 * @parent optional
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @parent optional
 * @type multiline_string
 */

/*~struct~TalkItemWithFrom:
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください。
 * \n で改行ができます。
 * @type string
 *
 * @param optional
 * @text ■ オプション
 * @type string
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方からの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type actor
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵からの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type enemy
 * @default 0
 *
 * @param sound
 * @text 再生する音声
 * @desc セリフと同時に再生する音声を指定します。
 * ボイスなどを想定しています。
 * @parent optional
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @parent optional
 * @type multiline_string
 */

/*~struct~TalkItemForSkill:
 * @param skillId
 * @text スキルのID
 * @desc このセリフを出すスキルを選択します。
 * なしの場合は未設定のスキルで使用します。
 * @type skill
 * @default 0
 *
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください。
 * \n : 改行   \skill : スキル名
 * @type string
 *
 * @param optional
 * @text ■ オプション
 * @type string
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type actor
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type enemy
 * @default 0
 *
 * @param sound
 * @text 再生する音声
 * @desc セリフと同時に再生する音声を指定します。
 * ボイスなどを想定しています。
 * @parent optional
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @parent optional
 * @type multiline_string
 */

/*~struct~TalkItemForItem:
 * @param itemId
 * @text アイテムのID
 * @desc このセリフを出すアイテムを選択します。
 * なしの場合は未設定のアイテムで使用します。
 * @type item
 * @default 0
 *
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください。
 * \n : 改行   \item : アイテム名
 * @type string
 *
 * @param optional
 * @text ■ オプション
 * @type string
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type actor
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type enemy
 * @default 0
 *
 * @param sound
 * @text 再生する音声
 * @desc セリフと同時に再生する音声を指定します。
 * ボイスなどを想定しています。
 * @parent optional
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @parent optional
 * @type multiline_string
 */

/*~struct~TalkItemForState:
 * @param stateId
 * @text ステートのID
 * @desc このセリフを出すステートを選択します。
 * なしの場合は未設定のステートで使用します。
 * @type state
 * @default 0
 *
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください。
 * \n で改行ができます。
 * @type string
 *
 * @param optional
 * @text ■ オプション
 * @type string
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方からの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type actor
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵からの時にしか使いたくない！
 * という場合は指定してください
 * @parent optional
 * @type enemy
 * @default 0
 *
 * @param sound
 * @text 再生する音声
 * @desc セリフと同時に再生する音声を指定します。
 * ボイスなどを想定しています。
 * @parent optional
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @parent optional
 * @type multiline_string
 */

/*~struct~TalkItemAdvanced:
 * @param type
 * @text 拡張タイプ
 * @desc このセリフの拡張タイプIDを指定します。
 * @type string
 *
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください。
 * \n で改行ができます。
 * @type string
 *
 * @param sound
 * @text 再生する音声
 * @desc セリフと同時に再生する音声を指定します。
 * ボイスなどを想定しています。
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 */

/*~struct~Sound:
 * @param name
 * @text 再生する音声
 * @desc 再生する音声（ボイスなど）を選択します。
 * 指定しない場合は何も再生されません。
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text 音量
 * @desc 効果音の音量を指定します。
 *  0～100で指定してください。
 * @type number
 * @min 0
 * @max 100
 * @decimals 0
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @desc 効果音のピッチを指定します。
 * 100が通常です。
 * @type number
 * @min 0
 * @max 200
 * @decimals 0
 * @default 100
 *
 * @param pan
 * @text パン
 * @desc 効果音のパンを指定します。
 * 0が通常です。
 * @type number
 * @min -100
 * @max 100
 * @decimals 0
 * @default 0
 */

(function () {
    'use strict';

    /**
     * 配列をシャッフルする
     * @param array
     */
    function arrayShuffle(array) {
        const arr = array.slice(0);
        for (let i = arr.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
        return arr;
    }

    /**
     * ツクールのメモ欄のメタデータ文字列の `<` `>` をデコードする
     * @param string
     */
    function unescapeMetaString(string) {
        return `${string || ''}`.trim().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    /**
     * 既存メンバー関数の置き換え
     * @param target 置き換える対象
     * @param methodName メソッド名
     * @param func
     */
    function wrap(target, methodName, func) {
        const originalFunc = Object.prototype.hasOwnProperty.call(target, methodName)
            ? target[methodName]
            : (() => {
                  const proto = Object.getPrototypeOf(target);
                  return function (...args) {
                      return proto[methodName].apply(this, args);
                  };
              })();
        target[methodName] = function (...args) {
            return func.apply(this, [this, originalFunc.bind(this), ...args]);
        };
    }

    /**
     * プラグインのファイル名を取得
     */
    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_BalloonInBattle2';
    }

    function parseBooleanParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        return String(value).toLowerCase() === 'true';
    }
    function parseIntegerParam(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        const intValue = Number.parseInt(String(value), 10);
        return isNaN(intValue) ? defaultValue : intValue;
    }
    function parseStringParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        return String(value);
    }
    function parseStructObjectParam(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        if (typeof value === 'string') return JSON.parse(value);
        return value;
    }

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function readStructTalkSet(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            id: parseStringParam(parameters['id'], ''),
            talk: parseStringParam(parameters['talk'], ''),
            talkBattleStart: parseStructObjectParam(parameters['talkBattleStart'], []).map(readStructTalkItemWithTroop),
            talkVictory: parseStructObjectParam(parameters['talkVictory'], []).map(readStructTalkItemWithTroop),
            talkInput: parseStructObjectParam(parameters['talkInput'], []).map(readStructTalkItemWithTroop),
            talkUseSkill: parseStructObjectParam(parameters['talkUseSkill'], []).map(readStructTalkItemForSkill),
            talkUseItem: parseStructObjectParam(parameters['talkUseItem'], []).map(readStructTalkItemForItem),
            talkDamage: parseStructObjectParam(parameters['talkDamage'], []).map(readStructTalkItemWithFrom),
            talkDead: parseStructObjectParam(parameters['talkDead'], []).map(readStructTalkItemWithTroop),
            talkSubstitute: parseStructObjectParam(parameters['talkSubstitute'], []).map(readStructTalkItemWithFrom),
            talkProtected: parseStructObjectParam(parameters['talkProtected'], []).map(readStructTalkItemWithFrom),
            talkRecovery: parseStructObjectParam(parameters['talkRecovery'], []).map(readStructTalkItemWithFrom),
            talkRemoveState: parseStructObjectParam(parameters['talkRemoveState'], []).map(readStructTalkItemForState),
            talkMissed: parseStructObjectParam(parameters['talkMissed'], []).map(readStructTalkItemWithFrom),
            talkEvasion: parseStructObjectParam(parameters['talkEvasion'], []).map(readStructTalkItemWithFrom),
            talkCounter: parseStructObjectParam(parameters['talkCounter'], []).map(readStructTalkItemWithFrom),
            advanced: parseStringParam(parameters['advanced'], ''),
            talkAdvanced: parseStructObjectParam(parameters['talkAdvanced'], []).map(readStructTalkItemAdvanced),
            note: parseStringParam(parameters['note'], ''),
        };
    }

    function readStructTalkItemWithTroop(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            message: parseStringParam(parameters['message'], ''),
            optional: parseStringParam(parameters['optional'], ''),
            troopId: parseIntegerParam(parameters['troopId'], 0),
            sound: readStructSound(
                parseStructObjectParam(parameters['sound'], { name: '', volume: 90, pitch: 100, pan: 0 }),
            ),
            note: parseStringParam(parameters['note'], ''),
        };
    }

    function readStructTalkItemWithFrom(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            message: parseStringParam(parameters['message'], ''),
            optional: parseStringParam(parameters['optional'], ''),
            actorId: parseIntegerParam(parameters['actorId'], 0),
            enemyId: parseIntegerParam(parameters['enemyId'], 0),
            sound: readStructSound(
                parseStructObjectParam(parameters['sound'], { name: '', volume: 90, pitch: 100, pan: 0 }),
            ),
            note: parseStringParam(parameters['note'], ''),
        };
    }

    function readStructTalkItemForSkill(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            skillId: parseIntegerParam(parameters['skillId'], 0),
            message: parseStringParam(parameters['message'], ''),
            optional: parseStringParam(parameters['optional'], ''),
            actorId: parseIntegerParam(parameters['actorId'], 0),
            enemyId: parseIntegerParam(parameters['enemyId'], 0),
            sound: readStructSound(
                parseStructObjectParam(parameters['sound'], { name: '', volume: 90, pitch: 100, pan: 0 }),
            ),
            note: parseStringParam(parameters['note'], ''),
        };
    }

    function readStructTalkItemForItem(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            itemId: parseIntegerParam(parameters['itemId'], 0),
            message: parseStringParam(parameters['message'], ''),
            optional: parseStringParam(parameters['optional'], ''),
            actorId: parseIntegerParam(parameters['actorId'], 0),
            enemyId: parseIntegerParam(parameters['enemyId'], 0),
            sound: readStructSound(
                parseStructObjectParam(parameters['sound'], { name: '', volume: 90, pitch: 100, pan: 0 }),
            ),
            note: parseStringParam(parameters['note'], ''),
        };
    }

    function readStructTalkItemForState(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            stateId: parseIntegerParam(parameters['stateId'], 0),
            message: parseStringParam(parameters['message'], ''),
            optional: parseStringParam(parameters['optional'], ''),
            actorId: parseIntegerParam(parameters['actorId'], 0),
            enemyId: parseIntegerParam(parameters['enemyId'], 0),
            sound: readStructSound(
                parseStructObjectParam(parameters['sound'], { name: '', volume: 90, pitch: 100, pan: 0 }),
            ),
            note: parseStringParam(parameters['note'], ''),
        };
    }

    function readStructTalkItemAdvanced(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            type: parseStringParam(parameters['type'], ''),
            message: parseStringParam(parameters['message'], ''),
            sound: readStructSound(
                parseStructObjectParam(parameters['sound'], { name: '', volume: 90, pitch: 100, pan: 0 }),
            ),
            note: parseStringParam(parameters['note'], ''),
        };
    }

    function readStructSound(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            name: parseStringParam(parameters['name'], ''),
            volume: parseIntegerParam(parameters['volume'], 90),
            pitch: parseIntegerParam(parameters['pitch'], 100),
            pan: parseIntegerParam(parameters['pan'], 0),
        };
    }

    function readParameter() {
        const parameters = PluginManager.parameters(getPluginName());
        return {
            version: '1.7.2',
            base: parseStringParam(parameters['base'], ''),
            talkConfig: parseStructObjectParam(parameters['talkConfig'], []).map(readStructTalkSet),
            balloon: parseStringParam(parameters['balloon'], ''),
            balloonImage: parseStringParam(parameters['balloonImage'], 'Window'),
            balloonFontSize: parseIntegerParam(parameters['balloonFontSize'], 22),
            balloonPadding: parseIntegerParam(parameters['balloonPadding'], 8),
            balloonTail: parseBooleanParam(parameters['balloonTail'], true),
            balloonTailY: parseIntegerParam(parameters['balloonTailY'], 4),
            balloonActorX: parseIntegerParam(parameters['balloonActorX'], 0),
            balloonActorY: parseIntegerParam(parameters['balloonActorY'], 0),
            balloonEnemyX: parseIntegerParam(parameters['balloonEnemyX'], 0),
            balloonEnemyY: parseIntegerParam(parameters['balloonEnemyY'], 0),
            advanced: parseStringParam(parameters['advanced'], ''),
            advancedLifeTime: parseIntegerParam(parameters['advancedLifeTime'], 90),
            advancedDamageLifeTime: parseIntegerParam(parameters['advancedDamageLifeTime'], 30),
            advancedInputLifeTime: parseIntegerParam(parameters['advancedInputLifeTime'], -1),
            advancedVictoryLifeTime: parseIntegerParam(parameters['advancedVictoryLifeTime'], -1),
            advancedLayerPosition: parseStringParam(parameters['advancedLayerPosition'], 'normal'),
        };
    }

    class Window_BattleBalloon extends Window_Base {
        constructor() {
            super(new Rectangle(0, 0, 32, 32));
            this.padding = Torigoya.BalloonInBattle.parameter.balloonPadding;
            this._battlerSprite = null;
            this._message = '';
            this._battlerPosition = new Point();
            this._lifeTimer = 0;
            this.downArrowVisible = this._useTail();
            this.openness = 0;
        }

        loadWindowskin() {
            this.windowskin = ImageManager.loadSystem(Torigoya.BalloonInBattle.parameter.balloonImage);
        }

        resetFontSettings() {
            this.contents.fontFace = $gameSystem.mainFontFace();
            this.contents.fontSize = Torigoya.BalloonInBattle.parameter.balloonFontSize;
            this.resetTextColor();
        }

        lineHeight() {
            return Math.floor(Torigoya.BalloonInBattle.parameter.balloonFontSize * 1.5);
        }

        setBattlerSprite(battlerSprite) {
            this._battlerSprite = battlerSprite;
        }

        showMessage(params) {
            if (this._message === params.message) return;
            this._message = params.message;
            if (params.options.talkItem && params.options.talkItem.sound) {
                const sound = params.options.talkItem.sound;
                if (sound.name && sound.volume > 0) {
                    AudioManager.playSe(sound);
                }
            }
            this.refresh();
            this.open();
        }

        refresh() {
            this.contents.clear();
            this.resetFontSettings();

            const { width, height } = this.textSizeEx(this._message);
            const windowWidth = Math.min(width + this.padding * 2, Graphics.width);
            const windowHeight = Math.min(height + this.padding * 2, Graphics.height);
            this.move(0, 0, windowWidth, windowHeight);

            this.drawTextEx(this._message, 0, 0, width);
        }

        _refreshAllParts() {
            if (
                this.contents &&
                (this.contents.width < this.contentsWidth() || this.contents.height < this.contentsHeight())
            ) {
                this.contents.resize(this.contentsWidth(), this.contentsHeight());
            }

            super._refreshAllParts();
        }

        _refreshArrows() {
            super._refreshArrows();
            this._downArrowSprite.y = this._height + this._tailY();
        }

        _useTail() {
            return !!Torigoya.BalloonInBattle.parameter.balloonTail;
        }

        _tailY() {
            if (!this._useTail()) return 0;
            return Torigoya.BalloonInBattle.parameter.balloonTailY || 0;
        }

        close() {
            this._message = '';
            this._lifeTimer = 0;
            super.close();
        }

        update() {
            this._updateMessage();
            this._updateTrackingBattlerSprite();
            super.update();
        }

        _updateMessage() {
            if (!this._battlerSprite) return;

            if (this._lifeTimer > 0) {
                --this._lifeTimer;
                if (this._lifeTimer <= 0) {
                    this.close();
                }
            }

            const battler = this._battlerSprite._actor || this._battlerSprite._enemy;
            if (!battler) return;

            const params = battler.torigoyaBalloonInBattle_getParam();
            if (params.type) {
                if (params.message) {
                    this._lifeTimer =
                        params.options.lifeTime !== undefined
                            ? params.options.lifeTime
                            : Torigoya.BalloonInBattle.parameter.advancedLifeTime;
                    this.showMessage(params);
                } else {
                    this.close();
                }

                // メッセージ予約を消す
                battler.torigoyaBalloonInBattle_clearMessage();
            }
        }

        _updateTrackingBattlerSprite() {
            if (!this._battlerSprite) return;

            this._battlerSprite.getGlobalPosition(this._battlerPosition);
            const battlerX = this._battlerPosition.x + this._battlerSprite.torigoyaBalloonInBattle_balloonX();
            const battlerY = this._battlerPosition.y + this._battlerSprite.torigoyaBalloonInBattle_balloonY();

            this.x = battlerX - this.width / 2;
            if (this.x < 0) this.x = 0;
            if (this.x + this.width > Graphics.width) this.x = Graphics.width - this.width;

            this.y = battlerY - this.height - this._tailY();
            if (this.y < 0) this.y = 0;
            if (this.y + this.height > Graphics.height) this.y = Graphics.height - this.height - this._tailY();

            this._downArrowSprite.x = battlerX - this.x;
        }
    }

    function evalCondition(code, a, options = {}) {
        try {
            const v = $gameVariables._data;

            return !!eval(code);
        } catch (e) {
            if ($gameTemp.isPlaytest()) console.error(e);
            return false;
        }
    }

    function readPriority(item) {
        const priority = item.meta['Priority'] || item.meta['優先度'];
        if (!priority) return 1;

        const value = parseInt(priority, 10);
        if (isNaN(value)) {
            if ($gameTemp.isPlaytest()) console.error(`優先度指定が間違っています: ${item}`);
            return 0;
        }
        return value;
    }

    class TalkSet {
        constructor(data) {
            this._data = this._parseMetaObjects(data);
        }

        _parseMetaObjects(data) {
            if (Array.isArray(data)) {
                data.forEach((item) => this._parseMetaObjects(item));
            } else if (typeof data === 'object') {
                Object.keys(data).forEach((key) => {
                    this._parseMetaObjects(data[key]);
                });
                DataManager.extractMetadata(data);
            }

            return data;
        }

        getTalkItem(type, options = {}) {
            let items = this._selectEnableItems(type, options);
            items = this._filterForAllItems(items, options);

            return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
        }

        _selectEnableItems(type, options) {
            switch (type) {
                case 'battleStart':
                    return this._selectEnableItemsForWithTroop('talkBattleStart', options);
                case 'victory':
                    return this._selectEnableItemsForWithTroop('talkVictory', options);
                case 'input':
                    return this._selectEnableItemsForWithTroop('talkInput', options);
                case 'dead':
                    return this._selectEnableItemsForWithTroop('talkDead', options);
                case 'damage':
                    return this._selectEnableItemsForWithFrom('talkDamage', options);
                case 'substitute':
                    return this._selectEnableItemsForWithFrom('talkSubstitute', options);
                case 'protected':
                    return this._selectEnableItemsForWithFrom('talkProtected', options);
                case 'recovery':
                    return this._selectEnableItemsForWithFrom('talkRecovery', options);
                case 'missed':
                    return this._selectEnableItemsForWithFrom('talkMissed', options);
                case 'evasion': {
                    const evasionItems = this._selectEnableItemsForWithFrom('talkEvasion', options);
                    return evasionItems.length > 0
                        ? evasionItems
                        : this._selectEnableItemsForWithFrom('talkMissed', options);
                }
                case 'counter':
                    return this._selectEnableItemsForWithFrom('talkCounter', options);
                case 'useSkill':
                    return this._selectEnableItemsForSkill('talkUseSkill', options);
                case 'useItem':
                    return this._selectEnableItemsForItem('talkUseItem', options);
                case 'removeState':
                    return this._selectEnableItemsForState('talkRemoveState', options);
            }

            return this._data.talkAdvanced.filter((item) => item.type === type);
        }

        _filterForAllItems(items, options) {
            items = this._filterCondition(items, options);
            items = this._filterPriority(items, options);

            return items;
        }

        _selectEnableItemsForWithTroop(key, options) {
            return this._filterTroopId(this._data[key] || [], options.troopId);
        }

        _selectEnableItemsForWithFrom(key, options) {
            return this._filterFrom(this._data[key] || [], options.from);
        }

        _selectEnableItemsForSkill(key, options) {
            let items = this._filterUsingSkill(this._data[key] || [], options.usingItem);
            items = this._filterTargets(items, options.targets);
            return items;
        }

        _selectEnableItemsForItem(key, options) {
            let items = this._filterUsingItem(this._data[key] || [], options.usingItem);
            items = this._filterTargets(items, options.targets);
            return items;
        }

        _selectEnableItemsForState(key, options) {
            let items = this._filterState(this._data[key] || [], options.state);
            items = this._filterFrom(items, options.from);
            return items;
        }

        _filterTroopId(items, troopId) {
            if (troopId) {
                const filtered = items.filter((item) => item.troopId === troopId);
                if (filtered.length > 0) return filtered;
            }

            return items.filter((item) => !item.troopId);
        }

        _filterFrom(items, from) {
            if (from) {
                if (from.isEnemy()) {
                    const enemyId = from.enemyId();
                    const filtered = items.filter((item) => item.enemyId === enemyId);
                    if (filtered.length > 0) return filtered;
                } else {
                    const actorId = from.actorId();
                    const filtered = items.filter((item) => item.actorId === actorId);
                    if (filtered.length > 0) return filtered;
                }
            }

            return items.filter((item) => !item.actorId && !item.enemyId);
        }

        _filterUsingSkill(items, usingSkill) {
            const skillId = usingSkill ? usingSkill.id : 0;
            if (skillId) {
                const filtered = items.filter((item) => item.skillId === skillId);
                if (filtered.length > 0) return filtered;
            }

            return items.filter((item) => !item.skillId);
        }

        _filterUsingItem(items, usingItem) {
            const itemId = usingItem ? usingItem.id : 0;
            if (itemId) {
                const filtered = items.filter((item) => item.itemId === itemId);
                if (filtered.length > 0) return filtered;
            }

            return items.filter((item) => !item.itemId);
        }

        _filterState(items, state) {
            const stateId = state ? state.id : 0;
            if (stateId) {
                const filtered = items.filter((item) => item.stateId === stateId);
                if (filtered.length > 0) return filtered;
            }

            return items.filter((item) => !item.stateId);
        }

        _filterTargets(items, targets) {
            if (targets && targets.length > 0) {
                for (const target of targets) {
                    if (target.isEnemy()) {
                        const enemyId = target.enemyId();
                        const filtered = items.filter((item) => item.enemyId === enemyId);
                        if (filtered.length > 0) return filtered;
                    } else {
                        const actorId = target.actorId();
                        const filtered = items.filter((item) => item.actorId === actorId);
                        if (filtered.length > 0) return filtered;
                    }
                }
            }

            return items.filter((item) => !item.actorId && !item.enemyId);
        }

        _filterCondition(items, options) {
            return items.filter((item) => {
                const str = item.meta['Condition'] || item.meta['条件'];
                if (!str) return true;

                return evalCondition(unescapeMetaString(str), options.subject, options);
            });
        }

        _filterPriority(items, _options) {
            const max = Math.max(...items.map((item) => readPriority(item)));
            return items.filter((item) => readPriority(item) === max);
        }
    }

    class TalkBuilder {
        build(item, options) {
            let message = item.message;
            message = this._replaceMessageReturn(message, item, options);
            message = this._replaceMessageTarget(message, item, options);
            message = this._replaceMessageFrom(message, item, options);
            message = this._replaceMessageSkill(message, item, options);
            return message;
        }

        _replaceMessageReturn(message, item, options) {
            return message.replace(/\\n/g, '\n');
        }

        _replaceMessageTarget(message, item, options) {
            return message.replace(/\\target/g, () => {
                if (!options.targets || options.targets.length === 0) return '';

                if (item.actorId || item.enemyId) {
                    for (const target of options.targets) {
                        if (target.isEnemy() && target.enemyId() === item.enemyId) {
                            return target.name();
                        } else if (target.actorId() === item.actorId) {
                            return target.name();
                        }
                    }
                }

                return options.targets[0].name();
            });
        }

        _replaceMessageFrom(message, item, options) {
            return message.replace(/\\(from)/g, () => {
                return options.from ? options.from.name() : '';
            });
        }

        _replaceMessageSkill(message, item, options) {
            return message.replace(/\\(skill|item)/g, () => {
                return options.usingItem ? options.usingItem.name : '';
            });
        }
    }

    Torigoya.BalloonInBattle = {
        name: getPluginName(),
        parameter: readParameter(),
        actorTalkSetId: [],
    };

    function shuffleActiveMember(members) {
        return arrayShuffle(members.filter((m) => m.canMove()));
    }

    function readTalkSetIdFromMeta(obj) {
        return (obj.meta['TalkSet'] || obj.meta['セリフセット'] || '').trim();
    }

    function readBalloonXFromMeta(obj) {
        const n = parseInt(obj.meta['BalloonX'] || obj.meta['セリフ位置X'] || 0, 10);
        return isNaN(n) ? 0 : n;
    }

    function readBalloonYFromMeta(obj) {
        const n = parseInt(obj.meta['BalloonY'] || obj.meta['セリフ位置Y'] || 0, 10);
        return isNaN(n) ? 0 : n;
    }

    Torigoya.BalloonInBattle.TalkBuilder = new TalkBuilder();

    (() => {
        const talkSetCache = new Map();

        function getTalkSet(talkSetId) {
            if (!talkSetCache.has(talkSetId)) {
                const config = Torigoya.BalloonInBattle.parameter.talkConfig.find((config) => config.id === talkSetId);
                talkSetCache.set(talkSetId, config ? new TalkSet(config) : null);
            }
            return talkSetCache.get(talkSetId);
        }
        // --------------------------------------------------------------------------
        // Game_Battler

        const battlerParameter = new WeakMap();

        Game_Battler.prototype.torigoyaBalloonInBattle_getTalkSet = function () {
            return null;
        };

        Game_Battler.prototype.torigoyaBalloonInBattle_getParam = function () {
            if (!battlerParameter.has(this)) battlerParameter.set(this, {});
            return battlerParameter.get(this);
        };

        Game_Battler.prototype.torigoyaBalloonInBattle_requestMessage = function (type, options = {}) {
            const talkSet = this.torigoyaBalloonInBattle_getTalkSet();
            if (!talkSet) return;

            const params = this.torigoyaBalloonInBattle_getParam();
            if (params.type === type) return;

            // 同一フレームでの優先度が低いものは採用されない
            if ((options.priority || 0) < ((params.options || {}).priority || 0)) return;

            options['subject'] = this;
            options['troopId'] = $gameTroop._troopId;

            const item = talkSet.getTalkItem(type, options);
            if (!item) return false;

            // メッセージ生成。メッセージが空文字の場合はスキップ
            const message = Torigoya.BalloonInBattle.TalkBuilder.build(item, options);
            if (!message) return false;

            options['talkItem'] = item;

            this.torigoyaBalloonInBattle_setMessageParameter(type, message, options);

            return true;
        };

        Game_Battler.prototype.torigoyaBalloonInBattle_clearMessage = function () {
            this.torigoyaBalloonInBattle_setMessageParameter('', '');
        };

        Game_Battler.prototype.torigoyaBalloonInBattle_closeMessage = function () {
            this.torigoyaBalloonInBattle_setMessageParameter('close', '');
        };

        Game_Battler.prototype.torigoyaBalloonInBattle_setMessageParameter = function (type, message, options = {}) {
            const params = this.torigoyaBalloonInBattle_getParam();
            params.type = type;
            params.message = message;
            params.options = options || {};
        };

        // 戦闘不能時
        wrap(Game_Battler.prototype, 'performCollapse', function (self, originalFunc) {
            originalFunc();

            this.torigoyaBalloonInBattle_requestMessage('dead', {});
        });

        // --------------------------------------------------------------------------
        // Game_Actor

        Game_Actor.prototype.torigoyaBalloonInBattle_getTalkSet = function () {
            const actor = this.actor();
            if (!actor) return null;

            // プラグインコマンドによる設定値
            const overrideTalkSetId = Torigoya.BalloonInBattle.actorTalkSetId[actor.id];
            if (overrideTalkSetId) return getTalkSet(overrideTalkSetId);

            // メモ欄（デフォルト値）
            const talkSetId = readTalkSetIdFromMeta(actor);
            return talkSetId ? getTalkSet(talkSetId) : null;
        };

        // --------------------------------------------------------------------------
        // Game_Enemy

        Game_Enemy.prototype.torigoyaBalloonInBattle_getTalkSet = function () {
            const enemy = this.enemy();
            if (!enemy) return null;
            const talkSetId = readTalkSetIdFromMeta(enemy);
            return talkSetId ? getTalkSet(talkSetId) : null;
        };

        // --------------------------------------------------------------------------
        // Sprite_Battler

        Sprite_Battler.prototype.torigoyaBalloonInBattle_balloonX = function () {
            return 0;
        };

        Sprite_Battler.prototype.torigoyaBalloonInBattle_balloonY = function () {
            return 0;
        };

        // --------------------------------------------------------------------------
        // Sprite_Actor

        Sprite_Actor.prototype.torigoyaBalloonInBattle_balloonX = function () {
            const actor = this._actor ? this._actor.actor() : null;
            const x = actor ? readBalloonXFromMeta(actor) : 0;
            return x + Torigoya.BalloonInBattle.parameter.balloonActorX;
        };

        Sprite_Actor.prototype.torigoyaBalloonInBattle_balloonY = function () {
            const bitmapHeight = this._frame.height * this.scale.y;
            const actor = this._actor ? this._actor.actor() : null;
            const y = actor ? readBalloonYFromMeta(actor) : 0;
            return -bitmapHeight + y + Torigoya.BalloonInBattle.parameter.balloonActorY;
        };

        // --------------------------------------------------------------------------
        // Sprite_Enemy

        Sprite_Enemy.prototype.torigoyaBalloonInBattle_balloonX = function () {
            const enemy = this._enemy ? this._enemy.enemy() : null;
            const x = enemy ? readBalloonXFromMeta(enemy) : 0;
            return x + Torigoya.BalloonInBattle.parameter.balloonEnemyX;
        };

        Sprite_Enemy.prototype.torigoyaBalloonInBattle_balloonY = function () {
            const bitmapHeight = (this.bitmap ? this.bitmap.height : 0) * this.scale.y;
            const enemy = this._enemy ? this._enemy.enemy() : null;
            const y = enemy ? readBalloonYFromMeta(enemy) : 0;
            return -bitmapHeight + y + Torigoya.BalloonInBattle.parameter.balloonEnemyY;
        };

        // --------------------------------------------------------------------------
        // Window_BattleLog

        wrap(Window_BattleLog.prototype, 'displayActionResults', function (self, originalFunc, subject, target) {
            originalFunc(subject, target);

            const result = target.result();
            if (result.used && subject !== target) {
                self.torigoyaBalloonInBattle_checkTalk(subject, target, result);
            }
        });

        Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalk = function (subject, target, result) {
            if (this.torigoyaBalloonInBattle_checkTalkForMissed(subject, target, result)) return true;
            if (this.torigoyaBalloonInBattle_checkTalkForEvasion(subject, target, result)) return true;
            if (this.torigoyaBalloonInBattle_checkTalkForRemoveState(subject, target, result)) return true;
            if (this.torigoyaBalloonInBattle_checkTalkForDamage(subject, target, result)) return true;
            if (this.torigoyaBalloonInBattle_checkTalkForRecovery(subject, target, result)) return true;

            return false;
        };

        // ミス
        Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForMissed = function (subject, target, result) {
            if (!target.canMove()) return false;
            if (!result.missed) return false;

            return target.torigoyaBalloonInBattle_requestMessage('missed', {
                from: subject,
                lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
            });
        };

        // 回避
        Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForEvasion = function (subject, target, result) {
            if (!target.canMove()) return false;
            if (!result.evaded) return false;

            return target.torigoyaBalloonInBattle_requestMessage('evasion', {
                from: subject,
                lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
            });
        };

        // ステート回復よる表示
        Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForRemoveState = function (
            subject,
            target,
            result,
        ) {
            if (!target.canMove()) return false;
            if (!target.result().isStatusAffected()) return false;

            // 敵対する相手に回復された場合はスキップ
            if (subject.isEnemy() !== target.isEnemy()) return false;

            const states = target.result().removedStateObjects();
            for (const state of states) {
                if (
                    target.torigoyaBalloonInBattle_requestMessage('removeState', {
                        from: subject,
                        lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
                        state: state,
                    })
                )
                    return true;
            }

            return false;
        };

        // ダメージによる表示
        Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForDamage = function (subject, target, result) {
            if (!target.canMove()) return false;
            if (result.hpDamage <= 0 && result.mpDamage <= 0 && result.tpDamage <= 0) return false;

            // 味方に攻撃された場合はスキップ
            if (subject.isEnemy() === target.isEnemy()) return false;

            return target.torigoyaBalloonInBattle_requestMessage('damage', {
                from: subject,
                lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
            });
        };

        // HP回復による表示
        Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForRecovery = function (subject, target, result) {
            if (!target.canMove()) return false;
            if (result.hpDamage >= 0 && result.mpDamage >= 0 && result.tpDamage >= 0) return false;

            // 敵対する相手に回復された場合はスキップ
            if (subject.isEnemy() !== target.isEnemy()) return false;

            return target.torigoyaBalloonInBattle_requestMessage('recovery', {
                from: subject,
                lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
            });
        };

        // --------------------------------------------------------------------------
        // BattleManager

        // 行動選択: 開始
        wrap(BattleManager, 'startActorInput', function (self, originalFunc) {
            originalFunc();

            if (this._currentActor) {
                this._currentActor.torigoyaBalloonInBattle_requestMessage('input', {
                    lifeTime: Torigoya.BalloonInBattle.parameter.advancedInputLifeTime,
                });
            }
        });

        // 行動選択: 終了
        wrap(BattleManager, 'changeCurrentActor', function (self, originalFunc, forward) {
            if (this._currentActor) {
                this._currentActor.torigoyaBalloonInBattle_closeMessage();
            }
            originalFunc(forward);
        });

        // スキル・アイテム
        wrap(BattleManager, 'startAction', function (self, originalFunc) {
            const subject = self._subject;
            const action = subject.currentAction();
            originalFunc();

            if (action.isSkill()) {
                subject.torigoyaBalloonInBattle_requestMessage('useSkill', {
                    targets: self._targets,
                    from: subject,
                    usingItem: action.item(),
                });
            } else if (action.isItem()) {
                subject.torigoyaBalloonInBattle_requestMessage('useItem', {
                    targets: self._targets,
                    from: subject,
                    usingItem: action.item(),
                });
            }
        });

        // 身代わり
        wrap(BattleManager, 'applySubstitute', function (_self, originalFunc, target) {
            const realTarget = originalFunc(target);

            if (target !== realTarget) {
                if (target.canMove())
                    target.torigoyaBalloonInBattle_requestMessage('protected', {
                        from: realTarget,
                        priority: 1,
                    });
                if (realTarget.canMove())
                    realTarget.torigoyaBalloonInBattle_requestMessage('substitute', {
                        to: target,
                        priority: 1,
                    });
            }

            return realTarget;
        });

        // カウンター
        wrap(BattleManager, 'invokeCounterAttack', function (_self, originalFunc, subject, target) {
            originalFunc(subject, target);

            if (target.canMove()) {
                target.torigoyaBalloonInBattle_requestMessage('counter', {
                    targets: [subject],
                    priority: 1,
                });
            }
        });

        // 魔法反射
        wrap(BattleManager, 'invokeMagicReflection', function (_self, originalFunc, subject, target) {
            originalFunc(subject, target);

            if (subject.canMove()) {
                subject.torigoyaBalloonInBattle_requestMessage('counter', {
                    targets: [target],
                    priority: 1,
                });
            }
        });

        wrap(BattleManager, 'startBattle', function (self, originalFunc) {
            self.torigoyaBalloonInBattle_talkStartBattleParty();
            self.torigoyaBalloonInBattle_talkStartBattleTroop();
            originalFunc();
        });

        BattleManager.torigoyaBalloonInBattle_talkStartBattleParty = function () {
            const actors = shuffleActiveMember($gameParty.battleMembers());
            for (const actor of actors) {
                if (actor.torigoyaBalloonInBattle_requestMessage('battleStart')) return;
            }
        };

        BattleManager.torigoyaBalloonInBattle_talkStartBattleTroop = function () {
            const enemies = shuffleActiveMember($gameTroop.members());
            for (const enemy of enemies) {
                if (enemy.torigoyaBalloonInBattle_requestMessage('battleStart')) return;
            }
        };

        wrap(BattleManager, 'processVictory', function (self, originalFunc) {
            self.torigoyaBalloonInBattle_talkVictory();
            originalFunc();
        });

        BattleManager.torigoyaBalloonInBattle_talkVictory = function () {
            const actors = shuffleActiveMember($gameParty.members());
            for (const actor of actors) {
                if (
                    actor.torigoyaBalloonInBattle_requestMessage('victory', {
                        lifeTime: Torigoya.BalloonInBattle.parameter.advancedVictoryLifeTime,
                    })
                )
                    return;
            }
        };

        wrap(BattleManager, 'processDefeat', function (self, originalFunc) {
            self.torigoyaBalloonInBattle_talkDefeat();
            originalFunc();
        });

        BattleManager.torigoyaBalloonInBattle_talkDefeat = function () {
            const enemies = shuffleActiveMember($gameTroop.members());
            for (const enemy of enemies) {
                if (
                    enemy.torigoyaBalloonInBattle_requestMessage('victory', {
                        lifeTime: Torigoya.BalloonInBattle.parameter.advancedVictoryLifeTime,
                    })
                )
                    return;
            }
        };

        wrap(BattleManager, 'endAction', function (self, originalFunc) {
            self.torigoyaBalloonInBattle_lastActionSubject = self._subject;
            originalFunc();
        });

        wrap(BattleManager, 'endTurn', function (self, originalFunc) {
            delete self.torigoyaBalloonInBattle_lastActionSubject;
            originalFunc();
        });

        wrap(BattleManager, 'endBattle', function (self, originalFunc, result) {
            delete self.torigoyaBalloonInBattle_lastActionSubject;
            originalFunc(result);
        });

        // --------------------------------------------------------------------------
        // Scene_Battle

        switch (Torigoya.BalloonInBattle.parameter.advancedLayerPosition) {
            case 'overlayWindow': {
                wrap(Scene_Battle.prototype, 'createWindowLayer', function (self, originalFunc) {
                    originalFunc();
                    self.torigoyaBalloonInBattle_createActorBalloons();
                    self.torigoyaBalloonInBattle_createEnemyBalloons();
                });
                break;
            }
            case 'default':
            default: {
                wrap(Scene_Battle.prototype, 'createWindowLayer', function (self, originalFunc) {
                    self.torigoyaBalloonInBattle_createActorBalloons();
                    self.torigoyaBalloonInBattle_createEnemyBalloons();
                    originalFunc();
                });
            }
        }

        Scene_Battle.prototype.torigoyaBalloonInBattle_createActorBalloons = function () {
            this._torigoyaBalloonInBattle_actorBalloonLayer = new Sprite();
            this.addChild(this._torigoyaBalloonInBattle_actorBalloonLayer);

            this._spriteset._actorSprites.forEach((actorSprite) => {
                const win = new Window_BattleBalloon();
                this._torigoyaBalloonInBattle_actorBalloonLayer.addChild(win);
                win.setBattlerSprite(actorSprite);
            });
        };

        Scene_Battle.prototype.torigoyaBalloonInBattle_createEnemyBalloons = function () {
            this._torigoyaBalloonInBattle_enemyBalloonLayer = new Sprite();
            this.addChild(this._torigoyaBalloonInBattle_enemyBalloonLayer);

            this._spriteset._enemySprites.forEach((enemySprite) => {
                const win = new Window_BattleBalloon();
                this._torigoyaBalloonInBattle_enemyBalloonLayer.addChild(win);
                win.setBattlerSprite(enemySprite);
            });
        };

        // --------------------------------------------------------------------------
        // Scene_Boot

        wrap(Scene_Boot.prototype, 'loadSystemImages', function (self, originalFunc) {
            originalFunc();
            ImageManager.loadSystem(Torigoya.BalloonInBattle.parameter.balloonImage);
        });

        // --------------------------------------------------------------------------
        // DataManager

        const SAVE_KEY = 'torigoyaBalloonInBattle_actorTalkSetId';

        wrap(DataManager, 'createGameObjects', function (self, originalFunc) {
            originalFunc();
            Torigoya.BalloonInBattle.actorTalkSetId = [];
        });

        wrap(DataManager, 'makeSaveContents', function (self, originalFunc) {
            const contents = originalFunc();
            contents[SAVE_KEY] = Torigoya.BalloonInBattle.actorTalkSetId;
            return contents;
        });

        wrap(DataManager, 'extractSaveContents', function (self, originalFunc, contents) {
            originalFunc(contents);
            Torigoya.BalloonInBattle.actorTalkSetId = contents[SAVE_KEY] || [];
        });

        // --------------------------------------------------------------------------
        // プラグインコマンド

        function commandChangeTalkSetId({ actorId, talkSetId }) {
            actorId = parseInt(actorId || '0', 10);
            talkSetId = `${talkSetId || ''}`.trim();
            const talkSet = getTalkSet(talkSetId);
            if (!talkSet) {
                if ($gameTemp.isPlaytest()) {
                    console.error(`talkSet: ${talkSetId} is not found`);
                }
                return;
            }

            Torigoya.BalloonInBattle.actorTalkSetId[actorId] = talkSetId;
        }

        function commandResetTalkSetId({ actorId }) {
            actorId = parseInt(actorId || '0', 10);
            if (!actorId) return;
            delete Torigoya.BalloonInBattle.actorTalkSetId[actorId];
        }

        function pickActor(actorId) {
            if (!$gameParty.inBattle()) return null;

            actorId = parseInt(actorId || '0', 10);
            const subject =
                actorId > 0
                    ? $gameParty.battleMembers().find((actor) => actor.actorId() === actorId)
                    : BattleManager._subject || BattleManager.torigoyaBalloonInBattle_lastActionSubject;

            return subject && subject.isActor() ? subject : null;
        }

        function commandTalkActorByType({ actorId, type }) {
            const subject = pickActor(actorId);
            if (!subject) return;

            subject.torigoyaBalloonInBattle_requestMessage(type);
        }

        function commandTalkActorByText({ actorId, text }) {
            const subject = pickActor(actorId);
            if (!subject) return;

            text = text.replace(/\\n/g, '\n');

            subject.torigoyaBalloonInBattle_setMessageParameter(`manualMessage-${Date.now()}`, text);
        }

        function pickEnemy(enemyIndex) {
            if (!$gameParty.inBattle()) return null;

            enemyIndex = parseInt(enemyIndex || '0', 10);
            const subject =
                enemyIndex > 0
                    ? $gameTroop.members().find((enemy) => enemy.index() === enemyIndex - 1)
                    : BattleManager._subject || BattleManager.torigoyaBalloonInBattle_lastActionSubject;
            return subject && subject.isEnemy() ? subject : null;
        }

        function commandTalkEnemyByType({ enemyIndex, type }) {
            const subject = pickEnemy(enemyIndex);
            if (!subject) return;

            subject.torigoyaBalloonInBattle_requestMessage(type);
        }

        function commandTalkEnemyByText({ enemyIndex, text }) {
            const subject = pickEnemy(enemyIndex);
            if (!subject) return;

            text = text.replace(/\\n/g, '\n');

            subject.torigoyaBalloonInBattle_setMessageParameter(`manualMessage-${Date.now()}`, text);
        }

        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'changeTalkSet', commandChangeTalkSetId);
        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'resetTalkSet', commandResetTalkSetId);
        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkActorByType', commandTalkActorByType);
        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkActorByText', commandTalkActorByText);
        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkEnemyByType', commandTalkEnemyByType);
        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkEnemyByText', commandTalkEnemyByText);
    })();
})();
