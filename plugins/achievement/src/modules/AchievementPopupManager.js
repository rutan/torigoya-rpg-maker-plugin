import { Torigoya } from '@rutan/torigoya-plugin-common';

export class AchievementPopupManager {
  get options() {
    return this._options;
  }

  /**
   * 生成
   * @param {AchievementManager} manager
   * @param {any} options
   */
  constructor(manager, options = {}) {
    this._manager = manager;
    this._options = options;
    this._stacks = [];
    this._stackAnimations = [];
    this._soundAnimator = null;
  }

  /**
   * 初期化処理
   */
  init() {
    this._manager.on(this.onNotify.bind(this));
  }

  /**
   * リセット処理
   */
  reset() {
    this._stackAnimations.forEach((tween) => {
      tween.abort();
    });
    this._stacks.forEach(this.destroyPopupWindow.bind(this));

    this._stacks.length = 0;
    this._stackAnimations.length = 0;
  }

  /**
   * 通知処理
   * @param {{achievement: Achievement, unlockInfo: any}} data
   */
  onNotify(data) {
    const popupWindow = this._options.createPopupWindow(data);
    const isLeftUp = this._options.popupPosition === 'leftUp';
    const x = isLeftUp ? this.leftX() : this.rightX() - popupWindow.width;
    const y = (() => {
      let y = this.topY();
      for (let i = 0; i < this._stacks.length; ++i) {
        const target = this._stacks[i];
        if (Math.abs(target.y - y) > (target.height + popupWindow.height) / 2) continue;
        y += popupWindow.y + popupWindow.height + 10;
      }
      return y;
    })();

    if (this._options.popupAnimationType === 'tween' && (Torigoya.FrameTween || Torigoya.Tween)) {
      this._showWithTween(popupWindow, x, y);
    } else {
      this._showWithoutTween(popupWindow, x, y);
    }
  }

  /**
   * Tweenを使った表示処理
   * @param popupWindow
   * @param x
   * @param y
   * @private
   */
  _showWithTween(popupWindow, x, y) {
    const isLeftUp = this._options.popupPosition === 'leftUp';
    const originalOpacity = popupWindow.opacity;
    const originalBackOpacity = popupWindow.backOpacity;

    const Easing = (Torigoya.FrameTween || Torigoya.Tween).Easing;

    const tween = (Torigoya.FrameTween || Torigoya.Tween)
      .create(popupWindow, {
        x: x + popupWindow.width * (isLeftUp ? -1 : 1),
        y,
        opacity: 0,
        backOpacity: 0,
        contentsOpacity: 0,
      })
      .to(
        {
          x: x,
          opacity: originalOpacity,
          backOpacity: originalBackOpacity,
          contentsOpacity: 255,
        },
        30,
        Easing.easeOutCircular,
      )
      .wait(Math.floor(this._options.popupWait * 60))
      .to(
        {
          y: y - popupWindow.height,
          opacity: 0,
          backOpacity: 0,
          contentsOpacity: 0,
        },
        30,
        Easing.easeInCircular,
      )
      .call(() => {
        this._stacks = this._stacks.filter((stack) => popupWindow !== stack);
        this.destroyPopupWindow(popupWindow);
      });
    tween.start();

    this._stacks.push(popupWindow);
    this._stacks.sort((a, b) => a.y - b.y);
    this._stackAnimations.push(tween);

    if (this._soundAnimator) {
      this._soundAnimator.abort();
      this._soundAnimator = null;
    }

    this._soundAnimator = (Torigoya.FrameTween || Torigoya.Tween)
      .create({})
      .wait(1)
      .call(() => {
        this._options.playSe();
      });
    this._soundAnimator.start();
  }

  /**
   * Tweenを使わない表示処理
   * @param popupWindow
   * @param x
   * @param y
   * @private
   */
  _showWithoutTween(popupWindow, x, y) {
    popupWindow.x = x;
    popupWindow.y = y;
    popupWindow.openness = 0;
    popupWindow.open();
    setTimeout(() => {
      popupWindow.close();
      this._stacks = this._stacks.filter((stack) => popupWindow !== stack);
      setTimeout(() => {
        if (popupWindow.parent) popupWindow.parent.removeChild(popupWindow);
      }, 500);
    }, this._options.popupWait * 1000);

    this._stacks.push(popupWindow);
    this._stacks.sort((a, b) => a.y - b.y);

    this._options.playSe();
  }

  /**
   * 一番左端
   * @returns {number}
   */
  leftX() {
    return 10;
  }

  /**
   * 一番右端
   * @returns {number}
   */
  rightX() {
    return Graphics.width - 10;
  }

  /**
   * 表示Y座標:上端
   * @returns {number}
   */
  topY() {
    return this._options.topY === undefined ? 10 : this._options.topY;
  }

  /**
   * ポップアップウィンドウの廃棄処理
   * @param popupWindow
   */
  destroyPopupWindow(popupWindow) {
    if (popupWindow.parent) popupWindow.parent.removeChild(popupWindow);
    if (typeof popupWindow.destroy === 'function') popupWindow.destroy();
  }
}
