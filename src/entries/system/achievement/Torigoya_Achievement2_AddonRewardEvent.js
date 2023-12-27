import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_Achievement2_AddonRewardEvent_parameter';
import { checkPlugin } from '../../../../scripts/utils/checkPlugin';
import { checkPluginVersion } from '../../../common/utils/checkPlugin';

checkPlugin(
  Torigoya.Achievement2,
  '「実績アドオン:ご褒美コモンイベント」より上に「実績プラグイン」が導入されていません。',
);
checkPluginVersion(
  Torigoya.Achievement2.parameter.version,
  '1.6.0',
  '「実績アドオン:ご褒美コモンイベント」を利用するには「実績プラグイン」を最新版にアップデートしてください',
);

Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
Torigoya.Achievement2.Addons.RewardEvent = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  function findRewardEvent(item) {
    if (!item) return null;
    const setting = item.achievement.meta['コモンイベント'] || item.achievement.meta['CommonEvent'];
    return setting === undefined ? null : Number.parseInt(setting, 10);
  }

  Torigoya.Achievement2.Addons.RewardEvent.lastItem = null;

  // -------------------------------------------------------------------------
  // Window_AchievementList

  const upstream_Window_AchievementList_isCurrentItemEnabled =
    Torigoya.Achievement2.Window_AchievementList.prototype.isCurrentItemEnabled;
  Torigoya.Achievement2.Window_AchievementList.prototype.isCurrentItemEnabled = function () {
    const item = this.item();
    if (!this.isLaunchInTitle() && item && item.unlockInfo && findRewardEvent(item)) return true;
    return upstream_Window_AchievementList_isCurrentItemEnabled.apply(this);
  };

  // -------------------------------------------------------------------------
  // Scene_Achievement

  const upstream_Scene_Achievement_onListOk = Torigoya.Achievement2.Scene_Achievement.prototype.onListOk;
  Torigoya.Achievement2.Scene_Achievement.prototype.onListOk = function () {
    const commonEventId = findRewardEvent(this._listWindow.item());
    if (!this.isLaunchInTitle() && commonEventId) {
      Torigoya.Achievement2.Addons.RewardEvent.lastItem = this._listWindow.item().achievement;
      $gameTemp.reserveCommonEvent(commonEventId);
      SceneManager.goto(Scene_Map);
    } else {
      upstream_Scene_Achievement_onListOk.apply(this);
    }
  };
})();
