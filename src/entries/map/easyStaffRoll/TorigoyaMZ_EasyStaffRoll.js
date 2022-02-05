import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_EasyStaffRoll_parameter';

Torigoya.EasyStaffRoll = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // -------------------------------------------------------------------------
  // Utils

  function loadBitmapPromise(bitmap) {
    return new Promise((resolve) => {
      if (bitmap.isReady()) {
        resolve();
      } else {
        bitmap.addLoadListener(resolve);
      }
    });
  }

  function loadBitmapListPromise(bitmaps) {
    const ps = bitmaps.map((bitmap) => loadBitmapPromise(bitmap));
    return Promise.all(ps).then(() => bitmaps);
  }

  // -------------------------------------------------------------------------
  // スタッフロールオブジェクト

  class StaffRollManager {
    constructor() {
      this._content = null;
      this._isLoading = false;
    }

    get content() {
      return this._content;
    }

    get timerRate() {
      const state = this.getState();

      if (state.duration <= 0) return 1;
      return state.timer / state.duration;
    }

    /**
     * 現在のスタッフロール表示状況の取得
     * @returns {*}
     */
    getState() {
      return $gameScreen.torigoyaEasyStaffRoll_getStaffRollState();
    }

    /**
     * スタッフロール本文の読込中であるか？
     * @returns {boolean}
     */
    isLoading() {
      return this._isLoading;
    }

    /**
     * スタッフロール表示中であるか？
     * @returns {boolean}
     */
    isDisplay() {
      const state = this.getState();
      return state.timer < state.duration;
    }

    /**
     * スタッフロール処理が動作中であるか？
     * @returns {boolean}
     */
    isBusy() {
      return this.isLoading() || this.isDisplay();
    }

    /**
     * 表示設定の反映
     * @param duration
     */
    setup({ duration }) {
      const state = this.getState();
      state.timer = 0;
      state.duration = duration;

      this._isLoading = true;
      this.loadStaffRollContent().then((content) => {
        this._content = content;
        this._isLoading = false;
      });
    }

    /**
     * 更新
     */
    update() {
      if (this._isLoading) return;
      const state = this.getState();

      if (state.timer < state.duration) {
        ++state.timer;

        if (state.timer === state.duration) this.finish();
      }
    }

    /**
     * 表示の終了
     */
    finish() {
      const state = this.getState();
      state.timer = state.duration = 0;
      this._content = null;
    }

    /**
     * スタッフロール情報の読み込み
     * アドオンプラグイン向けにPromiseを返す非同期のメソッドとして定義する
     * @returns {Promise<Object[]>}
     */
    loadStaffRollContent() {
      return Promise.resolve(Torigoya.EasyStaffRoll.parameter.baseStaffRollContent);
    }
  }

  Torigoya.EasyStaffRoll.Manager = new StaffRollManager();

  // -------------------------------------------------------------------------
  // Game_Screen

  const upstream_Game_Screen_clear = Game_Screen.prototype.clear;
  Game_Screen.prototype.clear = function () {
    upstream_Game_Screen_clear.apply(this);
    this.torigoyaEasyStaffRoll_clearStaffRollState();
  };

  /**
   * スタッフロール表示状況の初期化
   */
  Game_Screen.prototype.torigoyaEasyStaffRoll_clearStaffRollState = function () {
    this._torigoyaEasyStaffRoll_staffRollState = {
      timer: 0,
      duration: 0,
    };
  };

  const upstream_Game_Screen_update = Game_Screen.prototype.update;
  Game_Screen.prototype.update = function () {
    upstream_Game_Screen_update.apply(this);
    this.torigoyaEasyStaffRoll_updateStaffRoll();
  };

  /**
   * スタッフロール表示状況の更新
   */
  Game_Screen.prototype.torigoyaEasyStaffRoll_updateStaffRoll = function () {
    Torigoya.EasyStaffRoll.Manager.update();
  };

  Game_Screen.prototype.torigoyaEasyStaffRoll_getStaffRollState = function () {
    if (!this._torigoyaEasyStaffRoll_staffRollState) this.torigoyaEasyStaffRoll_clearStaffRollState();
    return this._torigoyaEasyStaffRoll_staffRollState;
  };

  // -------------------------------------------------------------------------
  // Game_Interpreter

  const upstream_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === 'torigoyaEasyStaffRoll') {
      if (Torigoya.EasyStaffRoll.Manager.isBusy()) return true;
    }

    return upstream_Game_Interpreter_updateWaitMode.apply(this);
  };

  // -------------------------------------------------------------------------
  // スタッフロール

  class Sprite_StaffRoll extends Sprite {
    constructor() {
      super();
      this._totalHeight = 0;
      this._isBusy = false;
      this._dummyBitmap = new Bitmap(1, 1);
    }

    destroy() {
      this._dummyBitmap.destroy();
      this._dummyBitmap = null;
      super.destroy();
    }

    /**
     * スプライトの初期化
     */
    init() {
      this._isBusy = true;
      this.preloadPictures().then(() => {
        this.createContents();
        this._isBusy = false;
      });
    }

    /**
     * コンテンツの生成
     */
    createContents() {
      this.createBody();
      this.adjustPosition();
    }

    /**
     * スタッフロールの本体部分の生成
     */
    createBody() {
      const { content } = Torigoya.EasyStaffRoll.Manager;
      if (!content) return;

      content.forEach((section, i) => {
        if (i > 0) this._totalHeight += Torigoya.EasyStaffRoll.parameter.designSectionMargin;
        this.createSection(section);
      });
    }

    /**
     * 各セクション表示の生成
     * @param section
     */
    createSection(section) {
      if (section.title) {
        this.addChildWithUpdateTotalHeight(this.createSectionTitleSprite(section.title));
      }

      section.items.forEach((item, j) => {
        if (section.title || j > 0) this._totalHeight += Torigoya.EasyStaffRoll.parameter.designItemMargin;
        this.createItem(item);
      });
    }

    /**
     * 各スタッフ名表示の生成
     * @param icon
     * @param title
     * @param description
     */
    createItem({ icon, title, description }) {
      if (icon) {
        this.addChildWithUpdateTotalHeight(new Sprite(ImageManager.loadPicture(icon)));
      }

      if (title) {
        this.addChildWithUpdateTotalHeight(this.createItemTitleSprite(title));
      }

      if (description) {
        this.addChildWithUpdateTotalHeight(this.createItemDescriptionSprite(description));
      }
    }

    /**
     * スタッフロール内で使用するピクチャー画像のプリロード
     * @returns {Promise<Bitmap[]>}
     */
    preloadPictures() {
      const { content } = Torigoya.EasyStaffRoll.Manager;
      if (!content) return;

      const pictures = content
        .map((section) => section.items.map((item) => item.icon))
        .flat()
        .filter(Boolean)
        .map((fileName) => ImageManager.loadPicture(fileName));

      return loadBitmapListPromise(pictures);
    }

    /**
     * スプライトを表示要素として追加
     * @param sprite
     */
    addChildWithUpdateTotalHeight(sprite) {
      sprite.anchor.x = 0.5;
      sprite.y = this._totalHeight;
      this._totalHeight += sprite.height;
      this.addChild(sprite);
    }

    /**
     * テキストのスプライトを生成
     * @param text
     * @param textSetting
     * @returns {Sprite}
     */
    createTextSprite(text, textSetting) {
      const lines = text.split(/\r?\n/);

      this._dummyBitmap.fontSize = textSetting.fontSize;
      this._dummyBitmap.fontFace = textSetting.fontFace || $gameSystem.mainFontFace();

      const width = Math.max(...lines.map((line) => this._dummyBitmap.measureTextWidth(line)));
      const lineHeight = Math.ceil(textSetting.fontSize * 1.5);

      const bitmap = new Bitmap(
        Math.min(width + textSetting.outlineWidth * 2, Graphics.width),
        lineHeight * lines.length + textSetting.outlineWidth * 2
      );
      bitmap.fontSize = textSetting.fontSize;
      bitmap.textColor = textSetting.textColor;
      bitmap.fontBold = textSetting.fontBold;
      bitmap.fontItalic = textSetting.fontItalic;
      bitmap.fontFace = textSetting.fontFace || $gameSystem.mainFontFace();
      bitmap.outlineColor = textSetting.outlineColor;
      bitmap.outlineWidth = textSetting.outlineWidth;

      lines.forEach((line, i) => {
        bitmap.drawText(
          line,
          0,
          textSetting.outlineWidth + i * textSetting.fontSize * 1.5,
          bitmap.width,
          lineHeight,
          this.textAlign()
        );
      });

      return new Sprite(bitmap);
    }

    /**
     * 見出し用スプライトの生成
     * @param text
     * @returns {Sprite}
     */
    createSectionTitleSprite(text) {
      return this.createTextSprite(text, Torigoya.EasyStaffRoll.parameter.designSectionTitleText);
    }

    /**
     * スタッフ名スプライトの生成
     * @param text
     * @returns {Sprite}
     */
    createItemTitleSprite(text) {
      return this.createTextSprite(text, Torigoya.EasyStaffRoll.parameter.designItemTitleText);
    }

    /**
     * 備考欄のスプライトの生成
     * @param text
     * @returns {Sprite}
     */
    createItemDescriptionSprite(text) {
      return this.createTextSprite(text, Torigoya.EasyStaffRoll.parameter.designItemDescriptionText);
    }

    /**
     * 更新
     */
    update() {
      if (this._isBusy) {
        // nothing to do
      } else if (this._totalHeight > 0) {
        this.adjustPosition();
      } else if (Torigoya.EasyStaffRoll.Manager.content && this._totalHeight === 0) {
        this.init();
      }

      super.update();
    }

    /**
     * 表示位置の反映
     */
    adjustPosition() {
      const { timerRate } = Torigoya.EasyStaffRoll.Manager;
      this.x = Graphics.width / 2;
      this.y = Graphics.height - timerRate * (Graphics.height + this._totalHeight);
    }

    /**
     * テキストの水平方向の配置位置
     * @returns {'left' | 'center' | 'right'}
     */
    textAlign() {
      return 'center';
    }
  }

  Torigoya.EasyStaffRoll.Sprite_StaffRoll = Sprite_StaffRoll;

  // -------------------------------------------------------------------------
  // Scene_Base

  Scene_Base.prototype.torigoyaEasyStaffRoll_createStaffRollSprite = function () {
    this._torigoyaEasyStaffRoll_staffRollSprite = new Sprite_StaffRoll();
    this.addChild(this._torigoyaEasyStaffRoll_staffRollSprite);
  };

  // -------------------------------------------------------------------------
  // Scene_Map

  const upstream_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    upstream_Scene_Map_createDisplayObjects.apply(this);
    this.torigoyaEasyStaffRoll_createStaffRollSprite();
  };

  // -------------------------------------------------------------------------
  // Scene_Battle

  const upstream_Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function () {
    upstream_Scene_Battle_createDisplayObjects.apply(this);
    this.torigoyaEasyStaffRoll_createStaffRollSprite();
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandDisplayStaffRoll({ displayFrame, isWait }) {
    displayFrame = Number(displayFrame);
    isWait = isWait.toString() === 'true';

    Torigoya.EasyStaffRoll.Manager.setup({ duration: displayFrame });
    if (isWait) this.setWaitMode('torigoyaEasyStaffRoll');
  }

  function commandRemoveStaffRoll() {
    Torigoya.EasyStaffRoll.Manager.finish();
  }

  function commandPreloadStaffRoll() {
    Torigoya.EasyStaffRoll.Manager.setup({ duration: 0 });
  }

  PluginManager.registerCommand(Torigoya.EasyStaffRoll.name, 'displayStaffRoll', commandDisplayStaffRoll);
  PluginManager.registerCommand(Torigoya.EasyStaffRoll.name, 'removeStaffRoll', commandRemoveStaffRoll);
  PluginManager.registerCommand(Torigoya.EasyStaffRoll.name, 'preloadStaffRoll', commandPreloadStaffRoll);
})();
