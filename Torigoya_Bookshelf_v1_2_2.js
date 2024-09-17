/*---------------------------------------------------------------------------*
 * Torigoya_Bookshelf.js v.1.2.2
 *---------------------------------------------------------------------------*
 * Build Date: 2024/09/17 23:29:58 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc テキスト本棚プラグイン (v.1.2.2)
 * @version 1.2.2
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_Bookshelf.js
 *
 * @help テキスト本棚プラグイン (v.1.2.2)
 * https://torigoya-plugin.rutan.dev
 *
 * テキストファイルから本棚シーンを作成します。
 * 使い方の詳細は解説ページをご覧ください。
 * https://torigoya-plugin.rutan.dev/system/bookshelf/
 *
 * ------------------------------------------------------------
 * ■ 基本的な使い方
 * ------------------------------------------------------------
 * (1) 本棚テキストを置くフォルダをつくる
 *
 * プロジェクトのフォルダ（img などの横）に、
 * bookshelf
 * という名前のフォルダを作成してください。
 *
 * (2) 本棚用のテキストファイルを作成する
 *
 * 後述の形式のテキストファイルを bookshelf フォルダ内に作成してください。
 * テキストはいくつでも設置できます。
 *
 * (3) プラグインコマンドで呼び出す
 *
 * 本棚を呼び出したいイベントから
 * プラグインコマンドで表示したいテキストファイルを指定します。
 *
 * ■ MZの場合
 * プラグインコマンドから「本棚の表示」を選んでください
 * パラメータ欄にテキストファイルの名前を指定します
 *
 * ■ MVの場合
 * プラグインコマンドに以下のように記述してください
 *
 * 本棚表示 xxxxx
 *
 * xxxxx の部分は読み込みたいテキストファイルの名前にしてください
 *
 * ------------------------------------------------------------
 * ■ テキストの書き方
 * ------------------------------------------------------------
 * ※見づらいので、解説ページを見ることをオススメします＞＜
 *
 * テキストファイル内で本棚のタイトルを指定できます。
 * 以下のように、シャープ1個を先頭につけ、その後ろにタイトルを記述してください。
 *
 * # ここに本棚のタイトル
 *
 * なお、タイトルが未設定の場合は、
 * 本棚画面でタイトル欄が非表示になります。
 *
 *
 * ■ 本棚の中に本を追加する
 * 以下のように、シャープ2個を先頭につけた行が本のタイトルになり、
 * その次の行からが本の中身になります。
 * 本の中身には、「文章の表示」同様に \c[2] などのコマンドが使えます。
 *
 * ## 1冊目の本のタイトル
 * ここに本文
 * ここに本文
 *
 * ## 2冊目の本のタイトル
 * ここに本文
 * 文章の表示同様に\c[2]文字の色を変えたり\c[0]できます
 *
 *
 * ■ 本のページを増やす
 * このプラグインは文章がはみ出しても
 * 自動的にページを切り替えたりはしません。
 * 手動でページ切り替えを記述する必要があります。
 * ページ切り替えをしたい場所で、
 * 以下のようにハイフンを3個以上並べてください。
 *
 * ## 本のタイトル
 * 1ページ目の本文
 *
 * ----------
 *
 * 2ページ目の本文
 *
 *
 * ■ 本文の中に画像を表示する
 * 本文の中に以下のように記述することで、
 * 文章の間に顔グラやピクチャーを表示できます。
 *
 * \bookFace 顔グラ画像の名前, 番号
 *
 * \bookPicture ピクチャーの名前
 *
 * @param base
 * @text ■ 基本設定
 * @type string
 *
 * @param bookshelfTitleFontSize
 * @text 本棚名の文字サイズ
 * @desc 本棚の名前のフォントサイズを指定します。
 * @parent base
 * @type number
 * @min 1
 * @decimals 0
 * @default 22
 *
 * @param bookshelfWidth
 * @text 本の一覧の横幅
 * @desc 本棚画面の本の一覧の横幅を指定します。
 * 0の場合、UI領域をすべて使用します。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 400
 *
 * @param bookshelfMaxHeight
 * @text 本の一覧の最大縦幅
 * @desc 本棚画面の本の一覧の最大縦幅を指定します。
 * 0の場合、UI領域をすべて使用します。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 0
 *
 * @param bookContentFontSize
 * @text 本の中身の文字サイズ
 * @desc 本の中身ウィンドウのフォントサイズを指定します。
 * @parent base
 * @type number
 * @min 1
 * @decimals 0
 * @default 24
 *
 * @param bookContentWidth
 * @text 本の中身の横幅
 * @desc 本の中身ウィンドウの横幅を指定します。
 * 0の場合、UI領域をすべて使用します。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 0
 *
 * @param bookContentHeight
 * @text 本の中身の縦幅
 * @desc 本の中身ウィンドウの縦幅を指定します。
 * 0の場合、UI領域をすべて使用します。
 * @parent base
 * @type number
 * @min 0
 * @decimals 0
 * @default 0
 *
 * @param menu
 * @text ■ メニュー設定
 * @type string
 *
 * @param menuItems
 * @text メニューに本棚を追加
 * @parent menu
 * @type struct<MenuItem>[]
 * @default []
 */

/*~struct~MenuItem:
 * @param name
 * @text 項目名
 * @desc メニューに表示される項目の名前
 * @type string
 *
 * @param fileName
 * @text 本棚のファイル名
 * @desc 読み込むテキストのファイル名を指定してください。
 * フォルダ(bookshelf)の名前は含める必要ありません。
 * @type string
 *
 * @param switchId
 * @text 有効スイッチ
 * @desc このスイッチがONのときのみ選択できるようにします。
 * なしの場合は、常に選択できます。
 * @type switch
 * @default 0
 *
 * @param visibility
 * @text 無効時に表示するか
 * @desc 有効スイッチがONじゃないときに
 * 項目をメニューに表示するか設定できます。
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄同様に使えます。
 * @type note
 */

(function () {
    'use strict';

    function getAtsumaru() {
        return (typeof window === 'object' && window.RPGAtsumaru) || null;
    }

    function pushCommentContextFactor(str) {
        const client = getAtsumaru();
        if (!client) return;
        try {
            client.comment.pushContextFactor(str);
        } catch (_) {}
    }

    // Safari 10.1 未満用の ponyfill
    // 既に新規で使う必要はないが、過去のプラグインとの互換性のために残しておく
    /**
     * 簡易的な Response の代替
     */
    class CustomFetchResponse {
        constructor(xhr) {
            this._xhr = xhr;
        }
        get status() {
            return this._xhr.status;
        }
        text() {
            return Promise.resolve(this._xhr.responseText);
        }
        json() {
            try {
                return Promise.resolve(JSON.parse(this._xhr.responseText));
            } catch (_) {
                return Promise.reject(this._xhr);
            }
        }
    }
    /**
     * 簡易的な fetch の代替
     * @param url
     * @param options
     */
    function customFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => (xhr.status < 400 ? resolve(new CustomFetchResponse(xhr)) : reject(xhr));
            xhr.onerror = () => reject(xhr);
            xhr.open(options.method || 'GET', url);
            xhr.send();
        });
    }

    /**
     * プラグインのファイル名を取得
     */
    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_Bookshelf';
    }

    function parseBooleanParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        return String(value).toLowerCase() === 'true';
    }
    function parseIntegerParam(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        const intValue = Number.parseInt(String(value), 10);
        return isNaN(intValue) ? defaultValue : intValue;
    }
    function parseStringParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        return String(value);
    }
    function parseNoteStringParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        const str = String(value);
        return str.startsWith('"') ? JSON.parse(str) : str;
    }
    function parseStructObjectParam(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        if (typeof value === 'string') return JSON.parse(value);
        return value;
    }

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function readStructMenuItem(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            name: parseStringParam(parameters['name'], ''),
            fileName: parseStringParam(parameters['fileName'], ''),
            switchId: parseIntegerParam(parameters['switchId'], 0),
            visibility: parseBooleanParam(parameters['visibility'], true),
            note: parseNoteStringParam(parameters['note'], ''),
        };
    }
    function readParameter() {
        const parameters = PluginManager.parameters(getPluginName());
        return {
            version: '1.2.2',
            base: parseStringParam(parameters['base'], ''),
            bookshelfTitleFontSize: parseIntegerParam(parameters['bookshelfTitleFontSize'], 22),
            bookshelfWidth: parseIntegerParam(parameters['bookshelfWidth'], 400),
            bookshelfMaxHeight: parseIntegerParam(parameters['bookshelfMaxHeight'], 0),
            bookContentFontSize: parseIntegerParam(parameters['bookContentFontSize'], 24),
            bookContentWidth: parseIntegerParam(parameters['bookContentWidth'], 0),
            bookContentHeight: parseIntegerParam(parameters['bookContentHeight'], 0),
            menu: parseStringParam(parameters['menu'], ''),
            menuItems: parseStructObjectParam(parameters['menuItems'], []).map(readStructMenuItem),
        };
    }

    const titleRegexp = /^#(?!#)\s*(.+)$/;
    const bookTitleRegexp = /^##(?!#)\s*(?:if\((.+)\):)?\s*(.+)$/;
    const pageBorderRegexp = /^(?:-{3,}|_{3,})$/;
    class TextParser {
        parse(text) {
            const lines = text.split(/\r?\n/);
            return {
                title: this.parseBookshelfTitle(lines),
                books: this.parseBooks(lines),
            };
        }
        parseBookshelfTitle(lines) {
            const titleLine = lines.find((line) => line.match(titleRegexp));
            if (!titleLine) return '';
            return titleLine.match(titleRegexp)[1];
        }
        parseBooks(lines) {
            const books = [];
            lines = lines.slice(0);
            while (lines.length) {
                const line = lines.shift();
                const title = line.match(bookTitleRegexp);
                if (!title) continue;
                const contentLines = [];
                while (lines[0] !== undefined && !lines[0].match(bookTitleRegexp)) {
                    contentLines.push(lines.shift());
                }
                books.push({
                    title: title[2],
                    condition: title[1],
                    pages: this.parseBookContent(contentLines),
                });
            }
            return books;
        }
        parseBookContent(lines) {
            lines = lines.slice(0);
            const pages = [];
            while (lines.length) {
                const pageLines = [];
                while (lines[0] !== undefined && !lines[0].match(pageBorderRegexp)) {
                    pageLines.push(lines.shift());
                }
                pages.push(this.parsePage(pageLines));
                lines.shift();
            }
            return pages;
        }
        parsePage(lines) {
            return lines.join('\n').trim();
        }
    }

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
            } else if (!Input.isTriggered('ok') && Input.isRepeated('ok'));
            else {
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
            this._bookContentWindow.deactivate();
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
})();
