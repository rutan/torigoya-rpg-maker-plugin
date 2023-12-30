import { Torigoya, getPluginName, findGlobalObject } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_SmoothValueGauge_parameter';

Torigoya.SmoothValueGauge = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  Torigoya.SmoothValueGauge.parameter.advancedTargetClassList.forEach((targetSpriteName) => {
    const targetSprite = findGlobalObject(targetSpriteName.trim());
    if (!targetSprite) {
      const error = `[ゲージ数値アニメーションプラグイン] ${targetSpriteName} というクラスが見つかりません`;
      console.error(error);
      if (Utils.isOptionValid('test')) alert(error);
      return;
    }

    const upstream_drawValue = targetSprite.prototype.drawValue;
    targetSprite.prototype.drawValue = function () {
      this._torigoyaEnemyHpBar_AddonSmoothValueFlag = true;
      upstream_drawValue.apply(this);
      this._torigoyaEnemyHpBar_AddonSmoothValueFlag = false;
    };

    const upstream_currentValue = targetSprite.prototype.currentValue;
    targetSprite.prototype.currentValue = function () {
      if (this._torigoyaEnemyHpBar_AddonSmoothValueFlag && !isNaN(this._value)) {
        return Math.round(this._value);
      } else {
        return upstream_currentValue.apply(this);
      }
    };
  });
})();
