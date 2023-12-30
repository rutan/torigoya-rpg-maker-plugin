import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/Torigoya_AtsumaruCommentOpacity_parameter';
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

  const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    switch (command) {
      case 'SetCommentOpacity':
      case 'コメント不透明度設定':
        setOpacity(parseInt(args[0], 10));
        return;
      case 'ResetCommentOpacity':
      case 'コメント不透明度初期化':
        setOpacity(Torigoya.AtsumaruCommentOpacity.parameter.defaultOpacity);
        return;
    }

    return upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
  };
})();
