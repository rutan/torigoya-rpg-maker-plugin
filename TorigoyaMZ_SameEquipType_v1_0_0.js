/*---------------------------------------------------------------------------*
 * TorigoyaMZ_SameEquipType.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/08/20 16:23 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 同じ名前の装備タイプなら同じものを装備できるようにするプラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @help
 * 同じ名前の装備タイプなら同じものを装備できるようにするプラグイン (v.1.0.0)
 *
 * データベースの「タイプ」→「装備タイプ」設定で
 * 同じ名前を設定した場合は、同じ種別のアイテムを装備できるようにします。
 *
 * 例えば
 *
 * 01 武器
 * 02 盾
 * 03 装飾品
 * 04 装飾品
 * 05 装飾品
 *
 * のように設定した場合、装備の3段目〜5段目がすべて
 * 「03 装飾品」が装備できるスロットになります。
 *
 * ※装備の設定をする際は必ず同じ名前でも
 * 　一番上にあるものにしてください。
 * 　上記の例の場合であれば装飾品はすべて「03 装飾品」になります。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_SameEquipType';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    Torigoya.SameEquipType = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        const upstream_Game_Actor_equipSlots = Game_Actor.prototype.equipSlots;
        Game_Actor.prototype.equipSlots = function () {
            const slots = upstream_Game_Actor_equipSlots.apply(this);
            for (let i = 1; i < $dataSystem.equipTypes.length; ++i) {
                const n = $dataSystem.equipTypes.indexOf($dataSystem.equipTypes[i]);
                if (n === i) continue;
                slots[i - 1] = n;
            }
            return slots;
        };
    })();
})();
