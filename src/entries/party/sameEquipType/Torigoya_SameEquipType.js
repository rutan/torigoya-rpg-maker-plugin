import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_SameEquipType_parameter';

Torigoya.SameEquipType = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  const upstream_Game_Actor_equipSlots = Game_Actor.prototype.equipSlots;
  Game_Actor.prototype.equipSlots = function () {
    const slots = upstream_Game_Actor_equipSlots.apply(this);
    for (let i = 1; i < $dataSystem.equipTypes.length; ++i) {
      const n = $dataSystem.equipTypes.indexOf($dataSystem.equipTypes[i]);
      if (n !== i) {
        slots[i - 1] = n;
      }
    }
    return slots;
  };
})();
