import { Torigoya, getPluginName, checkExistPlugin } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_NotifyMessage_AddonGetItem_parameter';

checkExistPlugin(
  Torigoya.NotifyMessage,
  '「通知メッセージアドオン: アイテム獲得表示」より上に「通知メッセージプラグイン」が導入されていません。',
);

Torigoya.NotifyMessage.Addons = Torigoya.NotifyMessage.Addons || {};
Torigoya.NotifyMessage.Addons.GetItem = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // -------------------------------------------------------------------------
  // Functions

  Torigoya.NotifyMessage.Addons.GetItem.isEnabled = function () {
    const switchId = Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedSwitch;
    if (!switchId) return true;

    return $gameSwitches.value(switchId);
  };

  Torigoya.NotifyMessage.Addons.GetItem.isShowHiddenItem = function () {
    return !!Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedShowHiddenItem;
  };

  Torigoya.NotifyMessage.Addons.GetItem.notifyGainMoney = function (value) {
    if (!this.isEnabled()) return;

    const template = Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainMoneyMessage;
    if (!template) return;

    const notifyItem = new Torigoya.NotifyMessage.NotifyItem({
      message: template.replace(/\\gold/, value),
      icon: Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainMoneyIcon,
      note: '<type:gainMoney>',
    });
    Torigoya.NotifyMessage.Manager.notify(notifyItem);
  };

  Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem = function (item, count) {
    if (!this.isEnabled()) return;
    if (!this.isNotifyItem(item)) return;

    const template =
      count === 1
        ? Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainSingleMessage
        : Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainMultiMessage;
    if (!template) return;

    const notifyItem = new Torigoya.NotifyMessage.NotifyItem({
      message: template.replace(/\\count/, count).replace(/\\name/, item.name),
      icon: item.iconIndex,
      note: '<type:gainItem>',
    });
    Torigoya.NotifyMessage.Manager.notify(notifyItem);
  };

  Torigoya.NotifyMessage.Addons.GetItem.isNotifyItem = function (item) {
    if (!this.isShowHiddenItem() && (item.itypeId === 3 || item.itypeId === 4)) return false;
    if (item.meta && (item.meta['GainNotifyHidden'] || item.meta['獲得通知非表示'])) return false;

    return true;
  };

  // -------------------------------------------------------------------------
  // Torigoya.NotifyMessage.NotifyItem

  const upstream_NotifyItem_getDisplaySe = Torigoya.NotifyMessage.NotifyItem.prototype.getDisplaySe;
  Torigoya.NotifyMessage.NotifyItem.prototype.getDisplaySe = function () {
    switch (this.meta.type) {
      case 'gainItem': {
        if (Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainItemSound.overwrite) {
          return Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainItemSound.sound;
        }
        break;
      }
      case 'gainMoney': {
        if (Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainMoneySound.overwrite) {
          return Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainMoneySound.sound;
        }
        break;
      }
    }
    return upstream_NotifyItem_getDisplaySe.apply(this);
  };

  // -------------------------------------------------------------------------
  // Game_Interpreter

  const upstream_Game_Interpreter_command125 = Game_Interpreter.prototype.command125;
  Game_Interpreter.prototype.command125 = function (params) {
    const value = this.operateValue(params[0], params[1], params[2]);
    if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainMoney(value);
    return upstream_Game_Interpreter_command125.apply(this, arguments);
  };

  const upstream_Game_Interpreter_command126 = Game_Interpreter.prototype.command126;
  Game_Interpreter.prototype.command126 = function (params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem($dataItems[params[0]], value);
    return upstream_Game_Interpreter_command126.apply(this, arguments);
  };

  const upstream_Game_Interpreter_command127 = Game_Interpreter.prototype.command127;
  Game_Interpreter.prototype.command127 = function (params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem($dataWeapons[params[0]], value);
    return upstream_Game_Interpreter_command127.apply(this, arguments);
  };

  const upstream_Game_Interpreter_command128 = Game_Interpreter.prototype.command128;
  Game_Interpreter.prototype.command128 = function (params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem($dataArmors[params[0]], value);
    return upstream_Game_Interpreter_command128.apply(this, arguments);
  };
})();
