import { Torigoya } from '../../../../common/Torigoya';
import { unescapeMetaString } from '../../../../common/utils/unescapeMetaString';
import { evalCondition } from './evalCondition';
import { Sprite_CutInWoss } from './Sprite_CutInWoss';

class CutInManagerClass {
  constructor() {
    this._configCache = new Map();
    this._cutInParameter = null;
  }

  reset() {
    this.clear();
    this._configCache.clear();
  }

  clear() {
    this._cutInParameter = null;
  }

  setParameter(config, isEnemy = false) {
    this._cutInParameter = Object.assign({ isEnemy }, config);
  }

  getConfigByActor(actor, item) {
    const actorId = actor.actorId();

    if (DataManager.isSkill(item)) {
      const key = `actorSkill::${actorId}::${item.id}`;
      const cache = this._configCache.get(key);
      if (cache) return cache;

      const result = Torigoya.SkillCutIn.parameter.actorConfig.filter(
        (config) => config.actorId === actorId && config.skillId === item.id,
      );
      this._configCache.set(key, result);

      return result;
    } else if (DataManager.isItem(item)) {
      const key = `actorItem::${actorId}::${item.id}`;
      const cache = this._configCache.get(key);
      if (cache) return cache;

      const result = Torigoya.SkillCutIn.parameter.actorConfig.filter(
        (config) =>
          config.actorId === actorId && parseInt(config.meta['item'] || config.meta['アイテム'] || 0, 10) === item.id,
      );
      this._configCache.set(key, result);

      return result;
    } else {
      return [];
    }
  }

  getConfigByEnemy(enemy, item) {
    const enemyId = enemy.enemyId();

    if (DataManager.isSkill(item)) {
      const key = `enemySkill::${enemyId}::${item.id}`;
      const cache = this._configCache.get(key);
      if (cache) return cache;

      const result = Torigoya.SkillCutIn.parameter.enemyConfig.filter(
        (config) => config.enemyId === enemyId && config.skillId === item.id,
      );
      this._configCache.set(key, result);

      return result;
    } else {
      return [];
    }
  }

  getConfigByNameFromActor(name) {
    const key = `nameFromActor::${name}`;
    const cache = this._configCache.get(key);
    if (cache) return cache;

    const result = Torigoya.SkillCutIn.parameter.actorConfig.filter(
      (config) => (config.meta['name'] || config.meta['呼び出し名'] || '').trim() === name,
    );
    this._configCache.set(key, result);

    return result;
  }

  getConfigByNameFromEnemy(name) {
    const key = `nameFromEnemy::${name}`;
    const cache = this._configCache.get(key);
    if (cache) return cache;

    const result = Torigoya.SkillCutIn.parameter.enemyConfig.filter(
      (config) => (config.meta['name'] || config.meta['呼び出し名'] || '').trim() === name,
    );
    this._configCache.set(key, result);

    return result;
  }

  canPlayConfig(config, battler) {
    const condition = unescapeMetaString(config.meta['condition'] || config.meta['条件'] || '');
    if (condition && !evalCondition(battler, condition)) return false;

    return true;
  }

  isPlaying() {
    return !!this._cutInParameter;
  }

  getParameter() {
    return this._cutInParameter;
  }

  detectCutInClass() {
    return Sprite_CutInWoss;
  }
}

export const CutInManager = new CutInManagerClass();
