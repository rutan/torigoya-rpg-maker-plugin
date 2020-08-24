import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_Achievement2_AddonTileView_parameter';
import { checkPlugin } from '../../../../scripts/utils/checkPlugin';

checkPlugin(Torigoya.Achievement2, '「実績アドオン:タイル表示」より上に「実績プラグイン」が導入されていません。');

Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
Torigoya.Achievement2.Addons.TileView = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  const Window_AchievementList = Torigoya.Achievement2.Window_AchievementList;
  const parameter = Torigoya.Achievement2.Addons.TileView.parameter;

  const upstream_Window_AchievementList_initialize = Window_AchievementList.prototype.initialize;
  Window_AchievementList.prototype.initialize = function (rect) {
    this._areaRect = rect;
    upstream_Window_AchievementList_initialize.apply(this, arguments);
    this.resizeFittingItems();
    this.refresh();
  };

  Window_AchievementList.prototype.resizeFittingItems = function () {
    const { x, y, width, height } = this._areaRect;

    const h = Math.ceil(this.maxItems() / this.maxCols());
    this.width = Math.min(this.maxCols() * this.itemWidth() + this.padding * 2, width);
    this.height = Math.max(
      Math.min(h * this.itemHeight() + (h - 1) * this.rowSpacing() + this.padding * 2, height),
      this.fittingHeight(1)
    );
    this.x = x + (width - this.width) / 2;
    this.y = y + (height - this.height) / 2;
  };

  Window_AchievementList.prototype.itemPadding = function () {
    return parameter.itemPadding;
  };

  Window_AchievementList.prototype.maxCols = function () {
    return parameter.colsSize;
  };

  Window_AchievementList.prototype.itemWidth = function () {
    return ImageManager.iconWidth + parameter.itemPadding * 2 + this.colSpacing();
  };

  Window_AchievementList.prototype.itemHeight = function () {
    return ImageManager.iconHeight + parameter.itemPadding * 2 + this.rowSpacing();
  };

  Window_AchievementList.prototype.lineHeight = function () {
    return this.itemHeight();
  };

  const upstream_Window_AchievementList_drawAllItems = Window_AchievementList.prototype.drawAllItems;
  Window_AchievementList.prototype.drawAllItems = function () {
    this.resizeFittingItems();
    upstream_Window_AchievementList_drawAllItems.apply(this);
  };

  Window_AchievementList.prototype.drawItem = function (index) {
    const item = this._data[index];
    const rect = this.itemRect(index);
    this.resetFontSettings();

    if (item) {
      if (item.unlockInfo) {
        this.changePaintOpacity(true);
        this.drawIcon(item.achievement.icon, rect.x + parameter.itemPadding, rect.y + parameter.itemPadding);
      } else {
        this.changePaintOpacity(false);
        this.drawIcon(
          Torigoya.Achievement2.parameter.achievementMenuHiddenIcon,
          rect.x + parameter.itemPadding,
          rect.y + parameter.itemPadding
        );
      }
    } else {
      this.changePaintOpacity(true);
      this.drawText(Torigoya.Achievement2.parameter.achievementMenuCancelMessage, rect.x, rect.y, rect.width, 'center');
    }
  };
})();
