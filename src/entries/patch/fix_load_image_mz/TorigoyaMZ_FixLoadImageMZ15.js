(() => {
  Bitmap.prototype._startLoading = function () {
    this._image = new Image();
    this._image.onload = this._onLoad.bind(this);
    this._image.onerror = this._onError.bind(this);
    this._destroyCanvas();
    this._loadingState = 'loading';
    if (Utils.hasEncryptedImages()) {
      this._startDecrypting();
    } else {
      this._image.src = this._url;

      // ↓ v.1.5で追加されたこのあたりが悪い感じ！
      // if (this._image.width > 0) {
      //   this._image.onload = null;
      //   this._onLoad();
      // }
    }
  };
})();
