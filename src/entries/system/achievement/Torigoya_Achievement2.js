import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_Achievement2_parameter';
import { AchievementManager } from './modules/AchievementManager';
import { AchievementPopupManager } from './modules/AchievementPopupManager';

Torigoya.Achievement2 = {
  name: getPluginName(),
  parameter: readParameter(),

  // 内部処理用に使うユニークなスロット名（≠localStorageのキー）
  saveSlotID: 'Torigoya Achievement2',
};

// -------------------------------------------------------------------------
// 実績マネージャ

Torigoya.Achievement2.Manager = new AchievementManager({
  onInit(manager) {
    manager.setAchievements(Torigoya.Achievement2.parameter.baseAchievementData);

    try {
      manager.unlockInfo.clear();
      const obj = JSON.parse(StorageManager.load(Torigoya.Achievement2.saveSlotID));
      obj.unlockInfo.forEach(([key, value]) => {
        if (!manager.getAchievement(key)) return;
        manager.unlockInfo.set(key, value);
      });
    } catch (_e) {
      manager.unlockInfo.clear();
    }
  },
  onSave(manager) {
    StorageManager.save(
      Torigoya.Achievement2.saveSlotID,
      JSON.stringify({
        unlockInfo: Array.from(manager.unlockInfo.entries()),
      })
    );
  },
  overwritable: Torigoya.Achievement2.parameter.advancedOverwritable,
});

// -------------------------------------------------------------------------
// 実績ポップアップ表示マネージャ

Torigoya.Achievement2.PopupManager = new AchievementPopupManager(Torigoya.Achievement2.Manager, {
  popupPosition: Torigoya.Achievement2.parameter.popupPosition,
  popupWait: Torigoya.Achievement2.parameter.popupWait,
  popupAnimationType: Torigoya.Achievement2.parameter.popupAnimationType,
  createPopupWindow(item) {
    const popupWindow = new Window_AchievementPopup(item);
    SceneManager._scene.addChild(popupWindow); // 行儀悪い

    return popupWindow;
  },
  playSe() {
    const name = Torigoya.Achievement2.parameter.popupSound.soundName;
    if (!name) return;

    AudioManager.playSe({ name, pan: 0, pitch: 100, volume: Torigoya.Achievement2.parameter.popupSound.soundVolume });
  },
});

// -------------------------------------------------------------------------
// 実績ポップアップウィンドウ

class Window_AchievementPopup extends Window_Base {
  initialize(item) {
    super.initialize(0, 0, this.windowWidth(), this.windowHeight());
    this._item = item;
    this.refresh();
  }

  windowWidth() {
    return Torigoya.Achievement2.parameter.popupWidth;
  }

  windowHeight() {
    return this.standardFontSize() + this.messageFontSize() + this.standardPadding() * 2 + 5;
  }

  standardFontSize() {
    return Torigoya.Achievement2.parameter.popupTitleFontSize;
  }

  messageFontSize() {
    return Torigoya.Achievement2.parameter.popupMessageFontSize;
  }

  lineHeight() {
    return this.standardFontSize();
  }

  standardPadding() {
    return Torigoya.Achievement2.parameter.popupPadding;
  }

  refresh() {
    this.contents.clear();
    this.drawIcon(this._item.achievement.icon, 0, 0);
    this.drawTitle();
    this.drawMessage();
  }

  drawTitle() {
    this.resetFontSettings();
    this.drawTextEx(`\\c[${Torigoya.Achievement2.parameter.popupTitleColor}]` + this._item.achievement.title, 40, 0);
  }

  drawMessage() {
    const textWidth = this.windowWidth() - this.standardPadding() * 2 - 40;
    const y = this.standardFontSize() + 5;
    this.resetTextColor();
    this.contents.fontSize = this.messageFontSize();
    this.contents.drawText(
      Torigoya.Achievement2.parameter.popupMessage,
      40,
      y,
      textWidth,
      this.messageFontSize(),
      'left'
    );
  }

  calcTextHeight() {
    return this.contents.fontSize;
  }

  loadWindowskin() {
    this.windowskin = ImageManager.loadSystem(Torigoya.Achievement2.parameter.popupWindowImage);
  }

  standardBackOpacity() {
    return Torigoya.Achievement2.parameter.popupOpacity === -1
      ? super.standardBackOpacity()
      : Torigoya.Achievement2.parameter.popupOpacity;
  }
}

Torigoya.Achievement2.Window_AchievementPopup = Window_AchievementPopup;

// -------------------------------------------------------------------------
// 実績一覧ウィンドウ

class Window_AchievementList extends Window_Selectable {
  initialize(x, y, width, height) {
    super.initialize(x, y, width, height);
    this._data = [];
    this.refresh();
  }

  isRequireCancel() {
    return !!Torigoya.Achievement2.parameter.achievementMenuCancelMessage;
  }

  maxItems() {
    return (this._data ? this._data.length : 0) + (this.isRequireCancel() ? 1 : 0);
  }

  item() {
    return this._data ? this._data[this.index()] : null;
  }

  makeItemList() {
    this._data = Torigoya.Achievement2.Manager.data().filter((param) => this.isVisibleItem(param));
  }

  isCurrentItemEnabled() {
    return !this.item();
  }

  isVisibleItem({ achievement, unlockInfo }) {
    if (unlockInfo) return true;
    return !achievement.isSecret;
  }

  drawItem(index) {
    const item = this._data[index];
    const rect = this.itemRect(index);
    this.resetFontSettings();

    if (item) {
      const iconWidth = Window_Base._iconWidth + 4;
      if (item.unlockInfo) {
        this.changePaintOpacity(true);
        this.drawIcon(item.achievement.icon, rect.x, rect.y);
        this.drawText(item.achievement.title, rect.x + iconWidth, rect.y, rect.width - iconWidth, 'left');
      } else {
        this.changePaintOpacity(false);
        this.drawIcon(Torigoya.Achievement2.parameter.achievementMenuHiddenIcon, rect.x, rect.y);
        this.drawText(
          Torigoya.Achievement2.parameter.achievementMenuHiddenTitle,
          rect.x + iconWidth,
          rect.y,
          rect.width - iconWidth,
          'left'
        );
      }
    } else {
      this.changePaintOpacity(true);
      this.drawText(Torigoya.Achievement2.parameter.achievementMenuCancelMessage, rect.x, rect.y, rect.width, 'center');
    }
  }

  refresh() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
  }

  updateHelp() {
    const item = this.item();
    if (item) {
      this.setHelpWindowItem({
        description: item.unlockInfo
          ? item.achievement.description
          : item.achievement.hint || item.achievement.description,
      });
    } else {
      this.setHelpWindowItem(null);
    }
  }

  playBuzzerSound() {
    // nothing to do
  }
}

Torigoya.Achievement2.Window_AchievementList = Window_AchievementList;

// -------------------------------------------------------------------------
// 実績表示シーン

class Scene_Achievement extends Scene_MenuBase {
  create() {
    super.create();
    this.createHelpWindow();

    const rect = this.listWindowRect();
    this._listWindow = new Window_AchievementList(rect.x, rect.y, rect.width, rect.height);
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._listWindow);
  }

  listWindowRect() {
    const wx = 0;
    const wy = this._helpWindow.y + this._helpWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
  }

  start() {
    super.start();
    this._listWindow.select(0);
    this._listWindow.activate();
  }

  onListOk() {
    this.onListCancel();
  }

  onListCancel() {
    this.popScene();
  }
}

Torigoya.Achievement2.Scene_Achievement = Scene_Achievement;

(() => {
  // -------------------------------------------------------------------------
  // 保存系処理

  const upstream_StorageManager_localFilePath = StorageManager.localFilePath;
  StorageManager.localFilePath = function (savefileId) {
    if (savefileId === Torigoya.Achievement2.saveSlotID) {
      return `${this.localFileDirectoryPath()}achievements.rpgsave`;
    }
    return upstream_StorageManager_localFilePath.apply(this, arguments);
  };

  const upstream_StorageManager_webStorageKey = StorageManager.webStorageKey;
  StorageManager.webStorageKey = function (savefileId) {
    if (savefileId === Torigoya.Achievement2.saveSlotID) {
      return Torigoya.Achievement2.parameter.baseSaveSlot;
    }
    return upstream_StorageManager_webStorageKey.apply(this, arguments);
  };

  // -------------------------------------------------------------------------
  // タイトル画面への追加

  if (Torigoya.Achievement2.parameter.titleMenuUseInTitle) {
    const upstream_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function () {
      upstream_Window_TitleCommand_makeCommandList.apply(this);
      this.addCommand(Torigoya.Achievement2.parameter.titleMenuText, 'Torigoya_Achievement', true);
    };

    const upstream_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
      upstream_Scene_Title_createCommandWindow.apply(this);
      this._commandWindow.setHandler('Torigoya_Achievement', this.commandTorigoyaAchievement.bind(this));
    };

    Scene_Title.prototype.commandTorigoyaAchievement = function () {
      this._commandWindow.close();
      SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
    };
  }

  // -------------------------------------------------------------------------
  // メニュー画面への追加

  if (Torigoya.Achievement2.parameter.titleMenuUseInMenu) {
    const upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
      upstream_Window_MenuCommand_addOriginalCommands.apply(this);
      this.addCommand(Torigoya.Achievement2.parameter.titleMenuText, 'Torigoya_Achievement', true);
    };

    const upstream_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
      upstream_Scene_Menu_createCommandWindow.apply(this);
      this._commandWindow.setHandler('Torigoya_Achievement', this.commandTorigoyaAchievement.bind(this));
    };

    Scene_Menu.prototype.commandTorigoyaAchievement = function () {
      SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
    };
  }

  // -------------------------------------------------------------------------
  // 起動処理

  const upstream_Scene_Boot_create = Scene_Boot.prototype.create;
  Scene_Boot.prototype.create = function () {
    upstream_Scene_Boot_create.apply(this);
    ImageManager.reserveSystem(Torigoya.Achievement2.parameter.popupWindowImage);
    Torigoya.Achievement2.Manager.init();
  };

  const upstream_Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    upstream_Scene_Boot_start.apply(this);
    if (Torigoya.Achievement2.parameter.popupEnable) {
      Torigoya.Achievement2.PopupManager.init();
    }
  };

  const upstream_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
  Scene_Boot.prototype.isReady = function () {
    return upstream_Scene_Boot_isReady.apply(this) && Torigoya.Achievement2.Manager.isReady();
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    switch (command) {
      case 'Achievement':
      case 'GetAchievement':
      case '実績':
      case '実績獲得':
        Torigoya.Achievement2.Manager.unlock(`${args[0]}`.trim());
        return;
      case 'RemoveAchievement':
      case '実績消去':
      case '実績削除':
        Torigoya.Achievement2.Manager.remove(`${args[0]}`.trim());
        return;
      case 'ShowAchievement':
      case '実績表示':
        SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
        return;
      case 'ResetAchievement':
      case '実績リセット':
        Torigoya.Achievement2.Manager.clear();
        return;
    }
    upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
  };
})();
