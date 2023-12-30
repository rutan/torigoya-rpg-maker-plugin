import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
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
  fontFamily: Torigoya.NiconikoBar.parameter.baseFontFamily,
  scrollSpeed: Torigoya.NiconikoBar.parameter.baseScrollSpeed,
  scrollTimeMax: Torigoya.NiconikoBar.parameter.baseScrollTimeMax,
});

Torigoya.NiconikoBar.timer = new Timer(
  () => {
    return Torigoya.NiconikoBar.client.fetchNewHistories().then((histories) => {
      if (histories.length === 0) return;

      Torigoya.NiconikoBar.viewBuilder.showMessage(
        `${generateMessage(histories)} ${Torigoya.NiconikoBar.parameter.baseMessage}`,
      );
    });
  },
  Torigoya.NiconikoBar.parameter.advancedFetchInterval * 60 * 1000,
);

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

function commandStart() {
  Torigoya.NiconikoBar.timer.start();
}

function commandStop() {
  Torigoya.NiconikoBar.timer.stop();
}

PluginManager.registerCommand(Torigoya.NiconikoBar.name, 'start', commandStart);
PluginManager.registerCommand(Torigoya.NiconikoBar.name, 'stop', commandStop);
