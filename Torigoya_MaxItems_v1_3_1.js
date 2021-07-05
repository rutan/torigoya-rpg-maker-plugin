/*---------------------------------------------------------------------------*
 * Torigoya_MaxItems.js v.1.3.1
 *---------------------------------------------------------------------------*
 * 2021/07/05 22:08 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc アイテム上限数個別指定プラグイン (v.1.3.1)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.3.1
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_MaxItems.js
 * @help
 * アイテム上限数個別指定プラグイン (v.1.3.1)
 * https://torigoya-plugin.rutan.dev
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
            version: '1.3.1',
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

        const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            switch (command) {
                case '所持数調整':
                case 'AdjustItems':
                    $gameParty.torigoyaAdjustAllItemSize();
                    return;
            }

            upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
        };
    })();
})();
