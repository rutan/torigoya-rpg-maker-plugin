/*---------------------------------------------------------------------------*
 * TorigoyaMZ_BalloonInBattle2_AddonLastAttacker.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/09/26 14:59 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 戦闘中セリフ表示プラグインアドオン: 勝利セリフをトドメキャラに (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_BalloonInBattle2_AddonLastAttacker.js
 * @base TorigoyaMZ_BalloonInBattle2
 * @orderAfter TorigoyaMZ_BalloonInBattle2
 * @help
 * 戦闘中セリフ表示プラグインアドオン: 勝利セリフをトドメキャラに (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * このプラグインは「戦闘中セリフ表示プラグイン」のアドオンです。
 * 戦闘中セリフ表示プラグインより下に入れてください。
 *
 * 勝利セリフをトドメを刺したキャラがしゃべるようにします。
 * トドメを刺したキャラにセリフが設定されていない場合は
 * 通常通りランダムにキャラが選択されます。
 *
 * このアドオンプラグインには、設定項目はありません。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_BalloonInBattle2_AddonLastAttacker';
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

    checkPlugin(
        Torigoya.BalloonInBattle,
        '「戦闘中セリフ表示プラグインアドオン: 勝利セリフをトドメキャラに」より上に「戦闘中セリフ表示プラグイン」が導入されていません。'
    );

    Torigoya.BalloonInBattle.Addons = Torigoya.BalloonInBattle.Addons || {};
    Torigoya.BalloonInBattle.Addons.LastAttacker = {
        name: getPluginName(),
        parameter: readParameter(),
        lastActionBattler: null,
    };

    (() => {
        const upstream_BattleManager_initMembers = BattleManager.initMembers;
        BattleManager.initMembers = function () {
            Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler = null;
            upstream_BattleManager_initMembers.apply(this);
        };

        const upstream_BattleManager_startAction = BattleManager.startAction;
        BattleManager.startAction = function () {
            Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler = this._subject;
            upstream_BattleManager_startAction.apply(this);
        };

        const upstream_BattleManager_torigoyaBalloonInBattle_talkVictory =
            BattleManager.torigoyaBalloonInBattle_talkVictory;
        BattleManager.torigoyaBalloonInBattle_talkVictory = function () {
            if (Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler) {
                const battler = Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler;
                Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler = null;

                if (
                    battler.isActor() &&
                    battler.canMove() &&
                    battler.torigoyaBalloonInBattle_requestMessage('victory', {
                        lifeTime: Torigoya.BalloonInBattle.parameter.advancedVictoryLifeTime,
                    })
                ) {
                    return;
                }
            }
            upstream_BattleManager_torigoyaBalloonInBattle_talkVictory.apply(this);
        };

        const upstream_BattleManager_torigoyaBalloonInBattle_talkDefeat =
            BattleManager.torigoyaBalloonInBattle_talkDefeat;
        BattleManager.torigoyaBalloonInBattle_talkDefeat = function () {
            if (Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler) {
                const battler = Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler;
                Torigoya.BalloonInBattle.Addons.LastAttacker.lastActionBattler = null;

                if (
                    battler.isEnemy() &&
                    battler.canMove() &&
                    battler.torigoyaBalloonInBattle_requestMessage('victory', {
                        lifeTime: Torigoya.BalloonInBattle.parameter.advancedVictoryLifeTime,
                    })
                ) {
                    return;
                }
            }
            upstream_BattleManager_torigoyaBalloonInBattle_talkDefeat.apply(this);
        };
    })();
})();
