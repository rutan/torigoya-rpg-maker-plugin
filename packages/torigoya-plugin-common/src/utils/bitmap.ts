type MaybeBitmap = {
  isReady: () => boolean;
  addLoadListener: (callback: () => void) => void;
};

/**
 * Bitmap のロード完了を待ってからコールバックを呼び出す
 * @param bitmap
 * @param callback
 */
export function callBitmapLoaded(bitmap: MaybeBitmap, callback: () => void) {
  if (bitmap.isReady()) {
    callback();
  } else {
    bitmap.addLoadListener(callback);
  }
}

/**
 * Bitmap のロード完了を待つ Promise を返す
 * @param bitmap
 */
export function loadBitmapPromise(bitmap: MaybeBitmap) {
  return new Promise<void>((resolve) => {
    if (bitmap.isReady()) {
      resolve();
    } else {
      bitmap.addLoadListener(resolve);
    }
  });
}

/**
 * Bitmap 配列のロード完了を待つ Promise を返す
 * @param bitmaps
 */
export function loadBitmapListPromise(bitmaps: MaybeBitmap[]) {
  const ps = bitmaps.map((bitmap) => loadBitmapPromise(bitmap));
  return Promise.all(ps).then(() => bitmaps);
}
