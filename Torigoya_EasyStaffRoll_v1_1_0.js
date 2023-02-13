/*---------------------------------------------------------------------------*
 * Torigoya_EasyStaffRoll.js v.1.1.0
 *---------------------------------------------------------------------------*
 * 2023/02/14 01:55 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc お手軽スタッフロールプラグイン (v.1.1.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.1.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_EasyStaffRoll.js
 * @help
 * お手軽スタッフロールプラグイン (v.1.1.0)
 * https://torigoya-plugin.rutan.dev
 *
 * スタッフロールを表示する機能を追加します。
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 * プラグイン設定の「スタッフロールの内容」に
 * 表示する内容を設定してください。
 *
 * ------------------------------------------------------------
 * ■ ゲーム中にスタッフロールを表示する
 * ------------------------------------------------------------
 * プラグインコマンドで表示することができます。
 * 以下のようなフォーマットで指定します。
 *
 * easyStaffRoll show 表示時間 ウェイトONにするか？
 *
 * ▼ 例1：スタッフロールを600フレーム(約10秒)かけて表示（ウェイトON）
 * easyStaffRoll show 600 true
 *
 * ▼ 例1：スタッフロールを1200フレーム(約20秒)かけて表示（ウェイトOFF）
 * easyStaffRoll show 600 false
 *
 * ------------------------------------------------------------
 * ■ その他のプラグインコマンド
 * ------------------------------------------------------------
 * ▼ 現在表示中のスタッフロールを消去
 * easyStaffRoll remove
 *
 * 主に「ウェイトOFF」で使用したとき向けの機能です。
 *
 * ▼ スタッフロールの事前読み込み
 * easyStaffRoll preload
 *
 * Web公開の場合など、画像読み込みに時間がかかる環境の場合に、
 * このコマンドを実行すると、そのタイミングで画像類の読み込み＆生成が実行されます。
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param baseStaffRollContent
 * @text スタッフロールの内容
 * @desc スタッフロールの内容を設定します。
 * @type struct<Section>[]
 * @parent base
 * @default []
 *
 * @param design
 * @text ■ 見た目設定
 *
 * @param designSectionTitleText
 * @text 見出し部分の文字設定
 * @desc スタッフロールの見出し部分の文字設定です。
 * @type struct<TextConfig>
 * @parent design
 * @default {"fontSize":"28","textColor":"#99ffff","fontBold":"true","fontItalic":"false","outlineColor":"rgba(0, 0, 0, 0.6)","outlineWidth":"5"}
 *
 * @param designSectionMargin
 * @text 各セクション間の余白
 * @desc 各セクション（見出しごとのブロック）の間の余白の大きさを指定します。
 * @type number
 * @parent design
 * @min 0
 * @max 10000
 * @default 100
 *
 * @param designItemTitleText
 * @text スタッフ名の文字設定
 * @desc スタッフロールのスタッフ名部分の文字設定です。
 * @type struct<TextConfig>
 * @parent design
 * @default {"fontSize":"24","textColor":"#ffffff","fontBold":"true","fontItalic":"false","outlineColor":"rgba(0, 0, 0, 0.9)","outlineWidth":"3"}
 *
 * @param designItemDescriptionText
 * @text 補足文章の文字設定
 * @desc スタッフロールの補足文章部分の文字設定です。
 * @type struct<TextConfig>
 * @parent design
 * @default {"fontSize":"16","textColor":"#ffffff","fontBold":"true","fontItalic":"false","outlineColor":"rgba(0, 0, 0, 0.9)","outlineWidth":"3"}
 *
 * @param designItemMargin
 * @text 各スタッフ名間の余白
 * @desc 各スタッフ名の間の余白の大きさを指定します。
 * @type number
 * @parent design
 * @min 0
 * @max 10000
 * @default 30
 *
 * @param designTextAlign
 * @text 文字の水平配置位置
 * @desc 見出しやスタッフ名の文字の水平方向の配置位置を指定します。
 * @type select
 * @parent design
 * @option 左寄せ
 * @value left
 * @option 中央寄せ
 * @value center
 * @option 右寄せ
 * @value right
 * @default center
 *
 * @param designContentHorizontalPadding
 * @text 文字の水平方向の余白
 * @desc 文字の両側の余白サイズを指定します。
 * @type number
 * @parent design
 * @min 0
 * @max 10000
 * @default 0
 */

/*~struct~Section:
 * @param title
 * @text 見出し
 * @desc 見出し部分の文字列を指定します。
 * @type note
 * @default
 *
 * @param items
 * @text スタッフ名
 * @desc スタッフロールに表示するスタッフ名を入力します。
 * @type struct<Item>[]
 * @default []
 */

/*~struct~Item:
 * @param title
 * @text スタッフ名
 * @desc スタッフロールに表示するスタッフ名を入力します。
 * @type note
 * @default
 *
 * @param description
 * @text 補足文章
 * @desc スタッフ名の下に表示する補足文章を入力します。
 * URLなどを入力することを想定しています。
 * @type note
 * @default
 *
 * @param icon
 * @text 画像
 * @desc スタッフ名の上に表示するピクチャー画像を入力します。
 * 省略した場合は画像を表示しません。
 * @type file
 * @require true
 * @dir img/pictures
 * @default
 */

/*~struct~TextConfig:
 * @param fontSize
 * @text 文字サイズ
 * @desc 文字サイズを指定します(px)
 * @type number
 * @min 1
 * @max 100
 * @default 24
 *
 * @param textColor
 * @text 文字色
 * @desc 文字色をCSSの書式で指定します。
 * （例：#ffffff）
 * @type string
 * @default #ffffff
 *
 * @param fontBold
 * @text 太字
 * @desc 文字を太字にするか指定します。
 * （※フォントによっては反映されない場合があります）
 * @type boolean
 * @on 太字にする
 * @off 太字にしない
 * @default false
 *
 * @param fontItalic
 * @text 斜体
 * @desc 文字を斜体にするか指定します。
 * （※フォントによっては反映されない場合があります）
 * @type boolean
 * @on 斜体にする
 * @off 斜体にしない
 * @default false
 *
 * @param outlineColor
 * @text 縁取りの色
 * @desc 文字の縁取りの色をCSSの書式で指定します。
 * （例：#ffffff）
 * @type string
 * @default rgba(0, 0, 0, 0.5)
 *
 * @param outlineWidth
 * @text 縁取りのサイズ
 * @desc 文字の縁取りの太さを指定します。
 * @type number
 * @min 0
 * @max 100
 * @default 3
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_EasyStaffRoll';
    }

    function pickNoteStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return (parameter[key].startsWith('"') ? JSON.parse(parameter[key]) : parameter[key]) || '';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return `${parameter[key] || ''}`;
    }

    function pickIntegerValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseInt(parameter[key], 10);
    }

    function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
        return `${parameter[key] || defaultValue}` === 'true';
    }

    function pickStructSection(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            title: pickNoteStringValueFromParameter(parameter, 'title', ''),
            items: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructItem(parameter);
                });
            })(parameter.items),
        };
    }

    function pickStructItem(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            title: pickNoteStringValueFromParameter(parameter, 'title', ''),
            description: pickNoteStringValueFromParameter(parameter, 'description', ''),
            icon: pickStringValueFromParameter(parameter, 'icon', ''),
        };
    }

    function pickStructTextConfig(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            fontSize: pickIntegerValueFromParameter(parameter, 'fontSize', 24),
            textColor: pickStringValueFromParameter(parameter, 'textColor', '#ffffff'),
            fontBold: pickBooleanValueFromParameter(parameter, 'fontBold', false),
            fontItalic: pickBooleanValueFromParameter(parameter, 'fontItalic', false),
            outlineColor: pickStringValueFromParameter(parameter, 'outlineColor', 'rgba(0, 0, 0, 0.5)'),
            outlineWidth: pickIntegerValueFromParameter(parameter, 'outlineWidth', 3),
        };
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.0',
            baseStaffRollContent: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructSection(parameter);
                });
            })(parameter.baseStaffRollContent),
            designSectionTitleText: ((parameter) => {
                return pickStructTextConfig(parameter);
            })(parameter.designSectionTitleText),
            designSectionMargin: pickIntegerValueFromParameter(parameter, 'designSectionMargin', 100),
            designItemTitleText: ((parameter) => {
                return pickStructTextConfig(parameter);
            })(parameter.designItemTitleText),
            designItemDescriptionText: ((parameter) => {
                return pickStructTextConfig(parameter);
            })(parameter.designItemDescriptionText),
            designItemMargin: pickIntegerValueFromParameter(parameter, 'designItemMargin', 30),
            designTextAlign: pickStringValueFromParameter(parameter, 'designTextAlign', 'center'),
            designContentHorizontalPadding: pickIntegerValueFromParameter(
                parameter,
                'designContentHorizontalPadding',
                0
            ),
        };
    }

    class StaffRollManager {
        constructor() {
            this._content = null;
            this._isLoading = false;
        }

        get content() {
            return this._content;
        }

        get timerRate() {
            const state = this.getState();

            if (state.duration <= 0) return 1;
            return state.timer / state.duration;
        }

        /**
         * 現在のスタッフロール表示状況の取得
         * @returns {*}
         */
        getState() {
            return $gameScreen.torigoyaEasyStaffRoll_getStaffRollState();
        }

        /**
         * スタッフロール本文の読込中であるか？
         * @returns {boolean}
         */
        isLoading() {
            return this._isLoading;
        }

        /**
         * スタッフロール表示中であるか？
         * @returns {boolean}
         */
        isDisplay() {
            const state = this.getState();
            return state.timer < state.duration;
        }

        /**
         * スタッフロール処理が動作中であるか？
         * @returns {boolean}
         */
        isBusy() {
            return this.isLoading() || this.isDisplay();
        }

        /**
         * 表示設定の反映
         * @param duration
         */
        setup({ duration }) {
            const state = this.getState();
            state.timer = 0;
            state.duration = duration;

            this._isLoading = true;
            this.loadStaffRollContent().then((content) => {
                this._content = content;
                this._isLoading = false;
            });
        }

        /**
         * 更新
         */
        update() {
            if (this._isLoading) return;
            const state = this.getState();

            if (state.timer < state.duration) {
                ++state.timer;

                if (state.timer === state.duration) this.finish();
            }
        }

        /**
         * 表示の終了
         */
        finish() {
            const state = this.getState();
            state.timer = state.duration = 0;
            this._content = null;
        }

        /**
         * スタッフロール情報の読み込み
         * アドオンプラグイン向けにPromiseを返す非同期のメソッドとして定義する
         * @returns {Promise<Object[]>}
         */
        loadStaffRollContent() {
            return Promise.resolve(Torigoya.EasyStaffRoll.parameter.baseStaffRollContent);
        }
    }

    function loadBitmapPromise(bitmap) {
        return new Promise((resolve) => {
            if (bitmap.isReady()) {
                resolve();
            } else {
                bitmap.addLoadListener(resolve);
            }
        });
    }

    function loadBitmapListPromise(bitmaps) {
        const ps = bitmaps.map((bitmap) => loadBitmapPromise(bitmap));
        return Promise.all(ps).then(() => bitmaps);
    }

    function arrayFlat(arr) {
        if (arr.flat) return arr.flat();
        return [].concat(...arr);
    }

    class Sprite_StaffRoll extends Sprite {
        constructor() {
            super();
            this._totalHeight = 0;
            this._isBusy = false;
            this._dummyBitmap = new Bitmap(1, 1);
        }

        destroy() {
            this._dummyBitmap.destroy();
            this._dummyBitmap = null;
            super.destroy();
        }

        /**
         * スプライトの初期化
         */
        init() {
            this._isBusy = true;
            this.preloadPictures().then(() => {
                this.createContents();
                this._isBusy = false;
            });
        }

        /**
         * コンテンツの生成
         */
        createContents() {
            this.createBody();
            this.adjustPosition();
        }

        /**
         * スタッフロールの本体部分の生成
         */
        createBody() {
            const { content } = Torigoya.EasyStaffRoll.Manager;
            if (!content) return;

            content.forEach((section, i) => {
                if (i > 0) this._totalHeight += Torigoya.EasyStaffRoll.parameter.designSectionMargin;
                this.createSection(section);
            });
        }

        /**
         * 各セクション表示の生成
         * @param section
         */
        createSection(section) {
            if (section.title) {
                this.addChildWithUpdateTotalHeight(this.createSectionTitleSprite(section.title));
            }

            section.items.forEach((item, j) => {
                if (section.title || j > 0) this._totalHeight += Torigoya.EasyStaffRoll.parameter.designItemMargin;
                this.createItem(item);
            });
        }

        /**
         * 各スタッフ名表示の生成
         * @param icon
         * @param title
         * @param description
         */
        createItem({ icon, title, description }) {
            if (icon) {
                this.addChildWithUpdateTotalHeight(new Sprite(ImageManager.loadPicture(icon)));
            }

            if (title) {
                this.addChildWithUpdateTotalHeight(this.createItemTitleSprite(title));
            }

            if (description) {
                this.addChildWithUpdateTotalHeight(this.createItemDescriptionSprite(description));
            }
        }

        /**
         * スタッフロール内で使用するピクチャー画像のプリロード
         * @returns {Promise<Bitmap[]>}
         */
        preloadPictures() {
            const { content } = Torigoya.EasyStaffRoll.Manager;
            if (!content) return;

            const pictures = arrayFlat(content.map((section) => section.items.map((item) => item.icon)))
                .filter(Boolean)
                .map((fileName) => ImageManager.loadPicture(fileName));

            return loadBitmapListPromise(pictures);
        }

        /**
         * スプライトを表示要素として追加
         * @param sprite
         */
        addChildWithUpdateTotalHeight(sprite) {
            switch (this.textAlign()) {
                case 'left':
                    sprite.anchor.x = 0;
                    break;
                case 'right':
                    sprite.anchor.x = 1;
                    break;
                case 'center':
                default:
                    sprite.anchor.x = 0.5;
            }
            sprite.y = this._totalHeight;
            this._totalHeight += sprite.height;
            this.addChild(sprite);
        }

        /**
         * テキストのスプライトを生成
         * @param text
         * @param textSetting
         * @returns {Sprite}
         */
        createTextSprite(text, textSetting) {
            const lines = text.split(/\r?\n/);

            this._dummyBitmap.fontSize = textSetting.fontSize;
            this._dummyBitmap.fontFace = textSetting.fontFace || this.textFontFace();

            const width = Math.max(...lines.map((line) => this._dummyBitmap.measureTextWidth(line)));
            const lineHeight = Math.ceil(textSetting.fontSize * 1.5);

            const bitmap = new Bitmap(
                Math.min(width + textSetting.outlineWidth * 2, this.contentMaxWidth()),
                lineHeight * lines.length + textSetting.outlineWidth * 2
            );
            bitmap.fontSize = textSetting.fontSize;
            bitmap.textColor = textSetting.textColor;
            bitmap.fontBold = textSetting.fontBold;
            bitmap.fontItalic = textSetting.fontItalic;
            bitmap.fontFace = textSetting.fontFace || this.textFontFace();
            bitmap.outlineColor = textSetting.outlineColor;
            bitmap.outlineWidth = textSetting.outlineWidth;

            lines.forEach((line, i) => {
                bitmap.drawText(
                    line,
                    0,
                    textSetting.outlineWidth + i * textSetting.fontSize * 1.5,
                    bitmap.width,
                    lineHeight,
                    this.textAlign()
                );
            });

            return new Sprite(bitmap);
        }

        /**
         * 見出し用スプライトの生成
         * @param text
         * @returns {Sprite}
         */
        createSectionTitleSprite(text) {
            return this.createTextSprite(text, Torigoya.EasyStaffRoll.parameter.designSectionTitleText);
        }

        /**
         * スタッフ名スプライトの生成
         * @param text
         * @returns {Sprite}
         */
        createItemTitleSprite(text) {
            return this.createTextSprite(text, Torigoya.EasyStaffRoll.parameter.designItemTitleText);
        }

        /**
         * 備考欄のスプライトの生成
         * @param text
         * @returns {Sprite}
         */
        createItemDescriptionSprite(text) {
            return this.createTextSprite(text, Torigoya.EasyStaffRoll.parameter.designItemDescriptionText);
        }

        /**
         * 更新
         */
        update() {
            if (this._isBusy);
            else if (this._totalHeight > 0) {
                this.adjustPosition();
            } else if (Torigoya.EasyStaffRoll.Manager.content && this._totalHeight === 0) {
                this.init();
            }

            super.update();
        }

        /**
         * 表示位置の反映
         */
        adjustPosition() {
            const { timerRate } = Torigoya.EasyStaffRoll.Manager;
            switch (this.textAlign()) {
                case 'left':
                    this.x = this.contentHorizontalPadding();
                    break;
                case 'right':
                    this.x = Graphics.width - this.contentHorizontalPadding();
                    break;
                default:
                    this.x = Graphics.width / 2;
            }
            this.y = Graphics.height - timerRate * (Graphics.height + this._totalHeight);
        }

        /**
         * フォント名の取得
         */
        textFontFace() {
            if ($gameSystem.mainFontFace) return $gameSystem.mainFontFace();
            return 'GameFont, sans-serif';
        }

        /**
         * テキストの水平方向の配置位置
         * @returns {'left' | 'center' | 'right'}
         */
        textAlign() {
            return Torigoya.EasyStaffRoll.parameter.designTextAlign || 'center';
        }

        /**
         * 要素の横方向の余白サイズ
         * @returns {number}
         */
        contentHorizontalPadding() {
            return Torigoya.EasyStaffRoll.parameter.designContentHorizontalPadding || 0;
        }

        /**
         * 各要素の最大幅
         * @returns {number}
         */
        contentMaxWidth() {
            return Graphics.width - this.contentHorizontalPadding() * 2;
        }
    }

    Torigoya.EasyStaffRoll = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        Torigoya.EasyStaffRoll.Manager = new StaffRollManager();
        Torigoya.EasyStaffRoll.Sprite_StaffRoll = Sprite_StaffRoll;

        // -------------------------------------------------------------------------
        // Bitmap

        // MZスタイルの太字機能を有効にする
        const upstream_Bitmap__makeFontNameText = Bitmap.prototype._makeFontNameText;
        Bitmap.prototype._makeFontNameText = function () {
            const fontNameText = upstream_Bitmap__makeFontNameText.apply(this);
            if (!this.fontBold || fontNameText.includes('bold ')) return fontNameText;
            return 'Bold ' + fontNameText;
        };

        // -------------------------------------------------------------------------
        // Game_Screen

        const upstream_Game_Screen_clear = Game_Screen.prototype.clear;
        Game_Screen.prototype.clear = function () {
            upstream_Game_Screen_clear.apply(this);
            this.torigoyaEasyStaffRoll_clearStaffRollState();
        };

        /**
         * スタッフロール表示状況の初期化
         */
        Game_Screen.prototype.torigoyaEasyStaffRoll_clearStaffRollState = function () {
            this._torigoyaEasyStaffRoll_staffRollState = {
                timer: 0,
                duration: 0,
            };
        };

        const upstream_Game_Screen_update = Game_Screen.prototype.update;
        Game_Screen.prototype.update = function () {
            upstream_Game_Screen_update.apply(this);
            this.torigoyaEasyStaffRoll_updateStaffRoll();
        };

        /**
         * スタッフロール表示状況の更新
         */
        Game_Screen.prototype.torigoyaEasyStaffRoll_updateStaffRoll = function () {
            Torigoya.EasyStaffRoll.Manager.update();
        };

        Game_Screen.prototype.torigoyaEasyStaffRoll_getStaffRollState = function () {
            if (!this._torigoyaEasyStaffRoll_staffRollState) this.torigoyaEasyStaffRoll_clearStaffRollState();
            return this._torigoyaEasyStaffRoll_staffRollState;
        };

        // -------------------------------------------------------------------------
        // Game_Interpreter

        const upstream_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
        Game_Interpreter.prototype.updateWaitMode = function () {
            if (this._waitMode === 'torigoyaEasyStaffRoll') {
                if (Torigoya.EasyStaffRoll.Manager.isBusy()) return true;
            }

            return upstream_Game_Interpreter_updateWaitMode.apply(this);
        };

        // -------------------------------------------------------------------------
        // Scene_Base

        Scene_Base.prototype.torigoyaEasyStaffRoll_createStaffRollSprite = function () {
            this._torigoyaEasyStaffRoll_staffRollSprite = new Sprite_StaffRoll();
            this.addChild(this._torigoyaEasyStaffRoll_staffRollSprite);
        };

        // -------------------------------------------------------------------------
        // Scene_Map

        const upstream_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
        Scene_Map.prototype.createDisplayObjects = function () {
            upstream_Scene_Map_createDisplayObjects.apply(this);
            this.torigoyaEasyStaffRoll_createStaffRollSprite();
        };

        // -------------------------------------------------------------------------
        // Scene_Battle

        const upstream_Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
        Scene_Battle.prototype.createDisplayObjects = function () {
            upstream_Scene_Battle_createDisplayObjects.apply(this);
            this.torigoyaEasyStaffRoll_createStaffRollSprite();
        };

        // -------------------------------------------------------------------------
        // プラグインコマンド

        function commandDisplayStaffRoll({ displayFrame, isWait }) {
            displayFrame = Number(displayFrame);
            isWait = isWait.toString() === 'true';

            Torigoya.EasyStaffRoll.Manager.setup({ duration: displayFrame });
            if (isWait) this.setWaitMode('torigoyaEasyStaffRoll');
        }

        function commandRemoveStaffRoll() {
            Torigoya.EasyStaffRoll.Manager.finish();
        }

        function commandPreloadStaffRoll() {
            Torigoya.EasyStaffRoll.Manager.setup({ duration: 0 });
        }

        const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            if (command === 'easyStaffRoll') {
                switch (args[0]) {
                    case 'show':
                        return commandDisplayStaffRoll.call(this, {
                            displayFrame: args[1] || '600',
                            isWait: args[2] || 'true',
                        });
                    case 'remove':
                        return commandRemoveStaffRoll.call(this);
                    case 'preload':
                        return commandPreloadStaffRoll.call(this);
                }
            }

            return upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
        };
    })();
})();
