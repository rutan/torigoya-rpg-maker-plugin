import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_BattleStatusPosition_parameter';

Torigoya.BattleStatusPosition = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // パーティメンバーの人数に応じて位置を変える
  Window_BattleStatus.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();

    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;

    const itemSize = Math.min(this.maxItems(), this.maxCols());
    const totalWidth = (this.innerWidth / this.maxCols()) * itemSize;

    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = (this.innerWidth - totalWidth) / 2 + col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();

    return new Rectangle(x, y, width, height);
  };
})();
