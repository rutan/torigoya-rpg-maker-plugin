/*---------------------------------------------------------------------------*
 * TorigoyaMZ_Achievement2_AddonCategory.js v.1.3.0
 *---------------------------------------------------------------------------*
 * 2021/08/15 15:33 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 実績プラグインアドオン: カテゴリ設定 (v.1.3.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.3.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_Achievement2_AddonCategory.js
 * @base TorigoyaMZ_Achievement2
 * @orderAfter TorigoyaMZ_Achievement2
 * @help
 * 実績プラグインアドオン: カテゴリ設定 (v.1.3.0)
 * https://torigoya-plugin.rutan.dev
 *
 * このプラグインは「実績プラグイン」のアドオンです。
 * 実績プラグインより下に導入してください。
 *
 * 獲得した実績をカテゴリ別に表示するようにします。
 *
 * ------------------------------------------------------------
 * ■ カテゴリの種類を定義する
 * ------------------------------------------------------------
 *
 * このプラグインの設定で行います。
 * 右のプラグイン設定から、画面に従って必要なカテゴリを作成してください。
 *
 * ＜カテゴリの自動割当＞
 * 実績プラグインで設定する管理IDの
 * 先頭についている文字列を使って
 * 自動的にカテゴリを割当することができます。
 *
 * 例えば
 * ・ストーリー_ハジメ村に到着
 * ・ストーリー_ハジメ村ボス撃破
 * のような管理IDをつけた実績がある場合
 * 「ストーリー」と指定することで、個別の設定をしなくても
 * カテゴリが設定できます。
 *
 * ------------------------------------------------------------
 * ■ 各実績に個別にカテゴリを設定する
 * ------------------------------------------------------------
 *
 * 【このプラグインではなく、実績プラグインの設定】で行います。
 *
 * 実績プラグインに実績を登録する画面にメモ欄があります。
 * そのメモ欄に以下のように設定してください。
 *
 * <カテゴリ: カテゴリの名前>
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
 *
 * @command gainAchievementCategory
 * @text 指定カテゴリの全実績を獲得
 * @desc 指定カテゴリの実績を獲得します
 *
 * @arg category
 * @text カテゴリ名
 * @desc 獲得したい実績に設定したカテゴリ名を指定
 * @type string
 *
 * @command removeAchievementCategory
 * @text 指定カテゴリの全実績を削除
 * @desc 指定カテゴリの実績を未獲得状態にします。
 * 未獲得だった場合は何もしません。
 *
 * @arg category
 * @text カテゴリ名
 * @desc 削除したい実績に設定したカテゴリ名を指定
 * @type string
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

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return ''.concat(parameter[key] || '');
    }

    function pickNumberValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseFloat(parameter[key]);
    }

    function pickStructCategory(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            name: pickStringValueFromParameter(parameter, 'name', ''),
            prefix: pickStringValueFromParameter(parameter, 'prefix', ''),
        };
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.3.0',
            categories: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructCategory(parameter);
                });
            })(parameter.categories),
            position: pickStringValueFromParameter(parameter, 'position', 'top'),
            maxCols: pickNumberValueFromParameter(parameter, 'maxCols', 4),
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

    function readCategoryName(achievement) {
        const category = (
            achievement.meta['カテゴリー'] ||
            achievement.meta['カテゴリ'] ||
            achievement.meta['Category'] ||
            ''
        ).trim();
        if (category) return category;

        const autoCategory = Torigoya.Achievement2.Addons.Category.parameter.categories.find((category) => {
            return category.prefix && achievement.key.startsWith(category.prefix);
        });
        return autoCategory ? autoCategory.name : '';
    }

    Torigoya.Achievement2.Addons.Category.readCategoryName = readCategoryName;

    (() => {
        const Window_AchievementList = Torigoya.Achievement2.Window_AchievementList;

        const upstream_Window_AchievementList_makeItemList = Window_AchievementList.prototype.makeItemList;
        Window_AchievementList.prototype.makeItemList = function () {
            upstream_Window_AchievementList_makeItemList.apply(this);
            this._data = this._data.filter((item) => {
                return this._category && this._category.name === readCategoryName(item.achievement);
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

        // -------------------------------------------------------------------------
        // プラグインコマンド

        function commandGainAchievementCategory({ category }) {
            Torigoya.Achievement2.Manager.achievements.forEach((achievement) => {
                if (readCategoryName(achievement) !== category) return;
                Torigoya.Achievement2.Manager.unlock(achievement.key);
            });
        }

        function commandRemoveAchievementCategory({ category }) {
            Torigoya.Achievement2.Manager.achievements.forEach((achievement) => {
                if (readCategoryName(achievement) !== category) return;
                Torigoya.Achievement2.Manager.remove(achievement.key);
            });
        }

        PluginManager.registerCommand(
            Torigoya.Achievement2.Addons.Category.name,
            'gainAchievementCategory',
            commandGainAchievementCategory
        );

        PluginManager.registerCommand(
            Torigoya.Achievement2.Addons.Category.name,
            'removeAchievementCategory',
            commandRemoveAchievementCategory
        );
    })();
})();
