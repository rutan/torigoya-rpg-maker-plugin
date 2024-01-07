// Safari 10.1 未満用の ponyfill
// 既に新規で使う必要はないが、過去のプラグインとの互換性のために残しておく

/**
 * 簡易的な Response の代替
 */
class CustomFetchResponse {
  private readonly _xhr: XMLHttpRequest;

  constructor(xhr: XMLHttpRequest) {
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
export function customFetch(url: string, options: { method?: string } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => (xhr.status < 400 ? resolve(new CustomFetchResponse(xhr)) : reject(xhr));
    xhr.onerror = () => reject(xhr);
    xhr.open(options.method || 'GET', url);
    xhr.send();
  });
}
