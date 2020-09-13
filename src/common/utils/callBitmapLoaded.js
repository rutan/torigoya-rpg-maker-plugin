export function callBitmapLoaded(bitmap, callback) {
  if (bitmap.isReady()) {
    callback();
  } else {
    bitmap.addLoadListener(callback);
  }
}
