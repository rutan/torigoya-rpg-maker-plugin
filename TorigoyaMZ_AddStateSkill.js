/*---------------------------------------------------------------------------*
 * TorigoyaMZ_AddStateSkill.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/08/30 13:46 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 使用後にステート追加スキルプラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_AddStateSkill.js
 * @help
 * 使用後にステート追加スキルプラグイン (v.1.0.0)
 *
 * スキル使用時に使用者にステートを追加/削除できるようにします。
 * 「相手に大ダメージを与えるが、自分は毒になる」のようなスキルが作れます。
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 * スキルのメモ欄に以下のように記述してください。
 *
 * ■ 例1：10番のステートを付与する
 *
 * <AddState: 10>
 *
 * または
 *
 * <ステート追加: 10>
 *
 * ■ 例2：10番と11番のステートを付与する（「,」区切りで指定）
 *
 * <AddState: 10, 11>
 *
 * または
 *
 * <ステート追加: 10, 11>
 *
 * ■ 例3：10番のステートを削除する
 *
 * <RemoveState: 10>
 *
 * または
 *
 * <ステート削除: 10>
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_AddStateSkill';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    Torigoya.AddStateSkill = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    function readStateIdsFromMeta(str) {
        if (!str) return [];
        return str
            .split(/\s*,\s*/)
            .filter(Boolean)
            .map((s) => parseInt(s, 10));
    }

    (() => {
        const upstream_BattleManager_endAction = BattleManager.endAction;
        BattleManager.endAction = function () {
            this.torigoyaAddStateSkill_check();
            upstream_BattleManager_endAction.apply(this);
        };

        BattleManager.torigoyaAddStateSkill_check = function () {
            const action = this._action;
            if (!action) return;
            const item = this._action.item();
            if (!item) return;

            const addStates = readStateIdsFromMeta(item.meta['AddState'] || item.meta['ステート追加']);
            const removeStates = readStateIdsFromMeta(item.meta['RemoveState'] || item.meta['ステート削除']);

            if (addStates.length === 0 && removeStates.length === 0) return;

            addStates.forEach((id) => this._subject.addState(id));
            removeStates.forEach((id) => this._subject.removeState(id));

            this._logWindow.displayAutoAffectedStatus(this._subject);
            if (this._subject.isDead()) this._subject.performCollapse();
        };
    })();
})();
