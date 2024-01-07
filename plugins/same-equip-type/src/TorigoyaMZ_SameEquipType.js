import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_SameEquipType_parameter';

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
      if (n === i) continue;
      slots[i - 1] = n;
    }
    return slots;
  };
})();
