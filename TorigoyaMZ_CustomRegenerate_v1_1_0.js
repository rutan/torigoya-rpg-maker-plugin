/*---------------------------------------------------------------------------*
 * TorigoyaMZ_CustomRegenerate.js v.1.1.0
 *---------------------------------------------------------------------------*
 * 2021/06/22 02:33 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc カスタムターン回復＆ダメージ設定プラグイン (v.1.1.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.1.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_CustomRegenerate.js
 * @help
 * カスタムターン回復＆ダメージ設定プラグイン (v.1.1.0)
 * https://torigoya-plugin.rutan.dev
 *
 * 毒などのターン毎の回復・ダメージ量をメモ欄で設定できるようにします。
 * 毎ターン固定10ダメージ、のようなものを作りやすくします。
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 * ステート等のメモ欄に以下のように設定してください。
 *
 * ■ 例1：毎ターンHPを10回復
 *
 * <CustomRegenerateHP: 10>
 *
 * ■ 例2：毎ターンMPに20ダメージ
 *
 * <CustomRegenerateMP: -20>
 *
 * ※マイナスにすると回復になります
 *
 * ■ 例3（プロ向け）：毎ターン現在HPの10%ダメージ
 *
 * <CustomRegenerateHP: -0.1 * a.hp>
 *
 * ※ダメージ計算のように「a」に自分自身が入ります。
 * 　ただしダメージ計算と違って「b」はないので気をつけてね！
 *
 * @param advanced
 * @text ■ 上級者設定
 *
 * @param advancedNoteTagHp
 * @text HP用のメモタグ
 * @desc メモ欄に指定するタグの名前（HP用）
 * 空欄の場合は機能が無効になります
 * @type string
 * @parent base
 * @default CustomRegenerateHP
 *
 * @param advancedNoteTagMp
 * @text HP用のメモタグ
 * @desc メモ欄に指定するタグの名前（MP用）
 * 空欄の場合は機能が無効になります
 * @type string
 * @parent base
 * @default CustomRegenerateMP
 *
 * @param advancedNoteTagTp
 * @text HP用のメモタグ
 * @desc メモ欄に指定するタグの名前（TP用）
 * 空欄の場合は機能が無効になります
 * @type string
 * @parent base
 * @default CustomRegenerateTP
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        const match = cs && cs.src.match(/\/js\/plugins\/(.+)\.js$/);
        return match ? match[1] : 'TorigoyaMZ_CustomRegenerate';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return ''.concat(parameter[key] || '');
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.0',
            advancedNoteTagHp: pickStringValueFromParameter(parameter, 'advancedNoteTagHp', 'CustomRegenerateHP'),
            advancedNoteTagMp: pickStringValueFromParameter(parameter, 'advancedNoteTagMp', 'CustomRegenerateMP'),
            advancedNoteTagTp: pickStringValueFromParameter(parameter, 'advancedNoteTagTp', 'CustomRegenerateTP'),
        };
    }

    function customEval(a, code) {
        try {
            return parseInt(eval(code), 10);
        } catch (e) {
            console.error(e);
            return 0;
        }
    }

    function applyCustomRegenerateHp(noteTag) {
        const tmpBattlerHpMap = new WeakMap();

        const upstream_Game_Battler_regenerateHp = Game_Battler.prototype.regenerateHp;
        Game_Battler.prototype.regenerateHp = function () {
            tmpBattlerHpMap.set(this, true);
            upstream_Game_Battler_regenerateHp.apply(this);

            if (tmpBattlerHpMap.get(this)) {
                tmpBattlerHpMap.delete(this);
                const minRecover = -this.maxSlipDamage();
                const value = Math.max(this.torigoya_customRegenerateHp(), minRecover);
                if (value !== 0) this.gainHp(value);
            }
        };

        const upstream_Game_Battler_gainHp = Game_Battler.prototype.gainHp;
        Game_Battler.prototype.gainHp = function (value) {
            if (tmpBattlerHpMap.get(this)) {
                tmpBattlerHpMap.delete(this);
                const minRecover = -this.maxSlipDamage();
                value = Math.max(value + this.torigoya_customRegenerateHp(), minRecover);
                if (value === 0) return;
            }

            upstream_Game_Battler_gainHp.call(this, value);
        };

        Game_Battler.prototype.torigoya_customRegenerateHp = function () {
            return this.traitObjects()
                .filter((obj) => obj.meta[noteTag])
                .map((obj) => customEval(this, obj.meta[noteTag]))
                .reduce((a, b) => a + b, 0);
        };
    }

    function applyCustomRegenerateMp(noteTag) {
        const tmpBattlerMpMap = new WeakMap();

        const upstream_Game_Battler_regenerateMp = Game_Battler.prototype.regenerateMp;
        Game_Battler.prototype.regenerateMp = function () {
            tmpBattlerMpMap.set(this, true);
            upstream_Game_Battler_regenerateMp.apply(this);

            if (tmpBattlerMpMap.get(this)) {
                tmpBattlerMpMap.delete(this);
                const value = this.torigoya_customRegenerateMp();
                if (value !== 0) this.gainMp(value);
            }
        };

        const upstream_Game_Battler_gainMp = Game_Battler.prototype.gainMp;
        Game_Battler.prototype.gainMp = function (value) {
            if (tmpBattlerMpMap.get(this)) {
                tmpBattlerMpMap.delete(this);
                value += this.torigoya_customRegenerateMp();
                if (value === 0) return;
            }

            upstream_Game_Battler_gainMp.call(this, value);
        };

        Game_Battler.prototype.torigoya_customRegenerateMp = function () {
            return this.traitObjects()
                .filter((obj) => obj.meta[noteTag])
                .map((obj) => customEval(this, obj.meta[noteTag]))
                .reduce((a, b) => a + b, 0);
        };
    }

    function applyCustomRegenerateTp(noteTag) {
        const upstream_Game_Battler_regenerateTp = Game_Battler.prototype.regenerateTp;
        Game_Battler.prototype.regenerateTp = function () {
            const value = this.torigoya_customRegenerateTp();
            upstream_Game_Battler_regenerateTp.apply(this);
            this.gainSilentTp(value);
        };

        Game_Battler.prototype.torigoya_customRegenerateTp = function () {
            return this.traitObjects()
                .filter((obj) => obj.meta[noteTag])
                .map((obj) => customEval(this, obj.meta[noteTag]))
                .reduce((a, b) => a + b, 0);
        };
    }

    Torigoya.CustomRegenerate = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    if (Torigoya.CustomRegenerate.parameter.advancedNoteTagHp) {
        applyCustomRegenerateHp(Torigoya.CustomRegenerate.parameter.advancedNoteTagHp);
    }
    if (Torigoya.CustomRegenerate.parameter.advancedNoteTagMp) {
        applyCustomRegenerateMp(Torigoya.CustomRegenerate.parameter.advancedNoteTagMp);
    }
    if (Torigoya.CustomRegenerate.parameter.advancedNoteTagTp) {
        applyCustomRegenerateTp(Torigoya.CustomRegenerate.parameter.advancedNoteTagTp);
    }
})();
