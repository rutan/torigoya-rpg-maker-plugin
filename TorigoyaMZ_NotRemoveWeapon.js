/*---------------------------------------------------------------------------*
 * TorigoyaMZ_NotRemoveWeapon.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/08/30 13:46 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 装備画面で武器は外せないようにするプラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_NotRemoveWeapon.js
 * @help
 * 装備画面で武器は外せないようにするプラグイン (v.1.0.0)
 *
 * 武器を付け替えはできても、武器無しにはできないようにします
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_NotRemoveWeapon';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    Torigoya.NotRemoveWeapon = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // Game_Actor

        Game_Actor.prototype.torigoyaNotRemoveWeapon_isWeaponSlot = function (slotId) {
            return this.equipSlots()[slotId] === 1;
        };

        // [再定義] 全部外すで外れないようにする
        Game_Actor.prototype.clearEquipments = function () {
            const maxSlots = this.equipSlots().length;
            for (let i = 0; i < maxSlots; i++) {
                if (!this.torigoyaNotRemoveWeapon_isWeaponSlot(i) && this.isEquipChangeOk(i)) {
                    this.changeEquip(i, null);
                }
            }
        };

        // 今の装備品とも比較するようにする
        const upstream_Game_Actor_bestEquipItem = Game_Actor.prototype.bestEquipItem;
        Game_Actor.prototype.bestEquipItem = function (slotId) {
            const bestItem = upstream_Game_Actor_bestEquipItem.apply(this, arguments),
                nowItem = this._equips[slotId].object(),
                bestPerformance = bestItem ? this.calcEquipItemPerformance(bestItem) : -1000,
                nowPerformance = nowItem ? this.calcEquipItemPerformance(nowItem) : -1000;

            return nowPerformance > bestPerformance ? nowItem : bestItem;
        };

        // -------------------------------------------------------------------------
        // Window_EquipItem

        // 武器のときは末尾空白を入れない
        const upstream_Window_EquipItem_includes = Window_EquipItem.prototype.includes;
        Window_EquipItem.prototype.includes = function (item) {
            if (!item && this._actor && this._actor.torigoyaNotRemoveWeapon_isWeaponSlot(this._slotId)) {
                return false;
            }
            return upstream_Window_EquipItem_includes.apply(this, arguments);
        };

        // 武器のときは空白を選択できない
        const upstream_Window_EquipItem_isEnabled = Window_EquipItem.prototype.isEnabled;
        Window_EquipItem.prototype.isEnabled = function (item) {
            if (!item && this._actor && this._actor.torigoyaNotRemoveWeapon_isWeaponSlot(this._slotId)) {
                return false;
            }
            return upstream_Window_EquipItem_isEnabled.apply(this, arguments);
        };
    })();
})();
