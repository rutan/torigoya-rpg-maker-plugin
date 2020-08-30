import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_AddStateSkill_parameter';

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
