/*---------------------------------------------------------------------------*
 * TorigoyaMZ_NotifyMessage.js v.1.6.2
 *---------------------------------------------------------------------------*
 * Build Date: 2025/02/28 22:55:34 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 通知メッセージプラグイン (v.1.6.2)
 * @version 1.6.2
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_NotifyMessage.js
 *
 * @base TorigoyaMZ_FrameTween
 * @orderAfter TorigoyaMZ_FrameTween
 *
 * @help 通知メッセージプラグイン (v.1.6.2)
 * https://torigoya-plugin.rutan.dev
 *
 * 画面の左下から通知メッセージを表示する機能を追加します。
 * 通知メッセージはプラグインコマンドで表示できます。
 *
 * ------------------------------------------------------------
 * ■ メモ欄を使ったカスタマイズ
 * ------------------------------------------------------------
 * プラグインコマンドのメモ欄に以下の記述を行うことで
 * 通知ごとに一部動作をカスタマイズすることができます。
 *
 * ▼ 表示時の効果音を無しにする
 * <noSound>
 *
 * ------------------------------------------------------------
 * ■ 上級者設定：UIエリア余白
 * ------------------------------------------------------------
 * 通知メッセージの表示位置を調整するための設定です。
 * 指定した値の分だけ、上下に余白を追加することができます。
 *
 * 例えば、上端に100、下端に100のような値を設定すると、
 * 画面の真ん中の部分だけに通知が表示されるようになります。
 *
 * なお、上端と下端の合計値が画面の高さを超えてしまうと、
 * 通知が正常に表示されなくなってしまうためご注意ください。
 *
 * @param base
 * @text ■ 基本設定
 * @type string
 *
 * @param baseAnimationDirection
 * @text 通知の表示方向
 * @desc 通知の表示方向を指定します。
 * @parent base
 * @type select
 * @option 下から上へ
 * @value bottomToTop
 * @option 上から下へ
 * @value topToBottom
 * @default bottomToTop
 *
 * @param baseAppearTime
 * @text 登場/退場時間
 * @desc 通知が画面にスクロールイン/アウトする時間（フレーム数/60＝1秒）を指定します。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 15
 *
 * @param baseViewTime
 * @text 表示時間
 * @desc 通知の表示時間（フレーム数/60＝1秒）を指定します。0にすると画面外に押し出されるまで消えなくなります。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 90
 *
 * @param baseFontSize
 * @text 文字サイズ
 * @desc 通知メッセージの文字サイズを指定します
 * @parent base
 * @type number
 * @min 1
 * @decimals 0
 * @default 22
 *
 * @param basePadding
 * @text 余白サイズ
 * @desc 通知メッセージの全体的な余白サイズを指定します
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 4
 *
 * @param baseLeftPadding
 * @text 左側の追加余白サイズ
 * @desc 通知メッセージの左側の余白サイズを指定します。
 * 全体の余白サイズに加え、この分が余白に追加されます。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 0
 *
 * @param baseRightPadding
 * @text 右側の追加余白サイズ
 * @desc 通知メッセージの右側の余白サイズを指定します。
 * 全体の余白サイズに加え、この分が余白に追加されます。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 30
 *
 * @param baseItemPadding
 * @text アイコンと文章の余白
 * @desc 通知アイコンとメッセージの間の余白サイズを指定します。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 5
 *
 * @param baseSound
 * @text 効果音
 * @desc 通知表示時の効果音を指定します。
 * @parent base
 * @type struct<Sound>
 * @default {"name":"Item1","volume":"90","pitch":"100","pan":"0"}
 *
 * @param advanced
 * @text ■ 上級者設定
 * @type string
 *
 * @param advancedVisibleSwitch
 * @text 有効スイッチ
 * @desc このスイッチがONのときのみ画面に通知を表示するようにします。「なし」の場合は常に表示されます。
 * @parent advanced
 * @type switch
 * @default 0
 *
 * @param advancedBackgroundColor1
 * @text 背景グラデーション:左端
 * @desc 背景グラデーションの左端の色を指定します。
 * 色はCSSの記法で指定できます。
 * @parent advanced
 * @type string
 * @default rgba(0, 0, 64, 0.6)
 *
 * @param advancedBackgroundColor2
 * @text 背景グラデーション:右端
 * @desc 背景グラデーションの右端の色を指定します。
 * 色はCSSの記法で指定できます。
 * @parent advanced
 * @type string
 * @default rgba(0, 32, 64, 0)
 *
 * @param advancedUiPaddingTop
 * @text UIエリア余白: 上端
 * @desc 通知メッセージ表示位置の上側の余白を指定します。
 * @parent advanced
 * @type number
 * @decimals 0
 * @default 5
 *
 * @param advancedUiPaddingBottom
 * @text UIエリア余白: 下端
 * @desc 通知メッセージ表示位置の下側の余白を指定します。
 * @parent advanced
 * @type number
 * @decimals 0
 * @default 5
 *
 * @param advancedAppendScenes
 * @text 通知を表示するシーンを追加
 * @desc マップ以外のシーンを通知表示シーンの対象にします。シーン名を指定してください（例： Scene_Battle ）
 * @parent advanced
 * @type string[]
 * @default []
 *
 * @param advancedKeepMessage
 * @text シーン遷移しても表示をキープ
 * @desc 【危険：環境によってはONにすると不具合の原因となります】シーン遷移してもメッセージを全消ししないようにします。
 * @parent advanced
 * @type boolean
 * @on キープする（危険）
 * @off キープしない（安全）
 * @default false
 *
 * @command notify
 * @text 通知の表示
 * @desc 指定内容の通知を表示します
 *
 * @arg message
 * @text メッセージ
 * @desc 通知に表示する文章を指定します。「文章の表示」のコマンドが一部利用できます。
 * @type multiline_string
 *
 * @arg icon
 * @text アイコンID
 * @desc 通知に表示するアイコンのIDを指定します。
 * 0の場合は表示しません。
 * @type number
 * @decimals 0
 * @default 0
 *
 * @arg note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄と同様に利用できます。
 * @type note
 *
 * @command notifyWithVariableIcon
 * @text 通知の表示(アイコン変数指定)
 * @desc 指定内容の通知を表示します。アイコンのIDを変数で指定します。
 *
 * @arg message
 * @text メッセージ
 * @desc 通知に表示する文章を指定します。「文章の表示」のコマンドが一部利用できます。
 * @type multiline_string
 *
 * @arg iconVariable
 * @text アイコンID（変数指定）
 * @desc 通知に表示するアイコンIDが設定された変数を指定します。
 * 変数の中身が0またはマイナスの場合は表示しません。
 * @type variable
 * @default 0
 *
 * @arg note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄と同様に利用できます。
 * @type note
 *
 * @command forceExitNotifications
 * @text 表示中の全通知を強制終了
 * @desc 現在表示中の全通知を強制終了します。
 */

/*~struct~Sound:
 * @param name
 * @text 効果音ファイル名
 * @desc 通知表示時に再生する効果音ファイル
 * 空っぽの場合は効果音なしになります
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text 効果音の音量
 * @desc 通知表示時に再生する効果音の音量（%）
 * @type number
 * @min 0
 * @max 100
 * @decimals 0
 * @default 90
 *
 * @param pitch
 * @text 効果音のピッチ
 * @desc 通知表示時に再生する効果音のピッチ（%）
 * @type number
 * @min 0
 * @max 200
 * @decimals 0
 * @default 100
 *
 * @param pan
 * @text 効果音の位相
 * @desc 通知表示時に再生する効果音の位相
 * @type number
 * @min -100
 * @max 100
 * @decimals 0
 * @default 0
 */

(function () {
    'use strict';

    /**
     * 指定名のグローバルなオブジェクトを探索する
     * 例： findGlobalObject('Torigoya.Item') // => window.Torigoya.Item
     * @param objName
     */
    function findGlobalObject(objName) {
        if (!objName) return null;
        const arr = objName.split('.');
        let scope = window;
        for (const name of arr) {
            scope = scope[name];
            if (!scope) return null;
        }
        return scope;
    }

    /**
     * プラグインが存在するかチェックする
     * @param pluginObject
     * @param errorMessage
     */
    function checkExistPlugin(pluginObject, errorMessage) {
        if (typeof pluginObject !== 'undefined') return;
        alert(errorMessage);
        throw new Error(errorMessage);
    }
    /**
     * プラグインのバージョンをチェックする
     * @param version
     * @param requireVersion
     * @param errorMessage
     */
    function checkPluginVersion(version, requireVersion, errorMessage) {
        if (isVersionString(version) && isGreaterThanOrEqualVersion(requireVersion, version)) return;
        alert(errorMessage);
        throw new Error(errorMessage);
    }
    /**
     * x.y.z 形式のバージョン文字列かどうか判定する
     * @param version
     */
    function isVersionString(version) {
        if (typeof version !== 'string') return false;
        return /^\d+\.\d+\.\d+$/.test(version);
    }
    /**
     * x.y.z 形式のバージョン文字列を分解する
     * @param version
     */
    function parseVersion(version) {
        if (!isVersionString(version)) throw new Error(`invalid version: ${version}`);
        return version.split('.', 3).map((n) => parseInt(n || '0', 10));
    }
    /**
     * b のバージョンが a 以上であるか判定する（a <= b）
     * @param a
     * @param b
     */
    function isGreaterThanOrEqualVersion(a, b) {
        if (a === b) return true;
        const version1 = parseVersion(a);
        const version2 = parseVersion(b);
        if (version1[0] !== version2[0]) return version1[0] < version2[0];
        if (version1[1] !== version2[1]) return version1[1] < version2[1];
        return version1[2] < version2[2];
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
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_NotifyMessage';
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
    function parseStringParamList(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        return (Array.isArray(value) ? value : JSON.parse(String(value))).map((n) => String(n));
    }
    function parseStructObjectParam(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        if (typeof value === 'string') return JSON.parse(value);
        return value;
    }

    const Torigoya = (window.Torigoya = window.Torigoya || {});

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
            version: '1.6.2',
            base: parseStringParam(parameters['base'], ''),
            baseAnimationDirection: parseStringParam(parameters['baseAnimationDirection'], 'bottomToTop'),
            baseAppearTime: parseIntegerParam(parameters['baseAppearTime'], 15),
            baseViewTime: parseIntegerParam(parameters['baseViewTime'], 90),
            baseFontSize: parseIntegerParam(parameters['baseFontSize'], 22),
            basePadding: parseIntegerParam(parameters['basePadding'], 4),
            baseLeftPadding: parseIntegerParam(parameters['baseLeftPadding'], 0),
            baseRightPadding: parseIntegerParam(parameters['baseRightPadding'], 30),
            baseItemPadding: parseIntegerParam(parameters['baseItemPadding'], 5),
            baseSound: readStructSound(
                parseStructObjectParam(parameters['baseSound'], { name: 'Item1', volume: 90, pitch: 100, pan: 0 }),
            ),
            advanced: parseStringParam(parameters['advanced'], ''),
            advancedVisibleSwitch: parseIntegerParam(parameters['advancedVisibleSwitch'], 0),
            advancedBackgroundColor1: parseStringParam(parameters['advancedBackgroundColor1'], 'rgba(0, 0, 64, 0.6)'),
            advancedBackgroundColor2: parseStringParam(parameters['advancedBackgroundColor2'], 'rgba(0, 32, 64, 0)'),
            advancedUiPaddingTop: parseIntegerParam(parameters['advancedUiPaddingTop'], 5),
            advancedUiPaddingBottom: parseIntegerParam(parameters['advancedUiPaddingBottom'], 5),
            advancedAppendScenes: parseStringParamList(parameters['advancedAppendScenes'], []),
            advancedKeepMessage: parseBooleanParam(parameters['advancedKeepMessage'], false),
        };
    }

    checkExistPlugin(
        Torigoya.FrameTween,
        '「通知メッセージプラグイン」より上に「[鳥小屋.txt ベースプラグイン] Tweenアニメーション」が導入されていません。',
    );
    checkPluginVersion(
        Torigoya.FrameTween.parameter.version,
        '2.1.0',
        '「[鳥小屋.txt ベースプラグイン] Tweenアニメーション」のバージョンが古いです。アップデートをしてください。',
    );

    Torigoya.NotifyMessage = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // NotifyItem

        class NotifyItem {
            /**
             * 初期化
             * @param {{ message?: string; icon: number; note?: string; }} params
             */
            constructor(params) {
                this.initialize(params);
            }

            initialize(params) {
                this.message = params.message || '';
                this.icon = params.icon;
                this.note = params.note || '';
                this._openness = 0;

                DataManager.extractMetadata(this);
            }

            /**
             * @return {number}
             */
            get openness() {
                return this._openness;
            }

            /**
             * @param {number} value
             */
            set openness(value) {
                if (value < 0) value = 0;
                if (value > 255) value = 255;
                this._openness = value;
            }

            /**
             * 表示時に効果音再生が必要であるか？
             * @returns {boolean}
             */
            isRequirePlaySound() {
                return !this.meta['noSound'];
            }

            /**
             * 表示時の効果音を再生
             * @return {{volume: number, name: string, pitch: number, pan: number}}
             */
            getDisplaySe() {
                return Torigoya.NotifyMessage.parameter.baseSound;
            }
        }

        Torigoya.NotifyMessage.NotifyItem = NotifyItem;

        // -------------------------------------------------------------------------
        // Window_NotifyMessage

        /**
         * 通知メッセージウィンドウ
         */
        class Window_NotifyMessage extends Window_Base {
            constructor() {
                const rect = new Rectangle(0, 0, 1, 1);
                super(rect);
                this._notifyItem = new NotifyItem({});
                this.opacity = 0;
                this.createBackCoverSprite();
            }

            /**
             * @return {number}
             */
            get contentsOpacity() {
                return super.contentsOpacity;
            }

            /**
             * @param {number} value
             */
            set contentsOpacity(value) {
                super.contentsOpacity = value;
                this._backCoverSprite.opacity = value;
            }

            /**
             * 背景用スプライトの生成
             */
            createBackCoverSprite() {
                this._backCoverSprite = new Sprite(new Bitmap(1, 1));
                this.addChildAt(this._backCoverSprite, 0);
            }

            /**
             * 通知メッセージの設定
             * @param {NotifyItem} notifyItem
             */
            setup(notifyItem) {
                this._notifyItem = notifyItem;
                this.refresh();
            }

            /**
             * 更新
             */
            update() {
                this.contentsOpacity = this._notifyItem.openness;
                super.update();
            }

            /**
             * 画面の再描画
             */
            refresh() {
                if (!this._notifyItem) return;

                this.refreshContents();
                this.drawItem();
            }

            /**
             * ウィンドウの再生成
             */
            refreshContents() {
                const { width, height } = this.itemSize();
                this.width = width + this.padding * 2;
                this.height = height + this.padding * 2;
                this.createContents();
                this._refreshBackCoverSprite();
            }

            /**
             * アイテムの描画
             */
            drawItem() {
                const { message, icon } = this._notifyItem;

                const messageRect = this.messageRect();
                this.drawTextEx(message, messageRect.x, messageRect.y, messageRect.width);
                if (icon) this.drawIcon(icon, this.leftPadding(), (this.innerHeight - ImageManager.iconHeight) / 2);
            }

            /**
             * アイテムの描画領域サイズ
             * @returns {{width: number, height: number}}
             */
            itemSize() {
                const { icon } = this._notifyItem;
                const messageRect = this.messageRect();
                return {
                    width: Math.min(Graphics.width, messageRect.x + messageRect.width + this.rightPadding()),
                    height: Math.max(messageRect.y + messageRect.height, icon ? ImageManager.iconHeight : 0),
                };
            }

            /**
             * 本文領域
             * @returns {Rectangle}
             */
            messageRect() {
                const { message, icon } = this._notifyItem;
                const { width: messageWidth, height: messageHeight } = this.textSizeEx(message);
                const gap = messageHeight - ImageManager.iconHeight;
                const x = this.leftPadding() + (icon ? ImageManager.iconWidth + this.itemPadding() : 0);
                return new Rectangle(
                    x,
                    icon ? (gap < 0 ? -gap / 2 : 0) : 0,
                    Math.min(messageWidth, this.messageMaxWidth()),
                    messageHeight,
                );
            }

            /**
             * 本文領域の最大幅
             * @returns {number}
             */
            messageMaxWidth() {
                const { icon } = this._notifyItem;
                return (
                    Graphics.width -
                    this.leftPadding() -
                    this.rightPadding() -
                    (icon ? ImageManager.iconWidth + this.padding : 0)
                );
            }

            /**
             * テキストの高さを計算
             * @note ツクールMZのコアスクリプトはフォントサイズの変更に対応していないため、自前で計算する
             * @param textState
             * @return {number}
             */
            calcTextHeight(textState) {
                const lastFontSize = this.contents.fontSize;

                const lineSpacing = this.lineHeight() - this.baseFontSize();
                const firstLine = textState.text.slice(textState.index).split('\n')[0];
                const textHeight = this.maxFontSizeInLine(firstLine) + lineSpacing;

                this.contents.fontSize = lastFontSize;
                return textHeight;
            }

            /**
             * 左側の空きスペースのサイズ
             * @return {number}
             */
            leftPadding() {
                return Torigoya.NotifyMessage.parameter.baseLeftPadding;
            }

            /**
             * 右側の空きスペースのサイズ
             * @return {number}
             */
            rightPadding() {
                return Torigoya.NotifyMessage.parameter.baseRightPadding;
            }

            /**
             * 背景画像の再生成
             * @private
             */
            _refreshBackCoverSprite() {
                const bitmap = this._backCoverSprite.bitmap;
                const w = this.width;
                const h = this.height;
                const c1 = Torigoya.NotifyMessage.parameter.advancedBackgroundColor1;
                const c2 = Torigoya.NotifyMessage.parameter.advancedBackgroundColor2;
                bitmap.resize(w, h);
                bitmap.gradientFillRect(0, 0, w, h, c1, c2, false);
                this._backCoverSprite.setFrame(0, 0, w, h);
                this._backCoverSprite.opacity = this.contentsOpacity;
            }

            /**
             * Paddingの設定
             */
            updatePadding() {
                this.padding = Torigoya.NotifyMessage.parameter.basePadding;
            }

            /**
             * フォント設定
             */
            resetFontSettings() {
                super.resetFontSettings();
                this.contents.fontSize = this.baseFontSize();
            }

            /**
             * 行間
             * @returns {number}
             */
            lineHeight() {
                return this.contents.fontSize * 1.25;
            }

            /**
             * アイコンとメッセージの間の余白
             * @returns {number}
             */
            itemPadding() {
                return Torigoya.NotifyMessage.parameter.baseItemPadding;
            }

            /**
             * テキストのサイズを取得
             * @return {number}
             */
            baseFontSize() {
                return Torigoya.NotifyMessage.parameter.baseFontSize;
            }
        }

        Torigoya.NotifyMessage.Window = Window_NotifyMessage;

        // -------------------------------------------------------------------------
        // NotifyManagerClass

        /**
         * 通知マネージャー
         */
        class NotifyManagerClass {
            constructor() {
                this._currentScene = null;
                this._stacks = [];
                this._pools = [];
                this._scrollAnimations = [];
                this._group = new Torigoya.FrameTween.Group();
                this._handlers = [];
            }

            /**
             * 通知登録
             * @param {(notifyItem: NotifyItem) => void} handler
             */
            on(handler) {
                this._handlers.push(handler);
            }

            /**
             * 通知登録の解除
             * @param {(notifyItem: NotifyItem) => void} handler
             */
            off(handler) {
                const index = this._handlers.indexOf(handler);
                if (index === -1) return;
                this._handlers.splice(index, 1);
            }

            /**
             * すべての通知登録を解除
             */
            offAll() {
                this._handlers.length = 0;
            }

            /**
             * 現在表示中のすべての通知ウィンドウを破棄
             * ※シーン遷移時に呼び出される想定
             */
            clear() {
                this._currentScene = null;

                this._stacks.forEach((stack) => {
                    if (!stack.window) return;

                    if (stack.window.parent) stack.window.parent.removeChild(window);
                    stack.window.parent = null;
                    stack.window = null;
                });

                if (!Torigoya.NotifyMessage.parameter.advancedKeepMessage) {
                    this._stacks.length = 0;
                    this._group.clear();
                }

                this._scrollAnimations.forEach((a) => a.abort());
                this._scrollAnimations.length = 0;

                this._pools.forEach((pool) => pool.destroy());
                this._pools.length = 0;
            }

            /**
             * 表示先シーンの設定
             * @param {Scene_Base} scene
             */
            setScene(scene) {
                if (this._currentScene === scene) return;
                if (this._currentScene) this.clear();

                this._currentScene = scene;
                if (!this._currentScene.torigoyaNotifyMessageContainer) {
                    const container = new Sprite();
                    this._currentScene.torigoyaNotifyMessageContainer = container;
                    this._currentScene.addChild(container);
                }

                if (Torigoya.NotifyMessage.parameter.advancedKeepMessage) {
                    this._stacks.forEach((stack) => {
                        stack.window = this._setupWindow(stack.notifyItem);
                        stack.window.y = stack.y;
                        stack.window.contentsOpacity = 255;
                        this._appendToScene(stack.window);
                    });
                }
            }

            /**
             * すべての通知を強制終了
             */
            forceExitNotifications() {
                this._stacks.forEach((stack) => {
                    this.forceStartExitAnimation(stack);
                });
            }

            /**
             * 通知メッセージごとのマージン
             * @returns {number}
             */
            itemMargin() {
                return 5;
            }

            /**
             * 更新処理
             */
            update() {
                const visible = this.isVisible();
                if (visible) this._group.update();
                if (this._currentScene && this._currentScene.torigoyaNotifyMessageContainer)
                    this._currentScene.torigoyaNotifyMessageContainer.visible = visible;
            }

            /**
             * 表示中であるか？
             * @return {boolean}
             */
            isVisible() {
                if (!this._currentScene) return false;

                const switchId = Torigoya.NotifyMessage.parameter.advancedVisibleSwitch;
                if (!switchId) return true;

                return $gameSwitches.value(switchId);
            }

            /**
             * 通知の発生
             * @param {NotifyItem} notifyItem
             */
            notify(notifyItem) {
                // 非表示中は新規の追加を行わない
                if (!this.isVisible()) return;

                const window = this._setupWindow(notifyItem);
                this._appendToScene(window);

                const stack = {
                    notifyItem,
                    window,
                    y: 0,
                    appearAnimation: null,
                    waitAnimation: null,
                    exitAnimation: null,
                };
                this._stacks.unshift(stack);

                this.startAppearAndExitAnimation(stack);
                this.startScrollAnimation(stack.window.height);

                // 効果音再生
                if (notifyItem.isRequirePlaySound()) {
                    const se = notifyItem.getDisplaySe();
                    if (se && se.name) AudioManager.playSe(se);
                }

                // 通知
                this._handlers.forEach((func) => func(notifyItem));
            }

            /**
             * 通知メッセージの登場/退場アニメーション
             * @param {*} stack
             */
            startAppearAndExitAnimation(stack) {
                const viewTime = Torigoya.NotifyMessage.parameter.baseViewTime;
                const animationDirection = Torigoya.NotifyMessage.parameter.baseAnimationDirection;
                const topPadding = Torigoya.NotifyMessage.parameter.advancedUiPaddingTop;
                const bottomPadding = Torigoya.NotifyMessage.parameter.advancedUiPaddingBottom;

                // スタックの状態を初期化
                stack.y =
                    animationDirection === 'topToBottom'
                        ? -stack.window.height + topPadding
                        : Graphics.height - bottomPadding;

                // ウィンドウの初期状態を設定
                stack.window.x = 0;
                stack.window.y = stack.y;
                stack.window.contentsOpacity = 0;

                // 登場アニメーション
                stack.appearAnimation = this.createAppearAnimation(stack).call(() =>
                    stack.waitAnimation ? stack.waitAnimation.start() : null,
                );

                // 停止アニメーション
                stack.waitAnimation =
                    viewTime > 0
                        ? this.createWaitAnimation(stack).call(() =>
                              stack.exitAnimation ? stack.exitAnimation.start() : null,
                          )
                        : null;

                // 退場アニメーション
                stack.exitAnimation = this.createExitAnimation(stack).call(() => this._destroyStack(stack));

                stack.appearAnimation.start();
            }

            /**
             * 登場時のTweenアニメーションの作成
             * @param stack
             * @return {Tween}
             */
            createAppearAnimation(stack) {
                const appearTime = Torigoya.NotifyMessage.parameter.baseAppearTime;

                return Torigoya.FrameTween.create(stack.notifyItem)
                    .group(this._group)
                    .to({ openness: 255 }, appearTime, Torigoya.FrameTween.Easing.easeInOutQuad);
            }

            /**
             * 待機時のTweenアニメーションの作成
             * @param stack
             * @return {Tween}
             */
            createWaitAnimation(stack) {
                const viewTime = Torigoya.NotifyMessage.parameter.baseViewTime;

                return Torigoya.FrameTween.create(stack.notifyItem).group(this._group).wait(viewTime);
            }

            /**
             * 終了時のTweenアニメーションの作成
             * @param stack
             * @return {Tween}
             */
            createExitAnimation(stack) {
                const appearTime = Torigoya.NotifyMessage.parameter.baseAppearTime;

                return Torigoya.FrameTween.create(stack.notifyItem)
                    .group(this._group)
                    .to({ openness: 0 }, appearTime, Torigoya.FrameTween.Easing.easeInOutQuad);
            }

            /**
             * 通知メッセージリストのスクロールアニメーション
             * @param {number} newWindowHeight
             */
            startScrollAnimation(newWindowHeight) {
                const animationDirection = Torigoya.NotifyMessage.parameter.baseAnimationDirection;

                // 既に動作中のアニメーションがある場合は破棄
                this._scrollAnimations.forEach((a) => a.abort());
                this._scrollAnimations.length = 0;

                if (animationDirection === 'topToBottom') {
                    this.applyScrollAnimationForTopToBottom(newWindowHeight);
                } else {
                    this.applyScrollAnimationForBottomToTop(newWindowHeight);
                }
            }

            /**
             * 上から下に移動するアニメーションを反映
             * @param {number} newWindowHeight
             */
            applyScrollAnimationForTopToBottom(newWindowHeight) {
                const appearTime = Torigoya.NotifyMessage.parameter.baseAppearTime;
                const bottomPadding = Torigoya.NotifyMessage.parameter.advancedUiPaddingBottom;

                let i = 0;
                while (i < this._stacks.length) {
                    const stack = this._stacks[i];

                    if (stack.y > Graphics.height) {
                        this._destroyStack(stack);
                        continue;
                    }

                    if (stack.y + stack.window.height > Graphics.height - bottomPadding) {
                        this.forceStartExitAnimation(stack);
                    }

                    stack.y += newWindowHeight + this.itemMargin();
                    const animation = Torigoya.FrameTween.create(stack.window)
                        .group(this._group)
                        .to({ y: stack.y }, appearTime, Torigoya.FrameTween.Easing.easeInOutQuad)
                        .start();
                    this._scrollAnimations.push(animation);

                    ++i;
                }
            }

            /**
             * 下から上に移動するアニメーションを反映
             * @param {number} newWindowHeight
             */
            applyScrollAnimationForBottomToTop(newWindowHeight) {
                const appearTime = Torigoya.NotifyMessage.parameter.baseAppearTime;
                const topPadding = Torigoya.NotifyMessage.parameter.advancedUiPaddingTop;

                let i = 0;
                while (i < this._stacks.length) {
                    const stack = this._stacks[i];

                    if (stack.y + stack.window.height < 0) {
                        this._destroyStack(stack);
                        continue;
                    }

                    if (stack.y < topPadding) {
                        this.forceStartExitAnimation(stack);
                    }

                    stack.y -= newWindowHeight + this.itemMargin();
                    const animation = Torigoya.FrameTween.create(stack.window)
                        .group(this._group)
                        .to({ y: stack.y }, appearTime, Torigoya.FrameTween.Easing.easeInOutQuad)
                        .start();
                    this._scrollAnimations.push(animation);

                    ++i;
                }
            }

            /**
             * 指定スタックの登場/待機アニメーションを強制終了して終了アニメーションを開始
             * @param {*} stack
             */
            forceStartExitAnimation(stack) {
                if (!stack.appearAnimation.finished) {
                    stack.appearAnimation.abort();
                    if (stack.waitAnimation) stack.waitAnimation.abort();
                    stack.exitAnimation.start();
                } else if (stack.waitAnimation && !stack.waitAnimation.finished) {
                    stack.waitAnimation.abort();
                    stack.exitAnimation.start();
                }
            }

            /**
             * 通知メッセージをもとにウィンドウを初期化
             * @param {NotifyItem} notifyItem
             * @returns {Window_NotifyMessage}
             * @private
             */
            _setupWindow(notifyItem) {
                const window = this._createOrGetFromPoolWindow();
                window.setup(notifyItem);
                window.x = 0;
                window.y = 0;
                window.contentsOpacity = 0;
                return window;
            }

            /**
             * ウィンドウをプールから取得、ない場合は生成する
             * @returns {Window_NotifyMessage}
             * @private
             */
            _createOrGetFromPoolWindow() {
                const window = this._pools.pop();
                if (window) return window;

                return new Window_NotifyMessage();
            }

            /**
             * 使用済みウィンドウをプールに戻す
             * @param {Window_NotifyMessage} window
             * @private
             */
            _releaseWindow(window) {
                if (window.parent) window.parent.removeChild(window);
                window.parent = null;
                this._pools.push(window);
            }

            /**
             * シーンへのaddChild
             * @param {Window_NotifyMessage} window
             * @private
             */
            _appendToScene(window) {
                if (!this._currentScene) return;
                if (!this._currentScene.torigoyaNotifyMessageContainer) return;
                this._currentScene.torigoyaNotifyMessageContainer.addChild(window);
            }

            /**
             * スタックから指定の通知を削除
             * @param {*} stack
             * @private
             */
            _destroyStack(stack) {
                const index = this._stacks.indexOf(stack);
                if (index === -1) return;
                this._stacks.splice(index, 1);
                if (stack.window) this._releaseWindow(stack.window);
                stack.appearAnimation = null;
                stack.waitAnimation = null;
                stack.exitAnimation = null;
            }
        }

        const NotifyManager = new NotifyManagerClass();
        Torigoya.NotifyMessage.Manager = NotifyManager;

        // -------------------------------------------------------------------------
        // Scene_Map

        wrap(Scene_Map.prototype, 'createAllWindows', function (self, originalFunc) {
            NotifyManager.setScene(self);
            originalFunc();
        });

        wrap(Scene_Map.prototype, 'update', function (self, originalFunc) {
            originalFunc();
            NotifyManager.update();
        });

        // -------------------------------------------------------------------------
        // Add Scenes

        if (Torigoya.NotifyMessage.parameter.advancedAppendScenes) {
            Torigoya.NotifyMessage.parameter.advancedAppendScenes.forEach((sceneName) => {
                const targetClass = findGlobalObject(sceneName);

                wrap(targetClass.prototype, 'createWindowLayer', function (self, originalFunc) {
                    NotifyManager.setScene(self);
                    originalFunc();
                });

                wrap(targetClass.prototype, 'update', function (self, originalFunc) {
                    originalFunc();
                    NotifyManager.update();
                });
            });
        }

        // -------------------------------------------------------------------------
        // SceneManager

        wrap(SceneManager, 'onSceneTerminate', function (_self, originalFunc) {
            NotifyManager.clear();
            originalFunc();
        });

        // -------------------------------------------------------------------------
        // プラグインコマンド

        function commandNotify({ message, icon, note }) {
            const item = new NotifyItem({ message, icon: parseInt(icon, 10), note });
            NotifyManager.notify(item);
        }

        function commandNotifyWithVariableIcon({ message, iconVariable, note }) {
            const variableId = parseInt(iconVariable, 10);
            const icon = Math.max($gameVariables.value(variableId), 0);
            const item = new NotifyItem({ message, icon, note });
            NotifyManager.notify(item);
        }

        function commandForceExitNotifications() {
            NotifyManager.forceExitNotifications();
        }

        PluginManager.registerCommand(Torigoya.NotifyMessage.name, 'notify', commandNotify);
        PluginManager.registerCommand(
            Torigoya.NotifyMessage.name,
            'notifyWithVariableIcon',
            commandNotifyWithVariableIcon,
        );
        PluginManager.registerCommand(
            Torigoya.NotifyMessage.name,
            'forceExitNotifications',
            commandForceExitNotifications,
        );
    })();
})();
