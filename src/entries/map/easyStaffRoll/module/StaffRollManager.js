import { Torigoya } from '../../../../common/Torigoya';

export class StaffRollManager {
  constructor() {
    this._content = null;
    this._isLoading = false;
  }

  get content() {
    return this._content;
  }

  get timerRate() {
    const state = this.getState();

    if (state.duration <= 0) return 1;
    return state.timer / state.duration;
  }

  /**
   * 現在のスタッフロール表示状況の取得
   * @returns {*}
   */
  getState() {
    return $gameScreen.torigoyaEasyStaffRoll_getStaffRollState();
  }

  /**
   * スタッフロール本文の読込中であるか？
   * @returns {boolean}
   */
  isLoading() {
    return this._isLoading;
  }

  /**
   * スタッフロール表示中であるか？
   * @returns {boolean}
   */
  isDisplay() {
    const state = this.getState();
    return state.timer < state.duration;
  }

  /**
   * スタッフロール処理が動作中であるか？
   * @returns {boolean}
   */
  isBusy() {
    return this.isLoading() || this.isDisplay();
  }

  /**
   * 表示設定の反映
   * @param duration
   */
  setup({ duration }) {
    const state = this.getState();
    state.timer = 0;
    state.duration = duration;

    this._isLoading = true;
    this.loadStaffRollContent().then((content) => {
      this._content = content;
      this._isLoading = false;
    });
  }

  /**
   * 更新
   */
  update() {
    if (this._isLoading) return;
    const state = this.getState();

    if (state.timer < state.duration) {
      ++state.timer;

      if (state.timer === state.duration) this.finish();
    }
  }

  /**
   * 表示の終了
   */
  finish() {
    const state = this.getState();
    state.timer = state.duration = 0;
    this._content = null;
  }

  /**
   * スタッフロール情報の読み込み
   * アドオンプラグイン向けにPromiseを返す非同期のメソッドとして定義する
   * @returns {Promise<Object[]>}
   */
  loadStaffRollContent() {
    return Promise.resolve(Torigoya.EasyStaffRoll.parameter.baseStaffRollContent);
  }
}
