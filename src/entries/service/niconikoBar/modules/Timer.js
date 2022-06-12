import { isThenable } from '../../../../common/utils/isThenable';

export class Timer {
  constructor(callback, interval) {
    this._time = null;
    this._callback = callback;
    this._interval = interval;
  }

  start() {
    this._time = setTimeout(this._call.bind(this), 1000);
  }

  stop() {
    if (this._time) clearTimeout(this._time);
    this._time = null;
  }

  _call() {
    this.stop();

    const result = this._callback();

    if (isThenable(result)) {
      result.then(() => this._reserveNextCall());
      if (result.catch) {
        result.catch(() => this._reserveNextCall());
      }
    } else {
      this._reserveNextCall();
    }
  }

  _reserveNextCall() {
    if (this._interval < 1) return;
    this._time = setTimeout(this._call.bind(this), this._interval);
  }
}
