/*---------------------------------------------------------------------------*
 * TorigoyaMZ_Achievement2_AddonCategory.js v.1.1.0
 *---------------------------------------------------------------------------*
 * 2020/08/25 01:23 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 実績プラグインアドオン: カテゴリ設定 (v.1.1.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.1.0
 * @base TorigoyaMZ_Achievement2
 * @orderAfter TorigoyaMZ_Achievement2
 * @help
 * 実績プラグインアドオン: カテゴリ設定 (v.1.1.0)
 *
 * このプラグインは「実績プラグイン」のアドオンです。
 * 実績プラグインより下に導入してください。
 *
 * 獲得した実績をカテゴリ別に表示するようにします。
 * カテゴリの分類はこのプラグインの設定で行ってください。
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param categories
 * @text カテゴリ設定
 * @desc カテゴリを設定します。
 * 必要な個数追加してください。
 * @type struct<Category>[]
 * @parent base
 * @default []
 *
 * @param position
 * @text カテゴリ位置
 * @desc カテゴリリストの表示位置を設定します。
 * @type select
 * @parent base
 * @option 左（縦向き）
 * @value left
 * @option 上（横向き）
 * @value top
 * @option 右（縦向き）
 * @value right
 * @default top
 *
 * @param maxCols
 * @text 最大列数
 * @desc 一度に表示するカテゴリの最大数
 * ※カテゴリ位置が「上」のときだけ有効
 * @type number
 * @parent base
 * @default 4
 */

/*~struct~Category:
 * @param name
 * @text カテゴリ名
 * @desc カテゴリの名前。
 * ここで設定した名前をメモ欄で指定してください。
 * @type string
 * @default
 *
 * @param prefix
 * @text 自動割当のID命名規則
 * @desc ここに設定した文字列で始まるIDの実績を
 * このカテゴリに自動割当します（空欄の場合は無し）
 * @type string
 * @default
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_Achievement2_AddonCategory';
    }

    function pickStringValueFromParameter(parameter, key) {
        return ''.concat(parameter[key] || '');
    }

    function pickNumberValueFromParameter(parameter, key) {
        return parseFloat(parameter[key]);
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.0',
            categories: ((parameters) => {
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    if (typeof parameter === 'string') parameter = JSON.parse(parameter);
                    return {
                        name: pickStringValueFromParameter(parameter, 'name'),
                        prefix: pickStringValueFromParameter(parameter, 'prefix'),
                    };
                });
            })(parameter.categories),
            position: pickStringValueFromParameter(parameter, 'position'),
            maxCols: pickNumberValueFromParameter(parameter, 'maxCols'),
        };
    }

    function checkPlugin(obj, errorMessage) {
        if (typeof obj !== 'undefined') return;
        alert(errorMessage);
        throw errorMessage;
    }

    checkPlugin(Torigoya.Achievement2, '「実績アドオン:カテゴリ設定」より上に「実績プラグイン」が導入されていません。');

    Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
    Torigoya.Achievement2.Addons.Category = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    class Window_AchievementCategory extends Window_Command {
        constructor(rect) {
            super(rect);
            this._listWindow = null;
        }

        maxCols() {
            if (Torigoya.Achievement2.Addons.Category.parameter.position === 'top') {
                return Math.min(
                    Torigoya.Achievement2.Addons.Category.parameter.categories.length,
                    Torigoya.Achievement2.Addons.Category.parameter.maxCols
                );
            } else {
                return 1;
            }
        }

        makeCommandList() {
            Torigoya.Achievement2.Addons.Category.parameter.categories.forEach((category) => {
                this.addCommand(category.name, 'category_'.concat(category.name), true, category);
            });
        }

        update() {
            super.update();
            if (this._listWindow) {
                this._listWindow.setCategory(this.currentExt());
            }
        }

        setListWindow(listWindow) {
            this._listWindow = listWindow;
            if (this._listWindow) this._listWindow.setCategory(this.currentExt());
        }
    }

    Torigoya.Achievement2.Addons.Category.Window_AchievementCategory = Window_AchievementCategory;

    (() => {
        const Window_AchievementList = Torigoya.Achievement2.Window_AchievementList;

        const upstream_Window_AchievementList_makeItemList = Window_AchievementList.prototype.makeItemList;
        Window_AchievementList.prototype.makeItemList = function () {
            upstream_Window_AchievementList_makeItemList.apply(this);
            this._data = this._data.filter((item) => {
                if (!this._category) return false;
                const itemCategory = (
                    item.achievement.meta['カテゴリー'] ||
                    item.achievement.meta['カテゴリ'] ||
                    item.achievement.meta['Category'] ||
                    ''
                ).trim();

                return (
                    itemCategory === this._category.name ||
                    (this._category.prefix && item.achievement.key.startsWith(this._category.prefix))
                );
            });
        };

        Window_AchievementList.prototype.setCategory = function (category) {
            if (this._category === category) return;
            this._category = category;
            this.refresh();
            this.scrollTo(0, 0);
        };
    })();

    (() => {
        const Scene_Achievement = Torigoya.Achievement2.Scene_Achievement;

        const upstream_Scene_Achievement_create = Scene_Achievement.prototype.create;
        Scene_Achievement.prototype.create = function () {
            upstream_Scene_Achievement_create.apply(this);

            this._categoryWindow = new Window_AchievementCategory(this.categoryWindowRect());
            this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
            this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
            this._categoryWindow.setListWindow(this._listWindow);
            this.addWindow(this._categoryWindow);
        };

        const upstream_Scene_Achievement_listWindowRect = Scene_Achievement.prototype.listWindowRect;
        Scene_Achievement.prototype.listWindowRect = function () {
            const rect = upstream_Scene_Achievement_listWindowRect.apply(this);
            const categoryRect = this.categoryWindowRect();

            const { position } = Torigoya.Achievement2.Addons.Category.parameter;
            switch (position) {
                case 'left':
                    rect.x += categoryRect.width;
                    rect.width -= categoryRect.width;
                    break;
                case 'top':
                    rect.y += categoryRect.height;
                    rect.height -= categoryRect.height;
                    break;
                case 'right':
                    rect.width -= categoryRect.width;
                    break;
            }

            return rect;
        };

        Scene_Achievement.prototype.categoryWindowRect = function () {
            const { position } = Torigoya.Achievement2.Addons.Category.parameter;

            if (position === 'top') {
                const length = Math.ceil(
                    Torigoya.Achievement2.Addons.Category.parameter.categories.length /
                        Torigoya.Achievement2.Addons.Category.parameter.maxCols
                );

                const wx = 0;
                const wy = this.mainAreaTop();
                const ww = Graphics.boxWidth;
                const wh = this.calcWindowHeight(length, true);
                return new Rectangle(wx, wy, ww, wh);
            } else {
                const ww = this.mainCommandWidth();
                const wh = this.mainAreaHeight();
                const wx = position === 'left' ? 0 : Graphics.boxWidth - ww;
                const wy = this.mainAreaTop();
                return new Rectangle(wx, wy, ww, wh);
            }
        };

        const upstream_Scene_Achievement_start = Scene_Achievement.prototype.start;
        Scene_Achievement.prototype.start = function () {
            upstream_Scene_Achievement_start.apply(this);
            this._listWindow.select(-1);
            this._listWindow.deactivate();
            this._categoryWindow.activate();
        };

        Scene_Achievement.prototype.onCategoryOk = function () {
            this._listWindow.select(0);
            this._listWindow.activate();
            this._categoryWindow.deactivate();
        };

        Scene_Achievement.prototype.onCategoryCancel = function () {
            this.popScene();
        };

        Scene_Achievement.prototype.onListCancel = function () {
            this._listWindow.select(-1);
            this._listWindow.deactivate();
            this._categoryWindow.activate();
            this._helpWindow.clear();
        };
    })();
})();
