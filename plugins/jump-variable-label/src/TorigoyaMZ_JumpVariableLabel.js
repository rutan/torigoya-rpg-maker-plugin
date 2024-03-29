import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_JumpVariableLabel_parameter';
import { replaceVariable } from './module/replaceVariable';

Torigoya.JumpVariableLabel = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  function replace(text) {
    if (window.PluginManagerEx) {
      return window.PluginManagerEx.convertEscapeCharacters(text);
    }
    return replaceVariable(text);
  }

  const upstream_Game_Interpreter_command119 = Game_Interpreter.prototype.command119;
  Game_Interpreter.prototype.command119 = function (params) {
    return upstream_Game_Interpreter_command119.call(this, [replace(params[0])]);
  };
})();
