/*---------------------------------------------------------------------------*
 * TorigoyaMZ_BattleStatusPosition.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/10/22 03:19 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 戦闘画面のステータス表示の位置を人数で調節プラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_BattleStatusPosition.js
 * @help
 * 戦闘画面のステータス表示の位置を人数で調節プラグイン (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * 戦闘画面に表示されるステータス表示について、
 * 戦闘メンバーの人数が少ない場合は中央寄せで表示するように変更します。
 *
 * このプラグインに特に設定はありません。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_BattleStatusPosition';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    Torigoya.BattleStatusPosition = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // パーティメンバーの人数に応じて位置を変える
        Window_BattleStatus.prototype.itemRect = function (index) {
            const maxCols = this.maxCols();

            const itemWidth = this.itemWidth();
            const itemHeight = this.itemHeight();
            const colSpacing = this.colSpacing();
            const rowSpacing = this.rowSpacing();
            const width = itemWidth - colSpacing;
            const height = itemHeight - rowSpacing;

            const itemSize = Math.min(this.maxItems(), this.maxCols());
            const totalWidth = (this.innerWidth / this.maxCols()) * itemSize;

            const col = index % maxCols;
            const row = Math.floor(index / maxCols);
            const x = (this.innerWidth - totalWidth) / 2 + col * itemWidth + colSpacing / 2 - this.scrollBaseX();
            const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();

            return new Rectangle(x, y, width, height);
        };
    })();
})();
