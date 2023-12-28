import { isThenable } from '@rutan/torigoya-plugin-common';

export class AchievementManager {
  get achievements() {
    return this._achievements;
  }

  get unlockInfo() {
    return this._unlockInfo;
  }

  get options() {
    return this._options;
  }

  /**
   * 生成
   * @param options
   */
  constructor(options = {}) {
    this._options = options;
    this._achievements = [];
    this._unlockInfo = new Map();
    this._handlers = [];
    this._isReady = false;
  }

  /**
   * 初期化処理
   */
  init() {
    if (this.options.onInit) {
      const result = this.options.onInit(this);
      if (isThenable(result)) {
        result.then(() => (this._isReady = true));
      } else {
        this._isReady = true;
      }
    } else {
      this._isReady = true;
    }
  }

  /**
   * 初期化完了
   * @returns {*}
   */
  isReady() {
    return this._isReady;
  }

  /**
   * 実績マスター情報の登録
   */
  setAchievements(achievements) {
    this._achievements = achievements.map((achievement) => {
      if (achievement.note) {
        DataManager.extractMetadata(achievement);
      } else {
        achievement.meta = {};
      }
      return achievement;
    });
  }

  /**
   * 獲得済み実績の保存
   * @returns {Promise}
   */
  save() {
    if (this.options.onSave) {
      const result = this.options.onSave(this);
      return isThenable(result) ? result : Promise.resolve();
    }
    return Promise.resolve();
  }

  /**
   * 実績リストを取得
   * @returns {{unlockInfo: any, achievement: *}[]}
   */
  data() {
    return this._achievements.map((achievement) => ({
      achievement,
      unlockInfo: this.unlockInfo.get(achievement.key) || null,
    }));
  }

  /**
   * 指定キーの実績情報を取得
   * @param {string} key  取得する実績のキー
   * @returns {Achievement|null}
   */
  getAchievement(key) {
    key = this.normalizeKey(key);
    return this._achievements.find((achievement) => achievement.key === key) || null;
  }

  /**
   * 獲得済み実績の件数を取得
   * @returns {number}
   */
  getUnlockedCount() {
    return this.unlockInfo.size;
  }

  /**
   * 実績獲得情報の取得
   * @param {string} key  取得するする実績のキー
   * @returns {any | null}
   */
  getUnlockInfo(key) {
    key = this.normalizeKey(key);
    return this.unlockInfo.get(`${key}`) || null;
  }

  /**
   * 指定キーの実績が獲得済みであるか？
   * @param {string} key  確認する実績のキー
   * @returns {boolean}
   */
  isUnlocked() {
    return Array.from(arguments).every((key) => {
      key = this.normalizeKey(key);
      return this.unlockInfo.has(key);
    });
  }

  /**
   * すべての実績が獲得済みであるか？
   * @returns {boolean}
   */
  isAllUnlocked() {
    return this.achievements.every((achievement) => {
      return this.unlockInfo.has(achievement.key);
    });
  }

  /**
   * 指定キーの実績が獲得可能であるか？
   * @param {string} key  確認する実績のキー
   * @returns {boolean}
   */
  isUnlockable(key) {
    key = this.normalizeKey(key);
    if (!this.getAchievement(key)) return false;
    if (!this.options.overwritable && this.unlockInfo.has(key)) return false;

    return true;
  }

  /**
   * 指定キーの実績を獲得する
   * @param {string} key  獲得する実績のキー
   * @returns {boolean}   実績獲得処理が実行されたか
   */
  unlock(key) {
    key = this.normalizeKey(key);
    if (!this.isUnlockable(key)) return false;
    this.unlockInfo.set(key, this.makeUnlockData(key));
    this.notify(key);
    this.save();
    return true;
  }

  /**
   * 実績獲得情報を生成する
   * ※アドオンプラグイン等で再定義・加工される想定
   * @param {string} _key 獲得する実績のキー
   * @returns {{date: number}}
   */
  makeUnlockData(_key) {
    return {
      date: Date.now(),
    };
  }

  /**
   * 指定キーの実績獲得イベントの通知
   * @param {string} key 獲得した実績のキー
   */
  notify(key) {
    key = this.normalizeKey(key);
    const achievement = this.getAchievement(key);
    if (!achievement) return;
    const unlockInfo = this.unlockInfo.get(key);
    if (!unlockInfo) return;

    this._handlers.forEach((handler) => {
      handler({ achievement, unlockInfo });
    });
  }

  /**
   * 指定キーの実績を削除する
   * @param key
   */
  remove(key) {
    key = `${key}`;
    this.unlockInfo.delete(key);
  }

  /**
   * 全実績を削除する
   * @note 削除後にセーブ処理を呼び出す
   */
  clear() {
    this.resetData();
    this.save();
  }

  /**
   * 実績データのリセット
   */
  resetData() {
    this.unlockInfo.clear();
  }

  /**
   * 実績獲得通知イベントの購読開始
   * @param {Handler} handler
   */
  on(handler) {
    this._handlers.push(handler);
  }

  /**
   * 実績獲得通知イベントの購読解除
   * @param {Handler} handler
   */
  off(handler) {
    this._handlers = this._handlers.filter((h) => h !== handler);
  }

  /**
   * @callback Handler
   * @param {{achievement: any, unlockInfo: any}} responseCode
   */

  /**
   * keyの文字列化
   * @param key
   * @returns {string}
   * @private
   */
  normalizeKey(key) {
    return typeof key === 'string' ? key : `${key}`;
  }

  /**
   * 保存したいデータの出力
   */
  createSaveContents() {
    return {
      unlockInfo: Array.from(this.unlockInfo.entries()),
    };
  }

  /**
   * データのインポート
   * @param data
   */
  extractSaveContents(data) {
    try {
      this.resetData();
      data.unlockInfo.forEach(([key, value]) => {
        if (!this.getAchievement(key)) return;
        this.unlockInfo.set(key, value);
      });
    } catch (e) {
      console.error(e);
    }
  }
}
