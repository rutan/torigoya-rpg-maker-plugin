/*---------------------------------------------------------------------------*
 * TorigoyaMZ_EnemyHpBar.js v.1.2.0
 *---------------------------------------------------------------------------*
 * 2020/09/25 01:38 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 敵にHPバーを表示プラグイン (v.1.2.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.2.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_EnemyHpBar.js
 * @help
 * 敵にHPバーを表示プラグイン (v.1.2.0)
 * https://torigoya-plugin.rutan.dev
 *
 * 敵キャラにHPバーを表示します
 *
 * ------------------------------------------------------------
 * ■ 使い方
 * ------------------------------------------------------------
 * このプラグインを入れるだけでOK！
 * 細かい表示はプラグイン設定で変更できます。
 *
 * ------------------------------------------------------------
 * ■ 敵キャラ個別にいろいろ設定したい！
 * ------------------------------------------------------------
 * いくつかの設定は、敵キャラのメモ欄に指定を書くことで変更できます。
 *
 * ▼ 特定の敵キャラにはHPを表示したくない場合
 * <HPバー非表示>
 *
 * ▼ 特定の敵キャラのHPゲージを横にずらしたい場合
 * <HPバーX: 100>
 *
 * ※100の部分をずらす量に変えよう。マイナスだと左にいくよ
 *
 * ▼ 特定の敵キャラのHPゲージを上下にずらしたい場合
 * <HPバーY: 100>
 *
 * ※100の部分をずらす量に変えよう。マイナスだと上にいくよ
 *
 * ▼ 特定の敵キャラのHPゲージの幅を変えたい場合
 * <HPバー幅: 320>
 *
 * ▼ 特定の敵キャラのHPゲージの太さを変えたい場合
 * <HPバー高さ: 30>
 *
 * ▼ 敵キャラのHPの数値を「????」にしたい場合
 *
 * <HP表示条件: false>
 *
 * ▼ いや、HPが半分切ったら「????」じゃなくしたいな
 *
 * <HP表示条件: a.hp < a.mhp * 0.5>
 *
 * ダメージ計算式のような形式で条件を書くことができます。
 * （a には敵の情報が入ります。ただし b はありません）
 * 条件が真になるとHPが数値で表示され、
 * 偽の場合はプラグイン設定で指定したマスク文字（?????等）で表示されます。
 *
 * ▼ 一度「????」じゃなくなったら、条件が解けても戻さないで！
 *
 * <HP表示条件: a.hp < a.mhp * 0.5>
 * <HP表示状態継続>
 *
 * このように <HP表示状態継続> というのを追加することで、
 * その戦闘中は一度HP表示状態になると、
 * ずっとHPが表示されるようになります。
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param basePosition
 * @text 表示場所
 * @desc ゲージを表示する場所を選択します
 * @type select
 * @parent base
 * @option 敵画像の上
 * @value top
 * @option 敵画像の下
 * @value bottom
 * @default top
 *
 * @param basePosX
 * @text 位置:X
 * @desc ゲージの横方向の位置を調整します
 * マイナスだと左、プラスだと右にずれます
 * @type number
 * @parent base
 * @min -10000
 * @max 10000
 * @default 0
 *
 * @param basePosY
 * @text 位置:Y
 * @desc ゲージの縦方向の位置を調整します
 * マイナスだと上、プラスだと下にずれます
 * @type number
 * @parent base
 * @min -10000
 * @max 10000
 * @default 0
 *
 * @param customize
 * @text ■ 表示カスタマイズ
 *
 * @param customizeCondition
 * @text 表示条件
 * @desc いつゲージを表示するかを選択します
 * @type select
 * @parent customize
 * @option 常に表示
 * @value always
 * @option 選択中・ダメージ中のみ
 * @value selectOrDamage
 * @default always
 *
 * @param customizeGaugeWidth
 * @text バーの幅
 * @desc HPバーの幅
 * @type number
 * @parent customize
 * @min 1
 * @default 100
 *
 * @param customizeGaugeHeight
 * @text バーの高さ
 * @desc HPバーの高さ
 * @type number
 * @parent customize
 * @min 1
 * @default 10
 *
 * @param customizeDrawLabel
 * @text HP数値
 * @desc HP数値を表示するか？
 * @type boolean
 * @parent customize
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param customizeLabelWidth
 * @text HPラベルの横幅
 * @desc HPのラベルエリアの横幅
 * @type number
 * @parent customize
 * @min 0
 * @default 20
 *
 * @param customizeLabelFontSize
 * @text HPラベルの文字サイズ
 * @desc HPのラベルの文字サイズ
 * @type number
 * @parent customize
 * @min 1
 * @default 16
 *
 * @param customizeValueFontSize
 * @text HP数値の文字サイズ
 * @desc HPの値の文字サイズ
 * @type number
 * @parent customize
 * @min 1
 * @default 20
 *
 * @param customizeMaskHpValue
 * @text HPのマスク表記
 * @desc HP数値を秘密にする場合の表示
 * @type string
 * @parent customize
 * @default ?????
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_EnemyHpBar';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return ''.concat(parameter[key] || '');
    }

    function pickIntegerValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseInt(parameter[key], 10);
    }

    function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
        return ''.concat(parameter[key] || defaultValue) === 'true';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.2.0',
            basePosition: pickStringValueFromParameter(parameter, 'basePosition', 'top'),
            basePosX: pickIntegerValueFromParameter(parameter, 'basePosX', 0),
            basePosY: pickIntegerValueFromParameter(parameter, 'basePosY', 0),
            customizeCondition: pickStringValueFromParameter(parameter, 'customizeCondition', 'always'),
            customizeGaugeWidth: pickIntegerValueFromParameter(parameter, 'customizeGaugeWidth', 100),
            customizeGaugeHeight: pickIntegerValueFromParameter(parameter, 'customizeGaugeHeight', 10),
            customizeDrawLabel: pickBooleanValueFromParameter(parameter, 'customizeDrawLabel', 'true'),
            customizeLabelWidth: pickIntegerValueFromParameter(parameter, 'customizeLabelWidth', 20),
            customizeLabelFontSize: pickIntegerValueFromParameter(parameter, 'customizeLabelFontSize', 16),
            customizeValueFontSize: pickIntegerValueFromParameter(parameter, 'customizeValueFontSize', 20),
            customizeMaskHpValue: pickStringValueFromParameter(parameter, 'customizeMaskHpValue', '?????'),
        };
    }

    function unescapeMetaString(string) {
        return ''
            .concat(string || '')
            .trim()
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    Torigoya.EnemyHpBar = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    function isHiddenHpBar(enemy) {
        return !enemy || enemy.meta['hiddenHpBar'] || enemy.meta['HPバー非表示'];
    }

    function hpBarX(enemy) {
        return parseInt((enemy && (enemy.meta['hpBarPosX'] || enemy.meta['HPバーX'])) || 0, 10);
    }

    function hpBarY(enemy) {
        return parseInt((enemy && (enemy.meta['hpBarPosY'] || enemy.meta['HPバーY'])) || 0, 10);
    }

    function hpBarWidth(enemy) {
        return parseInt((enemy && (enemy.meta['hpBarWidth'] || enemy.meta['HPバー幅'])) || 0, 10);
    }

    function hpBarHeight(enemy) {
        return parseInt((enemy && (enemy.meta['hpBarHeight'] || enemy.meta['HPバー高さ'])) || 0, 10);
    }

    const forceShowHpValueCache = new WeakSet();

    function isShowHpValueOfBattler(a) {
        if (!a) return true;
        if (forceShowHpValueCache.has(a)) return true;

        const enemy = a.enemy();
        const code = enemy.meta['hpShowCondition'] || enemy.meta['HP表示条件'] || '';
        if (!code) return true;
        try {
            if (eval(unescapeMetaString(code))) {
                if (enemy.meta['hpShowPermanently'] || enemy.meta['HP表示状態継続']) {
                    forceShowHpValueCache.add(a);
                }
                return true;
            }
        } catch (e) {
            if ($gameTemp.isPlaytest()) console.error(e);
        }

        return false;
    }

    class Sprite_EnemyHpGauge extends Sprite_Gauge {
        constructor() {
            super();
            this._durationWait = 0;
        }

        setup(battler, statusType) {
            if (this._battler === battler) return;
            this._battler = battler;
            this.reCreateBitmap();
            super.setup(battler, statusType);
        }

        reCreateBitmap() {
            if (this.bitmap) this.bitmap.destroy();
            this.bitmap = null;
            this.createBitmap();
        }

        bitmapWidth() {
            return this.gaugeWidth() + this.gaugeX();
        }

        bitmapHeight() {
            if (Torigoya.EnemyHpBar.parameter.customizeDrawLabel) {
                return Math.max(
                    this.labelFontSize() + this.labelOutlineWidth(),
                    this.valueFontSize() + this.valueOutlineWidth(),
                    this.gaugeHeight()
                );
            } else {
                return this.gaugeHeight();
            }
        }

        gaugeWidth() {
            return (
                hpBarWidth(this._battler && this._battler.enemy()) || Torigoya.EnemyHpBar.parameter.customizeGaugeWidth
            );
        }

        gaugeHeight() {
            return (
                hpBarHeight(this._battler && this._battler.enemy()) ||
                Torigoya.EnemyHpBar.parameter.customizeGaugeHeight
            );
        }

        gaugeX() {
            if (!Torigoya.EnemyHpBar.parameter.customizeDrawLabel) return 0;
            return Torigoya.EnemyHpBar.parameter.customizeLabelWidth;
        }

        labelFontSize() {
            return Torigoya.EnemyHpBar.parameter.customizeLabelFontSize;
        }

        valueFontSize() {
            return Torigoya.EnemyHpBar.parameter.customizeValueFontSize;
        }

        updateTargetValue(value, maxValue) {
            const oldDuration = this._duration;

            super.updateTargetValue(value, maxValue);

            if (oldDuration !== this._duration && BattleManager._phase !== '') {
                this._durationWait = this.durationWait();
            }
        }

        updateGaugeAnimation() {
            super.updateGaugeAnimation();
            if (this._durationWait > 0 && this._duration <= 0) {
                --this._durationWait;
            }
        }

        drawLabel() {
            if (!Torigoya.EnemyHpBar.parameter.customizeDrawLabel) return;
            super.drawLabel();
        }

        drawValue() {
            if (!Torigoya.EnemyHpBar.parameter.customizeDrawLabel) return;
            if (isShowHpValueOfBattler(this._battler)) {
                super.drawValue();
            } else {
                this.drawMaskValue();
            }
        }

        drawMaskValue() {
            const width = this.bitmapWidth();
            const height = this.bitmapHeight();
            this.setupValueFont();
            this.bitmap.drawText(Torigoya.EnemyHpBar.parameter.customizeMaskHpValue, 0, 0, width, height, 'right');
        }

        durationWait() {
            return this._statusType === 'time' ? 0 : 60;
        }

        shouldShow() {
            if (!this._battler) return false;
            if (this._battler.isDead()) return false;
            if (isHiddenHpBar(this._battler.enemy())) return false;

            switch (Torigoya.EnemyHpBar.parameter.customizeCondition) {
                case 'always': {
                    return true;
                }
                case 'selectOrDamage': {
                    if (BattleManager._phase === 'start') return false;

                    if (this._battler && this._battler.isSelected()) return true;
                    if (BattleManager._phase === 'input') return false;

                    if (this._duration > 0) return true;
                    if (this._durationWait > 0) return true;

                    break;
                }
            }

            return false;
        }
    }

    Torigoya.EnemyHpBar.Sprite_EnemyHpGauge = Sprite_EnemyHpGauge;

    (() => {
        const upstream_Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
        Sprite_Enemy.prototype.initMembers = function () {
            upstream_Sprite_Enemy_initMembers.apply(this);
            this.torigoyaEnemyHpBar_createGaugeSprite();
        };

        Sprite_Enemy.prototype.torigoyaEnemyHpBar_createGaugeSprite = function () {
            this._torigoyaEnemyHpBar_gaugeSprite = new Torigoya.EnemyHpBar.Sprite_EnemyHpGauge();
            this._torigoyaEnemyHpBar_gaugeSprite.anchor.x = 0.5;
            this._torigoyaEnemyHpBar_gaugeSprite.opacity = 0;
            this.addChild(this._torigoyaEnemyHpBar_gaugeSprite);
        };

        const upstream_Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
        Sprite_Enemy.prototype.setBattler = function (battler) {
            upstream_Sprite_Enemy_setBattler.apply(this, arguments);
            this._torigoyaEnemyHpBar_gaugeSprite.setup(battler, 'hp');
        };

        const upstream_Sprite_Enemy_update = Sprite_Enemy.prototype.update;
        Sprite_Enemy.prototype.update = function () {
            upstream_Sprite_Enemy_update.apply(this);
            if (this._enemy) {
                this.torigoyaEnemyHpBar_updateGaugeSprite();
            }
        };

        Sprite_Enemy.prototype.torigoyaEnemyHpBar_updateGaugeSprite = function () {
            this._torigoyaEnemyHpBar_gaugeSprite.x = this.torigoyaEnemyHpBar_posX();
            this._torigoyaEnemyHpBar_gaugeSprite.y = this.torigoyaEnemyHpBar_posY();

            this._torigoyaEnemyHpBar_gaugeSprite.opacity += this._torigoyaEnemyHpBar_gaugeSprite.shouldShow()
                ? 48
                : -48;
        };

        Sprite_Enemy.prototype.torigoyaEnemyHpBar_posX = function () {
            let x = Torigoya.EnemyHpBar.parameter.basePosX;
            x += hpBarX(this._battler && this._battler.enemy());
            return x;
        };

        Sprite_Enemy.prototype.torigoyaEnemyHpBar_posY = function () {
            let y = Torigoya.EnemyHpBar.parameter.basePosY;
            if (this.bitmap && this.bitmap.isReady()) {
                switch (Torigoya.EnemyHpBar.parameter.basePosition) {
                    case 'top':
                        y -= this.bitmap.height + this._torigoyaEnemyHpBar_gaugeSprite.bitmapHeight();
                        break;
                }
            }
            y += hpBarY(this._battler && this._battler.enemy());

            return y;
        };
    })();
})();
