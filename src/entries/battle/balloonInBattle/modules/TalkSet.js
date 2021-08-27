import { unescapeMetaString } from '../../../../common/utils/unescapeMetaString';

function evalCondition(a, code) {
  try {
    return !!eval(code);
  } catch (e) {
    if ($gameTemp.isPlaytest()) console.error(e);
    return false;
  }
}

function readPriority(item) {
  const priority = item.meta['Priority'] || item.meta['優先度'];
  if (!priority) return 1;

  const value = parseInt(priority, 10);
  if (isNaN(value)) {
    if ($gameTemp.isPlaytest()) console.error(`優先度指定が間違っています: ${item}`);
    return 0;
  }
  return value;
}

export class TalkSet {
  constructor(data) {
    this._data = this._parseMetaObjects(data);
  }

  _parseMetaObjects(data) {
    if (Array.isArray(data)) {
      data.forEach((item) => this._parseMetaObjects(item));
    } else if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        this._parseMetaObjects(data[key]);
      });
      DataManager.extractMetadata(data);
    }

    return data;
  }

  getTalkItem(type, options = {}) {
    let items = this._selectEnableItems(type, options);
    items = this._filterForAllItems(items, options);

    return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
  }

  _selectEnableItems(type, options) {
    switch (type) {
      case 'battleStart':
        return this._selectEnableItemsForWithTroop('talkBattleStart', options);
      case 'victory':
        return this._selectEnableItemsForWithTroop('talkVictory', options);
      case 'input':
        return this._selectEnableItemsForWithTroop('talkInput', options);
      case 'dead':
        return this._selectEnableItemsForWithTroop('talkDead', options);
      case 'damage':
        return this._selectEnableItemsForWithFrom('talkDamage', options);
      case 'substitute':
        return this._selectEnableItemsForWithFrom('talkSubstitute', options);
      case 'protected':
        return this._selectEnableItemsForWithFrom('talkProtected', options);
      case 'recovery':
        return this._selectEnableItemsForWithFrom('talkRecovery', options);
      case 'missed':
        return this._selectEnableItemsForWithFrom('talkMissed', options);
      case 'evasion': {
        const evasionItems = this._selectEnableItemsForWithFrom('talkEvasion', options);
        return evasionItems.length > 0 ? evasionItems : this._selectEnableItemsForWithFrom('talkMissed', options);
      }
      case 'counter':
        return this._selectEnableItemsForWithFrom('talkCounter', options);
      case 'useSkill':
        return this._selectEnableItemsForSkill('talkUseSkill', options);
      case 'useItem':
        return this._selectEnableItemsForItem('talkUseItem', options);
      case 'removeState':
        return this._selectEnableItemsForState('talkRemoveState', options);
    }

    return this._data.talkAdvanced.filter((item) => item.type === type);
  }

  _filterForAllItems(items, options) {
    items = this._filterCondition(items, options);
    items = this._filterPriority(items, options);

    return items;
  }

  _selectEnableItemsForWithTroop(key, options) {
    return this._filterTroopId(this._data[key] || [], options.troopId);
  }

  _selectEnableItemsForWithFrom(key, options) {
    return this._filterFrom(this._data[key] || [], options.from);
  }

  _selectEnableItemsForSkill(key, options) {
    let items = this._filterUsingSkill(this._data[key] || [], options.usingItem);
    items = this._filterTargets(items, options.targets);
    return items;
  }

  _selectEnableItemsForItem(key, options) {
    let items = this._filterUsingItem(this._data[key] || [], options.usingItem);
    items = this._filterTargets(items, options.targets);
    return items;
  }

  _selectEnableItemsForState(key, options) {
    let items = this._filterState(this._data[key] || [], options.state);
    items = this._filterFrom(items, options.from);
    return items;
  }

  _filterTroopId(items, troopId) {
    if (troopId) {
      const filtered = items.filter((item) => item.troopId === troopId);
      if (filtered.length > 0) return filtered;
    }

    return items.filter((item) => !item.troopId);
  }

  _filterFrom(items, from) {
    if (from) {
      if (from.isEnemy()) {
        const enemyId = from.enemyId();
        const filtered = items.filter((item) => item.enemyId === enemyId);
        if (filtered.length > 0) return filtered;
      } else {
        const actorId = from.actorId();
        const filtered = items.filter((item) => item.actorId === actorId);
        if (filtered.length > 0) return filtered;
      }
    }

    return items.filter((item) => !item.actorId && !item.enemyId);
  }

  _filterUsingSkill(items, usingSkill) {
    const skillId = usingSkill ? usingSkill.id : 0;
    if (skillId) {
      const filtered = items.filter((item) => item.skillId === skillId);
      if (filtered.length > 0) return filtered;
    }

    return items.filter((item) => !item.skillId);
  }

  _filterUsingItem(items, usingItem) {
    const itemId = usingItem ? usingItem.id : 0;
    if (itemId) {
      const filtered = items.filter((item) => item.itemId === itemId);
      if (filtered.length > 0) return filtered;
    }

    return items.filter((item) => !item.itemId);
  }

  _filterState(items, state) {
    const stateId = state ? state.id : 0;
    if (stateId) {
      const filtered = items.filter((item) => item.stateId === stateId);
      if (filtered.length > 0) return filtered;
    }

    return items.filter((item) => !item.stateId);
  }

  _filterTargets(items, targets) {
    if (targets && targets.length > 0) {
      for (const target of targets) {
        if (target.isEnemy()) {
          const enemyId = target.enemyId();
          const filtered = items.filter((item) => item.enemyId === enemyId);
          if (filtered.length > 0) return filtered;
        } else {
          const actorId = target.actorId();
          const filtered = items.filter((item) => item.actorId === actorId);
          if (filtered.length > 0) return filtered;
        }
      }
    }

    return items.filter((item) => !item.actorId && !item.enemyId);
  }

  _filterCondition(items, options) {
    return items.filter((item) => {
      const str = item.meta['Condition'] || item.meta['条件'];
      if (!str) return true;

      return evalCondition(options.subject, unescapeMetaString(str));
    });
  }

  _filterPriority(items, _options) {
    const max = Math.max(...items.map((item) => readPriority(item)));
    return items.filter((item) => readPriority(item) === max);
  }
}
