/*---------------------------------------------------------------------------*
 * TorigoyaMZ_Achievement2_AddonRewardEvent.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2022/04/29 18:11 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 実績プラグインアドオン: ご褒美コモンイベント (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_Achievement2_AddonRewardEvent.js
 * @base TorigoyaMZ_Achievement2
 * @orderAfter TorigoyaMZ_Achievement2
 * @help
 * 実績プラグインアドオン: ご褒美コモンイベント (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * このプラグインは「実績プラグイン」のアドオンです。
 * 実績プラグインより下に導入してください。
 *
 * 獲得した実績を選択することで、
 * コモンイベントを実行できるようにします。
 *
 * ------------------------------------------------------------
 * ■ 注意
 * ------------------------------------------------------------
 * ・コモンイベントの実行はゲーム内での実績画面でのみ動作します
 * 　タイトル画面から呼び出される実績画面では動きません
 *
 * ・動作としては「アイテム」の効果に
 * 　「コモンイベント」を設定したときと同様の動作をします。
 * 　つまり、一度メニューを閉じてコモンイベントが動作します。
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 * 設定はこのプラグイン内ではなく「実績プラグイン」側で行います。
 *
 * コモンイベントを設定した実績の「メモ」欄に
 * 以下のように記述してください。
 *
 * <コモンイベント: 1>
 *
 * もしくは
 *
 * <CommonEvent: 1>
 *
 * 「1」の部分には呼び出したいコモンイベントのIDを指定してください。
 *
 * ------------------------------------------------------------
 * ■ 上級者向けの使い方
 * ------------------------------------------------------------
 * このプラグインを導入すると、「スクリプト」内で以下の方法で
 * 「最後に選択（コモンイベントを呼び出した）した実績」を獲得できます。
 *
 * Torigoya.Achievement2.Addons.RewardEvent.lastItem
 *
 * この中には以下のようなフォーマットでデータが格納されます。
 *
 * {
 *   "key": "実績のID",
 *   "title": "実績の名前",
 *   "description": "実績の説明文",
 *   "hint": "実績のヒント",
 *   "icon": 123,        // アイコンのID
 *   "isSecret": false   // 実績が秘密であるか？
 * }
 *
 * ▼ 例：最後に選択した実績の名前を取得する
 * Torigoya.Achievement2.Addons.RewardEvent.lastItem.title
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_Achievement2_AddonRewardEvent';
    }

    function readParameter() {
        PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    function checkPlugin(obj, errorMessage) {
        if (typeof obj !== 'undefined') return;
        alert(errorMessage);
        throw errorMessage;
    }

    function parseVersion(version) {
        return version.split('.', 3).map((n) => parseInt(n || '0', 10));
    }

    function isGreaterThanOrEqualVersion(a, b) {
        if (a === b) return true;

        const version1 = parseVersion(a);
        const version2 = parseVersion(b);

        if (version1[0] !== version2[0]) return version1[0] < version2[0];
        if (version1[1] !== version2[1]) return version1[1] < version2[1];
        return version1[2] < version2[2];
    }

    function checkPluginVersion(version, requireVersion, errorMessage) {
        if (typeof version === 'string' && isGreaterThanOrEqualVersion(requireVersion, version)) return;
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    checkPlugin(
        Torigoya.Achievement2,
        '「実績アドオン:ご褒美コモンイベント」より上に「実績プラグイン」が導入されていません。'
    );
    checkPluginVersion(
        Torigoya.Achievement2.parameter.version,
        '1.6.0',
        '「実績アドオン:ご褒美コモンイベント」を利用するには「実績プラグイン」を最新版にアップデートしてください'
    );

    Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
    Torigoya.Achievement2.Addons.RewardEvent = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        function findRewardEvent(item) {
            if (!item) return null;
            const setting = item.achievement.meta['コモンイベント'] || item.achievement.meta['CommonEvent'];
            return setting === undefined ? null : Number.parseInt(setting, 10);
        }

        Torigoya.Achievement2.Addons.RewardEvent.lastItem = null;

        // -------------------------------------------------------------------------
        // Window_AchievementList

        const upstream_Window_AchievementList_isCurrentItemEnabled =
            Torigoya.Achievement2.Window_AchievementList.prototype.isCurrentItemEnabled;
        Torigoya.Achievement2.Window_AchievementList.prototype.isCurrentItemEnabled = function () {
            const item = this.item();
            if (!this.isLaunchInTitle() && item && item.unlockInfo && findRewardEvent(item)) return true;
            return upstream_Window_AchievementList_isCurrentItemEnabled.apply(this);
        };

        // -------------------------------------------------------------------------
        // Scene_Achievement

        const upstream_Scene_Achievement_onListOk = Torigoya.Achievement2.Scene_Achievement.prototype.onListOk;
        Torigoya.Achievement2.Scene_Achievement.prototype.onListOk = function () {
            const commonEventId = findRewardEvent(this._listWindow.item());
            if (!this.isLaunchInTitle() && commonEventId) {
                Torigoya.Achievement2.Addons.RewardEvent.lastItem = this._listWindow.item().achievement;
                $gameTemp.reserveCommonEvent(commonEventId);
                SceneManager.goto(Scene_Map);
            } else {
                upstream_Scene_Achievement_onListOk.apply(this);
            }
        };
    })();
})();
