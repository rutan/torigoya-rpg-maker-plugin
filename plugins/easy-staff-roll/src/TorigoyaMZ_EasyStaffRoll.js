import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_EasyStaffRoll_parameter';
import { StaffRollManager } from './module/StaffRollManager';
import { Sprite_StaffRoll } from './module/Sprite_StaffRoll';

Torigoya.EasyStaffRoll = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  Torigoya.EasyStaffRoll.Manager = new StaffRollManager();
  Torigoya.EasyStaffRoll.Sprite_StaffRoll = Sprite_StaffRoll;

  // -------------------------------------------------------------------------
  // Game_Screen

  const upstream_Game_Screen_clear = Game_Screen.prototype.clear;
  Game_Screen.prototype.clear = function () {
    upstream_Game_Screen_clear.apply(this);
    this.torigoyaEasyStaffRoll_clearStaffRollState();
  };

  /**
   * スタッフロール表示状況の初期化
   */
  Game_Screen.prototype.torigoyaEasyStaffRoll_clearStaffRollState = function () {
    this._torigoyaEasyStaffRoll_staffRollState = {
      timer: 0,
      duration: 0,
    };
  };

  const upstream_Game_Screen_update = Game_Screen.prototype.update;
  Game_Screen.prototype.update = function () {
    upstream_Game_Screen_update.apply(this);
    this.torigoyaEasyStaffRoll_updateStaffRoll();
  };

  /**
   * スタッフロール表示状況の更新
   */
  Game_Screen.prototype.torigoyaEasyStaffRoll_updateStaffRoll = function () {
    Torigoya.EasyStaffRoll.Manager.update();
  };

  Game_Screen.prototype.torigoyaEasyStaffRoll_getStaffRollState = function () {
    if (!this._torigoyaEasyStaffRoll_staffRollState) this.torigoyaEasyStaffRoll_clearStaffRollState();
    return this._torigoyaEasyStaffRoll_staffRollState;
  };

  // -------------------------------------------------------------------------
  // Game_Interpreter

  const upstream_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === 'torigoyaEasyStaffRoll') {
      if (Torigoya.EasyStaffRoll.Manager.isBusy()) return true;
    }

    return upstream_Game_Interpreter_updateWaitMode.apply(this);
  };

  // -------------------------------------------------------------------------
  // Scene_Base

  Scene_Base.prototype.torigoyaEasyStaffRoll_createStaffRollSprite = function () {
    this._torigoyaEasyStaffRoll_staffRollSprite = new Sprite_StaffRoll();
    this.addChild(this._torigoyaEasyStaffRoll_staffRollSprite);
  };

  // -------------------------------------------------------------------------
  // Scene_Map

  const upstream_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    upstream_Scene_Map_createDisplayObjects.apply(this);
    this.torigoyaEasyStaffRoll_createStaffRollSprite();
  };

  // -------------------------------------------------------------------------
  // Scene_Battle

  const upstream_Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function () {
    upstream_Scene_Battle_createDisplayObjects.apply(this);
    this.torigoyaEasyStaffRoll_createStaffRollSprite();
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandDisplayStaffRoll({ displayFrame, isWait }) {
    displayFrame = Number(displayFrame);
    isWait = isWait.toString() === 'true';

    Torigoya.EasyStaffRoll.Manager.setup({ duration: displayFrame });
    if (isWait) this.setWaitMode('torigoyaEasyStaffRoll');
  }

  function commandRemoveStaffRoll() {
    Torigoya.EasyStaffRoll.Manager.finish();
  }

  function commandPreloadStaffRoll() {
    Torigoya.EasyStaffRoll.Manager.setup({ duration: 0 });
  }

  const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (command === 'easyStaffRoll') {
      switch (args[0]) {
        case 'show':
          return commandDisplayStaffRoll.call(this, {
            displayFrame: args[1] || '600',
            isWait: args[2] || 'true',
          });
        case 'remove':
          return commandRemoveStaffRoll.call(this);
        case 'preload':
          return commandPreloadStaffRoll.call(this);
      }
    }

    return upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
  };

  PluginManager.registerCommand(Torigoya.EasyStaffRoll.name, 'displayStaffRoll', commandDisplayStaffRoll);
  PluginManager.registerCommand(Torigoya.EasyStaffRoll.name, 'removeStaffRoll', commandRemoveStaffRoll);
  PluginManager.registerCommand(Torigoya.EasyStaffRoll.name, 'preloadStaffRoll', commandPreloadStaffRoll);
})();
