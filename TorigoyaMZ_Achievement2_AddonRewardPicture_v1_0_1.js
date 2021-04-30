/*---------------------------------------------------------------------------*
 * TorigoyaMZ_Achievement2_AddonRewardPicture.js v.1.0.1
 *---------------------------------------------------------------------------*
 * 2021/05/01 01:20 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 実績プラグインアドオン: ご褒美ピクチャー (v.1.0.1)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.1
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_Achievement2_AddonRewardPicture.js
 * @base TorigoyaMZ_Achievement2
 * @orderAfter TorigoyaMZ_Achievement2
 * @help
 * 実績プラグインアドオン: ご褒美ピクチャー (v.1.0.1)
 * https://torigoya-plugin.rutan.dev
 *
 * このプラグインは「実績プラグイン」のアドオンです。
 * 実績プラグインより下に導入してください。
 *
 * 実績を獲得した人だけが見られるご褒美画像を設定できるようにします。
 * 画像ファイルはピクチャー用のフォルダに入れてください。
 *
 * ------------------------------------------------------------
 * ■ 設定方法（ちょっとめんどい）
 * ------------------------------------------------------------
 * このプラグインの右側の設定で、
 * 「どの実績IDに、何の画像を指定するか」を設定できます。
 *
 * 実績プラグイン本体のほうで設定した各実績のIDに
 * ピクチャー画像を紐付ける形で登録してください。
 * （画像を登録していない実績があっても大丈夫です）
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param baseRewardData
 * @text ご褒美ピクチャーの登録
 * @type struct<RewardPicture>[]
 * @parent base
 * @default []
 */

/*~struct~RewardPicture:
 * @param key
 * @text 実績ID
 * @desc ご褒美ピクチャーを設定する対象の
 * 実績プラグインで設定した実績IDを指定してください。
 * @type string
 * @default
 *
 * @param picture
 * @text ご褒美の画像
 * @desc ご褒美として表示する画像を選択してください。
 * 画像は複数枚指定可能です。
 * @type file[]
 * @require true
 * @dir img/pictures
 * @default []
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_Achievement2_AddonRewardPicture';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return ''.concat(parameter[key] || '');
    }

    function pickStringValueFromParameterList(parameter, key, defaultValue = []) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parameter[key] ? JSON.parse(parameter[key]) : [];
    }

    function pickStructRewardPicture(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            key: pickStringValueFromParameter(parameter, 'key', ''),
            picture: pickStringValueFromParameterList(parameter, 'picture', []),
        };
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.1',
            baseRewardData: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructRewardPicture(parameter);
                });
            })(parameter.baseRewardData),
        };
    }

    function checkPlugin(obj, errorMessage) {
        if (typeof obj !== 'undefined') return;
        alert(errorMessage);
        throw errorMessage;
    }

    checkPlugin(
        Torigoya.Achievement2,
        '「実績アドオン:ご褒美ピクチャー」より上に「実績プラグイン」が導入されていません。'
    );

    Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
    Torigoya.Achievement2.Addons.RewardPicture = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        function findRewardPicture(item) {
            if (!item) return null;
            return Torigoya.Achievement2.Addons.RewardPicture.parameter.baseRewardData.find(
                (n) => n.key === item.achievement.key
            );
        }

        // -------------------------------------------------------------------------
        // Window_AchievementReward

        class Window_AchievementReward extends Window_Selectable {
            initialize(rect) {
                super.initialize(rect);
                this.opacity = 0;
                this._pageIndex = 0;
            }

            maxItems() {
                return 1;
            }

            itemPadding() {
                return 0;
            }

            itemHeight() {
                return this.innerHeight;
            }

            setReward(reward) {
                this._reward = reward;
                this._pageIndex = 0;
                this.forceSelect(0);
                this.setCursorFixed(true);
                this.refresh();
            }

            refresh() {
                this.contents.clear();
                if (!this._reward) return;

                const picture = this.currentPicture();
                const bitmap = ImageManager.loadPicture(picture);
                if (bitmap.isReady()) {
                    this._drawRewardPicture(bitmap);
                } else {
                    bitmap.addLoadListener(() => {
                        if (picture !== this.currentPicture()) return;
                        this._drawRewardPicture(bitmap);
                    });
                }
            }

            currentPicture() {
                if (!this._reward) return null;
                return this._reward.picture[this._pageIndex];
            }

            hasNextPicture() {
                if (!this._reward) return false;
                return !!this._reward.picture[this._pageIndex + 1];
            }

            changeNextPage() {
                ++this._pageIndex;
                this.refresh();
            }

            _drawRewardPicture(bitmap) {
                this.contents.clear();

                const r = Math.min(1, this.itemWidth() / bitmap.width, this.itemHeight() / bitmap.height);
                const drawWidth = Math.round(bitmap.width * r);
                const drawHeight = Math.round(bitmap.height * r);

                this.contents.blt(
                    bitmap,
                    0,
                    0,
                    bitmap.width,
                    bitmap.height,
                    (this.itemWidth() - drawWidth) / 2,
                    (this.itemHeight() - drawHeight) / 2,
                    drawWidth,
                    drawHeight
                );
            }

            _makeCursorAlpha() {
                return 0;
            }
        }

        Torigoya.Achievement2.Addons.RewardPicture.Window_AchievementReward = Window_AchievementReward;

        // -------------------------------------------------------------------------
        // Window_AchievementList

        const upstream_Window_AchievementList_isCurrentItemEnabled =
            Torigoya.Achievement2.Window_AchievementList.prototype.isCurrentItemEnabled;
        Torigoya.Achievement2.Window_AchievementList.prototype.isCurrentItemEnabled = function () {
            const item = this.item();
            if (item && item.unlockInfo && findRewardPicture(item)) return true;
            return upstream_Window_AchievementList_isCurrentItemEnabled.apply(this);
        };

        // -------------------------------------------------------------------------
        // Scene_Achievement

        const upstream_Scene_Achievement_create = Torigoya.Achievement2.Scene_Achievement.prototype.create;
        Torigoya.Achievement2.Scene_Achievement.prototype.create = function () {
            upstream_Scene_Achievement_create.apply(this);

            this._rewardWindow = new Window_AchievementReward(this.rewardWindowRect());
            this._rewardWindow.setHandler('ok', this.onRewardOk.bind(this));
            this._rewardWindow.setHandler('cancel', this.onRewardCancel.bind(this));
            this._rewardWindow.hide();
            this.addWindow(this._rewardWindow);
        };

        Torigoya.Achievement2.Scene_Achievement.prototype.rewardWindowRect = function () {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        };

        Torigoya.Achievement2.Scene_Achievement.prototype.onRewardOk = function () {
            if (this._rewardWindow.hasNextPicture()) {
                this._rewardWindow.changeNextPage();
                this._rewardWindow.activate();
            } else {
                this.hideRewardWindow();
            }
        };

        Torigoya.Achievement2.Scene_Achievement.prototype.onRewardCancel = function () {
            this.hideRewardWindow();
        };

        const upstream_Scene_Achievement_onListOk = Torigoya.Achievement2.Scene_Achievement.prototype.onListOk;
        Torigoya.Achievement2.Scene_Achievement.prototype.onListOk = function () {
            const reward = findRewardPicture(this._listWindow.item());
            if (reward) {
                this._rewardWindow.setReward(reward);
                this.showRewardWindow();
            } else {
                upstream_Scene_Achievement_onListOk.apply(this);
            }
        };

        Torigoya.Achievement2.Scene_Achievement.prototype.showRewardWindow = function () {
            const activeWindows = this._windowLayer.children.filter((win) => {
                if (win instanceof Sprite_Button) return false;
                return !win._hidden;
            });
            this._rewardHideWindows = activeWindows;
            activeWindows.forEach((win) => win.hide());

            this._rewardWindow.show();
            this._rewardWindow.activate();
        };

        Torigoya.Achievement2.Scene_Achievement.prototype.hideRewardWindow = function () {
            if (this._rewardHideWindows) {
                this._rewardHideWindows.forEach((win) => win.show());
                this._rewardHideWindows = null;
            }
            this._rewardWindow.hide();
            this._listWindow.show();
            this._listWindow.activate();
        };
    })();
})();
