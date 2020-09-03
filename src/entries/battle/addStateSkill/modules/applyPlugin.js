import { readStateIdsFromMeta } from './readStateIdsFromMeta';

export function applyPlugin() {
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

    const forSubject = this.torigoyaAddStateSkill_readParameterForSubject(item);
    const forUnit = this.torigoyaAddStateSkill_readParameterForUnit(item);
    if (!forSubject && !forUnit) return;

    const friends = this._subject.isEnemy() ? $gameTroop.members() : $gameParty.battleMembers();
    const targets = new Set();

    if (forSubject) {
      const [addStates, removeStates] = forSubject;
      addStates.forEach((id) => this._subject.addState(id));
      removeStates.forEach((id) => this._subject.removeState(id));
      targets.add(this._subject);
    }

    if (forUnit) {
      const [addStates, removeStates] = forUnit;
      addStates.forEach((id) => friends.forEach((battler) => battler.addState(id)));
      removeStates.forEach((id) => friends.forEach((battler) => battler.removeState(id)));
      friends.forEach((battler) => targets.add(battler));
    }

    friends.forEach((battler) => {
      if (!targets.has(battler)) return;

      this._logWindow.displayAffectedStatus(battler);
      if (battler.isDead()) battler.performCollapse();
    });
  };

  BattleManager.torigoyaAddStateSkill_readParameterForSubject = function (item) {
    const addStates = readStateIdsFromMeta(item.meta['AddState'] || item.meta['ステート追加']);
    const removeStates = readStateIdsFromMeta(item.meta['RemoveState'] || item.meta['ステート削除']);
    if (addStates.length === 0 && removeStates.length === 0) return false;

    return [addStates, removeStates];
  };

  BattleManager.torigoyaAddStateSkill_readParameterForUnit = function (item) {
    const addStates = readStateIdsFromMeta(item.meta['AddStateUnit'] || item.meta['ステート追加全体']);
    const removeStates = readStateIdsFromMeta(item.meta['RemoveStateUnit'] || item.meta['ステート削除全体']);
    if (addStates.length === 0 && removeStates.length === 0) return false;

    return [addStates, removeStates];
  };
}
