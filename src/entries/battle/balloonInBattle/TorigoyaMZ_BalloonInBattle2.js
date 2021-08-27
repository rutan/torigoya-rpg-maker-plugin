import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_BalloonInBattle2_parameter';
import { arrayShuffle } from '../../../common/utils/arrayShuffle';
import { Window_BattleBalloon } from './modules/Window_BattleBalloon';
import { TalkSet } from './modules/TalkSet';
import { TalkBuilder } from './modules/TalkBuilder';

Torigoya.BalloonInBattle = {
  name: getPluginName(),
  parameter: readParameter(),
  actorTalkSetId: [],
};

function shuffleActiveMember(members) {
  return arrayShuffle(members.filter((m) => m.canMove()));
}

function readTalkSetIdFromMeta(obj) {
  return (obj.meta['TalkSet'] || obj.meta['セリフセット'] || '').trim();
}

function readBalloonYFromMeta(obj) {
  const n = parseInt(obj.meta['BalloonY'] || obj.meta['セリフ位置Y'] || 0, 10);
  return isNaN(n) ? 0 : n;
}

Torigoya.BalloonInBattle.TalkBuilder = new TalkBuilder();

(() => {
  const talkSetCache = new Map();

  function getTalkSet(talkSetId) {
    if (!talkSetCache.has(talkSetId)) {
      const config = Torigoya.BalloonInBattle.parameter.talkConfig.find((config) => config.id === talkSetId);
      talkSetCache.set(talkSetId, config ? new TalkSet(config) : null);
    }
    return talkSetCache.get(talkSetId);
  }
  // --------------------------------------------------------------------------
  // Game_Battler

  const battlerParameter = new WeakMap();

  Game_Battler.prototype.torigoyaBalloonInBattle_getTalkSet = function () {
    return null;
  };

  Game_Battler.prototype.torigoyaBalloonInBattle_getParam = function () {
    if (!battlerParameter.has(this)) battlerParameter.set(this, {});
    return battlerParameter.get(this);
  };

  Game_Battler.prototype.torigoyaBalloonInBattle_requestMessage = function (type, options = {}) {
    const talkSet = this.torigoyaBalloonInBattle_getTalkSet();
    if (!talkSet) return;

    const params = this.torigoyaBalloonInBattle_getParam();
    if (params.type === type) return;

    // 同一フレームでの優先度が低いものは採用されない
    if ((options.priority || 0) < ((params.options || {}).priority || 0)) return;

    options['subject'] = this;
    options['troopId'] = $gameTroop._troopId;

    const item = talkSet.getTalkItem(type, options);
    if (!item) return false;

    // メッセージ生成。メッセージが空文字の場合はスキップ
    const message = Torigoya.BalloonInBattle.TalkBuilder.build(item, options);
    if (!message) return false;

    options['talkItem'] = item;

    this.torigoyaBalloonInBattle_setMessageParameter(type, message, options);

    return true;
  };

  Game_Battler.prototype.torigoyaBalloonInBattle_clearMessage = function () {
    this.torigoyaBalloonInBattle_setMessageParameter('', '');
  };

  Game_Battler.prototype.torigoyaBalloonInBattle_closeMessage = function () {
    this.torigoyaBalloonInBattle_setMessageParameter('close', '');
  };

  Game_Battler.prototype.torigoyaBalloonInBattle_setMessageParameter = function (type, message, options = {}) {
    const params = this.torigoyaBalloonInBattle_getParam();
    params.type = type;
    params.message = message;
    params.options = options || {};
  };

  // 戦闘不能時
  const upstream_Game_Battler_performCollapse = Game_Battler.prototype.performCollapse;
  Game_Battler.prototype.performCollapse = function () {
    upstream_Game_Battler_performCollapse.apply(this);

    this.torigoyaBalloonInBattle_requestMessage('dead', {});
  };

  // --------------------------------------------------------------------------
  // Game_Actor

  Game_Actor.prototype.torigoyaBalloonInBattle_getTalkSet = function () {
    const actor = this.actor();
    if (!actor) return null;

    // プラグインコマンドによる設定値
    const overrideTalkSetId = Torigoya.BalloonInBattle.actorTalkSetId[actor.id];
    if (overrideTalkSetId) return getTalkSet(overrideTalkSetId);

    // メモ欄（デフォルト値）
    const talkSetId = readTalkSetIdFromMeta(actor);
    return talkSetId ? getTalkSet(talkSetId) : null;
  };

  // --------------------------------------------------------------------------
  // Game_Enemy

  Game_Enemy.prototype.torigoyaBalloonInBattle_getTalkSet = function () {
    const enemy = this.enemy();
    if (!enemy) return null;
    const talkSetId = readTalkSetIdFromMeta(enemy);
    return talkSetId ? getTalkSet(talkSetId) : null;
  };

  // --------------------------------------------------------------------------
  // Sprite_Battler

  Sprite_Battler.prototype.torigoyaBalloonInBattle_balloonY = function () {
    return 0;
  };

  // --------------------------------------------------------------------------
  // Sprite_Actor

  Sprite_Actor.prototype.torigoyaBalloonInBattle_balloonY = function () {
    const bitmapHeight = this._frame.height * this.scale.y;
    const actor = this._actor ? this._actor.actor() : null;
    const y = actor ? readBalloonYFromMeta(actor) : 0;
    return -bitmapHeight + y + Torigoya.BalloonInBattle.parameter.balloonActorY;
  };

  // --------------------------------------------------------------------------
  // Sprite_Enemy

  Sprite_Enemy.prototype.torigoyaBalloonInBattle_balloonY = function () {
    const bitmapHeight = (this.bitmap ? this.bitmap.height : 0) * this.scale.y;
    const enemy = this._enemy ? this._enemy.enemy() : null;
    const y = enemy ? readBalloonYFromMeta(enemy) : 0;
    return -bitmapHeight + y + Torigoya.BalloonInBattle.parameter.balloonEnemyY;
  };

  // --------------------------------------------------------------------------
  // Window_BattleLog

  const upstream_Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
  Window_BattleLog.prototype.displayActionResults = function (subject, target) {
    upstream_Window_BattleLog_displayActionResults.apply(this, arguments);

    const result = target.result();
    if (result.used && subject !== target) {
      this.torigoyaBalloonInBattle_checkTalk(subject, target, result);
    }
  };

  Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalk = function (subject, target, result) {
    if (this.torigoyaBalloonInBattle_checkTalkForMissed(subject, target, result)) return true;
    if (this.torigoyaBalloonInBattle_checkTalkForEvasion(subject, target, result)) return true;
    if (this.torigoyaBalloonInBattle_checkTalkForRemoveState(subject, target, result)) return true;
    if (this.torigoyaBalloonInBattle_checkTalkForDamage(subject, target, result)) return true;
    if (this.torigoyaBalloonInBattle_checkTalkForRecovery(subject, target, result)) return true;

    return false;
  };

  // ミス
  Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForMissed = function (subject, target, result) {
    if (!target.canMove()) return false;
    if (!result.missed) return false;

    return target.torigoyaBalloonInBattle_requestMessage('missed', {
      from: subject,
      lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
    });
  };

  // 回避
  Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForEvasion = function (subject, target, result) {
    if (!target.canMove()) return false;
    if (!result.evaded) return false;

    return target.torigoyaBalloonInBattle_requestMessage('evasion', {
      from: subject,
      lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
    });
  };

  // ステート回復よる表示
  Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForRemoveState = function (subject, target, result) {
    if (!target.canMove()) return false;
    if (!target.result().isStatusAffected()) return false;

    // 敵対する相手に回復された場合はスキップ
    if (subject.isEnemy() !== target.isEnemy()) return false;

    const states = target.result().removedStateObjects();
    for (const state of states) {
      if (
        target.torigoyaBalloonInBattle_requestMessage('removeState', {
          from: subject,
          lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
          state: state,
        })
      )
        return true;
    }

    return false;
  };

  // ダメージによる表示
  Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForDamage = function (subject, target, result) {
    if (!target.canMove()) return false;
    if (result.hpDamage <= 0 && result.mpDamage <= 0 && result.tpDamage <= 0) return false;

    // 味方に攻撃された場合はスキップ
    if (subject.isEnemy() === target.isEnemy()) return false;

    return target.torigoyaBalloonInBattle_requestMessage('damage', {
      from: subject,
      lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
    });
  };

  // HP回復による表示
  Window_BattleLog.prototype.torigoyaBalloonInBattle_checkTalkForRecovery = function (subject, target, result) {
    if (!target.canMove()) return false;
    if (result.hpDamage >= 0 && result.mpDamage >= 0 && result.tpDamage >= 0) return false;

    // 敵対する相手に回復された場合はスキップ
    if (subject.isEnemy() !== target.isEnemy()) return false;

    return target.torigoyaBalloonInBattle_requestMessage('recovery', {
      from: subject,
      lifeTime: Torigoya.BalloonInBattle.parameter.advancedDamageLifeTime,
    });
  };

  // --------------------------------------------------------------------------
  // BattleManager

  // 行動選択: 開始
  const upstream_BattleManager_startActorInput = BattleManager.startActorInput;
  BattleManager.startActorInput = function () {
    upstream_BattleManager_startActorInput.apply(this);

    if (this._currentActor) {
      this._currentActor.torigoyaBalloonInBattle_requestMessage('input', {
        lifeTime: Torigoya.BalloonInBattle.parameter.advancedInputLifeTime,
      });
    }
  };

  // 行動選択: 終了
  const upstream_BattleManager_changeCurrentActor = BattleManager.changeCurrentActor;
  BattleManager.changeCurrentActor = function (forward) {
    if (this._currentActor) {
      this._currentActor.torigoyaBalloonInBattle_closeMessage();
    }
    upstream_BattleManager_changeCurrentActor.apply(this, arguments);
  };

  // スキル・アイテム
  const upstream_BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function () {
    const subject = this._subject;
    const action = subject.currentAction();
    upstream_BattleManager_startAction.apply(this);

    if (action.isSkill()) {
      subject.torigoyaBalloonInBattle_requestMessage('useSkill', {
        targets: this._targets,
        from: subject,
        usingItem: action.item(),
      });
    } else if (action.isItem()) {
      subject.torigoyaBalloonInBattle_requestMessage('useItem', {
        targets: this._targets,
        from: subject,
        usingItem: action.item(),
      });
    }
  };

  // 身代わり
  const upstream_BattleManager_applySubstitute = BattleManager.applySubstitute;
  BattleManager.applySubstitute = function (target) {
    const realTarget = upstream_BattleManager_applySubstitute.apply(this, arguments);

    if (target !== realTarget) {
      if (target.canMove())
        target.torigoyaBalloonInBattle_requestMessage('protected', {
          from: realTarget,
          priority: 1,
        });
      if (realTarget.canMove())
        realTarget.torigoyaBalloonInBattle_requestMessage('substitute', {
          to: target,
          priority: 1,
        });
    }

    return realTarget;
  };

  // カウンター
  const upstream_BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
  BattleManager.invokeCounterAttack = function (subject, target) {
    upstream_BattleManager_invokeCounterAttack.apply(this, arguments);

    if (target.canMove()) {
      target.torigoyaBalloonInBattle_requestMessage('counter', {
        targets: [subject],
        priority: 1,
      });
    }
  };

  // 魔法反射
  const upstream_BattleManager_invokeMagicReflection = BattleManager.invokeMagicReflection;
  BattleManager.invokeMagicReflection = function (subject, target) {
    upstream_BattleManager_invokeMagicReflection.apply(this, arguments);

    if (subject.canMove()) {
      subject.torigoyaBalloonInBattle_requestMessage('counter', {
        targets: [target],
        priority: 1,
      });
    }
  };

  const upstream_BattleManager_startBattle = BattleManager.startBattle;
  BattleManager.startBattle = function () {
    this.torigoyaBalloonInBattle_talkStartBattleParty();
    this.torigoyaBalloonInBattle_talkStartBattleTroop();
    upstream_BattleManager_startBattle.apply(this);
  };

  BattleManager.torigoyaBalloonInBattle_talkStartBattleParty = function () {
    const actors = shuffleActiveMember($gameParty.battleMembers());
    for (const actor of actors) {
      if (actor.torigoyaBalloonInBattle_requestMessage('battleStart')) return;
    }
  };

  BattleManager.torigoyaBalloonInBattle_talkStartBattleTroop = function () {
    const enemies = shuffleActiveMember($gameTroop.members());
    for (const enemy of enemies) {
      if (enemy.torigoyaBalloonInBattle_requestMessage('battleStart')) return;
    }
  };

  const upstream_BattleManager_processVictory = BattleManager.processVictory;
  BattleManager.processVictory = function () {
    this.torigoyaBalloonInBattle_talkVictory();
    upstream_BattleManager_processVictory.apply(this);
  };

  BattleManager.torigoyaBalloonInBattle_talkVictory = function () {
    const actors = shuffleActiveMember($gameParty.members());
    for (const actor of actors) {
      if (
        actor.torigoyaBalloonInBattle_requestMessage('victory', {
          lifeTime: Torigoya.BalloonInBattle.parameter.advancedVictoryLifeTime,
        })
      )
        return;
    }
  };

  const upstream_BattleManager_processDefeat = BattleManager.processDefeat;
  BattleManager.processDefeat = function () {
    this.torigoyaBalloonInBattle_talkDefeat();
    upstream_BattleManager_processDefeat.apply(this);
  };

  BattleManager.torigoyaBalloonInBattle_talkDefeat = function () {
    const enemies = shuffleActiveMember($gameTroop.members());
    for (const enemy of enemies) {
      if (
        enemy.torigoyaBalloonInBattle_requestMessage('victory', {
          lifeTime: Torigoya.BalloonInBattle.parameter.advancedVictoryLifeTime,
        })
      )
        return;
    }
  };

  const upstream_BattleManager_endAction = BattleManager.endAction;
  BattleManager.endAction = function () {
    this.torigoyaBalloonInBattle_lastActionSubject = this._subject;
    upstream_BattleManager_endAction.apply(this);
  };

  const upstream_BattleManager_endTurn = BattleManager.endTurn;
  BattleManager.endTurn = function () {
    delete this.torigoyaBalloonInBattle_lastActionSubject;
    upstream_BattleManager_endTurn.apply(this);
  };

  const upstream_BattleManager_endBattle = BattleManager.endBattle;
  BattleManager.endBattle = function (result) {
    delete this.torigoyaBalloonInBattle_lastActionSubject;
    upstream_BattleManager_endBattle.apply(this, arguments);
  };

  // --------------------------------------------------------------------------
  // Scene_Battle

  const upstream_Scene_Battle_createWindowLayer = Scene_Battle.prototype.createWindowLayer;
  Scene_Battle.prototype.createWindowLayer = function () {
    this.torigoyaBalloonInBattle_createActorBalloons();
    this.torigoyaBalloonInBattle_createEnemyBalloons();
    upstream_Scene_Battle_createWindowLayer.apply(this);
  };

  Scene_Battle.prototype.torigoyaBalloonInBattle_createActorBalloons = function () {
    this._torigoyaBalloonInBattle_actorBalloonLayer = new Sprite();
    this.addChild(this._torigoyaBalloonInBattle_actorBalloonLayer);

    this._spriteset._actorSprites.forEach((actorSprite) => {
      const win = new Window_BattleBalloon();
      this._torigoyaBalloonInBattle_actorBalloonLayer.addChild(win);
      win.setBattlerSprite(actorSprite);
    });
  };

  Scene_Battle.prototype.torigoyaBalloonInBattle_createEnemyBalloons = function () {
    this._torigoyaBalloonInBattle_enemyBalloonLayer = new Sprite();
    this.addChild(this._torigoyaBalloonInBattle_enemyBalloonLayer);

    this._spriteset._enemySprites.forEach((enemySprite) => {
      const win = new Window_BattleBalloon();
      this._torigoyaBalloonInBattle_enemyBalloonLayer.addChild(win);
      win.setBattlerSprite(enemySprite);
    });
  };

  // --------------------------------------------------------------------------
  // Scene_Boot

  const upstream_Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
  Scene_Boot.prototype.loadSystemImages = function () {
    upstream_Scene_Boot_loadSystemImages.apply(this);
    ImageManager.loadSystem(Torigoya.BalloonInBattle.parameter.balloonImage);
  };

  // --------------------------------------------------------------------------
  // DataManager

  const SAVE_KEY = 'torigoyaBalloonInBattle_actorTalkSetId';

  const upstream_DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    upstream_DataManager_createGameObjects.apply(this);
    Torigoya.BalloonInBattle.actorTalkSetId = [];
  };

  const upstream_DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = upstream_DataManager_makeSaveContents.apply(this);
    contents[SAVE_KEY] = Torigoya.BalloonInBattle.actorTalkSetId;
    return contents;
  };

  const upstream_DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    upstream_DataManager_extractSaveContents.apply(this, arguments);
    Torigoya.BalloonInBattle.actorTalkSetId = contents[SAVE_KEY] || [];
  };

  // --------------------------------------------------------------------------
  // プラグインコマンド

  function commandChangeTalkSetId({ actorId, talkSetId }) {
    actorId = parseInt(actorId || '0', 10);
    talkSetId = `${talkSetId || ''}`.trim();
    const talkSet = getTalkSet(talkSetId);
    if (!talkSet) {
      if ($gameTemp.isPlaytest()) {
        console.error(`talkSet: ${talkSetId} is not found`);
      }
      return;
    }

    Torigoya.BalloonInBattle.actorTalkSetId[actorId] = talkSetId;
  }

  function commandResetTalkSetId({ actorId }) {
    actorId = parseInt(actorId || '0', 10);
    if (!actorId) return;
    delete Torigoya.BalloonInBattle.actorTalkSetId[actorId];
  }

  function pickActor(actorId) {
    if (!$gameParty.inBattle()) return null;

    actorId = parseInt(actorId || '0', 10);
    const subject =
      actorId > 0
        ? $gameParty.battleMembers().find((actor) => actor.actorId() === actorId)
        : BattleManager._subject || BattleManager.torigoyaBalloonInBattle_lastActionSubject;

    return subject && subject.isActor() ? subject : null;
  }

  function commandTalkActorByType({ actorId, type }) {
    const subject = pickActor(actorId);
    if (!subject) return;

    subject.torigoyaBalloonInBattle_requestMessage(type);
  }

  function commandTalkActorByText({ actorId, text }) {
    const subject = pickActor(actorId);
    if (!subject) return;

    subject.torigoyaBalloonInBattle_setMessageParameter(`manualMessage-${Date.now()}`, text);
  }

  function pickEnemy(enemyIndex) {
    if (!$gameParty.inBattle()) return null;

    enemyIndex = parseInt(enemyIndex || '0', 10);
    const subject =
      enemyIndex > 0
        ? $gameTroop.members().find((enemy) => enemy.index() === enemyIndex - 1)
        : BattleManager._subject || BattleManager.torigoyaBalloonInBattle_lastActionSubject;
    return subject && subject.isEnemy() ? subject : null;
  }

  function commandTalkEnemyByType({ enemyIndex, type }) {
    const subject = pickEnemy(enemyIndex);
    if (!subject) return;

    subject.torigoyaBalloonInBattle_requestMessage(type);
  }

  function commandTalkEnemyByText({ enemyIndex, text }) {
    const subject = pickEnemy(enemyIndex);
    if (!subject) return;

    subject.torigoyaBalloonInBattle_setMessageParameter(`manualMessage-${Date.now()}`, text);
  }

  PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'changeTalkSet', commandChangeTalkSetId);
  PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'resetTalkSet', commandResetTalkSetId);
  PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkActorByType', commandTalkActorByType);
  PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkActorByText', commandTalkActorByText);
  PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkEnemyByType', commandTalkEnemyByType);
  PluginManager.registerCommand(Torigoya.BalloonInBattle.name, 'talkEnemyByText', commandTalkEnemyByText);
})();
