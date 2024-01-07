import { getAtsumaru } from '@rutan/torigoya-plugin-common';

/**
 * ニコニ広告APIのクライアント
 */
export class NiconikoApiClient {
  /**
   * 初期化
   * @param {{debug: boolean, expiration: number}} options
   */
  constructor(options = {}) {
    this._debugMode = options.debug;
    this._lastStartedTime = Math.floor(Date.now() / 1000) - (options.expiration || 0);
  }

  /**
   * 広告履歴を取得
   * @returns {Promise<[{adPoint: *, contribution: *, endedAt, startedAt: number, nicoadId: number, advertiserName: *}, {adPoint: *, contribution: *, endedAt, startedAt: number, nicoadId: number, advertiserName: *}, {adPoint: *, contribution: *, endedAt, startedAt: number, nicoadId: number, advertiserName: *}, {adPoint: *, contribution: *, endedAt, startedAt: number, nicoadId: number, advertiserName: *}]>}
   */
  fetchNewHistories() {
    if (this._debugMode) {
      return this._fetchDummyHistories();
    } else {
      return this._fetchServerHistories();
    }
  }

  _fetchDummyHistories() {
    const startedAt = Math.floor(Date.now() / 1000);
    const generateDummy = (advertiserName, adPoint) => ({
      nicoadId: 1,
      advertiserName,
      adPoint,
      contribution: adPoint,
      startedAt,
      endedAt: startedAt + 86400,
    });

    return Promise.resolve([
      generateDummy('ハロルド', 1000),
      generateDummy('テレーゼ', 500),
      generateDummy('マーシャ', 250),
      generateDummy('ルキウス', 100),
    ]);
  }

  _fetchServerHistories() {
    const client = getAtsumaru();
    if (!client || !client.nicoad) return Promise.resolve([]);

    return client.nicoad.getHistories().then((resp) => {
      const newItems = Array.from(
        resp.histories
          .filter((item) => item.startedAt > this._lastStartedTime)
          .reduce((result, item) => {
            if (result.has(item.advertiserName)) {
              const prevItem = result.get(item.advertiserName);
              prevItem.adPoint += item.adPoint;
            } else {
              result.set(item.advertiserName, item);
            }

            return result;
          }, new Map())
          .values(),
      );

      if (newItems[0]) this._lastStartedTime = newItems[0].startedAt;

      return newItems;
    });
  }
}
