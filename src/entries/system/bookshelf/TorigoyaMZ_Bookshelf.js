import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_Bookshelf_parameter';
import { TextParser } from './modules/TextParser';
import { customFetch } from '../../../common/utils/customFetch';
import { pushCommentContextFactor } from '../../../common/atsumaru/comments';

Torigoya.Bookshelf = {
  name: getPluginName(),
  parameter: readParameter(),
  TextParser,
};

function evalCondition(code) {
  try {
    return !!eval(code);
  } catch (e) {
    console.error(e);
    return false;
  }
}

/**
 * 本棚の名前ウィンドウ
 */
class Window_BookshelfTitle extends Window_Base {
  setTitle(title) {
    if (this._title === title) return;
    this._title = title;
    this.refresh();
  }

  refresh() {
    this.contents.clear();
    if (!this._title) return;

    this.drawText(this._title, 0, 0, this.innerWidth, 'center');
  }

  resetFontSettings() {
    super.resetFontSettings();
    this.contents.fontSize = Torigoya.Bookshelf.parameter.bookshelfTitleFontSize;
  }

  lineHeight() {
    return Torigoya.Bookshelf.parameter.bookshelfTitleFontSize;
  }
}

Torigoya.Bookshelf.Window_BookshelfTitle = Window_BookshelfTitle;

/**
 * 本棚の中の本タイトル一覧ウィンドウ
 */
class Window_BooksList extends Window_Selectable {
  setBooks(books) {
    this._books = books;
    this.makeItemList();
    this.refresh();
  }

  makeItemList() {
    if (this._books) {
      this._data = this._books.filter((book) => {
        if (!book.condition) return true;
        return evalCondition(book.condition);
      });
    } else {
      this._data = [];
    }
  }

  item() {
    return this.itemAt(this.index());
  }

  itemAt(index) {
    return this._data ? this._data[index] : null;
  }

  maxItems() {
    return this._data ? this._data.length : 0;
  }

  drawItem(index) {
    const item = this.itemAt(index);
    if (!item) return;

    const rect = this.itemLineRect(index);
    this.drawText(item.title, rect.x, rect.y, rect.width, 'left');
  }
}

Torigoya.Bookshelf.Window_BooksList = Window_BooksList;

/**
 * 本の中身を表示するウィンドウ
 */
class Window_BookContent extends Window_Selectable {
  constructor(rect) {
    super(rect);
    this._waitLoadBitmaps = [];
    this._allTextHeight = 0;
    this._lastRenderPage = null;
  }

  setBook(book) {
    this._book = book;
    this.select(0);
    this.refresh();
  }

  resetFontSettings() {
    super.resetFontSettings();
    this.contents.fontSize = Torigoya.Bookshelf.parameter.bookContentFontSize;
  }

  _updateCursor() {
    this._cursorSprite.visible = false;
  }

  itemHeight() {
    return this.innerHeight;
  }

  maxItems() {
    return this._book ? this._book.pages.length : 0;
  }

  paint() {
    this._waitLoadBitmaps.length = 0;
    super.paint();
  }

  drawItemBackground() {
    // nothing to do
  }

  drawItem(index) {
    const page = this._book.pages[index];
    if (!page) return;

    // [アツマール限定]: コメントAPIに文章を反映
    if (this._lastRenderPage !== page) {
      pushCommentContextFactor(page);
      this._lastRenderPage = page;
    }

    const rect = this.itemRectWithPadding(index);
    this.resetTextColor();
    this.drawTextEx(page, rect.x, rect.y, rect.width);
  }

  addWaitLoadBitmap(bitmap) {
    if (bitmap.isReady()) return;
    this._waitLoadBitmaps.push(bitmap);
    bitmap.addLoadListener(() => this.onLoadBitmap(bitmap));
  }

  onLoadBitmap(bitmap) {
    if (!this._waitLoadBitmaps.includes(bitmap)) return;

    this._waitLoadBitmaps = this._waitLoadBitmaps.filter((b) => b !== bitmap);
    if (this._waitLoadBitmaps.length === 0) this.paint();
  }

  processEscapeCharacter(code, textState) {
    super.processEscapeCharacter(code, textState);

    switch (code) {
      case 'BOOKFACE': {
        const [name, faceIndex, align] = this.torigoyaBookshelf_obtainArrayParam(textState);
        if (name) this.processDrawBookFace(textState, name, parseInt(faceIndex), align);
        break;
      }
      case 'BOOKPICTURE': {
        const [name, align, height] = this.torigoyaBookshelf_obtainArrayParam(textState);
        if (name) this.processDrawBookPicture(textState, name, align, height ? parseInt(height) : 0);
        break;
      }
    }
  }

  torigoyaBookshelf_obtainArrayParam(textState) {
    const regExp = /^(.+)(\n|$)/; // 行末まで処理対象とする
    const arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
      textState.index += arr[0].length;
      return arr[1].split(/\s*,\s*/).map((n) => n.trim());
    } else {
      return [];
    }
  }

  processDrawBookFace(textState, faceName, faceIndex, align = 'center') {
    const bitmap = ImageManager.loadFace(faceName);

    if (bitmap.isReady()) {
      textState.x = textState.startX;

      const faceWidth = ImageManager.faceWidth;
      const dx =
        align === 'right'
          ? textState.x + textState.width - faceWidth
          : align === 'center'
          ? textState.x + (textState.width - faceWidth) / 2
          : textState.x;
      this.drawFace(faceName, faceIndex, dx, textState.y);
    } else {
      this.addWaitLoadBitmap(bitmap);
    }

    textState.height = Math.max(textState.height, ImageManager.faceHeight);
    this.processNewLine(textState);
  }

  processDrawBookPicture(textState, name, align = 'center', height = 0) {
    const bitmap = ImageManager.loadPicture(name);

    if (bitmap.isReady()) {
      textState.x = textState.startX;

      let rate = 1;

      if (height <= 0) {
        rate = Math.min(1, (textState.width - textState.startX) / bitmap.width);
        height = bitmap.height * rate;
      } else {
        rate = height / bitmap.height;
      }

      const dw = bitmap.width * rate;
      const dh = bitmap.height * rate;
      const dx =
        align === 'right'
          ? textState.x + textState.width - dw
          : align === 'center'
          ? textState.x + (textState.width - dw) / 2
          : textState.x;
      this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, textState.y, dw, dh);
    } else {
      this.addWaitLoadBitmap(bitmap);
    }

    textState.height = Math.max(textState.height, height);
    this.processNewLine(textState);
  }

  isOkEnabled() {
    return this.maxItems() > 0;
  }

  goPreviousPage() {
    if (this.index() > 0) {
      this.playCursorSound();
      this.forceSelect(this.index() - 1);
    }
  }

  goNextPage() {
    if (this.index() < this.maxItems() - 1) {
      this.playCursorSound();
      this.forceSelect(this.index() + 1);
    }
  }

  processOk() {
    // タッチスクロールと処理が重複するためフラグを折る
    this._isRequireCheckDiff = false;

    if (this.index() < this.maxItems() - 1) {
      this.goNextPage();
    } else if (!Input.isTriggered('ok') && Input.isRepeated('ok')) {
      // 誤操作防止のため、キー押しっぱなし状態で最終ページに来た場合は何もしない
    } else {
      this.playOkSound();
      this.callHandler('cancel');
    }
  }

  cursorUp(_) {
    super.cursorUp(false);
  }

  cursorDown(_) {
    super.cursorDown(false);
  }

  onTouchScrollStart() {
    super.onTouchScrollStart();
    this._startScrollY = this._scrollY;
    this._isRequireCheckDiff = true;
  }

  onTouchScrollEnd() {
    super.onTouchScrollEnd();
    this.setScrollAccel(0, 0);

    if (!this._isRequireCheckDiff) return;

    const diff = this._startScrollY - this._scrollY;
    if (Math.abs(diff) > 64) {
      this.smoothSelect(this.index() + (diff < 0 ? 1 : -1));
    } else {
      this.smoothSelect(this.index());
    }
  }
}

Torigoya.Bookshelf.Window_BookContent = Window_BookContent;

/**
 * 本棚シーン
 */
class Scene_Bookshelf extends Scene_MenuBase {
  constructor() {
    super();
    this._fileName = '';
    this._bookshelf = null;
  }

  prepare(fileName) {
    this._fileName = fileName;
  }

  create() {
    super.create();
    this.createTitleWindow();
    this.createBooksListWindow();
    this.createBookContentWindow();
    this.updatePageButtons();
    this.loadTextFile();
  }

  needsPageButtons() {
    return true;
  }

  arePageButtonsEnabled() {
    return this._bookContentWindow && this._bookContentWindow.active;
  }

  listWindowWidth() {
    return Torigoya.Bookshelf.parameter.bookshelfWidth || Graphics.boxWidth;
  }

  contentWindowWidth() {
    return Torigoya.Bookshelf.parameter.bookContentWidth || Graphics.boxWidth;
  }

  contentWindowHeight() {
    return Torigoya.Bookshelf.parameter.bookContentHeight || this.mainAreaHeight();
  }

  createTitleWindow() {
    this._titleWindow = new Window_BookshelfTitle(this.titleWindowRect());
    this.addWindow(this._titleWindow);
  }

  titleWindowRect() {
    return new Rectangle(0, 0, this.listWindowWidth(), this.titleWindowHeight());
  }

  titleWindowHeight() {
    return Window_BookshelfTitle.prototype.fittingHeight(1);
  }

  createBooksListWindow() {
    this._booksListWindow = new Window_BooksList(this.booksListWindowRect());
    this._booksListWindow.setHandler('ok', this.onBooksOk.bind(this));
    this._booksListWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._booksListWindow);
    this._booksListWindow.select(0);
    this._booksListWindow.activate();
  }

  booksListWindowRect() {
    return new Rectangle(0, 0, this.listWindowWidth(), this.maxBooksWindowHeight());
  }

  maxBooksWindowHeight() {
    return (
      Torigoya.Bookshelf.parameter.bookshelfMaxHeight ||
      this.mainAreaHeight() - (this._bookshelf && this._bookshelf.title ? this.titleWindowHeight() : 0) - 1
    );
  }

  createBookContentWindow() {
    this._bookContentWindow = new Window_BookContent(this.bookContentWindowRect());
    this._bookContentWindow.setHandler('cancel', this.onBookContentCancel.bind(this));
    this._bookContentWindow.hide();
    this._bookContentWindow.close();
    this.addWindow(this._bookContentWindow);
  }

  bookContentWindowRect() {
    const w = this.contentWindowWidth();
    const h = this.contentWindowHeight();
    const x = (Graphics.boxWidth - w) / 2;
    const y = this.mainAreaTop() + (this.mainAreaHeight() - h) / 2;
    return new Rectangle(x, y, w, h);
  }

  helpAreaHeight() {
    return 0;
  }

  loadTextFile() {
    customFetch(this.getFileUrl())
      .then((resp) => resp.text())
      .then((text) => {
        const parser = new TextParser();
        try {
          this.onLoadSuccess(parser.parse(text));
        } catch (e) {
          console.error(e);
          this.onParseError(e);
        }
      })
      .catch((e) => {
        console.error(e);
        this.onLoadError(e);
      });
  }

  onLoadSuccess(bookshelf) {
    this._bookshelf = bookshelf;

    if (this._bookshelf.title) {
      this._titleWindow.setTitle(this._bookshelf.title);
      this._titleWindow.show();
    } else {
      this._titleWindow.hide();
    }
    this._booksListWindow.setBooks(this._bookshelf.books);

    this.adjustWindowPosition();
  }

  onLoadError(e) {
    SceneManager.catchLoadError([e, this.getFileUrl(), this.loadTextFile.bind(this)]);
    SceneManager.stop();
  }

  onParseError(e) {
    this.catchNormalError(e);
    SceneManager.stop();
  }

  adjustWindowPosition() {
    if (!this._bookshelf) return;

    const titleHeight = this._bookshelf.title ? this._titleWindow.height : 0;
    this._booksListWindow.height = Math.min(
      this.calcWindowHeight(this._booksListWindow.maxItems(), true),
      this.maxBooksWindowHeight()
    );

    const totalHeight = titleHeight + this._booksListWindow.height;
    const safeAreaHeight = (Graphics.boxHeight - this.mainAreaHeight()) * 2;

    const x = (Graphics.boxWidth - this.listWindowWidth()) / 2;
    const y =
      totalHeight > this.mainAreaHeight() - safeAreaHeight
        ? this.mainAreaTop()
        : (Graphics.boxHeight - titleHeight - this._booksListWindow.height) / 2;
    this._titleWindow.x = x;
    this._titleWindow.y = y;
    this._booksListWindow.x = x;
    this._booksListWindow.y = y + titleHeight;
  }

  getFileUrl() {
    const hasExt = this._fileName.match(/\.[^\.\/]+$/);
    return `bookshelf/${this._fileName}${hasExt ? '' : '.txt'}`;
  }

  isReady() {
    return super.isReady() && !!this._bookshelf;
  }

  onBooksOk() {
    const book = this._booksListWindow.item();
    this._booksListWindow.deactivate();
    this._bookContentWindow.setBook(book);
    this._bookContentWindow.show();
    this._bookContentWindow.open();
    this._bookContentWindow.activate();
  }

  onBookContentCancel() {
    this._bookContentWindow.close();
    this._booksListWindow.activate();
  }

  // タッチUIをコンテンツ内のページ戻しに転用する
  previousActor() {
    this._bookContentWindow.goPreviousPage();
  }

  // タッチUIをコンテンツ内のページ送りに転用する
  nextActor() {
    this._bookContentWindow.goNextPage();
  }
}

Torigoya.Bookshelf.Scene_Bookshelf = Scene_Bookshelf;

(() => {
  // -------------------------------------------------------------------------
  // Window_MenuCommand

  const upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    upstream_Window_MenuCommand_addOriginalCommands.apply(this);

    Torigoya.Bookshelf.parameter.menuItems.forEach((item, i) => {
      const enabled = item.switchId ? $gameSwitches.value(parseInt(item.switchId, 10)) : true;
      if (!enabled && !item.visibility) return;
      this.addCommand(item.name, `TorigoyaBookshelf_${i}`, enabled);
    });
  };

  // -------------------------------------------------------------------------
  // Scene_Menu

  const upstream_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    upstream_Scene_Menu_createCommandWindow.apply(this);

    Torigoya.Bookshelf.parameter.menuItems.forEach((item, i) => {
      const fileName = item.fileName.trim();
      if (!fileName) return;

      this._commandWindow.setHandler(`TorigoyaBookshelf_${i}`, () => {
        SceneManager.push(Scene_Bookshelf);
        SceneManager.prepareNextScene(fileName);
      });
    });
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  function commandOpenBookshelf({ fileName }) {
    SceneManager.push(Scene_Bookshelf);
    SceneManager.prepareNextScene(fileName.trim());
  }

  PluginManager.registerCommand(Torigoya.Bookshelf.name, 'openBookshelf', commandOpenBookshelf);
})();
