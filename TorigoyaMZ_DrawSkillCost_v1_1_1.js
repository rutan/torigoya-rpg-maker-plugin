/*---------------------------------------------------------------------------*
 * TorigoyaMZ_DrawSkillCost.js v.1.1.1
 *---------------------------------------------------------------------------*
 * 2021/07/05 22:08 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc スキルコスト表示拡張プラグイン (v.1.1.1)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.1.1
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_DrawSkillCost.js
 * @orderAfter HPConsumeSkill
 * @help
 * スキルコスト表示拡張プラグイン (v.1.1.1)
 * https://torigoya-plugin.rutan.dev
 *
 * スキル一覧の消費コスト表示を拡張します。
 *
 * ・数値だけではなく「MP10」のようにラベル付きで表示できるようにします
 * ・MPとTPを両方使う場合は両方表示します
 * 　　・ロンチプラグインの「HPConsumeSkill」のHP消費にも対応します
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param labelFontSize
 * @text ラベルのサイズ
 * @desc コスト表示部分のラベル(MPなどの部分)の文字サイズ
 * 0の場合はラベルを表示しません
 * @type number
 * @min 0
 * @default 14
 *
 * @param valueFontSize
 * @text 数値のサイズ
 * @desc コスト表示部分の数値の文字サイズ
 * @type number
 * @min 1
 * @default 20
 *
 * @param gapSize
 * @text 隙間のサイズ
 * @desc コスト表記が複数ある場合の隙間のサイズ
 * @type number
 * @min 0
 * @default 6
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_DrawSkillCost';
    }

    function pickNumberValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseFloat(parameter[key]);
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.1',
            labelFontSize: pickNumberValueFromParameter(parameter, 'labelFontSize', 14),
            valueFontSize: pickNumberValueFromParameter(parameter, 'valueFontSize', 20),
            gapSize: pickNumberValueFromParameter(parameter, 'gapSize', 6),
        };
    }

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
                const labelWidth = Torigoya.DrawSkillCost.parameter.labelFontSize
                    ? this.contents.measureTextWidth(obj.label)
                    : 0;

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
})();
