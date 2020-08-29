import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_EnemyHpBar_parameter';

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
    return hpBarWidth(this._battler && this._battler.enemy()) || Torigoya.EnemyHpBar.parameter.customizeGaugeWidth;
  }

  gaugeHeight() {
    return hpBarHeight(this._battler && this._battler.enemy()) || Torigoya.EnemyHpBar.parameter.customizeGaugeHeight;
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
    super.drawValue();
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

    this._torigoyaEnemyHpBar_gaugeSprite.opacity += this._torigoyaEnemyHpBar_gaugeSprite.shouldShow() ? 48 : -48;
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
        case 'bottom':
          // nothing to do
          break;
      }
    }
    y += hpBarY(this._battler && this._battler.enemy());

    return y;
  };
})();
