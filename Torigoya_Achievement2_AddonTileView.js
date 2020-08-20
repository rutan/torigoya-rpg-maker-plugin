/*---------------------------------------------------------------------------*
 * Torigoya_Achievement2_AddonTileView.js v.0.0.0
 *---------------------------------------------------------------------------*
 * 2020/08/20 16:23 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc 実績プラグインアドオン: タイル表示 (v.0.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 0.0.0
 * @help
 * 実績プラグインアドオン: タイル表示 (v.0.0.0)
 *
 * このプラグインは「実績プラグイン」のアドオンです。
 * 実績プラグインより下に導入してください。
 *
 * 獲得した実績の一覧画面をテキストではなく
 * アイコンで表示するように変更します
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param colsSize
 * @text 表示数（横）
 * @desc 一列に表示するアイコンの個数
 * @type number
 * @parent base
 * @min 1
 * @default 5
 *
 * @param itemPadding
 * @text アイコンの余白
 * @desc アイコンの周囲の余白(px)
 * @type number
 * @parent base
 * @min 0
 * @default 5
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_Achievement2_AddonTileView';
    }

    function pickNumberValueFromParameter(parameter, key) {
        return parseFloat(parameter[key]);
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '0.0.0',
            colsSize: pickNumberValueFromParameter(parameter, 'colsSize'),
            itemPadding: pickNumberValueFromParameter(parameter, 'itemPadding'),
        };
    }

    function checkPlugin(obj, errorMessage) {
        if (typeof obj !== 'undefined') return;
        alert(errorMessage);
        throw errorMessage;
    }

    checkPlugin(Torigoya.Achievement2, '「実績アドオン:タイル表示」より上に「実績プラグイン」が導入されていません。');

    Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
    Torigoya.Achievement2.Addons.TileView = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        const Window_AchievementList = Torigoya.Achievement2.Window_AchievementList;
        const parameter = Torigoya.Achievement2.Addons.TileView.parameter;
        const useCancelMessage = !!Torigoya.Achievement2.parameter.achievementMenuCancelMessage;

        const upstream_Window_AchievementList_initialize = Window_AchievementList.prototype.initialize;
        Window_AchievementList.prototype.initialize = function (x, y, width, height) {
            upstream_Window_AchievementList_initialize.apply(this, arguments);

            const h = useCancelMessage
                ? Math.ceil((this.maxItems() - 1) / this.maxCols()) + 1
                : Math.ceil(this.maxItems() / this.maxCols());

            this.width = Math.min(
                this.maxCols() * this.itemWidth() + (this.maxCols() - 1) * this.spacing() + this.padding * 2,
                width
            );

            this.height = Math.min(h * this.itemHeight() + this.padding * 2, height);
            this.x = x + (width - this.width) / 2;
            this.y = y + (height - this.height) / 2;

            this.refresh();
        };

        Window_AchievementList.prototype.maxCols = function () {
            return parameter.colsSize;
        };

        Window_AchievementList.prototype.itemWidth = function () {
            return Window_Base._iconWidth + parameter.itemPadding * 2;
        };

        Window_AchievementList.prototype.itemHeight = function () {
            return Window_Base._iconHeight + parameter.itemPadding * 2;
        };

        Window_AchievementList.prototype.lineHeight = function () {
            return this.itemHeight();
        };

        Window_AchievementList.prototype.drawItem = function (index) {
            const item = this._data[index];
            const rect = this.itemRect(index);
            this.resetFontSettings();

            if (item) {
                if (item.unlockInfo) {
                    this.changePaintOpacity(true);
                    this.drawIcon(
                        item.achievement.icon,
                        rect.x + parameter.itemPadding,
                        rect.y + parameter.itemPadding
                    );
                } else {
                    this.changePaintOpacity(false);
                    this.drawIcon(
                        Torigoya.Achievement2.parameter.achievementMenuHiddenIcon,
                        rect.x + parameter.itemPadding,
                        rect.y + parameter.itemPadding
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
        };

        // キャンセルボタン描画用の処理
        if (useCancelMessage) {
            const upstream_Window_AchievementList_itemRect = Window_AchievementList.prototype.itemRect;
            Window_AchievementList.prototype.itemRect = function (index) {
                const item = this._data[index];
                if (item) return upstream_Window_AchievementList_itemRect.apply(this, arguments);

                const rect = new Rectangle();
                rect.width = this.width - this.padding * 2;
                rect.height = this.itemHeight();
                rect.x = -this._scrollX;
                rect.y = Math.ceil((this.maxItems() - 1) / this.maxCols()) * rect.height - this._scrollY;
                return rect;
            };

            Window_AchievementList.prototype.cursorUp = function (wrap) {
                const index = this.index();
                const maxItems = this.maxItems();
                const maxCols = this.maxCols();
                if (index === maxItems - 1) {
                    this.select(index - 1);
                } else if (index >= maxCols || (wrap && maxCols === 1)) {
                    this.select((index - maxCols + maxItems) % maxItems);
                }
            };

            Window_AchievementList.prototype.cursorDown = function (wrap) {
                const index = this.index();
                const maxItems = this.maxItems();
                const maxCols = this.maxCols();
                if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
                    this.select((index + maxCols) % maxItems);
                } else {
                    this.select(maxItems - 1);
                }
            };
        }
    })();
})();
