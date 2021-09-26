import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_AtsumaruCommentOpacity_parameter';
import { setOpacity } from './modules/setOpacity';

Torigoya.AtsumaruCommentOpacity = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // -------------------------------------------------------------------------
  // Scene_Title

  const upstream_Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    upstream_Scene_Title_create.apply(this);
    this.torigoyaAtsumaruCommentOpacity_setDefaultOpacity();
  };

  Scene_Title.prototype.torigoyaAtsumaruCommentOpacity_setDefaultOpacity = function () {
    setOpacity(Torigoya.AtsumaruCommentOpacity.parameter.defaultOpacity);
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandChangeOpacity({ opacity }) {
    setOpacity(opacity);
  }

  function commandResetOpacity() {
    setOpacity(Torigoya.AtsumaruCommentOpacity.parameter.defaultOpacity);
  }

  PluginManager.registerCommand(Torigoya.AtsumaruCommentOpacity.name, 'changeOpacity', commandChangeOpacity);
  PluginManager.registerCommand(Torigoya.AtsumaruCommentOpacity.name, 'resetOpacity', commandResetOpacity);
})();
