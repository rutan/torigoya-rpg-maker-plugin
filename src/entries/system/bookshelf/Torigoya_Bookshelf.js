import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_Bookshelf_parameter';
import { TextParser } from './modules/TextParser';
import { customFetch } from '../../../common/utils/customFetch';
import { pushCommentContextFactor } from '../../../common/atsumaru/comments';

Torigoya.Bookshelf = {
  name: getPluginName(),
  parameter: readParameter(),
  TextParser,
  bookFileName: '',
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

    this.resetFontSettings();
    this.drawText(this._title, 0, 0, this.contents.width, 'center');
  }

  standardFontSize() {
    return Torigoya.Bookshelf.parameter.bookshelfTitleFontSize;
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

    const rect = this.itemRect(index);
    this.drawText(item.title, rect.x, rect.y, rect.width, 'left');
  }
}

Torigoya.Bookshelf.Window_BooksList = Window_BooksList;

/**
 * 本の中身を表示するウィンドウ
 */
class Window_BookContent extends Window_Selectable {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this._waitLoadBitmaps = [];
    this._allTextHeight = 0;
    this._lastRenderPage = null;
  }

  setBook(book) {
    this._book = book;
    this.select(0);
    this.refresh();
  }

  standardFontSize() {
    return Torigoya.Bookshelf.parameter.bookContentFontSize;
  }

  _updateCursor() {
    this._windowCursorSprite.visible = false;
  }

  itemHeight() {
    return this.height - this.padding * 2;
  }

  maxItems() {
    return this._book ? this._book.pages.length : 0;
  }

  refresh() {
    this._waitLoadBitmaps.length = 0;
    super.refresh();
  }

  drawItem(index) {
    const page = this._book.pages[index];
    if (!page) return;

    // [アツマール限定]: コメントAPIに文章を反映
    if (this._lastRenderPage !== page) {
      pushCommentContextFactor(page);
      this._lastRenderPage = page;
    }

    const rect = this.itemRect(index);
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
    if (this._waitLoadBitmaps.length === 0) {
      this.refresh();
    }
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
      textState.index += arr[0].length - 1;
      return arr[1].split(/\s*,\s*/).map((n) => n.trim());
    } else {
      return [];
    }
  }

  processDrawBookFace(textState, faceName, faceIndex, align = 'center') {
    const bitmap = ImageManager.loadFace(faceName);

    if (bitmap.isReady()) {
      textState.x = 0;

      const faceWidth = Window_Base._faceWidth;
      const dx =
        align === 'right'
          ? textState.x + this.contents.width - faceWidth
          : align === 'center'
            ? textState.x + (this.contents.width - faceWidth) / 2
            : textState.x;
      this.drawFace(faceName, faceIndex, dx, textState.y);
    } else {
      this.addWaitLoadBitmap(bitmap);
    }

    textState.height = Math.max(textState.height, Window_Base._faceHeight);
    this.processNewLine(textState);
  }

  processDrawBookPicture(textState, name, align = 'center', height = 0) {
    const bitmap = ImageManager.loadPicture(name);

    if (bitmap.isReady()) {
      textState.x = 0;

      let rate = 1;

      if (height <= 0) {
        rate = Math.min(1, this.contents.width / bitmap.width);
        height = bitmap.height * rate;
      } else {
        rate = height / bitmap.height;
      }

      const dw = bitmap.width * rate;
      const dh = bitmap.height * rate;
      const dx =
        align === 'right'
          ? textState.x + this.contents.width - dw
          : align === 'center'
            ? textState.x + (this.contents.width - dw) / 2
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
      SoundManager.playCursor();
      this.select(this.index() - 1);
    }
  }

  goNextPage() {
    if (this.index() < this.maxItems() - 1) {
      SoundManager.playCursor();
      this.select(this.index() + 1);
    }
  }

  processOk() {
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
    this._fileName = Torigoya.Bookshelf.bookFileName;
  }

  create() {
    super.create();
    this.createTitleWindow();
    this.createBooksListWindow();
    this.createBookContentWindow();
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
    return Torigoya.Bookshelf.parameter.bookContentHeight || Graphics.boxHeight;
  }

  createTitleWindow() {
    const { x, y, width, height } = this.titleWindowRect();
    this._titleWindow = new Window_BookshelfTitle(x, y, width, height);
    this.addWindow(this._titleWindow);
  }

  titleWindowRect() {
    return new Rectangle(0, 0, this.listWindowWidth(), this.titleWindowHeight());
  }

  titleWindowHeight() {
    return Window_BookshelfTitle.prototype.fittingHeight(1);
  }

  createBooksListWindow() {
    const { x, y, width, height } = this.booksListWindowRect();
    this._booksListWindow = new Window_BooksList(x, y, width, height);
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
      Graphics.boxHeight - (this._bookshelf && this._bookshelf.title ? this.titleWindowHeight() : 0) - 1
    );
  }

  createBookContentWindow() {
    const { x, y, width, height } = this.bookContentWindowRect();
    this._bookContentWindow = new Window_BookContent(x, y, width, height);
    this._bookContentWindow.setHandler('cancel', this.onBookContentCancel.bind(this));
    this._bookContentWindow.hide();
    this._bookContentWindow.close();
    this.addWindow(this._bookContentWindow);
  }

  bookContentWindowRect() {
    const w = this.contentWindowWidth();
    const h = this.contentWindowHeight();
    const x = (Graphics.boxWidth - w) / 2;
    const y = (Graphics.boxHeight - h) / 2;
    return new Rectangle(x, y, w, h);
  }

  helpAreaHeight() {
    return 0;
  }

  loadTextFile() {
    if (!this._loader) {
      this._loader = ResourceHandler.createLoader(this.getFileUrl(), this.loadTextFile.bind(this));
    }

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
      .catch(this._loader);
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

  onParseError(e) {
    SceneManager.catchException(e);
  }

  adjustWindowPosition() {
    if (!this._bookshelf) return;

    const titleHeight = this._bookshelf.title ? this._titleWindow.height : 0;
    this._booksListWindow.height = Math.min(
      Window_Selectable.prototype.fittingHeight(this._booksListWindow.maxItems()),
      this.maxBooksWindowHeight(),
    );

    const x = (Graphics.boxWidth - this.listWindowWidth()) / 2;
    const y = (Graphics.boxHeight - titleHeight - this._booksListWindow.height) / 2;
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
        Torigoya.Bookshelf.bookFileName = fileName;
        SceneManager.push(Scene_Bookshelf);
      });
    });
  };

  // -------------------------------------------------------------------------
  // プラグインコマンド

  const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    switch (command) {
      case 'openBookshelf':
      case '本棚表示':
        Torigoya.Bookshelf.bookFileName = `${args[0] || ''}`.trim();
        SceneManager.push(Scene_Bookshelf);
        return;
    }
    upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
  };
})();
