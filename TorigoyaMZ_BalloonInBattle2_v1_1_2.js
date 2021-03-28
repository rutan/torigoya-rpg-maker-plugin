/*---------------------------------------------------------------------------*
 * TorigoyaMZ_BalloonInBattle2.js v.1.1.2
 *---------------------------------------------------------------------------*
 * 2021/03/28 21:34 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 戦闘中セリフ表示プラグイン (v.1.1.2)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.1.2
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_BalloonInBattle2.js
 * @orderBefore TorigoyaMZ_DisplayAnimationInFrontView
 * @help
 * 戦闘中セリフ表示プラグイン (v.1.1.2)
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
 * このプラグインだけ使う場合は特に必要ないから無視して大丈夫だよ。
 * 他のプラグインから、このプラグインの機能を拡張するために使う欄です。
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
 * ● 吹き出しの位置(高さ)を調整する
 * アクターやエネミーのメモ欄に以下のように記述することで
 * 吹き出しの位置を変えることができます。
 *
 * <セリフ位置Y: -50>
 *
 * マイナスの値を指定すると上方向に動きます。
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
 * @param base
 * @text ■ 基本設定
 *
 * @param talkConfig
 * @text セリフセットの登録
 * @type struct<TalkSet>[]
 * @parent base
 * @default []
 *
 * @param balloon
 * @text ■ 表示設定
 *
 * @param balloonImage
 * @text 吹き出し用の画像
 * @desc 吹き出しに使用するウィンドウ画像を指定します
 * @type file
 * @require true
 * @parent balloon
 * @dir img/system
 * @default Window
 *
 * @param balloonFontSize
 * @text 文字サイズ
 * @desc セリフの文字のサイズの標準値を指定します
 * @type number
 * @parent balloon
 * @min 1
 * @default 22
 *
 * @param balloonPadding
 * @text ウィンドウの余白
 * @desc 吹き出しの余白の大きさを指定します
 * @type number
 * @parent balloon
 * @min 0
 * @default 8
 *
 * @param balloonTail
 * @text ウィンドウのしっぽ
 * @desc しっぽ部分を表示するかどうか
 * @type boolean
 * @parent balloon
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param balloonTailY
 * @text しっぽの位置調整
 * @desc しっぽ用の表示位置(高さ)を調整します
 * マイナスにすると上に移動します
 * @type number
 * @parent balloon
 * @min -10000
 * @max 10000
 * @default 4
 *
 * @param balloonActorY
 * @text 味方吹き出しの位置調整
 * @desc 味方側の吹き出しの表示位置(高さ)を調整します
 * マイナスにすると上に移動します
 * @type number
 * @parent balloon
 * @min -10000
 * @max 10000
 * @default 0
 *
 * @param balloonEnemyY
 * @text 敵の吹き出しの位置調整
 * @desc 敵側の吹き出しの表示位置(高さ)を調整します
 * マイナスにすると上に移動します
 * @type number
 * @parent balloon
 * @min -10000
 * @max 10000
 * @default 0
 *
 * @param advanced
 * @text ■ 上級者設定
 *
 * @param advancedLifeTime
 * @text 表示時間：通常
 * @desc 通常のセリフの表示時間（ウェイト）を指定します
 * 60＝1秒です
 * @type number
 * @parent advanced
 * @min -1
 * @default 90
 *
 * @param advancedDamageLifeTime
 * @text 表示時間：被ダメ
 * @desc 被ダメージ系セリフの表示時間（ウェイト）を指定します
 * 60＝1秒です
 * @type number
 * @parent advanced
 * @min -1
 * @default 30
 *
 * @param advancedInputLifeTime
 * @text 表示時間：行動選択
 * @desc 行動選択セリフの表示時間（ウェイト）を指定します
 * 60＝1秒です。-1の場合は別のセリフが出るまで消えません。
 * @type number
 * @parent advanced
 * @min -1
 * @default -1
 *
 * @param advancedVictoryLifeTime
 * @text 表示時間：勝利
 * @desc 行動選択セリフの表示時間（ウェイト）を指定します
 * 60＝1秒です。-1の場合は別のセリフが出るまで消えません。
 * @type number
 * @parent advanced
 * @min -1
 * @default -1
 *
 * @command changeTalkSet
 * @text セリフセットの変更
 * @desc セリフセットを別のものに変更します
 * 変更内容はセーブデータに反映されます
 *
 * @arg actorId
 * @text アクター
 * @desc セリフセットを変更するアクター
 * @type actor
 * @default 0
 *
 * @arg talkSetId
 * @text セリフセットID
 * @desc 変更後のセリフセットのID
 * プラグイン設定で登録したものを指定してください
 * @type string
 * @default
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
 */

/*~struct~TalkSet:
 * @param id
 * @text セリフセットID
 * @desc このセリフセットのIDを設定します(重複×)
 * このIDをアクターのメモ欄で使用します
 * @type string
 * @default
 *
 * @param talk
 * @text ■ セリフ
 *
 * @param talkBattleStart
 * @text [セリフ] 戦闘開始
 * @desc 戦闘開始時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithTroop>[]
 * @parent talk
 *
 * @param talkVictory
 * @text [セリフ] 勝利
 * @desc 戦闘勝利時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithTroop>[]
 * @parent talk
 *
 * @param talkInput
 * @text [セリフ] 行動選択中
 * @desc 行動選択時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithTroop>[]
 * @parent talk
 *
 * @param talkUseSkill
 * @text [セリフ] スキル
 * @desc スキル使用時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemForSkill>[]
 * @parent talk
 *
 * @param talkUseItem
 * @text [セリフ] アイテム
 * @desc アイテム使用時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemForItem>[]
 * @parent talk
 *
 * @param talkDamage
 * @text [セリフ] ダメージ
 * @desc ダメージを受けた時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithFrom>[]
 * @parent talk
 *
 * @param talkDead
 * @text [セリフ] 戦闘不能
 * @desc 戦闘不能時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithTroop>[]
 * @parent talk
 *
 * @param talkSubstitute
 * @text [セリフ] 身代わりした
 * @desc 味方を身代わりした時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithFrom>[]
 * @parent talk
 *
 * @param talkProtected
 * @text [セリフ] 身代わりされた
 * @desc 味方に身代わりされた時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithFrom>[]
 * @parent talk
 *
 * @param talkRecovery
 * @text [セリフ] 回復
 * @desc 味方に回復された時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithFrom>[]
 * @parent talk
 *
 * @param talkRemoveState
 * @text [セリフ] ステート回復
 * @desc 味方にステートを回復された時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemForState>[]
 * @parent talk
 *
 * @param talkMissed
 * @text [セリフ] 敵攻撃がミス
 * @desc 敵の攻撃がミス時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithFrom>[]
 * @parent talk
 *
 * @param talkEvasion
 * @text [セリフ] 敵攻撃を回避
 * @desc 敵の攻撃回避時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithFrom>[]
 * @parent talk
 *
 * @param talkCounter
 * @text [セリフ] カウンター
 * @desc 敵にカウンター時に表示するセリフを登録します
 * 複数登録時はどれか1つがランダムに表示されます
 * @type struct<TalkItemWithFrom>[]
 * @parent talk
 *
 * @param advanced
 * @text ■ 拡張用
 *
 * @param talkAdvanced
 * @text 拡張データ
 * @desc 拡張用データです。通常利用では設定は不要です。
 * アドオンプラグイン等から利用されます。
 * @type struct<TalkItemAdvanced>[]
 * @parent advanced
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 * @default
 */

/*~struct~TalkItemWithTroop:
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください
 * \n で改行ができます
 * @type string
 * @default
 *
 * @param optional
 * @text ■ オプション
 *
 * @param troopId
 * @text 対象のトループ
 * @desc この戦闘でしか使用したくない！
 * という場合は指定してください
 * @type troop
 * @parent optional
 * @default 0
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 * @default
 */

/*~struct~TalkItemWithFrom:
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください
 * \n で改行ができます
 * @type string
 * @default
 *
 * @param optional
 * @text ■ オプション
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方からの時にしか使いたくない！
 * という場合は指定してください
 * @type actor
 * @parent optional
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵から時にしか使いたくない！
 * という場合は指定してください
 * @type enemy
 * @parent optional
 * @default 0
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 * @default
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
 * @desc 表示するセリフを入力してください
 * \n : 改行   \skill : スキル名
 * @type string
 * @default
 *
 * @param optional
 * @text ■ オプション
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @type actor
 * @parent optional
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @type enemy
 * @parent optional
 * @default 0
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 * @default
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
 * @desc 表示するセリフを入力してください
 * \n : 改行   \item : アイテム名
 * @type string
 * @default
 *
 * @param optional
 * @text ■ オプション
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @type actor
 * @parent optional
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵がターゲットの時にしか使いたくない！
 * という場合は指定してください
 * @type enemy
 * @parent optional
 * @default 0
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 * @default
 */

/*~struct~TalkItemForState:
 * @param stateId
 * @text ステートのID
 * @desc このセリフを出すステートを選択します。
 * なしの場合は未設定のアイテムで使用します。
 * @type state
 * @default 0
 *
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください
 * \n で改行ができます
 * @type string
 * @default
 *
 * @param optional
 * @text ■ オプション
 *
 * @param actorId
 * @text 対象の相手(味方)
 * @desc この味方からの時にしか使いたくない！
 * という場合は指定してください
 * @type actor
 * @parent optional
 * @default 0
 *
 * @param enemyId
 * @text 対象の相手(敵)
 * @desc この敵から時にしか使いたくない！
 * という場合は指定してください
 * @type enemy
 * @parent optional
 * @default 0
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 * @default
 */

/*~struct~TalkItemAdvanced:
 * @param type
 * @text 拡張タイプ
 * @desc このセリフの拡張タイプIDを指定します
 * @type string
 * @default
 *
 * @param message
 * @text セリフ
 * @desc 表示するセリフを入力してください
 * \n で改行ができます
 * @type string
 * @default
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type multiline_string
 * @default
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_BalloonInBattle2';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return ''.concat(parameter[key] || '');
    }

    function pickIntegerValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseInt(parameter[key], 10);
    }

    function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
        return ''.concat(parameter[key] || defaultValue) === 'true';
    }

    function pickStructTalkSet(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            id: pickStringValueFromParameter(parameter, 'id', ''),
            talkBattleStart: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithTroop(parameter);
                });
            })(parameter.talkBattleStart),
            talkVictory: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithTroop(parameter);
                });
            })(parameter.talkVictory),
            talkInput: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithTroop(parameter);
                });
            })(parameter.talkInput),
            talkUseSkill: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemForSkill(parameter);
                });
            })(parameter.talkUseSkill),
            talkUseItem: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemForItem(parameter);
                });
            })(parameter.talkUseItem),
            talkDamage: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithFrom(parameter);
                });
            })(parameter.talkDamage),
            talkDead: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithTroop(parameter);
                });
            })(parameter.talkDead),
            talkSubstitute: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithFrom(parameter);
                });
            })(parameter.talkSubstitute),
            talkProtected: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithFrom(parameter);
                });
            })(parameter.talkProtected),
            talkRecovery: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithFrom(parameter);
                });
            })(parameter.talkRecovery),
            talkRemoveState: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemForState(parameter);
                });
            })(parameter.talkRemoveState),
            talkMissed: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithFrom(parameter);
                });
            })(parameter.talkMissed),
            talkEvasion: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithFrom(parameter);
                });
            })(parameter.talkEvasion),
            talkCounter: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemWithFrom(parameter);
                });
            })(parameter.talkCounter),
            talkAdvanced: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkItemAdvanced(parameter);
                });
            })(parameter.talkAdvanced),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function pickStructTalkItemWithTroop(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            message: pickStringValueFromParameter(parameter, 'message', ''),
            troopId: pickIntegerValueFromParameter(parameter, 'troopId', 0),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function pickStructTalkItemWithFrom(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            message: pickStringValueFromParameter(parameter, 'message', ''),
            actorId: pickIntegerValueFromParameter(parameter, 'actorId', 0),
            enemyId: pickIntegerValueFromParameter(parameter, 'enemyId', 0),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function pickStructTalkItemForSkill(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            skillId: pickIntegerValueFromParameter(parameter, 'skillId', 0),
            message: pickStringValueFromParameter(parameter, 'message', ''),
            actorId: pickIntegerValueFromParameter(parameter, 'actorId', 0),
            enemyId: pickIntegerValueFromParameter(parameter, 'enemyId', 0),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function pickStructTalkItemForItem(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            itemId: pickIntegerValueFromParameter(parameter, 'itemId', 0),
            message: pickStringValueFromParameter(parameter, 'message', ''),
            actorId: pickIntegerValueFromParameter(parameter, 'actorId', 0),
            enemyId: pickIntegerValueFromParameter(parameter, 'enemyId', 0),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function pickStructTalkItemForState(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            stateId: pickIntegerValueFromParameter(parameter, 'stateId', 0),
            message: pickStringValueFromParameter(parameter, 'message', ''),
            actorId: pickIntegerValueFromParameter(parameter, 'actorId', 0),
            enemyId: pickIntegerValueFromParameter(parameter, 'enemyId', 0),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function pickStructTalkItemAdvanced(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            type: pickStringValueFromParameter(parameter, 'type', ''),
            message: pickStringValueFromParameter(parameter, 'message', ''),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.2',
            talkConfig: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructTalkSet(parameter);
                });
            })(parameter.talkConfig),
            balloonImage: pickStringValueFromParameter(parameter, 'balloonImage', 'Window'),
            balloonFontSize: pickIntegerValueFromParameter(parameter, 'balloonFontSize', 22),
            balloonPadding: pickIntegerValueFromParameter(parameter, 'balloonPadding', 8),
            balloonTail: pickBooleanValueFromParameter(parameter, 'balloonTail', true),
            balloonTailY: pickIntegerValueFromParameter(parameter, 'balloonTailY', 4),
            balloonActorY: pickIntegerValueFromParameter(parameter, 'balloonActorY', 0),
            balloonEnemyY: pickIntegerValueFromParameter(parameter, 'balloonEnemyY', 0),
            advancedLifeTime: pickIntegerValueFromParameter(parameter, 'advancedLifeTime', 90),
            advancedDamageLifeTime: pickIntegerValueFromParameter(parameter, 'advancedDamageLifeTime', 30),
            advancedInputLifeTime: pickIntegerValueFromParameter(parameter, 'advancedInputLifeTime', -1),
            advancedVictoryLifeTime: pickIntegerValueFromParameter(parameter, 'advancedVictoryLifeTime', -1),
        };
    }

    function arrayShuffle(array) {
        for (let i = array.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = array[i];
            array[i] = array[j];
            array[j] = t;
        }
        return array;
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
            this.close();
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

        showMessage(message) {
            if (this._message === message) return;
            this._message = message;
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
                    this.showMessage(params.message);
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
            const battlerX = this._battlerPosition.x;
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

    function unescapeMetaString(string) {
        return ''
            .concat(string || '')
            .trim()
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    function evalCondition(a, code) {
        try {
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
            if ($gameTemp.isPlaytest())
                console.error(
                    '\u512A\u5148\u5EA6\u6307\u5B9A\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059: '.concat(item)
                );
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

            return [];
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

                return evalCondition(options.subject, unescapeMetaString(str));
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
        const upstream_Game_Battler_performCollapse = Game_Battler.prototype.performCollapse;
        Game_Battler.prototype.performCollapse = function () {
            upstream_Game_Battler_performCollapse.apply(this);

            this.torigoyaBalloonInBattle_requestMessage('dead', {});
        };

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

        Sprite_Battler.prototype.torigoyaBalloonInBattle_balloonY = function () {
            return 0;
        };

        // --------------------------------------------------------------------------
        // Sprite_Actor

        Sprite_Actor.prototype.torigoyaBalloonInBattle_balloonY = function () {
            const bitmapHeight = this._frame.height;
            const actor = this._actor ? this._actor.actor() : null;
            const y = actor ? readBalloonYFromMeta(actor) : 0;
            return -bitmapHeight + y + Torigoya.BalloonInBattle.parameter.balloonActorY;
        };

        // --------------------------------------------------------------------------
        // Sprite_Enemy

        Sprite_Enemy.prototype.torigoyaBalloonInBattle_balloonY = function () {
            const bitmapHeight = this.bitmap ? this.bitmap.height : 0;
            const enemy = this._enemy ? this._enemy.enemy() : null;
            const y = enemy ? readBalloonYFromMeta(enemy) : 0;
            return -bitmapHeight + y + Torigoya.BalloonInBattle.parameter.balloonEnemyY;
        };

        // --------------------------------------------------------------------------
        // Window_BattleLog

        const upstream_Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
        Window_BattleLog.prototype.displayActionResults = function (subject, target) {
            upstream_Window_BattleLog_displayActionResults.apply(this, arguments);

            const result = target.result();
            if (result.used && subject !== target) {
                this.torigoyaBalloonInBattle_checkTalk(subject, target, result);
            }
        };

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
            result
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
        const upstream_BattleManager_startActorInput = BattleManager.startActorInput;
        BattleManager.startActorInput = function () {
            upstream_BattleManager_startActorInput.apply(this);

            if (this._currentActor) {
                this._currentActor.torigoyaBalloonInBattle_requestMessage('input', {
                    lifeTime: Torigoya.BalloonInBattle.parameter.advancedInputLifeTime,
                });
            }
        };

        // 行動選択: 終了
        const upstream_BattleManager_changeCurrentActor = BattleManager.changeCurrentActor;
        BattleManager.changeCurrentActor = function (forward) {
            if (this._currentActor) {
                this._currentActor.torigoyaBalloonInBattle_closeMessage();
            }
            upstream_BattleManager_changeCurrentActor.apply(this, arguments);
        };

        // スキル・アイテム
        const upstream_BattleManager_startAction = BattleManager.startAction;
        BattleManager.startAction = function () {
            const subject = this._subject;
            const action = subject.currentAction();
            upstream_BattleManager_startAction.apply(this);

            if (action.isSkill()) {
                subject.torigoyaBalloonInBattle_requestMessage('useSkill', {
                    targets: this._targets,
                    from: subject,
                    usingItem: action.item(),
                });
            } else if (action.isItem()) {
                subject.torigoyaBalloonInBattle_requestMessage('useItem', {
                    targets: this._targets,
                    from: subject,
                    usingItem: action.item(),
                });
            }
        };

        // 身代わり
        const upstream_BattleManager_applySubstitute = BattleManager.applySubstitute;
        BattleManager.applySubstitute = function (target) {
            const realTarget = upstream_BattleManager_applySubstitute.apply(this, arguments);

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
        };

        // カウンター
        const upstream_BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
        BattleManager.invokeCounterAttack = function (subject, target) {
            upstream_BattleManager_invokeCounterAttack.apply(this, arguments);

            if (target.canMove()) {
                target.torigoyaBalloonInBattle_requestMessage('counter', {
                    targets: [subject],
                    priority: 1,
                });
            }
        };

        // 魔法反射
        const upstream_BattleManager_invokeMagicReflection = BattleManager.invokeMagicReflection;
        BattleManager.invokeMagicReflection = function (subject, target) {
            upstream_BattleManager_invokeMagicReflection.apply(this, arguments);

            if (subject.canMove()) {
                subject.torigoyaBalloonInBattle_requestMessage('counter', {
                    targets: [target],
                    priority: 1,
                });
            }
        };

        const upstream_BattleManager_startBattle = BattleManager.startBattle;
        BattleManager.startBattle = function () {
            this.torigoyaBalloonInBattle_talkStartBattleParty();
            this.torigoyaBalloonInBattle_talkStartBattleTroop();
            upstream_BattleManager_startBattle.apply(this);
        };

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

        const upstream_BattleManager_processVictory = BattleManager.processVictory;
        BattleManager.processVictory = function () {
            this.torigoyaBalloonInBattle_talkVictory();
            upstream_BattleManager_processVictory.apply(this);
        };

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

        const upstream_BattleManager_processDefeat = BattleManager.processDefeat;
        BattleManager.processDefeat = function () {
            this.torigoyaBalloonInBattle_talkDefeat();
            upstream_BattleManager_processDefeat.apply(this);
        };

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

        // --------------------------------------------------------------------------
        // Scene_Battle

        const upstream_Scene_Battle_createWindowLayer = Scene_Battle.prototype.createWindowLayer;
        Scene_Battle.prototype.createWindowLayer = function () {
            this.torigoyaBalloonInBattle_createActorBalloons();
            this.torigoyaBalloonInBattle_createEnemyBalloons();
            upstream_Scene_Battle_createWindowLayer.apply(this);
        };

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

        const upstream_Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
        Scene_Boot.prototype.loadSystemImages = function () {
            upstream_Scene_Boot_loadSystemImages.apply(this);
            ImageManager.loadSystem(Torigoya.BalloonInBattle.parameter.balloonImage);
        };

        // --------------------------------------------------------------------------
        // DataManager

        const SAVE_KEY = 'torigoyaBalloonInBattle_actorTalkSetId';

        const upstream_DataManager_createGameObjects = DataManager.createGameObjects;
        DataManager.createGameObjects = function () {
            upstream_DataManager_createGameObjects.apply(this);
            Torigoya.BalloonInBattle.actorTalkSetId = [];
        };

        const upstream_DataManager_makeSaveContents = DataManager.makeSaveContents;
        DataManager.makeSaveContents = function () {
            const contents = upstream_DataManager_makeSaveContents.apply(this);
            contents[SAVE_KEY] = Torigoya.BalloonInBattle.actorTalkSetId;
            return contents;
        };

        const upstream_DataManager_extractSaveContents = DataManager.extractSaveContents;
        DataManager.extractSaveContents = function (contents) {
            upstream_DataManager_extractSaveContents.apply(this, arguments);
            Torigoya.BalloonInBattle.actorTalkSetId = contents[SAVE_KEY] || [];
        };

        // --------------------------------------------------------------------------
        // プラグインコマンド

        function commandChangeTalkSetId({ actorId, talkSetId }) {
            actorId = parseInt(actorId || '0', 10);
            talkSetId = ''.concat(talkSetId || '').trim();
            const talkSet = getTalkSet(talkSetId);
            if (!talkSet) {
                if ($gameTemp.isPlaytest()) {
                    console.error('talkSet: '.concat(talkSetId, ' is not found'));
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

        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'changeTalkSet', commandChangeTalkSetId);
        PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'resetTalkSet', commandResetTalkSetId);
    })();
})();
