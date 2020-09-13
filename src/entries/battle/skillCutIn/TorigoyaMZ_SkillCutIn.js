import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_SkillCutIn_parameter';
import { CutInManager } from './modules/CutInManager';
import { Sprite_CutInBase } from './modules/Sprite_CutInBase';
import { Sprite_CutInWoss } from './modules/Sprite_CutInWoss';
import { applyPluginToSpritesetBattle } from './modules/applyPluginToSpritesetBattle';
import { applyPluginToBattleManager } from './modules/applyPluginToBattleManager';
import { applyPluginToGameInterpreter } from './modules/applyPluginToGameInterpreter';
import { createAndPlayCutInSprite } from './modules/createAndPlayCutInSprite';
import { commandShowActorCutIn, commandShowEnemyCutIn } from './modules/pluginCommands';

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
  // SceneManager

  const upstream_SceneManager_onSceneTerminate = SceneManager.onSceneTerminate;
  SceneManager.onSceneTerminate = function () {
    CutInManager.reset();
    upstream_SceneManager_onSceneTerminate.apply(this);
  };

  // -------------------------------------------------------------------------
  // Scene_Message

  const upstream_Scene_Message_update = Scene_Message.prototype.update;
  Scene_Message.prototype.update = function () {
    upstream_Scene_Message_update.apply(this);
    this.torigoyaSkillCutIn_updateCutIn();
  };

  Scene_Message.prototype.torigoyaSkillCutIn_updateCutIn = function () {
    if (!CutInManager.isPlaying()) return;
    if (this._torigoyaSkillCutIn_cutInSprite) return;

    this.torigoyaSkillCutIn_createAndPlayCutInSprite();
  };

  Scene_Message.prototype.torigoyaSkillCutIn_createAndPlayCutInSprite = createAndPlayCutInSprite;

  // -------------------------------------------------------------------------
  // プラグインコマンド

  PluginManager.registerCommand(Torigoya.SkillCutIn.name, 'showActorCutIn', commandShowActorCutIn);
  PluginManager.registerCommand(Torigoya.SkillCutIn.name, 'showEnemyCutIn', commandShowEnemyCutIn);
})();
