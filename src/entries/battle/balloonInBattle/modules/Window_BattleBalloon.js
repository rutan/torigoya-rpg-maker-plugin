import { Torigoya } from '../../../../common/Torigoya';

export class Window_BattleBalloon extends Window_Base {
  constructor() {
    super(new Rectangle(0, 0, 32, 32));
    this.padding = Torigoya.BalloonInBattle.parameter.balloonPadding;
    this._battlerSprite = null;
    this._message = '';
    this._battlerPosition = new Point();
    this._lifeTimer = 0;
    this.downArrowVisible = this._useTail();
    this.openness = 0;
  }

  loadWindowskin() {
    this.windowskin = ImageManager.loadSystem(Torigoya.BalloonInBattle.parameter.balloonImage);
  }

  resetFontSettings() {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = Torigoya.BalloonInBattle.parameter.balloonFontSize;
    this.resetTextColor();
  }

  lineHeight() {
    return Math.floor(Torigoya.BalloonInBattle.parameter.balloonFontSize * 1.5);
  }

  setBattlerSprite(battlerSprite) {
    this._battlerSprite = battlerSprite;
  }

  showMessage(params) {
    if (this._message === params.message) return;
    this._message = params.message;
    if (params.options.talkItem && params.options.talkItem.sound) {
      const sound = params.options.talkItem.sound;
      if (sound.name && sound.volume > 0) {
        AudioManager.playSe(sound);
      }
    }
    this.refresh();
    this.open();
  }

  refresh() {
    this.contents.clear();
    this.resetFontSettings();

    const { width, height } = this.textSizeEx(this._message);
    const windowWidth = Math.min(width + this.padding * 2, Graphics.width);
    const windowHeight = Math.min(height + this.padding * 2, Graphics.height);
    this.move(0, 0, windowWidth, windowHeight);

    this.drawTextEx(this._message, 0, 0, width);
  }

  _refreshAllParts() {
    if (this.contents && (this.contents.width < this.contentsWidth() || this.contents.height < this.contentsHeight())) {
      this.contents.resize(this.contentsWidth(), this.contentsHeight());
    }

    super._refreshAllParts();
  }

  _refreshArrows() {
    super._refreshArrows();
    this._downArrowSprite.y = this._height + this._tailY();
  }

  _useTail() {
    return !!Torigoya.BalloonInBattle.parameter.balloonTail;
  }

  _tailY() {
    if (!this._useTail()) return 0;
    return Torigoya.BalloonInBattle.parameter.balloonTailY || 0;
  }

  close() {
    this._message = '';
    this._lifeTimer = 0;
    super.close();
  }

  update() {
    this._updateMessage();
    this._updateTrackingBattlerSprite();
    super.update();
  }

  _updateMessage() {
    if (!this._battlerSprite) return;

    if (this._lifeTimer > 0) {
      --this._lifeTimer;
      if (this._lifeTimer <= 0) {
        this.close();
      }
    }

    const battler = this._battlerSprite._actor || this._battlerSprite._enemy;
    if (!battler) return;

    const params = battler.torigoyaBalloonInBattle_getParam();
    if (params.type) {
      if (params.message) {
        this._lifeTimer =
          params.options.lifeTime !== undefined
            ? params.options.lifeTime
            : Torigoya.BalloonInBattle.parameter.advancedLifeTime;
        this.showMessage(params);
      } else {
        this.close();
      }

      // メッセージ予約を消す
      battler.torigoyaBalloonInBattle_clearMessage();
    }
  }

  _updateTrackingBattlerSprite() {
    if (!this._battlerSprite) return;

    this._battlerSprite.getGlobalPosition(this._battlerPosition);
    const battlerX = this._battlerPosition.x;
    const battlerY = this._battlerPosition.y + this._battlerSprite.torigoyaBalloonInBattle_balloonY();

    this.x = battlerX - this.width / 2;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > Graphics.width) this.x = Graphics.width - this.width;

    this.y = battlerY - this.height - this._tailY();
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > Graphics.height) this.y = Graphics.height - this.height - this._tailY();

    this._downArrowSprite.x = battlerX - this.x;
  }
}
