/*---------------------------------------------------------------------------*
 * TorigoyaMZ_MaxItems.js v.1.2.0
 *---------------------------------------------------------------------------*
 * 2020/08/23 21:29 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc アイテム上限数個別指定プラグイン (v.1.2.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.2.0
 * @help
 * アイテム上限数個別指定プラグイン (v.1.2.0)
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
 *
 * @command adjustItems
 * @text アイテム所持数の調整
 * @desc 最大所持数を超えたアイテムがある場合に上限を超えないようにアイテムを自動で減らします
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_MaxItems';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.2.0',
        };
    }

    Torigoya.MaxItems = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // Game_Party

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

        // アイテム全体の個数が上限に収まるように調整
        Game_Party.prototype.torigoyaAdjustAllItemSize = function () {
            this.items().forEach((item) => {
                this._items[item.id] = this.numItems(item).clamp(0, this.maxItems(item));
            });

            this.weapons().forEach((item) => {
                this._weapons[item.id] = this.numItems(item).clamp(0, this.maxItems(item));
            });

            this.armors().forEach((item) => {
                this._armors[item.id] = this.numItems(item).clamp(0, this.maxItems(item));
            });
        };

        // -------------------------------------------------------------------------
        // プラグインコマンド

        function commandAdjustItems() {
            $gameParty.torigoyaAdjustAllItemSize();
        }

        PluginManager.registerCommand(Torigoya.MaxItems.name, 'adjustItems', commandAdjustItems);
    })();
})();
