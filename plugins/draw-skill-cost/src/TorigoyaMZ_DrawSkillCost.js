import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_DrawSkillCost_parameter';

Torigoya.DrawSkillCost = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  let hpCostColorCache;

  function getHpCostColor() {
    if (!hpCostColorCache) {
      const parameters = PluginManager.parameters('HPConsumeSkill');
      const colorId = Number(parameters['Consume HP Color'] || 17);
      hpCostColorCache = ColorManager.textColor(colorId);
    }
    return hpCostColorCache;
  }

  Window_SkillList.prototype.drawSkillCost = function (skill, x, y, width) {
    const items = this.torigoyaDrawSkillCost_costItems(skill);
    if (items.length === 0) return;

    const maxWidth = (width - Torigoya.DrawSkillCost.parameter.gapSize * (items.length - 1)) / items.length;
    let baseX = x + width;
    items.forEach((obj) => {
      this.changeTextColor(obj.color);

      this.contents.fontSize = Torigoya.DrawSkillCost.parameter.labelFontSize;
      const labelWidth = Torigoya.DrawSkillCost.parameter.labelFontSize ? this.contents.measureTextWidth(obj.label) : 0;

      this.contents.fontSize = Torigoya.DrawSkillCost.parameter.valueFontSize;
      const w = Math.max(Math.min(this.contents.measureTextWidth(obj.value), maxWidth - labelWidth), 1);

      baseX -= w;
      this.contents.drawText(obj.value, baseX, y, w, this.lineHeight());

      if (Torigoya.DrawSkillCost.parameter.labelFontSize) {
        this.contents.fontSize = Torigoya.DrawSkillCost.parameter.labelFontSize;
        baseX -= labelWidth;
        this.contents.drawText(obj.label, baseX, y, w, this.lineHeight());
      }

      baseX -= Torigoya.DrawSkillCost.parameter.gapSize;
    });

    this.resetFontSettings();
  };

  Window_SkillList.prototype.torigoyaDrawSkillCost_costItems = function (skill) {
    const hpCost = typeof this._actor.skillHpCost === 'function' ? this._actor.skillHpCost(skill) : 0;
    const mpCost = this._actor.skillMpCost(skill);
    const tpCost = this._actor.skillTpCost(skill);
    return [
      tpCost ? { value: tpCost, label: TextManager.tpA, color: ColorManager.tpCostColor() } : false,
      mpCost ? { value: mpCost, label: TextManager.mpA, color: ColorManager.mpCostColor() } : false,
      hpCost ? { value: hpCost, label: TextManager.hpA, color: getHpCostColor() } : false,
    ].filter(Boolean);
  };
})();
