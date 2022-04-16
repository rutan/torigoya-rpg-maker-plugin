/*---------------------------------------------------------------------------*
 * TorigoyaMZ_CommonMenu.js v.1.2.0
 *---------------------------------------------------------------------------*
 * 2022/04/17 02:48 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc メニューからコモンイベント呼び出しプラグイン (v.1.2.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.2.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_CommonMenu.js
 * @help
 * メニューからコモンイベント呼び出しプラグイン (v.1.2.0)
 * https://torigoya-plugin.rutan.dev
 *
 * メニューにコモンイベントを呼び出す項目を追加します
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 *
 * このプラグインの設定からメニュー項目を登録してください。
 * ここでの並び順の順番で画面に表示されます。
 *
 * ------------------------------------------------------------
 * ■ PluginCommonBase.js 連携
 * ------------------------------------------------------------
 *
 * このプラグインは PluginCommonBase.js に対応しています。
 * PluginCommonBase.js を導入している場合、
 * メニュー項目の名前に変数（\V[123]）など一部の制御文字を利用できます。
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param baseItems
 * @text メニューに追加する項目
 * @type struct<MenuItem>[]
 * @parent base
 * @default ["{\"name\": \"コモンイベント\",\"commonEvent\": \"1\",\"switchId\": \"0\",\"visibility\": \"true\",\"note\": \"\"}"]
 */

/*~struct~MenuItem:
 * @param name
 * @text 項目名
 * @desc メニューに表示される項目の名前
 * @type string
 * @default
 *
 * @param commonEvent
 * @text 呼び出すコモンイベント
 * @desc メニュー選択時に呼び出すコモンイベント
 * @type common_event
 * @default 0
 *
 * @param switchId
 * @text 有効スイッチ
 * @desc このスイッチがONのときのみ選択できるようにします
 * なしの場合は、常に選択できます
 * @type switch
 * @default 0
 *
 * @param visibility
 * @text 無効時に表示するか
 * @desc 有効スイッチがONじゃないときに
 * 項目をメニューに表示するか設定できます
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param note
 * @text メモ
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
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_CommonMenu';
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

    function pickStructMenuItem(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            name: pickStringValueFromParameter(parameter, 'name', ''),
            commonEvent: pickIntegerValueFromParameter(parameter, 'commonEvent', 0),
            switchId: pickIntegerValueFromParameter(parameter, 'switchId', 0),
            visibility: pickBooleanValueFromParameter(parameter, 'visibility', 'true'),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.2.0',
            baseItems: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructMenuItem(parameter);
                });
            })(parameter.baseItems),
        };
    }

    Torigoya.CommonMenu = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        /**
         * メニュー項目の追加
         * @param item
         * @param index
         */
        Window_MenuCommand.prototype.torigoyaCommonMenu_addCommand = function (item, index) {
            const enabled = this.torigoyaCommonMenu_isEnable(item);
            if (!enabled && !this.torigoyaCommonMenu_isVisibility(item)) return;

            this.addCommand(this.torigoyaCommonMenu_itemName(item), `TorigoyaCommonMenu_${index}`, enabled);
        };

        /**
         * メニュー項目が有効であるか？
         * @param item
         * @returns {boolean}
         */
        Window_MenuCommand.prototype.torigoyaCommonMenu_isEnable = function (item) {
            return item.switchId ? $gameSwitches.value(parseInt(item.switchId, 10)) : true;
        };

        /**
         * メニュー項目が可視状態であるか？
         * @param item
         * @returns {boolean}
         */
        Window_MenuCommand.prototype.torigoyaCommonMenu_isVisibility = function (item) {
            return item.visibility;
        };

        /**
         * メニュー項目の名前を取得
         * @param item
         * @returns {string}
         */
        Window_MenuCommand.prototype.torigoyaCommonMenu_itemName = function (item) {
            if (!item) return '';

            if (window.PluginManagerEx && window.PluginManagerEx.convertEscapeCharacters) {
                return window.PluginManagerEx.convertEscapeCharacters(item.name);
            }
            return item.name;
        };

        const upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            upstream_Window_MenuCommand_addOriginalCommands.apply(this);

            Torigoya.CommonMenu.parameter.baseItems.forEach(this.torigoyaCommonMenu_addCommand.bind(this));
        };

        const upstream_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            upstream_Scene_Menu_createCommandWindow.apply(this);

            Torigoya.CommonMenu.parameter.baseItems.forEach((item, i) => {
                const id = parseInt(item.commonEvent, 10);
                if (!id) return;

                this._commandWindow.setHandler(`TorigoyaCommonMenu_${i}`, () => {
                    $gameTemp.reserveCommonEvent(id);
                    SceneManager.goto(Scene_Map);
                });
            });
        };
    })();
})();
