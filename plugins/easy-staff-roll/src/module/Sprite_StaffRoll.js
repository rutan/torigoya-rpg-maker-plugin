import { Torigoya, loadBitmapListPromise, arrayFlat } from '@rutan/torigoya-plugin-common';

export class Sprite_StaffRoll extends Sprite {
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

    const pictures = arrayFlat(content.map((section) => section.items.map((item) => item.icon)))
      .filter(Boolean)
      .map((fileName) => ImageManager.loadPicture(fileName));

    return loadBitmapListPromise(pictures);
  }

  /**
   * スプライトを表示要素として追加
   * @param sprite
   */
  addChildWithUpdateTotalHeight(sprite) {
    switch (this.textAlign()) {
      case 'left':
        sprite.anchor.x = 0;
        break;
      case 'right':
        sprite.anchor.x = 1;
        break;
      case 'center':
      default:
        sprite.anchor.x = 0.5;
    }
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
    this._dummyBitmap.fontFace = textSetting.fontFace || this.textFontFace();

    const width = Math.max(...lines.map((line) => this._dummyBitmap.measureTextWidth(line)));
    const lineHeight = Math.ceil(textSetting.fontSize * 1.5);

    const bitmap = new Bitmap(
      Math.min(width + textSetting.outlineWidth * 2, this.contentMaxWidth()),
      lineHeight * lines.length + textSetting.outlineWidth * 2,
    );
    bitmap.fontSize = textSetting.fontSize;
    bitmap.textColor = textSetting.textColor;
    bitmap.fontBold = textSetting.fontBold;
    bitmap.fontItalic = textSetting.fontItalic;
    bitmap.fontFace = textSetting.fontFace || this.textFontFace();
    bitmap.outlineColor = textSetting.outlineColor;
    bitmap.outlineWidth = textSetting.outlineWidth;

    lines.forEach((line, i) => {
      bitmap.drawText(
        line,
        0,
        textSetting.outlineWidth + i * textSetting.fontSize * 1.5,
        bitmap.width,
        lineHeight,
        this.textAlign(),
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
    switch (this.textAlign()) {
      case 'left':
        this.x = this.contentHorizontalPadding();
        break;
      case 'right':
        this.x = Graphics.width - this.contentHorizontalPadding();
        break;
      default:
        this.x = Graphics.width / 2;
    }
    this.y = Graphics.height - timerRate * (Graphics.height + this._totalHeight);
  }

  /**
   * フォント名の取得
   */
  textFontFace() {
    if ($gameSystem.mainFontFace) return $gameSystem.mainFontFace();
    return 'GameFont, sans-serif';
  }

  /**
   * テキストの水平方向の配置位置
   * @returns {'left' | 'center' | 'right'}
   */
  textAlign() {
    return Torigoya.EasyStaffRoll.parameter.designTextAlign || 'center';
  }

  /**
   * 要素の横方向の余白サイズ
   * @returns {number}
   */
  contentHorizontalPadding() {
    return Torigoya.EasyStaffRoll.parameter.designContentHorizontalPadding || 0;
  }

  /**
   * 各要素の最大幅
   * @returns {number}
   */
  contentMaxWidth() {
    return Graphics.width - this.contentHorizontalPadding() * 2;
  }
}
