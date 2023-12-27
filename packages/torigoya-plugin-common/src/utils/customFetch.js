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

export function customFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => (xhr.status < 400 ? resolve(new CustomFetchResponse(xhr)) : reject(xhr));
    xhr.onerror = () => reject(xhr);
    xhr.open(options.method || 'GET', url);
    xhr.send();
  });
}
