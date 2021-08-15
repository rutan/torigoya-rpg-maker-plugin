import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_Achievement2_AddonCategory_parameter';
import { checkPlugin } from '../../../../scripts/utils/checkPlugin';

checkPlugin(Torigoya.Achievement2, '「実績アドオン:カテゴリ設定」より上に「実績プラグイン」が導入されていません。');

Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
Torigoya.Achievement2.Addons.Category = {
  name: getPluginName(),
  parameter: readParameter(),
};

class Window_AchievementCategory extends Window_Command {
  constructor(rect) {
    super(rect);
    this._listWindow = null;
  }

  maxCols() {
    if (Torigoya.Achievement2.Addons.Category.parameter.position === 'top') {
      return Math.min(
        Torigoya.Achievement2.Addons.Category.parameter.categories.length,
        Torigoya.Achievement2.Addons.Category.parameter.maxCols
      );
    } else {
      return 1;
    }
  }

  makeCommandList() {
    Torigoya.Achievement2.Addons.Category.parameter.categories.forEach((category) => {
      this.addCommand(category.name, `category_${category.name}`, true, category);
    });
  }

  update() {
    super.update();
    if (this._listWindow) {
      this._listWindow.setCategory(this.currentExt());
    }
  }

  setListWindow(listWindow) {
    this._listWindow = listWindow;
    if (this._listWindow) this._listWindow.setCategory(this.currentExt());
  }
}

Torigoya.Achievement2.Addons.Category.Window_AchievementCategory = Window_AchievementCategory;

function readCategoryName(achievement) {
  const category = (
    achievement.meta['カテゴリー'] ||
    achievement.meta['カテゴリ'] ||
    achievement.meta['Category'] ||
    ''
  ).trim();
  if (category) return category;

  const autoCategory = Torigoya.Achievement2.Addons.Category.parameter.categories.find((category) => {
    return category.prefix && achievement.key.startsWith(category.prefix);
  });
  return autoCategory ? autoCategory.name : '';
}

Torigoya.Achievement2.Addons.Category.readCategoryName = readCategoryName;

(() => {
  const Window_AchievementList = Torigoya.Achievement2.Window_AchievementList;

  const upstream_Window_AchievementList_makeItemList = Window_AchievementList.prototype.makeItemList;
  Window_AchievementList.prototype.makeItemList = function () {
    upstream_Window_AchievementList_makeItemList.apply(this);
    this._data = this._data.filter((item) => {
      return this._category && this._category.name === readCategoryName(item.achievement);
    });
  };

  Window_AchievementList.prototype.setCategory = function (category) {
    if (this._category === category) return;
    this._category = category;
    this.refresh();
    this.scrollTo(0, 0);
  };
})();

(() => {
  const Scene_Achievement = Torigoya.Achievement2.Scene_Achievement;

  const upstream_Scene_Achievement_create = Scene_Achievement.prototype.create;
  Scene_Achievement.prototype.create = function () {
    upstream_Scene_Achievement_create.apply(this);

    this._categoryWindow = new Window_AchievementCategory(this.categoryWindowRect());
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
    this._categoryWindow.setListWindow(this._listWindow);
    this.addWindow(this._categoryWindow);
  };

  const upstream_Scene_Achievement_listWindowRect = Scene_Achievement.prototype.listWindowRect;
  Scene_Achievement.prototype.listWindowRect = function () {
    const rect = upstream_Scene_Achievement_listWindowRect.apply(this);
    const categoryRect = this.categoryWindowRect();

    const { position } = Torigoya.Achievement2.Addons.Category.parameter;
    switch (position) {
      case 'left':
        rect.x += categoryRect.width;
        rect.width -= categoryRect.width;
        break;
      case 'top':
        rect.y += categoryRect.height;
        rect.height -= categoryRect.height;
        break;
      case 'right':
        rect.width -= categoryRect.width;
        break;
    }
    return rect;
  };

  Scene_Achievement.prototype.categoryWindowRect = function () {
    const { position } = Torigoya.Achievement2.Addons.Category.parameter;

    if (position === 'top') {
      const length = Math.ceil(
        Torigoya.Achievement2.Addons.Category.parameter.categories.length /
          Torigoya.Achievement2.Addons.Category.parameter.maxCols
      );
      const wx = 0;
      const wy = this.mainAreaTop();
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(length, true);
      return new Rectangle(wx, wy, ww, wh);
    } else {
      const ww = this.mainCommandWidth();
      const wh = this.mainAreaHeight();
      const wx = position === 'left' ? 0 : Graphics.boxWidth - ww;
      const wy = this.mainAreaTop();
      return new Rectangle(wx, wy, ww, wh);
    }
  };

  const upstream_Scene_Achievement_start = Scene_Achievement.prototype.start;
  Scene_Achievement.prototype.start = function () {
    upstream_Scene_Achievement_start.apply(this);
    this._listWindow.select(-1);
    this._listWindow.deactivate();
    this._categoryWindow.activate();
  };

  Scene_Achievement.prototype.onCategoryOk = function () {
    this._listWindow.select(0);
    this._listWindow.activate();
    this._categoryWindow.deactivate();
  };

  Scene_Achievement.prototype.onCategoryCancel = function () {
    this.popScene();
  };

  Scene_Achievement.prototype.onListCancel = function () {
    this._listWindow.select(-1);
    this._listWindow.deactivate();
    this._categoryWindow.activate();
    this._helpWindow.clear();
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandGainAchievementCategory({ category }) {
    Torigoya.Achievement2.Manager.achievements.forEach((achievement) => {
      if (readCategoryName(achievement) !== category) return;
      Torigoya.Achievement2.Manager.unlock(achievement.key);
    });
  }

  function commandRemoveAchievementCategory({ category }) {
    Torigoya.Achievement2.Manager.achievements.forEach((achievement) => {
      if (readCategoryName(achievement) !== category) return;
      Torigoya.Achievement2.Manager.remove(achievement.key);
    });
  }

  PluginManager.registerCommand(
    Torigoya.Achievement2.Addons.Category.name,
    'gainAchievementCategory',
    commandGainAchievementCategory
  );
  PluginManager.registerCommand(
    Torigoya.Achievement2.Addons.Category.name,
    'removeAchievementCategory',
    commandRemoveAchievementCategory
  );
})();
