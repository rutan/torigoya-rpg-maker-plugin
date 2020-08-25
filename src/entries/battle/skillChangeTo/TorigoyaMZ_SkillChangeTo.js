import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_SkillChangeTo_parameter';
import { unescapeMetaString } from '../../../common/utils/unescapeMetaString';

Torigoya.SkillChangeTo = {
  name: getPluginName(),
  parameter: readParameter(),
};

function doEval(a, code) {
  try {
    return !!eval(unescapeMetaString(code));
  } catch (e) {
    if ($gameTemp.isPlaytest()) console.error(e);
    return false;
  }
}

(() => {
  const upstream_BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function () {
    this.torigoyaSkillChangeToApply();
    upstream_BattleManager_startAction.apply(this);
  };

  BattleManager.torigoyaSkillChangeToApply = function () {
    const subject = this._subject;

    const action = subject.currentAction();
    if (!action) return;

    const item = action.item();
    if (!item) return;

    this.torigoyaSkillChangeTo_getConditions(item).find(({ id, condition }) => {
      if (!doEval(subject, condition)) return false;

      if (action.isSkill()) {
        action.setSkill(id);
      } else if (action.isItem()) {
        action.setItem(id);
      }
      return true;
    });
  };

  const cache = new WeakMap();

  BattleManager.torigoyaSkillChangeTo_getConditions = function (item) {
    if (cache.has(item)) return cache.get(item);

    const conditions = Object.keys(item.meta)
      .map((key) => {
        const match = key.match(/ChangeTo\[(\d+)]/);
        return match ? { id: parseInt(match[1], 10), condition: item.meta[key] } : null;
      })
      .filter(Boolean);

    cache.set(item, conditions);
    return conditions;
  };
})();
