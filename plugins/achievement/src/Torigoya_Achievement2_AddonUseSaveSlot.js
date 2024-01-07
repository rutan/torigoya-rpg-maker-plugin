import { Torigoya, getPluginName, checkExistPlugin } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/Torigoya_Achievement2_AddonUseSaveSlot_parameter.js';

checkExistPlugin(
  Torigoya.Achievement2,
  '「実績アドオン:セーブ別実績」より上に「実績プラグイン」が導入されていません。',
);

Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
Torigoya.Achievement2.Addons.UseSaveSlot = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // -------------------------------------------------------------------------
  // Manager

  Torigoya.Achievement2.Manager.options.onInit = function (manager) {
    manager.setAchievements(Torigoya.Achievement2.parameter.baseAchievementData);
  };

  Torigoya.Achievement2.Manager.options.onSave = null;

  // -------------------------------------------------------------------------
  // DataManager

  const upstream_DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    upstream_DataManager_createGameObjects.apply(this);
    Torigoya.Achievement2.Manager.resetData();
  };

  const upstream_DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = upstream_DataManager_makeSaveContents.apply(this);
    contents.torigoyaAchievement2 = Torigoya.Achievement2.Manager.createSaveContents();
    return contents;
  };

  const upstream_DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    upstream_DataManager_extractSaveContents.apply(this, arguments);

    const { torigoyaAchievement2 } = contents;
    if (torigoyaAchievement2) {
      Torigoya.Achievement2.Manager.extractSaveContents(torigoyaAchievement2);
    }
  };
})();
