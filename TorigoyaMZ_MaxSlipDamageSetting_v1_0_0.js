/*---------------------------------------------------------------------------*
 * TorigoyaMZ_MaxSlipDamageSetting.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/08/20 16:31 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 敵のスリップダメージ上限設定プラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @help
 * 敵のスリップダメージ上限設定プラグイン (v.1.0.0)
 *
 * 敵キャラについて、毒などで受ける最大ダメージを設定できるようになります。
 * 「毒のダメージを最大HPの50%にしたらボスが2ターンで死んだ」のような
 * 悲しい事件を防ぐことができます。
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 * 敵キャラのメモ欄に以下のように設定してください。
 *
 * <MaxSlipDamage: 最大ダメージ数>
 *
 * <MaxSlipDamage: 50> のように設定すると、
 * 毒で50ダメージまでしか受けなくなります。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_MaxSlipDamageSetting';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    Torigoya.MaxSlipDamageSetting = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    const upstream_Game_Enemy_maxSlipDamage = Game_Enemy.prototype.maxSlipDamage;
    Game_Enemy.prototype.maxSlipDamage = function () {
        const defaultValue = upstream_Game_Enemy_maxSlipDamage.apply(this);
        const maxSlipDamage = this.enemy().meta['MaxSlipDamage'];
        if (maxSlipDamage) {
            return Math.min(defaultValue, parseInt(maxSlipDamage, 10));
        } else {
            return defaultValue;
        }
    };
})();
