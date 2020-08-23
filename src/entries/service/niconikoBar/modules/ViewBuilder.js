export class ViewBuilder {
  /**
   * 初期化
   * @param {{title: string, backgroundColor: string, textColor: string, scrollTime: number}} options
   */
  constructor(options = {}) {
    this._isShow = false;
    this._title = options.title;
    this._backgroundColor = options.backgroundColor;
    this._textColor = options.textColor;
    this._scrollTime = options.scrollTime || 0;
  }

  /**
   * 一番外側のHTML要素
   * @returns {HTMLDivElement}
   */
  get element() {
    return this._element;
  }

  /**
   * HTML要素の生成
   */
  createElement() {
    this._element = this._createLayerElement();
    document.body.appendChild(this._element);

    this._barElement = this._createBarElement();
    this._element.appendChild(this._barElement);
    this._titleElement = this._createTitleElement();
    this._barElement.appendChild(this._titleElement);
    this._messageElement = this._createMessageElement();
    this._barElement.appendChild(this._messageElement);
    this._messageTextElement = this._createMessageTextElement();
    this._messageElement.appendChild(this._messageTextElement);

    this.resetStyle();
    this.updateElement();
  }

  _createLayerElement() {
    const element = document.createElement('div');
    element.id = 'nicoko-layer';
    element.classList.add('nicoko-layer');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.left = '0';
    element.style.right = '0';
    element.style.bottom = '0';
    element.style.margin = 'auto';
    element.style.zIndex = '10';
    element.style.overflow = 'hidden';
    element.style.pointerEvents = 'none';
    return element;
  }

  _createBarElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-bar');
    element.style.position = 'absolute';
    element.style.left = '0';
    element.style.width = '100%';
    element.style.height = '2em';
    element.style.overflow = 'hidden';
    element.style.background = this._backgroundColor;
    element.style.color = this._textColor;
    element.style.fontFamily = 'GameFont sans-serif';
    element.style.opacity = '0';
    element.style.transition = 'all ease-in-out .5s';
    return element;
  }

  _createTitleElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-title');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.lineHeight = `${2 / 0.8}em`;
    element.style.padding = '0 10px';
    element.style.fontSize = '0.8em';
    element.style.fontWeight = 'bold';
    element.style.transition = 'left ease-in-out .5s 1s, transform ease-in-out .5s 1s';
    element.innerText = this._title;
    return element;
  }

  _createMessageElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-message');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.right = '0';
    element.style.height = '2em';
    element.style.overflow = 'hidden';
    return element;
  }

  _createMessageTextElement() {
    const element = document.createElement('div');
    element.classList.add('nicoko-message-text');
    element.style.whiteSpace = 'pre';
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.lineHeight = `${2 / 0.8}em`;
    element.style.fontSize = '0.8em';
    element.style.padding = '0 10px';
    element.addEventListener('transitionend', this._onTextTransitionEnd.bind(this));
    return element;
  }

  /**
   * アニメーション開始前の位置に戻す
   */
  resetStyle() {
    this._barElement.style.bottom = '-2em';
    this._barElement.style.opacity = '0';

    this._titleElement.style.left = '50%';
    this._titleElement.style.transform = 'translateX(-50%)';

    this._messageElement.style.width = '0';

    this._messageTextElement.style.transition = 'initial';
    this._messageTextElement.style.left = '100%';
    this._messageTextElement.style.transform = 'translateX(0%)';
  }

  /**
   * 画面サイズに表示を合わせる
   */
  updateElement() {
    this._element.width = Graphics._width;
    this._element.height = Graphics._height;
    const size = Math.min(Math.max(Math.floor(20 * Graphics._realScale), 10), 20);
    this._element.style.fontSize = `${size}px`;
    Graphics._centerElement(this._element);
  }

  /**
   * メッセージ表示の開始
   * @param message
   */
  showMessage(message) {
    if (this._isShow) return;
    this._isShow = true;

    this._barElement.style.bottom = '0';
    this._barElement.style.opacity = '1';

    this._titleElement.style.left = '0';
    this._titleElement.style.transform = 'translateX(0)';

    const rect = this._titleElement.getBoundingClientRect();
    this._messageElement.style.width = `calc(100% - ${rect.width}px)`;

    this._messageTextElement.innerText = message;
    this._messageTextElement.style.left = '0';
    this._messageTextElement.style.transform = 'translateX(-100%)';
    this._messageTextElement.style.transition = `left linear ${this._scrollTime}s 2s, transform linear ${this._scrollTime}s 2s`;
  }

  _onTextTransitionEnd() {
    this._isShow = false;
    this.resetStyle();
  }
}
