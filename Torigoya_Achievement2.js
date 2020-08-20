/*---------------------------------------------------------------------------*
 * Torigoya_Achievement2.js v.0.0.0
 *---------------------------------------------------------------------------*
 * 2020/08/20 16:23 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc 実績プラグイン (v.0.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 0.0.0
 * @help
 * 実績プラグイン (v.0.0.0)
 *
 * 実績・トロフィー的なシステムを定義します。
 * 使用方法の詳細は以下の記事をご確認ください。
 * https://torigoya-plugin.rutan.dev/system/achievement/
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param baseAchievementData
 * @text 実績情報の登録
 * @type struct<Achievement>[]
 * @parent base
 * @default []
 *
 * @param baseSaveSlot
 * @text セーブデータのスロット名
 * @type string
 * @parent base
 * @default
 *
 * @param popup
 * @text ■ ポップアップ設定
 *
 * @param popupEnable
 * @text ポップアップ表示のON/OFF
 * @desc 実績を獲得した時にポップアップ表示を行うか？
 * @type boolean
 * @parent popup
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param popupPosition
 * @text 表示位置
 * @desc 実績獲得ポップアップが表示される位置
 * @type select
 * @parent popup
 * @option 左上
 * @value leftUp
 * @option 右上
 * @value rightUp
 * @default leftUp
 *
 * @param popupAnimationType
 * @text アニメーション
 * @desc 実績獲得ポップアップのアニメーション方法
 * 「なめらか」はTorigoya_FrameTween.jsが必要です
 * @type select
 * @parent popup
 * @option なめらか
 * @value tween
 * @option その場に表示
 * @value open
 * @default tween
 *
 * @param popupWait
 * @text 表示時間
 * @desc 実績獲得ポップアップの表示時間（秒）
 * ※アニメーションの時間は含みません
 * @type number
 * @parent popup
 * @decimals 2
 * @min 0
 * @default 1.25
 *
 * @param popupWidth
 * @text ポップアップの横幅
 * @desc 実績獲得ポップアップの横幅（px）
 * 小さすぎると文字がはみ出します
 * @type number
 * @parent popup
 * @min 200
 * @default 300
 *
 * @param popupPadding
 * @text ポップアップの余白
 * @desc 実績獲得ポップアップの余白サイズ
 * @type number
 * @parent popup
 * @min 0
 * @default 10
 *
 * @param popupTitleFontSize
 * @text 実績名の文字サイズ
 * @desc 実績獲得ポップアップに表示される
 * 取得した実績名の文字サイズ
 * @type number
 * @parent popup
 * @min 16
 * @default 20
 *
 * @param popupTitleColor
 * @text 実績名の文字の色番号
 * @desc 実績名の文字表示に使用する色
 * ※\c[数字] ←の数字欄に入れる数字
 * @type number
 * @parent popup
 * @min 0
 * @default 1
 *
 * @param popupMessage
 * @text メッセージの内容
 * @desc 実績獲得ポップアップに表示される
 * 獲得メッセージの内容
 * @type string
 * @parent popup
 * @default 実績を獲得しました
 *
 * @param popupMessageFontSize
 * @text メッセージの文字サイズ
 * @desc 実績獲得ポップアップに表示される
 * 獲得メッセージの文字サイズ
 * @type number
 * @parent popup
 * @min 12
 * @default 16
 *
 * @param popupSound
 * @text 効果音
 * @desc 実績獲得時に再生する効果音の設定
 * @type struct<Sound>
 * @parent popup
 * @default {"soundName":"Saint5","soundVolume":"90"}
 *
 * @param popupWindowImage
 * @text ウィンドウ画像
 * @desc 実績獲得ポップアップのウィンドウ画像
 * @type file
 * @require true
 * @parent popup
 * @dir img/system/
 * @default Window
 *
 * @param popupOpacity
 * @text ウィンドウ背景の透明度
 * @desc ウィンドウ背景の透明度(0～255)
 * -1の場合はデフォルトの透明度を使用します
 * @type number
 * @parent popup
 * @min -1
 * @max 255
 * @default -1
 *
 * @param titleMenu
 * @text ■ タイトル / メニュー画面設定
 *
 * @param titleMenuUseInTitle
 * @text タイトル画面に表示
 * @desc タイトル画面に実績メニューを表示するか？
 * @type boolean
 * @parent titleMenu
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param titleMenuUseInMenu
 * @text メニュー画面に表示
 * @desc メニュー画面に実績メニューを表示するか？
 * @type boolean
 * @parent titleMenu
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param titleMenuText
 * @text 項目名
 * @desc タイトルやメニューに表示する際の
 * 実績メニューの項目名
 * @type string
 * @parent title
 * @default 実績
 *
 * @param achievementMenu
 * @text ■ 実績画面設定
 *
 * @param achievementMenuHiddenTitle
 * @text 未獲得実績の表示名
 * @desc 実績画面で未取得の実績の欄に
 * 表示する名前
 * @type string
 * @parent achievementMenu
 * @default ？？？？？
 *
 * @param achievementMenuHiddenIcon
 * @text 未獲得実績のアイコンID
 * @desc 実績画面で未取得の実績の欄に
 * 表示するアイコンのID
 * @type number
 * @parent achievementMenu
 * @default 0
 *
 * @param advanced
 * @text ■ 上級者向け設定
 *
 * @param advancedOverwritable
 * @text 獲得済み実績の再取得
 * @desc 既に獲得済みの実績でも再取得できるようにします
 * @type boolean
 * @parent advanced
 * @on する
 * @off しない
 * @default false
 *
 * @param achievementMenuCancelMessage
 * @text 閉じるボタンのテキスト
 * @desc 実績画面を閉じるボタンのテキスト
 * 空欄の場合は閉じるボタンを表示しません
 * @type string
 * @parent achievementMenu
 * @default 閉じる
 */

/*~struct~Sound:
 * @param soundName
 * @text 効果音ファイル名
 * @desc 実績獲得ポップアップ表示時に再生する効果音ファイル
 * 空っぽの場合は効果音なしになります
 * @type file
 * @require true
 * @dir audio/se/
 * @default Saint5
 *
 * @param soundVolume
 * @text 効果音の音量
 * @desc 実績獲得ポップアップ表示時に再生する効果音の音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 */

/*~struct~Achievement:
 * @param key
 * @text 管理ID
 * @desc 実績獲得時に指定する名前（例: ゲームクリア）
 * 数字でも日本語でもOK / 他の実績と被るのはNG
 * @type string
 *
 * @param title
 * @text 表示名
 * @desc 実績に画面に表示するときの実績名
 * （例：激闘の果てに魔王を倒した…ッ！）
 * @type string
 * @default
 *
 * @param description
 * @text 実績の説明文
 * @desc 実績に画面に表示する説明文（2行程度）
 * @type note
 * @default
 *
 * @param icon
 * @text 実績のアイコンID
 * @type number
 * @default 0
 *
 * @param hint
 * @text 実績獲得のヒント
 * @desc 未取得の場合に取得方法を表示できます（2行程度）
 * 空欄の場合は通常の説明文を表示します
 * @type note
 * @default
 *
 * @param isSecret
 * @text 秘密実績フラグ
 * @desc この実績の存在を秘密にします
 * 未獲得の場合に一覧に表示されなくなります
 * @type boolean
 * @on 秘密にする
 * @off 秘密にしない
 * @default false
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_Achievement2';
    }

    function pickStringValueFromParameter(parameter, key) {
        return ''.concat(parameter[key] || '');
    }

    function pickJsonValueFromParameter(parameter, key) {
        if (!parameter[key]) return parameter[key];
        return JsonEx.parse(parameter[key]);
    }

    function pickNumberValueFromParameter(parameter, key) {
        return parseFloat(parameter[key]);
    }

    function pickBooleanValueFromParameter(parameter, key) {
        return ''.concat(parameter[key]) === 'true';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '0.0.0',
            baseAchievementData: ((parameters) => {
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    if (typeof parameter === 'string') parameter = JSON.parse(parameter);
                    return {
                        key: pickStringValueFromParameter(parameter, 'key'),
                        title: pickStringValueFromParameter(parameter, 'title'),
                        description: pickJsonValueFromParameter(parameter, 'description'),
                        icon: pickNumberValueFromParameter(parameter, 'icon'),
                        hint: pickJsonValueFromParameter(parameter, 'hint'),
                        isSecret: pickBooleanValueFromParameter(parameter, 'isSecret'),
                    };
                });
            })(parameter.baseAchievementData),
            baseSaveSlot: pickStringValueFromParameter(parameter, 'baseSaveSlot'),
            popupEnable: pickBooleanValueFromParameter(parameter, 'popupEnable'),
            popupPosition: pickStringValueFromParameter(parameter, 'popupPosition'),
            popupAnimationType: pickStringValueFromParameter(parameter, 'popupAnimationType'),
            popupWait: pickNumberValueFromParameter(parameter, 'popupWait'),
            popupWidth: pickNumberValueFromParameter(parameter, 'popupWidth'),
            popupPadding: pickNumberValueFromParameter(parameter, 'popupPadding'),
            popupTitleFontSize: pickNumberValueFromParameter(parameter, 'popupTitleFontSize'),
            popupTitleColor: pickNumberValueFromParameter(parameter, 'popupTitleColor'),
            popupMessage: pickStringValueFromParameter(parameter, 'popupMessage'),
            popupMessageFontSize: pickNumberValueFromParameter(parameter, 'popupMessageFontSize'),
            popupSound: ((parameter) => {
                if (typeof parameter === 'string') parameter = JSON.parse(parameter);
                return {
                    soundName: pickStringValueFromParameter(parameter, 'soundName'),
                    soundVolume: pickNumberValueFromParameter(parameter, 'soundVolume'),
                };
            })(parameter.popupSound),
            popupWindowImage: pickStringValueFromParameter(parameter, 'popupWindowImage'),
            popupOpacity: pickNumberValueFromParameter(parameter, 'popupOpacity'),
            titleMenuUseInTitle: pickBooleanValueFromParameter(parameter, 'titleMenuUseInTitle'),
            titleMenuUseInMenu: pickBooleanValueFromParameter(parameter, 'titleMenuUseInMenu'),
            titleMenuText: pickStringValueFromParameter(parameter, 'titleMenuText'),
            achievementMenuHiddenTitle: pickStringValueFromParameter(parameter, 'achievementMenuHiddenTitle'),
            achievementMenuHiddenIcon: pickNumberValueFromParameter(parameter, 'achievementMenuHiddenIcon'),
            advancedOverwritable: pickBooleanValueFromParameter(parameter, 'advancedOverwritable'),
            achievementMenuCancelMessage: pickStringValueFromParameter(parameter, 'achievementMenuCancelMessage'),
        };
    }

    function isThenable(obj) {
        return obj && typeof obj['then'] === 'function';
    }

    class AchievementManager {
        get achievements() {
            return this._achievements;
        }

        get unlockInfo() {
            return this._unlockInfo;
        }

        get options() {
            return this._options;
        }

        /**
         * 生成
         * @param options
         */
        constructor(options = {}) {
            this._options = options;
            this._achievements = [];
            this._unlockInfo = new Map();
            this._handlers = [];
            this._isReady = false;
        }

        /**
         * 初期化処理
         */
        init() {
            if (this.options.onInit) {
                const result = this.options.onInit(this);
                if (isThenable(result)) {
                    result.then(() => (this._isReady = true));
                } else {
                    this._isReady = true;
                }
            } else {
                this._isReady = true;
            }
        }

        /**
         * 初期化完了
         * @returns {*}
         */
        isReady() {
            return this._isReady;
        }

        /**
         * 実績マスター情報の登録
         */
        setAchievements(achievements) {
            this._achievements = achievements;
        }

        /**
         * 獲得済み実績の保存
         * @returns {Promise}
         */
        save() {
            if (this.options.onSave) {
                const result = this.options.onSave(this);
                return isThenable(result) ? result : Promise.resolve();
            }
            return Promise.resolve();
        }

        /**
         * 実績リストを取得
         * @returns {{unlockInfo: any, achievement: *}[]}
         */
        data() {
            return this._achievements.map((achievement) => ({
                achievement,
                unlockInfo: this.unlockInfo.get(achievement.key) || null,
            }));
        }

        /**
         * 指定キーの実績情報を取得
         * @param {string} key  取得する実績のキー
         * @returns {Achievement|null}
         */
        getAchievement(key) {
            key = this.normalizeKey(key);
            return this._achievements.find((achievement) => achievement.key === key) || null;
        }

        /**
         * 獲得済み実績の件数を取得
         * @returns {number}
         */
        getUnlockedCount() {
            return this.unlockInfo.size;
        }

        /**
         * 実績獲得情報の取得
         * @param {string} key  取得するする実績のキー
         * @returns {any | null}
         */
        getUnlockInfo(key) {
            key = this.normalizeKey(key);
            return this.unlockInfo.get(''.concat(key)) || null;
        }

        /**
         * 指定キーの実績が獲得済みであるか？
         * @param {string} key  確認する実績のキー
         * @returns {boolean}
         */
        isUnlocked() {
            return Array.from(arguments).every((key) => {
                key = this.normalizeKey(key);
                return this.unlockInfo.has(key);
            });
        }

        /**
         * すべての実績が獲得済みであるか？
         * @returns {boolean}
         */
        isAllUnlocked() {
            return this.achievements.every((achievement) => {
                return this.unlockInfo.has(achievement.key);
            });
        }

        /**
         * 指定キーの実績が獲得可能であるか？
         * @param {string} key  確認する実績のキー
         * @returns {boolean}
         */
        isUnlockable(key) {
            key = this.normalizeKey(key);
            if (!this.getAchievement(key)) return false;
            if (!this.options.overwritable && this.unlockInfo.has(key)) return false;

            return true;
        }

        /**
         * 指定キーの実績を獲得する
         * @param {string} key  獲得する実績のキー
         * @returns {boolean}   実績獲得処理が実行されたか
         */
        unlock(key) {
            key = this.normalizeKey(key);
            if (!this.isUnlockable(key)) return false;
            this.unlockInfo.set(key, this.makeUnlockData(key));
            this.notify(key);
            this.save();
            return true;
        }

        /**
         * 実績獲得情報を生成する
         * ※アドオンプラグイン等で再定義・加工される想定
         * @param {string} _key 獲得する実績のキー
         * @returns {{date: number}}
         */
        makeUnlockData(_key) {
            return {
                date: Date.now(),
            };
        }

        /**
         * 指定キーの実績獲得イベントの通知
         * @param {string} key 獲得した実績のキー
         */
        notify(key) {
            key = this.normalizeKey(key);
            const achievement = this.getAchievement(key);
            if (!achievement) return;
            const unlockInfo = this.unlockInfo.get(key);
            if (!unlockInfo) return;

            this._handlers.forEach((handler) => {
                handler({ achievement, unlockInfo });
            });
        }

        /**
         * 指定キーの実績を削除する
         * @param key
         */
        remove(key) {
            key = ''.concat(key);
            this.unlockInfo.delete(key);
        }

        /**
         * 全実績を削除する
         */
        clear() {
            this.unlockInfo.clear();
            this.save();
        }

        /**
         * 実績獲得通知イベントの購読開始
         * @param {Handler} handler
         */
        on(handler) {
            this._handlers.push(handler);
        }

        /**
         * 実績獲得通知イベントの購読解除
         * @param {Handler} handler
         */
        off(handler) {
            this._handlers = this._handlers.filter((h) => h !== handler);
        }

        /**
         * @callback Handler
         * @param {{achievement: any, unlockInfo: any}} responseCode
         */

        /**
         * keyの文字列化
         * @param key
         * @returns {string}
         * @private
         */
        normalizeKey(key) {
            return typeof key === 'string' ? key : ''.concat(key);
        }
    }

    class AchievementPopupManager {
        get options() {
            return this._options;
        }

        /**
         * 生成
         * @param {AchievementManager} manager
         * @param {any} options
         */
        constructor(manager, options = {}) {
            this._manager = manager;
            this._options = options;
            this._stacks = [];
            this._soundAnimator = null;
        }

        /**
         * 初期化処理
         */
        init() {
            this._manager.on(this.onNotify.bind(this));
        }

        /**
         * リセット処理
         */
        reset() {
            this._stacks.length = 0;
        }

        /**
         * 通知処理
         * @param {{achievement: Achievement, unlockInfo: any}} data
         */
        onNotify(data) {
            const popupWindow = this._options.createPopupWindow(data);
            const isLeftUp = this._options.popupPosition === 'leftUp';
            const x = isLeftUp ? this.leftX() : this.rightX() - popupWindow.width;
            const y = (() => {
                let y = 10;
                for (let i = 0; i < this._stacks.length; ++i) {
                    const target = this._stacks[i];
                    if (Math.abs(target.y - y) > (target.height + popupWindow.height) / 2) continue;
                    y += popupWindow.y + popupWindow.height + 10;
                }
                return y;
            })();

            if (this._options.popupAnimationType === 'tween' && (Torigoya.FrameTween || Torigoya.Tween)) {
                this._showWithTween(popupWindow, x, y);
            } else {
                this._showWithoutTween(popupWindow, x, y);
            }
        }

        /**
         * Tweenを使った表示処理
         * @param popupWindow
         * @param x
         * @param y
         * @private
         */
        _showWithTween(popupWindow, x, y) {
            const isLeftUp = this._options.popupPosition === 'leftUp';
            const originalOpacity = popupWindow.opacity;
            const originalBackOpacity = popupWindow.backOpacity;

            const Easing = (Torigoya.FrameTween || Torigoya.Tween).Easing;

            (Torigoya.FrameTween || Torigoya.Tween)
                .create(popupWindow, {
                    x: x + popupWindow.width * (isLeftUp ? -1 : 1),
                    y,
                    opacity: 0,
                    backOpacity: 0,
                    contentsOpacity: 0,
                })
                .to(
                    {
                        x: x,
                        opacity: originalOpacity,
                        backOpacity: originalBackOpacity,
                        contentsOpacity: 255,
                    },

                    30,
                    Easing.easeOutCircular
                )
                .wait(Math.floor(this._options.popupWait * 60))
                .to(
                    {
                        y: y - popupWindow.height,
                        opacity: 0,
                        backOpacity: 0,
                        contentsOpacity: 0,
                    },

                    30,
                    Easing.easeInCircular
                )
                .call(() => {
                    this._stacks = this._stacks.filter((stack) => popupWindow !== stack);
                    if (popupWindow.parent) {
                        popupWindow.parent.removeChild(popupWindow);
                        if (typeof popupWindow.destroy === 'function') popupWindow.destroy();
                    }
                })
                .start();

            this._stacks.push(popupWindow);
            this._stacks.sort((a, b) => a.y - b.y);

            if (this._soundAnimator) {
                this._soundAnimator.abort();
                this._soundAnimator = null;
            }

            this._soundAnimator = (Torigoya.FrameTween || Torigoya.Tween)
                .create({})
                .wait(1)
                .call(() => {
                    this._options.playSe();
                });
            this._soundAnimator.start();
        }

        /**
         * Tweenを使わない表示処理
         * @param popupWindow
         * @param x
         * @param y
         * @private
         */
        _showWithoutTween(popupWindow, x, y) {
            popupWindow.x = x;
            popupWindow.y = y;
            popupWindow.openness = 0;
            popupWindow.open();
            setTimeout(() => {
                popupWindow.close();
                this._stacks = this._stacks.filter((stack) => popupWindow !== stack);
                setTimeout(() => {
                    if (popupWindow.parent) popupWindow.parent.removeChild(popupWindow);
                }, 500);
            }, this._options.popupWait * 1000);

            this._stacks.push(popupWindow);
            this._stacks.sort((a, b) => a.y - b.y);

            this._options.playSe();
        }

        /**
         * 一番左端
         * @returns {number}
         */
        leftX() {
            return 10;
        }

        /**
         * 一番右端
         * @returns {number}
         */
        rightX() {
            return Graphics.width - 10;
        }
    }

    Torigoya.Achievement2 = {
        name: getPluginName(),
        parameter: readParameter(),

        // 内部処理用に使うユニークなスロット名（≠localStorageのキー）
        saveSlotID: 'Torigoya Achievement2',
    };

    // -------------------------------------------------------------------------
    // 実績マネージャ

    Torigoya.Achievement2.Manager = new AchievementManager({
        onInit(manager) {
            manager.setAchievements(Torigoya.Achievement2.parameter.baseAchievementData);

            try {
                manager.unlockInfo.clear();
                const obj = JSON.parse(StorageManager.load(Torigoya.Achievement2.saveSlotID));
                obj.unlockInfo.forEach(([key, value]) => {
                    if (!manager.getAchievement(key)) return;
                    manager.unlockInfo.set(key, value);
                });
            } catch (_e) {
                manager.unlockInfo.clear();
            }
        },
        onSave(manager) {
            StorageManager.save(
                Torigoya.Achievement2.saveSlotID,
                JSON.stringify({
                    unlockInfo: Array.from(manager.unlockInfo.entries()),
                })
            );
        },
        overwritable: Torigoya.Achievement2.parameter.advancedOverwritable,
    });

    // -------------------------------------------------------------------------
    // 実績ポップアップ表示マネージャ

    Torigoya.Achievement2.PopupManager = new AchievementPopupManager(Torigoya.Achievement2.Manager, {
        popupPosition: Torigoya.Achievement2.parameter.popupPosition,
        popupWait: Torigoya.Achievement2.parameter.popupWait,
        popupAnimationType: Torigoya.Achievement2.parameter.popupAnimationType,
        createPopupWindow(item) {
            const popupWindow = new Window_AchievementPopup(item);
            SceneManager._scene.addChild(popupWindow); // 行儀悪い

            return popupWindow;
        },
        playSe() {
            const name = Torigoya.Achievement2.parameter.popupSound.soundName;
            if (!name) return;

            AudioManager.playSe({
                name,
                pan: 0,
                pitch: 100,
                volume: Torigoya.Achievement2.parameter.popupSound.soundVolume,
            });
        },
    });

    // -------------------------------------------------------------------------
    // 実績ポップアップウィンドウ

    class Window_AchievementPopup extends Window_Base {
        initialize(item) {
            super.initialize(0, 0, this.windowWidth(), this.windowHeight());
            this._item = item;
            this.refresh();
        }

        windowWidth() {
            return Torigoya.Achievement2.parameter.popupWidth;
        }

        windowHeight() {
            return this.standardFontSize() + this.messageFontSize() + this.standardPadding() * 2 + 5;
        }

        standardFontSize() {
            return Torigoya.Achievement2.parameter.popupTitleFontSize;
        }

        messageFontSize() {
            return Torigoya.Achievement2.parameter.popupMessageFontSize;
        }

        lineHeight() {
            return this.standardFontSize();
        }

        standardPadding() {
            return Torigoya.Achievement2.parameter.popupPadding;
        }

        refresh() {
            this.contents.clear();
            this.drawIcon(this._item.achievement.icon, 0, 0);
            this.drawTitle();
            this.drawMessage();
        }

        drawTitle() {
            this.resetFontSettings();
            this.drawTextEx(
                '\\c['.concat(Torigoya.Achievement2.parameter.popupTitleColor, ']') + this._item.achievement.title,
                40,
                0
            );
        }

        drawMessage() {
            const textWidth = this.windowWidth() - this.standardPadding() * 2 - 40;
            const y = this.standardFontSize() + 5;
            this.resetTextColor();
            this.contents.fontSize = this.messageFontSize();
            this.contents.drawText(
                Torigoya.Achievement2.parameter.popupMessage,
                40,
                y,
                textWidth,
                this.messageFontSize(),
                'left'
            );
        }

        calcTextHeight() {
            return this.contents.fontSize;
        }

        loadWindowskin() {
            this.windowskin = ImageManager.loadSystem(Torigoya.Achievement2.parameter.popupWindowImage);
        }

        standardBackOpacity() {
            return Torigoya.Achievement2.parameter.popupOpacity === -1
                ? super.standardBackOpacity()
                : Torigoya.Achievement2.parameter.popupOpacity;
        }
    }

    Torigoya.Achievement2.Window_AchievementPopup = Window_AchievementPopup;

    // -------------------------------------------------------------------------
    // 実績一覧ウィンドウ

    class Window_AchievementList extends Window_Selectable {
        initialize(x, y, width, height) {
            super.initialize(x, y, width, height);
            this._data = [];
            this.refresh();
        }

        maxItems() {
            return (
                (this._data ? this._data.length : 0) +
                (Torigoya.Achievement2.parameter.achievementMenuCancelMessage ? 1 : 0)
            );
        }

        item() {
            return this._data ? this._data[this.index()] : null;
        }

        makeItemList() {
            this._data = Torigoya.Achievement2.Manager.data().filter((param) => this.isVisibleItem(param));
        }

        isCurrentItemEnabled() {
            return !this.item();
        }

        isVisibleItem({ achievement, unlockInfo }) {
            if (unlockInfo) return true;
            return !achievement.isSecret;
        }

        drawItem(index) {
            const item = this._data[index];
            const rect = this.itemRect(index);
            this.resetFontSettings();

            if (item) {
                const iconWidth = Window_Base._iconWidth + 4;
                if (item.unlockInfo) {
                    this.changePaintOpacity(true);
                    this.drawIcon(item.achievement.icon, rect.x, rect.y);
                    this.drawText(item.achievement.title, rect.x + iconWidth, rect.y, rect.width - iconWidth, 'left');
                } else {
                    this.changePaintOpacity(false);
                    this.drawIcon(Torigoya.Achievement2.parameter.achievementMenuHiddenIcon, rect.x, rect.y);
                    this.drawText(
                        Torigoya.Achievement2.parameter.achievementMenuHiddenTitle,
                        rect.x + iconWidth,
                        rect.y,
                        rect.width - iconWidth,
                        'left'
                    );
                }
            } else {
                this.changePaintOpacity(true);
                this.drawText(
                    Torigoya.Achievement2.parameter.achievementMenuCancelMessage,
                    rect.x,
                    rect.y,
                    rect.width,
                    'center'
                );
            }
        }

        refresh() {
            this.makeItemList();
            this.drawAllItems();
        }

        updateHelp() {
            const item = this.item();
            if (item) {
                this.setHelpWindowItem({
                    description: item.unlockInfo
                        ? item.achievement.description
                        : item.achievement.hint || item.achievement.description,
                });
            } else {
                this.setHelpWindowItem(null);
            }
        }

        playBuzzerSound() {
            // nothing to do
        }
    }

    Torigoya.Achievement2.Window_AchievementList = Window_AchievementList;

    // -------------------------------------------------------------------------
    // 実績表示シーン

    class Scene_Achievement extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();

            const wy = this._helpWindow.y + this._helpWindow.height;
            const wh = Graphics.boxHeight - wy;
            this._listWindow = new Window_AchievementList(0, wy, Graphics.boxWidth, wh);
            this._listWindow.setHandler('ok', this.onListOk.bind(this));
            this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
            this._listWindow.setHelpWindow(this._helpWindow);
            this.addWindow(this._listWindow);
        }

        start() {
            super.start();
            this._listWindow.select(0);
            this._listWindow.activate();
        }

        onListOk() {
            this.onListCancel();
        }

        onListCancel() {
            this.popScene();
        }
    }

    Torigoya.Achievement2.Scene_Achievement = Scene_Achievement;

    (() => {
        // -------------------------------------------------------------------------
        // 保存系処理

        const upstream_StorageManager_localFilePath = StorageManager.localFilePath;
        StorageManager.localFilePath = function (savefileId) {
            if (savefileId === Torigoya.Achievement2.saveSlotID) {
                return ''.concat(this.localFileDirectoryPath(), 'achievements.rpgsave');
            }
            return upstream_StorageManager_localFilePath.apply(this, arguments);
        };

        const upstream_StorageManager_webStorageKey = StorageManager.webStorageKey;
        StorageManager.webStorageKey = function (savefileId) {
            if (savefileId === Torigoya.Achievement2.saveSlotID) {
                return Torigoya.Achievement2.parameter.baseSaveSlot;
            }
            return upstream_StorageManager_webStorageKey.apply(this, arguments);
        };

        // -------------------------------------------------------------------------
        // タイトル画面への追加

        if (Torigoya.Achievement2.parameter.titleMenuUseInTitle) {
            const upstream_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
            Window_TitleCommand.prototype.makeCommandList = function () {
                upstream_Window_TitleCommand_makeCommandList.apply(this);
                this.addCommand(Torigoya.Achievement2.parameter.titleMenuText, 'Torigoya_Achievement', true);
            };

            const upstream_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
            Scene_Title.prototype.createCommandWindow = function () {
                upstream_Scene_Title_createCommandWindow.apply(this);
                this._commandWindow.setHandler('Torigoya_Achievement', this.commandTorigoyaAchievement.bind(this));
            };

            Scene_Title.prototype.commandTorigoyaAchievement = function () {
                this._commandWindow.close();
                SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
            };
        }

        // -------------------------------------------------------------------------
        // メニュー画面への追加

        if (Torigoya.Achievement2.parameter.titleMenuUseInMenu) {
            const upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
            Window_MenuCommand.prototype.addOriginalCommands = function () {
                upstream_Window_MenuCommand_addOriginalCommands.apply(this);
                this.addCommand(Torigoya.Achievement2.parameter.titleMenuText, 'Torigoya_Achievement', true);
            };

            const upstream_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
            Scene_Menu.prototype.createCommandWindow = function () {
                upstream_Scene_Menu_createCommandWindow.apply(this);
                this._commandWindow.setHandler('Torigoya_Achievement', this.commandTorigoyaAchievement.bind(this));
            };

            Scene_Menu.prototype.commandTorigoyaAchievement = function () {
                SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
            };
        }

        // -------------------------------------------------------------------------
        // 起動処理

        const upstream_Scene_Boot_create = Scene_Boot.prototype.create;
        Scene_Boot.prototype.create = function () {
            upstream_Scene_Boot_create.apply(this);
            ImageManager.reserveSystem(Torigoya.Achievement2.parameter.popupWindowImage);
            Torigoya.Achievement2.Manager.init();
        };

        const upstream_Scene_Boot_start = Scene_Boot.prototype.start;
        Scene_Boot.prototype.start = function () {
            upstream_Scene_Boot_start.apply(this);
            if (Torigoya.Achievement2.parameter.popupEnable) {
                Torigoya.Achievement2.PopupManager.init();
            }
        };

        const upstream_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
        Scene_Boot.prototype.isReady = function () {
            return upstream_Scene_Boot_isReady.apply(this) && Torigoya.Achievement2.Manager.isReady();
        };

        // -------------------------------------------------------------------------
        // プラグインコマンド

        const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            switch (command) {
                case 'Achievement':
                case 'GetAchievement':
                case '実績':
                case '実績獲得':
                    Torigoya.Achievement2.Manager.unlock(''.concat(args[0]).trim());
                    return;
                case 'RemoveAchievement':
                case '実績消去':
                case '実績削除':
                    Torigoya.Achievement2.Manager.remove(''.concat(args[0]).trim());
                    return;
                case 'ShowAchievement':
                case '実績表示':
                    SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
                    return;
                case 'ResetAchievement':
                case '実績リセット':
                    Torigoya.Achievement2.Manager.clear();
                    return;
            }

            upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
        };
    })();
})();
