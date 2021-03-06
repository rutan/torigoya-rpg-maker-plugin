import { Sprite_CutInBase } from './Sprite_CutInBase';
import { Torigoya } from '../../../../common/Torigoya';
import { callBitmapLoaded } from '../../../../common/utils/callBitmapLoaded';
import { easingBounce } from './easingBounce';

export class Sprite_CutInWoss extends Sprite_CutInBase {
  getMainSmallHeight() {
    if (!this._mainSmallHeightCache) {
      this._mainSmallHeightCache = this.getMainWidth() / 4;
    }
    return this._mainSmallHeightCache;
  }

  getMainLargeHeight() {
    if (!this._mainLargeHeightCache) {
      this._mainLargeHeightCache = this.getMainWidth() / 2;
    }
    return this._mainLargeHeightCache;
  }

  getOpenAndCloseTime() {
    return 25;
  }

  getStopTime() {
    return 10;
  }

  onCreate() {
    this._createMask();
    this._createGlobalBackPlaneSprite();
    this._createGlobalBackEffectSprite();
    this._createMainBackSprite();
    this._createCharacterSprite();
    this._createBorderSprites();
  }

  _createMask() {
    const w = this.getMainWidth();
    const h1 = this.getMainSmallHeight();
    const h2 = this.getMainLargeHeight();

    this._maskShape = new PIXI.Graphics();
    this._maskShape.clear();
    this._maskShape.beginFill(0xffffff);
    this._maskShape.moveTo(0, (h2 - h1) / 2);
    this._maskShape.lineTo(w, 0);
    this._maskShape.lineTo(w, h2);
    this._maskShape.lineTo(0, h2 - (h2 - h1) / 2);
    this._maskShape.endFill();
    this._maskShape.pivot = new PIXI.Point(w / 2, h2 / 2);
    this._maskShape.scale.y = 0;

    this._maskShape.rotation = this.getMainRotation();

    this.addChild(this._maskShape);
  }

  _createGlobalBackPlaneSprite() {
    const size = this.getMainWidth();
    const colorBitmap = new Bitmap(32, 32);
    colorBitmap.fillAll('#000000');
    this._globalBackPlaneSprite = new Sprite(colorBitmap);
    this._globalBackPlaneSprite.scale.x = this._globalBackPlaneSprite.scale.y = size / colorBitmap.width;
    this._globalBackPlaneSprite.anchor.x = this._globalBackPlaneSprite.anchor.y = 0.5;
    this._globalBackPlaneSprite.opacity = 0;
    this.addChild(this._globalBackPlaneSprite);
  }

  _createGlobalBackEffectSprite() {
    const size = this.getMainWidth();
    const bitmap = ImageManager.loadPicture(this.getCutInBackImageName1());
    const shapeHeight = (this.getMainLargeHeight() - this.getMainSmallHeight()) / 2;
    const r = Math.atan2(shapeHeight, this.getMainWidth());
    const colorTone = this.getBackTone();

    this._globalBackEffectSprites = new Array(2).fill(0).map((_, i) => {
      const mask = new PIXI.Graphics();
      mask.beginFill(0xffffff);
      mask.moveTo(0, 0);
      mask.lineTo(size, 0);
      mask.lineTo(size, size / 2);
      mask.lineTo(0, size / 2);
      mask.lineTo(0, 0);
      mask.endFill();
      mask.pivot = new PIXI.Point(size / 2, i === 0 ? size / 2 : 0);
      mask.rotation = this.getMainRotation();
      this.addChild(mask);

      const wrapperSprite = new Sprite();
      wrapperSprite.opacity = 0;
      wrapperSprite.mask = mask;
      wrapperSprite.x = Math.cos(r) * shapeHeight * (i === 0 ? -1 : 1);
      wrapperSprite.y = shapeHeight * (i === 0 ? -1 : 1);
      wrapperSprite.rotation = this.getMainRotation() + (i === 0 ? -1 : 1) * r;
      wrapperSprite.setColorTone(colorTone);
      wrapperSprite.blendMode = PIXI.BLEND_MODES.ADD;
      this.addChild(wrapperSprite);

      const sprite = new TilingSprite(bitmap);
      sprite.move(-size / 2, -size / 2, size, size);
      wrapperSprite.addChild(sprite);

      return sprite;
    });
  }

  _createMainBackSprite() {
    const width = this.getMainWidth();
    const height = this.getMainLargeHeight();

    const color1 = this.getBackColor1();
    const color2 = this.getBackColor2();

    const colorBitmap = new Bitmap(64, 64);
    colorBitmap.gradientFillRect(0, 0, colorBitmap.width, colorBitmap.height / 2, color1, color2, true);
    colorBitmap.gradientFillRect(
      0,
      colorBitmap.height / 2,
      colorBitmap.width,
      colorBitmap.height / 2,
      color2,
      color1,
      true
    );

    this._mainBackSprite = new Sprite(colorBitmap);
    this._mainBackSprite.anchor.x = this._mainBackSprite.anchor.y = 0.5;
    this._mainBackSprite.scale.x = width / colorBitmap.width;
    this._mainBackSprite.scale.y = height / colorBitmap.height;
    this._mainBackSprite.rotation = this.getMainRotation();
    this._mainBackSprite.mask = this._maskShape;
    this.addChild(this._mainBackSprite);

    const wrapperSprite = new Sprite();
    wrapperSprite.rotation = this.getMainRotation();
    wrapperSprite.mask = this._maskShape;
    this.addChild(wrapperSprite);

    const effectBitmap = ImageManager.loadPicture(this.getCutInBackImageName2());
    this._mainBackEffectSprite = new TilingSprite(effectBitmap);
    this._mainBackEffectSprite.blendMode = PIXI.BLEND_MODES.ADD;
    this._mainBackEffectSprite.opacity = 128;
    this._mainBackEffectSprite.move(-width / 2, -height / 2, width, height);
    wrapperSprite.addChild(this._mainBackEffectSprite);
  }

  _createCharacterSprite() {
    const l = this.getMainWidth() / 2;
    const x = -Math.cos(this.getMainRotation()) * l;
    const y = -Math.sin(this.getMainRotation()) * l;

    this._characterSprite = new Sprite();
    this._characterSprite.addChild(this._createCharacterInnerSprite());
    this._characterSprite.x = x;
    this._characterSprite.y = y;
    this._characterSprite.scale.x = this._characterSprite.scale.y = 2;
    this._characterSprite.mask = this._maskShape;
    this.addChild(this._characterSprite);

    const blurInner = this._createCharacterInnerSprite();
    blurInner.blendMode = PIXI.BLEND_MODES.ADD;
    this._blurCharacterSprite = new Sprite();
    this._blurCharacterSprite.addChild(blurInner);
    this._blurCharacterSprite.opacity = 0;
    this._blurCharacterSprite.scale.x = this._characterSprite.scale.y = 2;
    this._blurCharacterSprite.mask = this._maskShape;
    this.addChild(this._blurCharacterSprite);
  }

  _createCharacterInnerSprite() {
    const characterBitmap = ImageManager.loadPicture(this.params.picture);
    const sprite = new Sprite(characterBitmap);
    sprite.anchor.x = sprite.anchor.y = 0.5;

    sprite.x = this.params.pictureX;
    sprite.y = this.params.pictureY;
    sprite.scale.x = sprite.scale.y = this.params.pictureScale;

    return sprite;
  }

  _createBorderSprites() {
    const borderBitmap = ImageManager.loadPicture(this.getCutInBorderImageName());
    const colorTone = this.getBorderTone();

    this._borderSprites = new Array(2).fill(0).map((_, i) => {
      const wrapperSprite = new Sprite();
      wrapperSprite.rotation = this.getMainRotation();
      wrapperSprite.scale.y = 0;
      wrapperSprite.setColorTone(colorTone);
      wrapperSprite.blendMode = this.getCutInBorderBlendMode();
      this.addChild(wrapperSprite);

      const sprite = new TilingSprite(borderBitmap);
      callBitmapLoaded(borderBitmap, () => {
        const w = this.getMainWidth();
        const h = borderBitmap.height;
        sprite.move(-w / 2, -h / 2, w, h);
      });
      wrapperSprite.addChild(sprite);
      return sprite;
    });
  }

  onStart() {
    this.playSe();

    this._onStartShape();
    this._onStartGlobalBackPlane();
    this._onStartGlobalBackEffect();
    this._onStartBorders();
    this._onStartCharacter();
  }

  _onStartShape() {
    Torigoya.FrameTween.create(this._maskShape.scale)
      .to(
        {
          y: 1,
        },
        this.getOpenAndCloseTime(),
        easingBounce
      )
      .wait(this.getStopTime())
      .to(
        {
          y: 0,
        },
        this.getOpenAndCloseTime(),
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .call(() => this.finish())
      .start();
  }

  _onStartGlobalBackPlane() {
    Torigoya.FrameTween.create(this._globalBackPlaneSprite)
      .to(
        {
          opacity: 128,
        },
        this.getOpenAndCloseTime(),
        easingBounce
      )
      .wait(this.getStopTime())
      .to(
        {
          opacity: 0,
        },
        this.getOpenAndCloseTime(),
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .start();
  }

  _onStartGlobalBackEffect() {
    this._globalBackEffectSprites.forEach((sprite) => {
      const wrapper = sprite.parent;
      Torigoya.FrameTween.create(wrapper)
        .to(
          {
            opacity: 255,
          },
          this.getOpenAndCloseTime(),
          easingBounce
        )
        .wait(this.getStopTime())
        .to(
          {
            opacity: 0,
          },
          this.getOpenAndCloseTime(),
          Torigoya.FrameTween.Easing.easeOutCubic
        )
        .start();
    });
  }

  _onStartBorders() {
    this._borderSprites.forEach((sprite) => {
      const wrapper = sprite.parent;
      Torigoya.FrameTween.create(wrapper.scale)
        .to(
          {
            y: 1,
          },
          this.getOpenAndCloseTime(),
          easingBounce
        )
        .wait(this.getStopTime())
        .to(
          {
            y: 0,
          },
          this.getOpenAndCloseTime(),
          Torigoya.FrameTween.Easing.easeOutCubic
        )
        .start();
    });
  }

  _onStartCharacter() {
    Torigoya.FrameTween.create(this._characterSprite)
      .to(
        {
          x: 0,
          y: 0,
          opacity: 255,
        },
        this.getOpenAndCloseTime(),
        easingBounce
      )
      .wait(this.getStopTime())
      .to(
        {
          opacity: 0,
        },
        this.getOpenAndCloseTime(),
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .start();

    Torigoya.FrameTween.create(this._characterSprite.scale)
      .to(
        {
          x: 1,
          y: 1,
        },
        this.getOpenAndCloseTime(),
        easingBounce
      )
      .wait(this.getStopTime())
      .to(
        {
          x: 3,
          y: 3,
        },
        this.getOpenAndCloseTime(),
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .start();

    const blurAnimationTime = this.getOpenAndCloseTime() / 2;

    Torigoya.FrameTween.create(this._blurCharacterSprite)
      .wait(blurAnimationTime)
      .to(
        {
          opacity: 255,
        },
        blurAnimationTime,
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .to(
        {
          opacity: 0,
        },
        blurAnimationTime,
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .start();

    Torigoya.FrameTween.create(this._blurCharacterSprite.scale)
      .wait(blurAnimationTime)
      .to(
        {
          x: 1,
          y: 1,
        },
        blurAnimationTime,
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .to(
        {
          x: 3,
          y: 3,
        },
        blurAnimationTime,
        Torigoya.FrameTween.Easing.easeOutCubic
      )
      .start();
  }

  onUpdate() {
    this._mainBackEffectSprite.origin.x -= 30;
    this._globalBackEffectSprites.forEach((sprite, i) => {
      sprite.origin.x += i === 0 ? -45 : 45;
    });
    this._onUpdateBorders();
  }

  _onUpdateBorders() {
    const shapeHeight = ((this.getMainLargeHeight() - this.getMainSmallHeight()) / 2) * this._maskShape.scale.y;
    const length =
      ((this.getMainSmallHeight() + (this.getMainLargeHeight() - this.getMainSmallHeight()) / 2) / 2) *
      this._maskShape.scale.y;
    const r = Math.atan2(shapeHeight, this.getMainWidth());

    this._borderSprites.forEach((sprite, i) => {
      const wrapperSprite = sprite.parent;
      const r2 = this.getMainRotation() + (i === 0 ? -1 : 1) * r;
      wrapperSprite.rotation = r2 + (i === 1 ? Math.PI : 0);
      const r3 = r2 + Math.PI / 2;
      wrapperSprite.x = Math.cos(r3) * length * (i === 0 ? -1 : 1);
      wrapperSprite.y = Math.sin(r3) * length * (i === 0 ? -1 : 1);

      sprite.origin.x += 30;
    });
  }

  onDestroy() {
    if (this._globalBackPlaneSprite.destroy) {
      this._globalBackPlaneSprite.destroy();
    } else {
      this._globalBackPlaneSprite.bitmap.resize(1, 1);
    }

    if (this._mainBackSprite.bitmap.destroy) {
      this._mainBackSprite.bitmap.destroy();
    } else {
      this._mainBackSprite.bitmap.resize(1, 1);
    }
    this._mainBackSprite.bitmap = null;
  }
}
