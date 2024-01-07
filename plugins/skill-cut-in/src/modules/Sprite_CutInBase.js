import { Torigoya } from '@rutan/torigoya-plugin-common';

export class Sprite_CutInBase extends Sprite {
  constructor(params) {
    super();
    this._params = params;
    this._callback = null;
    this._isPlaying = false;
    this._isStarting = false;
    this.anchor.x = this.anchor.y = 0.5;
    this.visible = false;
    this.onCreate();
  }

  get params() {
    return this._params;
  }

  /**
   * metaから指定keyを読み取る
   * @param {String | String[]} keys
   * @param {any} defaultValue
   * @returns {any}
   */
  getMeta(keys, defaultValue = undefined) {
    if (Array.isArray(keys)) {
      for (const key of keys) {
        if (this.params.meta[key] !== undefined) return this.params.meta[key];
      }
    } else {
      if (this.params.meta[keys] !== undefined) return this.params.meta[keys];
    }
    return defaultValue;
  }

  /**
   * 全体の表示角度を取得
   * @returns {number}
   */
  getMainRotation() {
    if (!this._mainRotationCache) {
      const rotation = this.getMeta(['rotate', '角度'], undefined);
      if (rotation === undefined) {
        if (this.params.isEnemy) {
          this._mainRotationCache = Math.atan2(-Graphics.height, -Graphics.width);
        } else {
          this._mainRotationCache = Math.atan2(-Graphics.height, Graphics.width);
        }
      } else {
        this._mainRotationCache = (parseFloat(rotation) * Math.PI) / 180;
      }
    }
    return this._mainRotationCache;
  }

  /**
   * カットイン幅を取得
   * ※カットイン幅は画面の対角線の長さになる
   * @returns {number}
   */
  getMainWidth() {
    if (!this._mainWidthCache) {
      this._mainWidthCache = Math.ceil(Math.sqrt(Math.pow(Graphics.width, 2) + Math.pow(Graphics.height, 2)));
    }
    return this._mainWidthCache;
  }

  /**
   * 破棄
   */
  destroy() {
    this.onDestroy();
    if (Sprite.prototype.destroy) {
      Sprite.prototype.destroy.apply(this);
    }
  }

  /**
   * 再生開始
   * @returns {Promise}
   */
  play() {
    if (this._isPlaying) Promise.reject('isPlaying');

    return new Promise((resolve) => {
      this._callback = resolve;
      this._isPlaying = true;
    });
  }

  /**
   * 再生終了
   * このメソッドを外部から呼び出すことはない
   */
  finish() {
    if (!this._isPlaying) return;
    if (this._callback) this._callback();
    this._callback = null;
    this._isPlaying = false;
    this._isStarting = false;
  }

  /**
   * 更新
   */
  update() {
    if (this._isStarting) {
      this.onUpdate();
    } else if (this._isPlaying) {
      if (this.isReady()) {
        this._isStarting = true;
        this.visible = true;
        this.onStart();
      }
    }

    super.update();
  }

  /**
   * 画像等のリソース読み込みが完了しているか
   * @returns {boolean}
   */
  isReady() {
    return ImageManager.isReady();
  }

  /**
   * カットイン効果音の再生
   */
  playSe() {
    const sound = this.getConfigSound();
    if (sound) AudioManager.playSe(sound);
  }

  /**
   * カットイン効果音の取得
   * @returns {null|any}
   */
  getConfigSound() {
    if (this.params.sound && this.params.sound.name) {
      return this.params.sound;
    } else if (Torigoya.SkillCutIn.parameter.commonSound && Torigoya.SkillCutIn.parameter.commonSound.name) {
      return Torigoya.SkillCutIn.parameter.commonSound;
    }
    return null;
  }

  /**
   * 背景画像1のファイル名を取得
   * @returns {string}
   */
  getCutInBackImageName1() {
    if (this.params.backImage1) return this.params.backImage1;
    return Torigoya.SkillCutIn.parameter.commonBackImage1;
  }

  /**
   * 背景画像2のファイル名を取得
   * @returns {string}
   */
  getCutInBackImageName2() {
    if (this.params.backImage2) return this.params.backImage2;
    return Torigoya.SkillCutIn.parameter.commonBackImage2;
  }

  /**
   * 境界線画像のファイル名を取得
   * @returns {string}
   */
  getCutInBorderImageName() {
    if (this.params.borderImage) return this.params.borderImage;
    return Torigoya.SkillCutIn.parameter.commonBorderImage;
  }

  /**
   * 境界線画像のブレンドモードを取得
   * @returns {PIXI.BLEND_MODES}
   */
  getCutInBorderBlendMode() {
    const mode = this.params.borderBlendMode || Torigoya.SkillCutIn.parameter.commonBorderBlendMode;
    switch (mode) {
      case 'add':
        return PIXI.BLEND_MODES.ADD;
      case 'normal':
      default:
        return PIXI.BLEND_MODES.NORMAL;
    }
  }

  /**
   * 背景色1を取得
   * @returns {string}
   */
  getBackColor1() {
    if (this.params.backColor1) return this.params.backColor1;

    if (this.params.isEnemy) {
      return Torigoya.SkillCutIn.parameter.enemyBackColor1;
    } else {
      return Torigoya.SkillCutIn.parameter.actorBackColor1;
    }
  }

  /**
   * 背景色2を取得
   * @returns {string}
   */
  getBackColor2() {
    if (this.params.backColor2) return this.params.backColor2;
    if (this.params.backColor1) return this.params.backColor1;

    if (this.params.isEnemy) {
      return Torigoya.SkillCutIn.parameter.enemyBackColor2 || Torigoya.SkillCutIn.parameter.enemyBackColor1;
    } else {
      return Torigoya.SkillCutIn.parameter.actorBackColor2 || Torigoya.SkillCutIn.parameter.actorBackColor1;
    }
  }

  /**
   * 背景色のトーンを取得
   * @returns {number[]}
   */
  getBackTone() {
    if (this.params.backTone && this.params.backTone.isUse) {
      const tone = this.params.backTone;
      return [tone.red, tone.green, tone.blue, 0];
    } else if (this.params.isEnemy) {
      const tone = Torigoya.SkillCutIn.parameter.enemyBackTone;
      return [tone.red, tone.green, tone.blue, 0];
    } else {
      const tone = Torigoya.SkillCutIn.parameter.actorBackTone;
      return [tone.red, tone.green, tone.blue, 0];
    }
  }

  /**
   * 境界線のトーンを取得
   * @returns {number[]}
   */
  getBorderTone() {
    if (this.params.borderTone && this.params.borderTone.isUse) {
      const tone = this.params.borderTone;
      return [tone.red, tone.green, tone.blue, 0];
    } else if (this.params.isEnemy) {
      const tone = Torigoya.SkillCutIn.parameter.enemyBorderTone;
      return [tone.red, tone.green, tone.blue, 0];
    } else {
      const tone = Torigoya.SkillCutIn.parameter.actorBorderTone;
      return [tone.red, tone.green, tone.blue, 0];
    }
  }

  /**
   * 生成処理（継承先で上書き）
   */
  onCreate() {
    // override me
  }

  /**
   * 開始処理（継承先で上書き）
   */
  onStart() {
    // override me
  }

  /**
   * 更新処理（継承先で上書き）
   */
  onUpdate() {
    // override me
  }

  /**
   * 破棄処理（継承先で上書き）
   */
  onDestroy() {
    // override me
  }
}
