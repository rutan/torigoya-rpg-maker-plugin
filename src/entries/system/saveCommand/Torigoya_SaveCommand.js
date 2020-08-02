import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_SaveCommand_parameter';

Torigoya.SaveCommand = {
  name: getPluginName(),
  parameter: readParameter(),
  lastTimestamp: undefined,
  lastAccessId: undefined,
};

function parseSlotId(str) {
  let slotId = 0;
  let matches = str.match(/^\[(\d+)]$/);
  if (matches) {
    slotId = $gameVariables.value(parseInt(matches[1], 10));
  } else if (str.match(/^\d+$/)) {
    slotId = parseInt(str, 10);
  } else {
    switch (str) {
      case 'last':
        slotId = DataManager.lastAccessedSavefileId();
        break;
      case 'latest':
        slotId = DataManager.latestSavefileId();
        break;
    }
  }

  if (slotId <= 0) {
    throw '[Torigoya_SaveCommand.js] invalid SlotId: ' + slotId;
  }

  return slotId;
}

function runCommand(gameInterpreter, type, slotId, skipTimestamp) {
  switch (type) {
    case 'load':
      runCommandLoad(gameInterpreter, slotId);
      break;
    case 'save':
      runCommandSave(gameInterpreter, slotId, skipTimestamp);
      break;
    case 'remove':
      runCommandRemove(gameInterpreter, slotId);
      break;
  }
}

function runCommandLoad(gameInterpreter, slotId) {
  if (!DataManager.isThisGameFile(slotId)) return;

  const scene = SceneManager._scene;
  scene.fadeOutAll();
  DataManager.loadGame(slotId);
  gameInterpreter.command115(); // 今のイベントが継続しないように中断コマンドを実行する
  Scene_Load.prototype.reloadMapIfUpdated.apply(scene);
  SceneManager.goto(Scene_Map);
  $gameSystem.onAfterLoad();
}

function runCommandSave(gameInterpreter, slotId, skipTimestamp) {
  if (skipTimestamp) {
    const info = DataManager.loadSavefileInfo(slotId);
    Torigoya.SaveCommand.lastTimestamp = info && info.timestamp ? info.timestamp : 0;
    Torigoya.SaveCommand.lastAccessId = DataManager.lastAccessedSavefileId();
  }

  // そのままセーブしてしまうと
  // ロード時にもプラグインコマンドが呼び出されてしまうため
  // 次の行のイベントコマンドから始まるように細工する
  const originalIndex = gameInterpreter._index;
  ++gameInterpreter._index;

  $gameSystem.onBeforeSave();
  if (DataManager.saveGame(slotId) && StorageManager.cleanBackup) {
    StorageManager.cleanBackup(slotId);
  }

  if (skipTimestamp) {
    DataManager._lastAccessedId = Torigoya.SaveCommand.lastAccessId;
    Torigoya.SaveCommand.lastTimestamp = undefined;
    Torigoya.SaveCommand.lastAccessId = undefined;
  }

  // 細工した分を戻す
  gameInterpreter._index = originalIndex;
}

function runCommandRemove(_, slotId) {
  StorageManager.remove(slotId);
}

(() => {
  const upstream_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
  DataManager.makeSavefileInfo = function () {
    const info = upstream_DataManager_makeSavefileInfo.apply(this);
    if (Torigoya.SaveCommand.lastTimestamp !== undefined) {
      info.timestamp = Torigoya.SaveCommand.lastTimestamp;
    }
    return info;
  };

  const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (command === 'SaveCommand') {
      const type = (args[0] || '').trim();
      const slotId = parseSlotId((args[1] || '').trim());
      const skipTimestamp = args[2] === 'notime';
      runCommand(this, type, slotId, skipTimestamp);
      return;
    }
    upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
  };
})();
