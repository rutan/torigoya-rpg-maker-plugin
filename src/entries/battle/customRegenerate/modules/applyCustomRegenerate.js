function customEval(a, code) {
  try {
    return parseInt(eval(code), 10);
  } catch (e) {
    console.error(e);
    return 0;
  }
}

export function applyCustomRegenerateHp(noteTag) {
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

export function applyCustomRegenerateMp(noteTag) {
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

export function applyCustomRegenerateTp(noteTag) {
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
