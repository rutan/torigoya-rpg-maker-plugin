import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_JumpVariableLabel_parameter';
import { replaceVariable } from './module/replaceVariable';

Torigoya.JumpVariableLabel = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  const upstream_Game_Interpreter_command119 = Game_Interpreter.prototype.command119;
  Game_Interpreter.prototype.command119 = function () {
    this._params = [...this._params];
    this._params[0] = replaceVariable(this._params[0]);
    return upstream_Game_Interpreter_command119.call(this);
  };
})();
