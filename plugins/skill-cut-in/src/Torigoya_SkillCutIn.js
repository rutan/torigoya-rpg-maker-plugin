import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/Torigoya_SkillCutIn_parameter';
import { CutInManager } from './modules/CutInManager';
import { Sprite_CutInBase } from './modules/Sprite_CutInBase';
import { Sprite_CutInWoss } from './modules/Sprite_CutInWoss';
import { applyPluginToSpritesetBattle } from './modules/applyPluginToSpritesetBattle';
import { applyPluginToBattleManager } from './modules/applyPluginToBattleManager';
import { applyPluginToGameInterpreter } from './modules/applyPluginToGameInterpreter';
import { createAndPlayCutInSprite } from './modules/createAndPlayCutInSprite';
import { commandShowActorCutIn, commandShowEnemyCutIn } from './modules/pluginCommands';
import { createCutInContainer } from './modules/createCutInContainer';

Torigoya.SkillCutIn = {
  name: getPluginName(),
  parameter: readParameter(),
};

Torigoya.SkillCutIn.parameter.actorConfig.forEach((config) => DataManager.extractMetadata(config));
Torigoya.SkillCutIn.parameter.enemyConfig.forEach((config) => DataManager.extractMetadata(config));

Torigoya.SkillCutIn.CutInManager = CutInManager;
Torigoya.SkillCutIn.Sprite_CutInBase = Sprite_CutInBase;
Torigoya.SkillCutIn.Sprite_CutInWoss = Sprite_CutInWoss;

applyPluginToBattleManager();
applyPluginToSpritesetBattle();
applyPluginToGameInterpreter();

(() => {
  // -------------------------------------------------------------------------
  // Scene_Base

  const upstream_Scene_Base_detachReservation = Scene_Base.prototype.detachReservation;
  Scene_Base.prototype.detachReservation = function () {
    CutInManager.reset();
    upstream_Scene_Base_detachReservation.apply(this);
  };

  // -------------------------------------------------------------------------
  // Scene_Map

  const upstream_Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    upstream_Scene_Map_update.apply(this);
    this.torigoyaSkillCutIn_updateCutIn();
  };

  Scene_Map.prototype.torigoyaSkillCutIn_updateCutIn = function () {
    if (!CutInManager.isPlaying()) return;
    if (this._torigoyaSkillCutIn_cutInSprite) return;

    this.torigoyaSkillCutIn_createCutInContainer();
    this.torigoyaSkillCutIn_createAndPlayCutInSprite();
  };

  Scene_Map.prototype.torigoyaSkillCutIn_createCutInContainer = createCutInContainer;
  Scene_Map.prototype.torigoyaSkillCutIn_createAndPlayCutInSprite = createAndPlayCutInSprite;

  // -------------------------------------------------------------------------
  // Scene_Battle

  const upstream_Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    upstream_Scene_Battle_update.apply(this);
    this.torigoyaSkillCutIn_updateCutIn();
  };

  Scene_Battle.prototype.torigoyaSkillCutIn_updateCutIn = function () {
    if (!CutInManager.isPlaying()) return;
    if (this._torigoyaSkillCutIn_cutInSprite) return;

    this.torigoyaSkillCutIn_createCutInContainer();
    this.torigoyaSkillCutIn_createAndPlayCutInSprite();
  };

  Scene_Battle.prototype.torigoyaSkillCutIn_createCutInContainer = createCutInContainer;
  Scene_Battle.prototype.torigoyaSkillCutIn_createAndPlayCutInSprite = createAndPlayCutInSprite;

  // -------------------------------------------------------------------------
  // プラグインコマンド

  const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    switch (command) {
      case 'ShowActorCutIn':
      case '味方カットイン':
        commandShowActorCutIn.call(this, { name: `${args[0]}`.trim() });
        return;
      case 'ShowEnemyCutIn':
      case '敵カットイン':
        commandShowEnemyCutIn.call(this, { name: `${args[0]}`.trim() });
        return;
    }
    upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
  };
})();
