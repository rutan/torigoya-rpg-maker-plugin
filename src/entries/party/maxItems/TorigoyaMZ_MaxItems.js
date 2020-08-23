import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_MaxItems_parameter';

Torigoya.MaxItems = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // -------------------------------------------------------------------------
  // Game_Party

  const upstream_Game_Party_maxItems = Game_Party.prototype.maxItems;
  Game_Party.prototype.maxItems = function (item) {
    const meta = item.meta['MaxItems'] || item.meta['最大所持数'];
    if (meta) {
      const match = meta.match(/v\[(\d+)]/);
      if (match) {
        return $gameVariables.value(parseInt(match[1], 10));
      } else {
        return parseInt(meta, 10);
      }
    } else {
      return upstream_Game_Party_maxItems.apply(this, arguments);
    }
  };

  // アイテム全体の個数が上限に収まるように調整
  Game_Party.prototype.torigoyaAdjustAllItemSize = function () {
    this.items().forEach((item) => {
      this._items[item.id] = this.numItems(item).clamp(0, this.maxItems(item));
    });

    this.weapons().forEach((item) => {
      this._weapons[item.id] = this.numItems(item).clamp(0, this.maxItems(item));
    });

    this.armors().forEach((item) => {
      this._armors[item.id] = this.numItems(item).clamp(0, this.maxItems(item));
    });
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandAdjustItems() {
    $gameParty.torigoyaAdjustAllItemSize();
  }

  PluginManager.registerCommand(Torigoya.MaxItems.name, 'adjustItems', commandAdjustItems);
})();
