import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_Achievement2_parameter.js';
import { AchievementManager } from './modules/AchievementManager.js';
import { AchievementPopupManager } from './modules/AchievementPopupManager.js';
import { convertItemForWindow } from './modules/convertItemForWindow.js';

Torigoya.Achievement2 = {
  name: getPluginName(),
  parameter: readParameter(),
};

// -------------------------------------------------------------------------
// Utils
Torigoya.Achievement2.convertItemForWindow = convertItemForWindow;

// -------------------------------------------------------------------------
// 実績マネージャ

Torigoya.Achievement2.Manager = new AchievementManager({
  onInit(manager) {
    manager.setAchievements(Torigoya.Achievement2.parameter.baseAchievementData);

    return StorageManager.loadObject(Torigoya.Achievement2.parameter.baseSaveSlot)
      .then((data) => manager.extractSaveContents(data))
      .catch((e) => {
        console.error(e);
        manager.resetData();
      });
  },
  onSave(manager) {
    return StorageManager.saveObject(Torigoya.Achievement2.parameter.baseSaveSlot, manager.createSaveContents());
  },
  overwritable: Torigoya.Achievement2.parameter.advancedOverwritable,
});

// -------------------------------------------------------------------------
// 実績ポップアップ表示マネージャ

Torigoya.Achievement2.PopupManager = new AchievementPopupManager(Torigoya.Achievement2.Manager, {
  popupPosition: Torigoya.Achievement2.parameter.popupPosition,
  popupWait: Torigoya.Achievement2.parameter.popupWait,
  popupAnimationType: Torigoya.Achievement2.parameter.popupAnimationType,
  topY: Torigoya.Achievement2.parameter.popupTopY,
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
    const rect = new Rectangle(0, 0, this.windowWidth(), this.windowHeight());
    super.initialize(rect);
    this._item = item;
    this.refresh();
  }

  updatePadding() {
    this.padding = this.standardPadding();
  }

  windowWidth() {
    return Torigoya.Achievement2.parameter.popupWidth;
  }

  windowHeight() {
    return this.titleFontSize() + this.messageFontSize() + this.standardPadding() * 2 + 5;
  }

  standardPadding() {
    return Torigoya.Achievement2.parameter.popupPadding;
  }

  labelFontFace() {
    return Torigoya.Achievement2.parameter.advancedFontFace || $gameSystem.mainFontFace();
  }

  titleFontSize() {
    return Torigoya.Achievement2.parameter.popupTitleFontSize;
  }

  messageFontSize() {
    return Torigoya.Achievement2.parameter.popupMessageFontSize;
  }

  lineHeight() {
    return this.titleFontSize();
  }

  resetFontSettings() {
    super.resetFontSettings();
    this.contents.fontFace = this.labelFontFace();
    this.contents.fontSize = this.titleFontSize();
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
    const y = this.titleFontSize() + 5;
    this.resetTextColor();
    this.contents.fontSize = this.messageFontSize();
    this.contents.drawText(
      Torigoya.Achievement2.parameter.popupMessage,
      40,
      y,
      textWidth,
      this.messageFontSize(),
      'left',
    );
  }

  calcTextHeight() {
    return this.contents.fontSize;
  }

  loadWindowskin() {
    this.windowskin = ImageManager.loadSystem(Torigoya.Achievement2.parameter.popupWindowImage);
  }

  updateBackOpacity() {
    return Torigoya.Achievement2.parameter.popupOpacity === -1
      ? super.updateBackOpacity()
      : Torigoya.Achievement2.parameter.popupOpacity;
  }
}

Torigoya.Achievement2.Window_AchievementPopup = Window_AchievementPopup;

// -------------------------------------------------------------------------
// 実績一覧ウィンドウ

class Window_AchievementList extends Window_Selectable {
  initialize(rect) {
    super.initialize(rect);
    this._data = [];
    this._isLaunchInTitle = false;
    this.refresh();
  }

  isLaunchInTitle() {
    return this._isLaunchInTitle;
  }

  setIsLaunchInTitle(value) {
    this._isLaunchInTitle = !!value;
  }

  maxItems() {
    return this._data ? this._data.length : 0;
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
    const achievementItem = this._data[index];
    const item = Torigoya.Achievement2.convertItemForWindow(achievementItem);
    this.resetFontSettings();

    if (!item) return;

    const rect = this.itemLineRect(index);
    this.resetTextColor();
    this.changePaintOpacity(!!achievementItem);

    const iconWidth = ImageManager.iconWidth + 8;
    this.drawIcon(item.iconIndex, rect.x, rect.y + (rect.height - ImageManager.iconHeight) / 2);
    this.drawText(item.name, rect.x + iconWidth, rect.y, rect.width - iconWidth, 'left');
  }

  refresh() {
    this.makeItemList();
    this.paint();
  }

  updateHelp() {
    const item = this.item();
    this.setHelpWindowItem(Torigoya.Achievement2.convertItemForWindow(item));
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

    this._listWindow = new Window_AchievementList(this.listWindowRect());
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._listWindow);
  }

  listWindowRect() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
  }

  prepare(params) {
    this._isLaunchInTitle = !!params.isLaunchInTitle;
  }

  start() {
    super.start();
    this._listWindow.setIsLaunchInTitle(this._isLaunchInTitle);
    this._listWindow.select(0);
    this._listWindow.activate();
  }

  onListOk() {
    this.onListCancel();
  }

  onListCancel() {
    this.popScene();
  }

  isLaunchInTitle() {
    return this._isLaunchInTitle;
  }
}

Torigoya.Achievement2.Scene_Achievement = Scene_Achievement;

(() => {
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
      SceneManager.prepareNextScene({ isLaunchInTitle: true });
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
  // シーン管理

  const upstream_Scene_Boot_onSceneTerminate = SceneManager.onSceneTerminate;
  SceneManager.onSceneTerminate = function () {
    Torigoya.Achievement2.PopupManager.reset();
    upstream_Scene_Boot_onSceneTerminate.apply(this);
  };

  // -------------------------------------------------------------------------
  // 起動処理

  const upstream_Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
  Scene_Boot.prototype.onDatabaseLoaded = function () {
    upstream_Scene_Boot_onDatabaseLoaded.apply(this);
    ImageManager.loadSystem(Torigoya.Achievement2.parameter.popupWindowImage);
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

  function commandGainAchievement({ key }) {
    Torigoya.Achievement2.Manager.unlock(`${key}`.trim());
  }

  function commandRemoveAchievement({ key }) {
    Torigoya.Achievement2.Manager.remove(`${key}`.trim());
  }

  function commandOpenSceneAchievement() {
    SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
  }

  function commandResetAchievement() {
    Torigoya.Achievement2.Manager.clear();
  }

  PluginManager.registerCommand(Torigoya.Achievement2.name, 'gainAchievement', commandGainAchievement);
  PluginManager.registerCommand(Torigoya.Achievement2.name, 'removeAchievement', commandRemoveAchievement);
  PluginManager.registerCommand(Torigoya.Achievement2.name, 'openSceneAchievement', commandOpenSceneAchievement);
  PluginManager.registerCommand(Torigoya.Achievement2.name, 'resetAchievement', commandResetAchievement);
})();
