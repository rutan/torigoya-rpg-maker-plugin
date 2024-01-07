import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_CommonMenu_parameter';

Torigoya.CommonMenu = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  /**
   * メニュー項目の追加
   * @param item
   * @param index
   */
  Window_MenuCommand.prototype.torigoyaCommonMenu_addCommand = function (item, index) {
    const enabled = this.torigoyaCommonMenu_isEnable(item);
    if (!enabled && !this.torigoyaCommonMenu_isVisibility(item)) return;

    this.addCommand(this.torigoyaCommonMenu_itemName(item), `TorigoyaCommonMenu_${index}`, enabled);
  };

  /**
   * メニュー項目が有効であるか？
   * @param item
   * @returns {boolean}
   */
  Window_MenuCommand.prototype.torigoyaCommonMenu_isEnable = function (item) {
    return item.switchId ? $gameSwitches.value(parseInt(item.switchId, 10)) : true;
  };

  /**
   * メニュー項目が可視状態であるか？
   * @param item
   * @returns {boolean}
   */
  Window_MenuCommand.prototype.torigoyaCommonMenu_isVisibility = function (item) {
    return item.visibility;
  };

  /**
   * メニュー項目の名前を取得
   * @param item
   * @returns {string}
   */
  Window_MenuCommand.prototype.torigoyaCommonMenu_itemName = function (item) {
    if (!item) return '';

    if (window.PluginManagerEx && window.PluginManagerEx.convertEscapeCharacters) {
      return window.PluginManagerEx.convertEscapeCharacters(item.name);
    }
    return item.name;
  };

  const upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    upstream_Window_MenuCommand_addOriginalCommands.apply(this);

    Torigoya.CommonMenu.parameter.baseItems.forEach(this.torigoyaCommonMenu_addCommand.bind(this));
  };

  const upstream_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    upstream_Scene_Menu_createCommandWindow.apply(this);

    Torigoya.CommonMenu.parameter.baseItems.forEach((item, i) => {
      const id = parseInt(item.commonEvent, 10);
      if (!id) return;

      this._commandWindow.setHandler(`TorigoyaCommonMenu_${i}`, () => {
        $gameTemp.reserveCommonEvent(id);
        SceneManager.goto(Scene_Map);
      });
    });
  };
})();
