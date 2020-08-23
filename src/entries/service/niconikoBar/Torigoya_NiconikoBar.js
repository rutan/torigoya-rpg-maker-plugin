import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_NiconikoBar_parameter';
import { Timer } from './modules/Timer';
import { NiconikoApiClient } from './modules/NiconikoApiClient';
import { ViewBuilder } from './modules/ViewBuilder';
import { generateMessage } from './modules/generateMessage';

Torigoya.NiconikoBar = {
  name: getPluginName(),
  parameter: readParameter(),
};

Torigoya.NiconikoBar.client = new NiconikoApiClient({
  debug: Utils.isOptionValid('test') && Torigoya.NiconikoBar.parameter.testUseDebugMode,
  expiration: Torigoya.NiconikoBar.parameter.advancedExpiration,
});

Torigoya.NiconikoBar.viewBuilder = new ViewBuilder({
  title: Torigoya.NiconikoBar.parameter.baseTitle,
  backgroundColor: Torigoya.NiconikoBar.parameter.baseBackgroundColor,
  textColor: Torigoya.NiconikoBar.parameter.baseTextColor,
  scrollTime: Torigoya.NiconikoBar.parameter.baseScrollTime,
});

Torigoya.NiconikoBar.timer = new Timer(() => {
  return Torigoya.NiconikoBar.client.fetchNewHistories().then((histories) => {
    if (histories.length === 0) return;

    Torigoya.NiconikoBar.viewBuilder.showMessage(
      `${generateMessage(histories)} ${Torigoya.NiconikoBar.parameter.baseMessage}`
    );
  });
}, Torigoya.NiconikoBar.parameter.advancedFetchInterval * 60 * 1000);

// -------------------------------------------------------------------------
// hook

(() => {
  const upstream_Graphics_createAllElements = Graphics._createAllElements;
  Graphics._createAllElements = function () {
    upstream_Graphics_createAllElements.apply(this);
    Torigoya.NiconikoBar.viewBuilder.createElement();
  };

  const upstream_Graphics_updateAllElements = Graphics._updateAllElements;
  Graphics._updateAllElements = function () {
    upstream_Graphics_updateAllElements.apply(this);
    Torigoya.NiconikoBar.viewBuilder.updateElement();
  };

  if (Torigoya.NiconikoBar.parameter.advancedAutoStart) {
    const upstream_Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
      upstream_Scene_Boot_start.apply(this);
      Torigoya.NiconikoBar.timer.start();
    };
  }
})();

// -------------------------------------------------------------------------
// プラグインコマンド

(() => {
  const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    switch (command) {
      case 'ニコニ広告バー開始':
        Torigoya.NiconikoBar.timer.start();
        return;
      case 'ニコニ広告バー停止':
        Torigoya.NiconikoBar.timer.stop();
        return;
    }
    upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
  };
})();
