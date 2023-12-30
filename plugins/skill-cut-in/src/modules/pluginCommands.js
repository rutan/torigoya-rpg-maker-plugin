import { CutInManager } from './CutInManager';

export function commandShowActorCutIn({ name }) {
  const config = CutInManager.getConfigByNameFromActor(name)[0];
  if (!config) {
    return;
  }
  CutInManager.setParameter(config, false);
  this.setWaitMode('torigoyaSkillCutIn');
}

export function commandShowEnemyCutIn({ name }) {
  const config = CutInManager.getConfigByNameFromEnemy(name)[0];
  if (!config) {
    return;
  }
  CutInManager.setParameter(config, true);
  this.setWaitMode('torigoyaSkillCutIn');
}
