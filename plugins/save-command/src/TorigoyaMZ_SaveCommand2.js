import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_SaveCommand2_parameter.js';

Torigoya.SaveCommand2 = {
  name: getPluginName(),
  parameter: readParameter(),
  backupLastTimestamp: undefined,
  isBusy: false,
  requestCall: undefined,
};

(() => {
  // -------------------------------------------------------------------------
  // Game_Interpreter

  /**
   * セーブの実行リクエスト
   * @param {number} savefileId
   * @param {boolean} skipUpdateTimestamp
   * @returns {Promise<*>}
   */
  Game_Interpreter.prototype.torigoyaSaveCommand_requestSave = function (savefileId, skipUpdateTimestamp) {
    Torigoya.SaveCommand2.requestCall = () => {
      if (skipUpdateTimestamp) {
        if (DataManager._globalInfo && DataManager._globalInfo[savefileId]) {
          Torigoya.SaveCommand2.backupLastTimestamp = DataManager._globalInfo[savefileId].timestamp || 0;
        } else {
          Torigoya.SaveCommand2.backupLastTimestamp = 0;
        }
      } else {
        $gameSystem.setSavefileId(savefileId);
      }

      $gameSystem.onBeforeSave();

      return DataManager.saveGame(savefileId);
    };
  };

  /**
   * セーブデータの削除リクエスト
   * @param {number} savefileId
   * @returns {Promise<*>}
   */
  Game_Interpreter.prototype.torigoyaSaveCommand_requestDelete = function (savefileId) {
    const saveName = DataManager.makeSavename(savefileId);
    Torigoya.SaveCommand2.requestCall = () => {
      return (StorageManager.remove(saveName) || Promise.resolve()).then(() => DataManager.removeInvalidGlobalInfo());
    };
  };

  Game_Interpreter.prototype.torigoyaSaveCommand_clearState = function () {
    Torigoya.SaveCommand2.isBusy = false;
    Torigoya.SaveCommand2.backupLastTimestamp = undefined;
    Torigoya.SaveCommand2.requestCall = undefined;
  };

  const upstream_Game_Interpreter_updateWait = Game_Interpreter.prototype.updateWait;
  Game_Interpreter.prototype.updateWait = function () {
    if (Torigoya.SaveCommand2.requestCall) {
      const requestCall = Torigoya.SaveCommand2.requestCall;
      requestCall()
        .then(() => this.torigoyaSaveCommand_clearState())
        .catch(() => this.torigoyaSaveCommand_clearState());

      Torigoya.SaveCommand2.requestCall = undefined;
      Torigoya.SaveCommand2.isBusy = true;
      return true;
    }
    if (Torigoya.SaveCommand2.isBusy) return true;

    return upstream_Game_Interpreter_updateWait.apply(this);
  };

  // -------------------------------------------------------------------------
  // DataManager

  const upstream_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
  DataManager.makeSavefileInfo = function () {
    const info = upstream_DataManager_makeSavefileInfo.apply(this);

    if (Torigoya.SaveCommand2.backupLastTimestamp !== undefined) {
      info.timestamp = Torigoya.SaveCommand2.backupLastTimestamp;
      Torigoya.SaveCommand2.backupLastTimestamp = undefined;
    }

    return info;
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandSaveWithId({ slotId, skipUpdateTimestamp }) {
    slotId = parseInt(slotId, 10);
    skipUpdateTimestamp = skipUpdateTimestamp === 'true';
    this.torigoyaSaveCommand_requestSave(slotId, skipUpdateTimestamp);
  }

  function commandSaveWithVariable({ slotVariableId, skipUpdateTimestamp }) {
    slotVariableId = parseInt(slotVariableId, 10);
    const slotId = $gameVariables.value(slotVariableId);
    skipUpdateTimestamp = skipUpdateTimestamp === 'true';
    this.torigoyaSaveCommand_requestSave(slotId, skipUpdateTimestamp);
  }

  function commandSaveLastSlot({ skipUpdateTimestamp }) {
    const slotId = $gameSystem.savefileId() || DataManager.emptySavefileId();
    skipUpdateTimestamp = skipUpdateTimestamp === 'true';
    this.torigoyaSaveCommand_requestSave(slotId, skipUpdateTimestamp);
  }

  function commandDeleteWithId({ slotId }) {
    slotId = parseInt(slotId, 10);
    this.torigoyaSaveCommand_requestDelete(slotId);
  }

  function commandDeleteWithVariable({ slotVariableId }) {
    slotVariableId = parseInt(slotVariableId, 10);
    const slotId = $gameVariables.value(slotVariableId);
    this.torigoyaSaveCommand_requestDelete(slotId);
  }

  function commandDeleteLastSlot() {
    const slotId = $gameSystem.savefileId() || DataManager.emptySavefileId();
    this.torigoyaSaveCommand_requestDelete(slotId);
  }

  PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'saveWithId', commandSaveWithId);
  PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'saveWithVariable', commandSaveWithVariable);
  PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'saveLastSlot', commandSaveLastSlot);
  PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'deleteWithId', commandDeleteWithId);
  PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'deleteWithVariable', commandDeleteWithVariable);
  PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'deleteLastSlot', commandDeleteLastSlot);
})();
