import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_CommonMenu_parameter';

Torigoya.CommonMenu = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  const upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    upstream_Window_MenuCommand_addOriginalCommands.apply(this);

    Torigoya.CommonMenu.parameter.baseItems.forEach((item, i) => {
      const enabled = item.switchId ? $gameSwitches.value(parseInt(item.switchId, 10)) : true;
      if (!enabled && !item.visibility) return;
      this.addCommand(item.name, `TorigoyaCommonMenu_${i}`, enabled);
    });
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
