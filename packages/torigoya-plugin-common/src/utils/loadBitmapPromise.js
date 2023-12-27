export function loadBitmapPromise(bitmap) {
  return new Promise((resolve) => {
    if (bitmap.isReady()) {
      resolve();
    } else {
      bitmap.addLoadListener(resolve);
    }
  });
}

export function loadBitmapListPromise(bitmaps) {
  const ps = bitmaps.map((bitmap) => loadBitmapPromise(bitmap));
  return Promise.all(ps).then(() => bitmaps);
}
