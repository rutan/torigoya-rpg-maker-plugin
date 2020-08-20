import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_MaxSlipDamageSetting_parameter';

Torigoya.MaxSlipDamageSetting = {
  name: getPluginName(),
  parameter: readParameter(),
};

const upstream_Game_Enemy_maxSlipDamage = Game_Enemy.prototype.maxSlipDamage;
Game_Enemy.prototype.maxSlipDamage = function () {
  const defaultValue = upstream_Game_Enemy_maxSlipDamage.apply(this);
  const maxSlipDamage = this.enemy().meta['MaxSlipDamage'];
  if (maxSlipDamage) {
    return Math.min(defaultValue, parseInt(maxSlipDamage, 10));
  } else {
    return defaultValue;
  }
};
