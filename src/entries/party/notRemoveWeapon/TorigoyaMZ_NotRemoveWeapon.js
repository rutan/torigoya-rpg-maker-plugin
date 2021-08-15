import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_NotRemoveWeapon_parameter';

Torigoya.NotRemoveWeapon = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // -------------------------------------------------------------------------
  // Game_Actor

  Game_Actor.prototype.torigoyaNotRemoveWeapon_isWeaponSlot = function (slotId) {
    const id = this.equipSlots()[slotId];
    return Torigoya.NotRemoveWeapon.parameter.advancedSlotIds.findIndex((n) => id === n) >= 0;
  };

  // [再定義] 全部外すで外れないようにする
  Game_Actor.prototype.clearEquipments = function () {
    const maxSlots = this.equipSlots().length;
    for (let i = 0; i < maxSlots; i++) {
      if (!this.torigoyaNotRemoveWeapon_isWeaponSlot(i) && this.isEquipChangeOk(i)) {
        this.changeEquip(i, null);
      }
    }
  };

  // 今の装備品とも比較するようにする
  const upstream_Game_Actor_bestEquipItem = Game_Actor.prototype.bestEquipItem;
  Game_Actor.prototype.bestEquipItem = function (slotId) {
    const bestItem = upstream_Game_Actor_bestEquipItem.apply(this, arguments),
      nowItem = this._equips[slotId].object(),
      bestPerformance = bestItem ? this.calcEquipItemPerformance(bestItem) : -1000,
      nowPerformance = nowItem ? this.calcEquipItemPerformance(nowItem) : -1000;

    return nowPerformance > bestPerformance ? nowItem : bestItem;
  };

  // -------------------------------------------------------------------------
  // Window_EquipItem

  // 武器のときは末尾空白を入れない
  const upstream_Window_EquipItem_includes = Window_EquipItem.prototype.includes;
  Window_EquipItem.prototype.includes = function (item) {
    if (!item && this._actor && this._actor.torigoyaNotRemoveWeapon_isWeaponSlot(this._slotId)) {
      return false;
    }
    return upstream_Window_EquipItem_includes.apply(this, arguments);
  };

  // 武器のときは空白を選択できない
  const upstream_Window_EquipItem_isEnabled = Window_EquipItem.prototype.isEnabled;
  Window_EquipItem.prototype.isEnabled = function (item) {
    if (!item && this._actor && this._actor.torigoyaNotRemoveWeapon_isWeaponSlot(this._slotId)) {
      return false;
    }
    return upstream_Window_EquipItem_isEnabled.apply(this, arguments);
  };
})();
