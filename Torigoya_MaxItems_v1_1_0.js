/*---------------------------------------------------------------------------*
 * Torigoya_MaxItems.js v.1.1.0
 *---------------------------------------------------------------------------*
 * 2020/08/23 20:59 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc アイテム上限数個別指定プラグイン (v.1.1.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.1.0
 * @help
 * アイテム上限数個別指定プラグイン (v.1.1.0)
 *
 * アイテムの所持できる上限を
 * メモ欄で個別に設定できるようにします。
 *
 * ------------------------------------------------------------
 * ■ メモの指定方法
 * ------------------------------------------------------------
 *
 * 各アイテムのメモ欄に指定してください。
 *
 * ▼ 例1）上限を15個にする
 *
 * <MaxItems: 15>
 *
 * または
 *
 * <最大所持数: 15>
 *
 * ▼ 例2）上限を【変数1】で指定した数にする
 *
 * <MaxItems: v[1]>
 *
 * または
 *
 * <最大所持数: v[1]>
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_MaxItems';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.0',
        };
    }

    Torigoya.MaxItems = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        const upstream_Game_Party_maxItems = Game_Party.prototype.maxItems;
        Game_Party.prototype.maxItems = function (item) {
            const meta = item.meta['MaxItems'] || item.meta['最大所持数'];
            if (meta) {
                const match = meta.match(/v\[(\d+)]/);
                if (match) {
                    return $gameVariables.value(parseInt(match[1], 10));
                } else {
                    return parseInt(meta, 10);
                }
            } else {
                return upstream_Game_Party_maxItems.apply(this, arguments);
            }
        };
    })();
})();
