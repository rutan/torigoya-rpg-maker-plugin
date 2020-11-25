/*---------------------------------------------------------------------------*
 * Torigoya_Achievement2_AddonUseSaveSlot.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/11/26 00:53 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc 実績プラグインアドオン: セーブ別実績 (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_Achievement2_AddonUseSaveSlot.js
 * @help
 * 実績プラグインアドオン: セーブ別実績 (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * このプラグインは「実績プラグイン」のアドオンです。
 * 実績プラグインより下に導入してください。
 *
 * 実績をセーブ別に保存するようにします。
 * このプラグインに設定項目はありません。
 *
 * 【注意】
 * このアドオンを有効にすると、タイトル画面での実績表示は正常に動きません。
 * 実績プラグインの設定で、タイトル画面でのメニュー表示をOFFにしてください。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_Achievement2_AddonUseSaveSlot';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    function checkPlugin(obj, errorMessage) {
        if (typeof obj !== 'undefined') return;
        alert(errorMessage);
        throw errorMessage;
    }

    checkPlugin(Torigoya.Achievement2, '「実績アドオン:セーブ別実績」より上に「実績プラグイン」が導入されていません。');

    Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
    Torigoya.Achievement2.Addons.UseSaveSlot = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // Manager

        Torigoya.Achievement2.Manager.options.onInit = function (manager) {
            manager.setAchievements(Torigoya.Achievement2.parameter.baseAchievementData);
        };

        Torigoya.Achievement2.Manager.options.onSave = null;

        // -------------------------------------------------------------------------
        // DataManager

        const upstream_DataManager_createGameObjects = DataManager.createGameObjects;
        DataManager.createGameObjects = function () {
            upstream_DataManager_createGameObjects.apply(this);
            Torigoya.Achievement2.Manager.resetData();
        };

        const upstream_DataManager_makeSaveContents = DataManager.makeSaveContents;
        DataManager.makeSaveContents = function () {
            const contents = upstream_DataManager_makeSaveContents.apply(this);
            contents.torigoyaAchievement2 = Torigoya.Achievement2.Manager.createSaveContents();
            return contents;
        };

        const upstream_DataManager_extractSaveContents = DataManager.extractSaveContents;
        DataManager.extractSaveContents = function (contents) {
            upstream_DataManager_extractSaveContents.apply(this, arguments);

            const { torigoyaAchievement2 } = contents;
            if (torigoyaAchievement2) {
                Torigoya.Achievement2.Manager.extractSaveContents(torigoyaAchievement2);
            }
        };
    })();
})();
