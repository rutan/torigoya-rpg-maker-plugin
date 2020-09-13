import { CutInManager } from './CutInManager';

export function applyPluginToBattleManager() {
  const upstream_BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function () {
    this.torigoyaSkillCutIn_playCutIn();
    upstream_BattleManager_startAction.apply(this);
  };

  BattleManager.torigoyaSkillCutIn_playCutIn = function () {
    const subject = this._subject;
    if (!subject) return;

    const action = subject.currentAction();
    const item = action && action.item();
    if (!item) return;

    const configs = subject.isEnemy()
      ? CutInManager.getConfigByEnemy(subject, item)
      : CutInManager.getConfigByActor(subject, item);
    if (configs.length === 0) return;

    const config = configs.find((config) => CutInManager.canPlayConfig(config, subject));
    if (!config) return;

    CutInManager.setParameter(config, subject.isEnemy());

    this._logWindow.setWaitMode('effect');
  };
}
