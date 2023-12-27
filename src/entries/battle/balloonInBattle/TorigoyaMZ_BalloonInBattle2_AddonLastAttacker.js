import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_BalloonInBattle2_AddonLastAttacker_parameter';
import { checkPlugin } from '../../../../scripts/utils/checkPlugin';

checkPlugin(
  Torigoya.BalloonInBattle,
  '「戦闘中セリフ表示プラグインアドオン: 勝利セリフをトドメキャラに」より上に「戦闘中セリフ表示プラグイン」が導入されていません。',
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

  const upstream_BattleManager_torigoyaBalloonInBattle_talkVictory = BattleManager.torigoyaBalloonInBattle_talkVictory;
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

  const upstream_BattleManager_torigoyaBalloonInBattle_talkDefeat = BattleManager.torigoyaBalloonInBattle_talkDefeat;
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
