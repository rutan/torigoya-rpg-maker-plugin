WebAudio._onShow = function () {
  if (this._shouldMuteOnHide()) {
    this._fadeIn(1); // 0.5 -> 1
  }
};
