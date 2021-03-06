import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_NotifyMessage_parameter';
import { checkExistPlugin, checkPluginVersion } from '../../../common/utils/checkPlugin';

checkExistPlugin(
  Torigoya.FrameTween,
  '「通知メッセージプラグイン」より上に「[鳥小屋.txt ベースプラグイン] Tweenアニメーション」が導入されていません。'
);
checkPluginVersion(
  Torigoya.FrameTween.parameter.version,
  '2.1.0',
  '「[鳥小屋.txt ベースプラグイン] Tweenアニメーション」のバージョンが古いです。アップデートをしてください。'
);

Torigoya.NotifyMessage = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // -------------------------------------------------------------------------
  // NotifyItem

  class NotifyItem {
    constructor(params) {
      this.initialize(params);
    }

    initialize(params) {
      this.message = params.message;
      this.icon = params.icon;
      this._openness = 0;
    }

    get openness() {
      return this._openness;
    }

    set openness(value) {
      if (value < 0) value = 0;
      if (value > 255) value = 255;
      this._openness = value;
    }
  }

  Torigoya.NotifyMessage.NotifyItem = NotifyItem;

  // -------------------------------------------------------------------------
  // Window_NotifyMessage

  /**
   * 通知メッセージウィンドウ
   */
  class Window_NotifyMessage extends Window_Base {
    constructor() {
      const rect = new Rectangle(0, 0, 1, 1);
      super(rect);
      this._notifyItem = null;
      this.opacity = 0;
      this.createBackCoverSprite();
    }

    get contentsOpacity() {
      return super.contentsOpacity;
    }

    set contentsOpacity(value) {
      super.contentsOpacity = value;
      this._backCoverSprite.opacity = value;
    }

    /**
     * 背景用スプライトの生成
     */
    createBackCoverSprite() {
      this._backCoverSprite = new Sprite(new Bitmap(1, 1));
      this.addChildAt(this._backCoverSprite, 0);
    }

    /**
     * 通知メッセージの設定
     * @param {NotifyItem} notifyItem
     */
    setup(notifyItem) {
      this._notifyItem = notifyItem;
      this.refresh();
    }

    update() {
      if (this._notifyItem) this.contentsOpacity = this._notifyItem.openness;
      super.update();
    }

    /**
     * 画面の再描画
     */
    refresh() {
      if (!this._notifyItem) return;

      // サイズ計算
      const { message, icon } = this._notifyItem;
      const itemPadding = this.itemPadding();
      const { width: messageWidth, height: messageHeight } = this.textSizeEx(message);
      const totalWidth = Math.min(
        (icon ? ImageManager.iconWidth + itemPadding : 0) + messageWidth + 30,
        Graphics.width
      );
      const totalHeight = Math.max(ImageManager.iconHeight, messageHeight);

      // ウィンドウのサイズを調整
      this.width = totalWidth + this.padding * 2;
      this.height = totalHeight + this.padding * 2;
      this.createContents();
      this._refreshBackCoverSprite();

      // 描画
      const gap = messageHeight - ImageManager.iconHeight;
      if (icon) {
        const x = ImageManager.iconWidth + itemPadding;
        this.drawIcon(icon, 0, gap > 0 ? gap / 2 : 0);
        this.drawTextEx(message, x, gap < 0 ? -gap / 2 : 0, totalWidth - x);
      } else {
        this.drawTextEx(message, 0, gap < 0 ? -gap / 2 : 0, totalWidth);
      }
    }

    /**
     * 背景画像の再生成
     * @private
     */
    _refreshBackCoverSprite() {
      const bitmap = this._backCoverSprite.bitmap;
      const w = this.width;
      const h = this.height;
      const c1 = Torigoya.NotifyMessage.parameter.advancedBackgroundColor1;
      const c2 = Torigoya.NotifyMessage.parameter.advancedBackgroundColor2;
      bitmap.resize(w, h);
      bitmap.gradientFillRect(0, 0, w, h, c1, c2, false);
      this._backCoverSprite.setFrame(0, 0, w, h);
      this._backCoverSprite.opacity = this.contentsOpacity;
    }

    /**
     * Paddingの設定
     */
    updatePadding() {
      this.padding = Torigoya.NotifyMessage.parameter.basePadding;
    }

    /**
     * フォント設定
     */
    resetFontSettings() {
      super.resetFontSettings();
      this.contents.fontSize = Torigoya.NotifyMessage.parameter.baseFontSize;
    }

    /**
     * 行間
     * @returns {number}
     */
    lineHeight() {
      return this.contents.fontSize * 1.25;
    }

    /**
     * アイコンとメッセージの間の余白
     * @returns {number}
     */
    itemPadding() {
      return Torigoya.NotifyMessage.parameter.baseItemPadding;
    }
  }

  Torigoya.NotifyMessage.Window = Window_NotifyMessage;

  // -------------------------------------------------------------------------
  // NotifyManagerClass

  /**
   * 通知マネージャー
   */
  class NotifyManagerClass {
    constructor() {
      this._currentScene = null;
      this._stacks = [];
      this._pools = [];
      this._scrollAnimations = [];
      this._requestSound = null;
      this._group = new Torigoya.FrameTween.Group();
      this._handlers = [];
    }

    /**
     * 通知登録
     * @param handler
     */
    on(handler) {
      this._handlers.push(handler);
    }

    /**
     * 通知登録の解除
     * @param handler
     */
    off(handler) {
      const index = this._handlers.indexOf(handler);
      if (index === -1) return;
      this._handlers.splice(index, 1);
    }

    /**
     * すべての通知登録を解除
     */
    offAll() {
      this._handlers.length = 0;
    }

    /**
     * 現在表示中のすべての通知ウィンドウを破棄
     * ※シーン遷移時に呼び出される想定
     */
    clear() {
      this._currentScene = null;

      this._stacks.forEach((stack) => {
        if (!stack.window) return;

        if (stack.window.parent) stack.window.parent.removeChild(window);
        stack.window.parent = null;
        stack.window = null;
      });

      if (!Torigoya.NotifyMessage.parameter.advancedKeepMessage) {
        this._stacks.length = 0;
        this._group.clear();
      }

      this._scrollAnimations.forEach((a) => a.abort());
      this._scrollAnimations.length = 0;

      this._pools.forEach((pool) => pool.destroy());
      this._pools.length = 0;
    }

    /**
     * 表示先シーンの設定
     * @param scene
     */
    setScene(scene) {
      if (this._currentScene === scene) return;
      if (this._currentScene) this.clear();

      this._currentScene = scene;
      if (!this._currentScene.torigoyaNotifyMessageContainer) {
        const container = new Sprite();
        this._currentScene.torigoyaNotifyMessageContainer = container;
        this._currentScene.addChild(container);
      }

      if (Torigoya.NotifyMessage.parameter.advancedKeepMessage) {
        this._stacks.forEach((stack) => {
          stack.window = this._setupWindow(stack.notifyItem);
          stack.window.y = stack.y;
          stack.window.contentsOpacity = 255;
          this._appendToScene(stack.window);
        });
      }
    }

    /**
     * 通知メッセージごとのマージン
     * @returns {number}
     */
    itemMargin() {
      return 5;
    }

    /**
     * 更新処理
     */
    update() {
      const visible = this.isVisible();
      if (visible) this._group.update();
      if (this._currentScene && this._currentScene.torigoyaNotifyMessageContainer)
        this._currentScene.torigoyaNotifyMessageContainer.visible = visible;
    }

    /**
     * 表示中であるか？
     */
    isVisible() {
      const switchId = Torigoya.NotifyMessage.parameter.advancedVisibleSwitch;
      if (!switchId) return true;

      return $gameSwitches.value(switchId);
    }

    /**
     * 通知の発生
     * @param {NotifyItem} notifyItem
     */
    notify(notifyItem) {
      // 非表示中は新規の追加を行わない
      if (!this.isVisible()) return;

      const window = this._setupWindow(notifyItem);
      this._appendToScene(window);

      const stack = {
        notifyItem,
        window,
        y: window.y + this.itemMargin(),
      };
      this._stacks.unshift(stack);

      this.startAppearAndExitAnimation(stack);
      this.startScrollAnimation(stack.window.height);
      this.requestPlaySound();

      // 通知
      this._handlers.forEach((func) => func(notifyItem));
    }

    /**
     * 通知メッセージの登場/退場アニメーション
     * @param stack
     */
    startAppearAndExitAnimation(stack) {
      const appearTime = Torigoya.NotifyMessage.parameter.baseAppearTime;
      const viewTime = Torigoya.NotifyMessage.parameter.baseViewTime;
      const animation = Torigoya.FrameTween.create(stack.notifyItem).group(this._group);

      // 登場アニメーション
      animation.to({ openness: 255 }, appearTime, Torigoya.FrameTween.Easing.easeInOutQuad);

      // 停止→退場アニメーション
      if (viewTime > 0) {
        animation
          .wait(viewTime)
          .to({ openness: 0 }, appearTime, Torigoya.FrameTween.Easing.easeInOutQuad)
          .call(() => this._destroyStack(stack));
      }

      animation.start();
    }

    /**
     * 通知メッセージリストのスクロールアニメーション
     * @param newWindowHeight
     */
    startScrollAnimation(newWindowHeight) {
      const appearTime = Torigoya.NotifyMessage.parameter.baseAppearTime;

      // 既に動作中のアニメーションがある場合は破棄
      this._scrollAnimations.forEach((a) => a.abort());
      this._scrollAnimations.length = 0;

      let i = 0;
      while (i < this._stacks.length) {
        const stack = this._stacks[i];

        if (stack.y + stack.window.height < 0) {
          this._destroyStack(stack);
          continue;
        }

        stack.y -= newWindowHeight + this.itemMargin();
        const animation = Torigoya.FrameTween.create(stack.window)
          .group(this._group)
          .to({ y: stack.y }, appearTime, Torigoya.FrameTween.Easing.easeInOutQuad)
          .start();
        this._scrollAnimations.push(animation);

        ++i;
      }
    }

    /**
     * 通知メッセージをもとにウィンドウを初期化
     * @param notifyItem
     * @returns {Window|Window_NotifyMessage}
     * @private
     */
    _setupWindow(notifyItem) {
      const bottom = Torigoya.NotifyMessage.parameter.advancedUiPaddingBottom;

      const window = this._createOrGetFromPoolWindow();
      window.setup(notifyItem);
      window.x = 0;
      window.y = Graphics.height - bottom;
      window.contentsOpacity = 0;
      return window;
    }

    /**
     * ウィンドウをプールから取得、ない場合は生成する
     * @returns {Window_NotifyMessage|*}
     * @private
     */
    _createOrGetFromPoolWindow() {
      const window = this._pools.pop();
      if (window) return window;

      return new Window_NotifyMessage();
    }

    /**
     * 使用済みウィンドウをプールに戻す
     * @param window
     * @private
     */
    _releaseWindow(window) {
      if (window.parent) window.parent.removeChild(window);
      window.parent = null;
      this._pools.push(window);
    }

    /**
     * シーンへのaddChild
     * @param window
     * @private
     */
    _appendToScene(window) {
      if (!this._currentScene) return;
      if (!this._currentScene.torigoyaNotifyMessageContainer) return;
      this._currentScene.torigoyaNotifyMessageContainer.addChild(window);
    }

    /**
     * スタックから指定の通知を削除
     * @param stack
     * @private
     */
    _destroyStack(stack) {
      const index = this._stacks.indexOf(stack);
      if (index === -1) return;
      this._stacks.splice(index, 1);
      if (stack.window) this._releaseWindow(stack.window);
    }

    /**
     * 効果音の再生
     * @private
     */
    requestPlaySound() {
      const se = Torigoya.NotifyMessage.parameter.baseSound;
      if (!se.name) return;

      // 大量に同時にメッセージが追加された場合に爆音になるのを防止するため
      // 1フレームバッファしてから再生する
      if (this._requestSound) return;

      this._requestSound = Torigoya.FrameTween.create(this)
        .wait(1)
        .call(() => {
          AudioManager.playSe(se);
          this._requestSound = null;
        })
        .start();
    }
  }

  const NotifyManager = new NotifyManagerClass();
  Torigoya.NotifyMessage.Manager = NotifyManager;

  // -------------------------------------------------------------------------
  // Scene_Map

  const upstream_Scene_Map_createWindowLayer = Scene_Map.prototype.createWindowLayer;
  Scene_Map.prototype.createWindowLayer = function () {
    NotifyManager.setScene(this);
    upstream_Scene_Map_createWindowLayer.apply(this);
  };

  const upstream_Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    upstream_Scene_Map_update.apply(this);
    NotifyManager.update();
  };

  // -------------------------------------------------------------------------
  // SceneManager

  const upstream_SceneManager_onSceneTerminate = SceneManager.onSceneTerminate;
  SceneManager.onSceneTerminate = function () {
    NotifyManager.clear();
    upstream_SceneManager_onSceneTerminate.apply(this);
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandNotify({ message, icon }) {
    const item = new NotifyItem({ message, icon: parseInt(icon, 10) });
    NotifyManager.notify(item);
  }

  PluginManager.registerCommand(Torigoya.NotifyMessage.name, 'notify', commandNotify);
})();
