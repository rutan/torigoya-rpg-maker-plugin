import { CutInManager } from './CutInManager';

export function applyPluginToGameInterpreter() {
  const upstream_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === 'torigoyaSkillCutIn') {
      return CutInManager.isPlaying();
    }

    return upstream_Game_Interpreter_updateWaitMode.apply(this);
  };
}
