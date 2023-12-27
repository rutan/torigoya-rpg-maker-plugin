import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_NotifyMessage_AddonAtsumaruGlobalSignal_parameter';
import { checkExistPlugin } from '../../../common/utils/checkPlugin';

checkExistPlugin(
  Torigoya.NotifyMessage,
  '「通知メッセージアドオン: アツマールグローバルシグナル通知ログ」より上に「通知メッセージプラグイン」が導入されていません。',
);

Torigoya.NotifyMessage.Addons = Torigoya.NotifyMessage.Addons || {};
Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // このプラグインが発生させたシグナルであるかの検証用
  const SIGNAL_KEY = '_1';
  const SIGNAL_VALUE = '_2';
  const SIGNAL_ICON = '_3';

  // -------------------------------------------------------------------------
  // SignalCrawler

  class SignalCrawlerClass {
    constructor() {
      this._isFetching = false;
      this._lastFetchedAt = 0;
      this._lastSignalCreatedAt = -1;
      this._handlers = [];
    }

    /**
     * データ取得間隔（ミリ秒）
     * @returns {number}
     */
    getIntervalMs() {
      return Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.parameter.advancedFetchInterval * 1000;
    }

    /**
     * 初回取得の最大件数
     * @returns {number}
     */
    firstFetchLimit() {
      return Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.parameter.baseFirstFetchLimit;
    }

    /**
     * 必要であればデータ取得を開始
     */
    fetchStartIfRequire() {
      if (this._isFetching) return;
      if (Date.now() - this._lastFetchedAt < this.getIntervalMs()) return;
      this.doFetch();
    }

    /**
     * データ取得処理の実行
     */
    doFetch() {
      if (this._isFetching) return;
      this._isFetching = true;
      this._lastFetchedAt = Date.now();

      this._fetchSignals()
        .then((result) => {
          this._isFetching = false;

          // 初回取得処理
          if (this._lastSignalCreatedAt < 0) {
            this._lastSignalCreatedAt = 0;
            const size = Math.min(result.length, this.firstFetchLimit());
            result = result.slice(result.length - size);
          }

          if (result.length === 0) return;

          this._lastSignalCreatedAt = result[result.length - 1].createdAt;
          result.forEach((s) => this.emit(s));
        })
        .catch((e) => {
          console.error(e);
          this._isFetching = false;
        });
    }

    /**
     * グローバルシグナルの取得
     * @returns {Promise<Object[]>}
     * @private
     */
    _fetchSignals() {
      if (window.RPGAtsumaru && window.RPGAtsumaru.signal && window.RPGAtsumaru.signal.getGlobalSignals) {
        // アツマール上での動作（オンラインモード）
        return window.RPGAtsumaru.signal.getGlobalSignals().then((data) => {
          return data
            .filter((item) => item.createdAt > this._lastSignalCreatedAt)
            .map((item) => this.extractSignalItem(item))
            .sort((a, b) => a.createdAt - b.createdAt);
        });
      } else {
        // アツマール外での動作（ローカルモード）
        return Promise.resolve([]);
      }
    }

    /**
     * グローバルシグナルの加工処理
     * @param globalSignal
     * @returns {*}
     */
    extractSignalItem(globalSignal) {
      try {
        globalSignal.body = JSON.parse(globalSignal.data);
      } catch (_) {
        globalSignal.body = {};
      }
      return globalSignal;
    }

    /**
     * ハンドラー登録
     * @param handler
     */
    on(handler) {
      this._handlers.push(handler);
    }

    /**
     * ハンドラーの解除
     * @param handler
     */
    off(handler) {
      this._handlers = this._handlers.filter((h) => h !== handler);
    }

    /**
     * 全ハンドラーの解除
     */
    offAll() {
      this._handlers.length = 0;
    }

    /**
     * 取得したグローバルシグナルの通知
     * 通知は1件ずつ行う
     * @param signal
     */
    emit(signal) {
      this._handlers.forEach((handler) => {
        handler(signal);
      });
    }
  }

  Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.SignalCrawler = new SignalCrawlerClass();

  // -------------------------------------------------------------------------
  // SignalTemporaryStorage

  const SignalTemporaryStorage = {
    queues: [],
    handleSignal(signal) {
      // このプラグインが生成したシグナルでなければ破棄
      const key = signal.body[SIGNAL_KEY];
      if (!key) return;

      this.queues.push(signal);
    },
    shift() {
      return this.queues.shift();
    },
  };

  Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.SignalCrawler.on(
    SignalTemporaryStorage.handleSignal.bind(SignalTemporaryStorage),
  );
  Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.Storage = SignalTemporaryStorage;

  // -------------------------------------------------------------------------
  // Torigoya.NotifyMessage.Window

  const upstream_Torigoya_NotifyMessage_Window_convertEscapeCharacters =
    Torigoya.NotifyMessage.Window.prototype.convertEscapeCharacters;
  Torigoya.NotifyMessage.Window.prototype.convertEscapeCharacters = function (text) {
    text = upstream_Torigoya_NotifyMessage_Window_convertEscapeCharacters.apply(this, arguments);

    text = text.replace(/\x1bSIG_NAME/gi, (_, p1) => this.getSignalSenderName());

    text = text.replace(/\x1bSIG_V\[(\d+)\]/gi, (_, p1) => this.findSignalMessage('v', parseInt(p1, 10)));

    text = text.replace(/\x1bSIG_N\[(\d+)\]/gi, (_, p1) => this.findSignalMessage('n', parseInt(p1, 10)));

    text = text.replace(/\x1bSIG_P\[(\d+)\]/gi, (_, p1) => this.findSignalMessage('p', parseInt(p1, 10)));

    return text;
  };

  Torigoya.NotifyMessage.Window.prototype.getSignalSenderName = function () {
    const signal = this._notifyItem.meta.atsumaruSignal;
    if (!signal) return '';

    return signal.senderName || '';
  };

  Torigoya.NotifyMessage.Window.prototype.findSignalMessage = function (key, id) {
    const signal = this._notifyItem.meta.atsumaruSignal;
    if (!signal || !signal.body || !signal.body[SIGNAL_VALUE]) return '';

    const value = signal.body[SIGNAL_VALUE].find((n) => n[0] === key && n[1] === id);
    if (!value) return '';

    return value[2].toString().replace(/\x1b/g, '\\');
  };

  // -------------------------------------------------------------------------
  // Torigoya.NotifyMessage.Manager

  const upstream_Torigoya_NotifyMessage_Manager_update = Torigoya.NotifyMessage.Manager.update;
  Torigoya.NotifyMessage.Manager.update = function () {
    upstream_Torigoya_NotifyMessage_Manager_update.apply(this);

    Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.SignalCrawler.fetchStartIfRequire();
    this.showAtsumaruGlobalSignalMessage();
  };

  Torigoya.NotifyMessage.Manager.showAtsumaruGlobalSignalMessage = function () {
    if (!this.isVisible()) return;
    if (SignalTemporaryStorage.queues.length === 0) return;
    const signal = SignalTemporaryStorage.queues.shift();
    const key = signal.body[SIGNAL_KEY];

    // keyから通知を生成
    const template = findEventTemplate(key);
    if (!template) return;

    const item = new Torigoya.NotifyMessage.NotifyItem({
      message: template.message,
      icon: signal.body[SIGNAL_ICON] || template.icon,
      note: template.note,
    });
    item.meta.atsumaruSignal = signal;
    if (Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.parameter.advancedForceMute) item.meta.noSound = true;
    this.notify(item);
  };

  // -------------------------------------------------------------------------
  // functions

  function findEventTemplate(key) {
    return Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.parameter.baseEventLogs.find((n) => n.key === key);
  }

  function login() {
    const { loginStatus } = Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal;

    if (loginStatus === 'login') return Promise.resolve();
    if (loginStatus === 'unauthorized') return Promise.resolve();

    if (window.RPGAtsumaru && window.RPGAtsumaru.interplayer && window.RPGAtsumaru.interplayer.enable) {
      return window.RPGAtsumaru.interplayer
        .enable()
        .then(() => {
          Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.loginStatus = 'login';
        })
        .catch((e) => {
          if (e && e.code === 'UNAUTHORIZED') {
            Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.loginStatus = 'unauthorized';
          }
          return Promise.reject(e);
        });
    } else {
      return Promise.resolve();
    }
  }

  function commandSendEvent({ key, iconVariable }) {
    const template = findEventTemplate(key);
    if (!template) {
      console.error(`識別キー: ${key} のイベントログはありません`);
      return;
    }

    const vars = [];
    template.message
      .replace(/\\/g, '\x1b')
      .replace(/\x1b\x1b/g, '\\')
      .replace(/\x1bSIG_NAME/gi, '')
      .replace(/\x1bSIG_V\[(\d+)\]/gi, (_, p1) => {
        const id = parseInt(p1, 10);
        const value = $gameVariables.value(id);
        vars.push(['v', id, value]);
        return value;
      })
      .replace(/\x1bSIG_N\[(\d+)\]/gi, (_, p1) => {
        const id = parseInt(p1, 10);
        const actor = id > 0 ? $gameActors.actor(id) : null;
        const value = actor ? actor.name() : '';
        vars.push(['n', id, value]);
        return value;
      })
      .replace(/\x1bSIG_P\[(\d+)\]/gi, (_, p1) => {
        const index = parseInt(p1, 10);
        const actor = index > 0 ? $gameParty.members()[index - 1] : null;
        const value = actor ? actor.name() : '';
        vars.push(['p', id, value]);
        return value;
      });

    const body = { [SIGNAL_KEY]: key, [SIGNAL_VALUE]: vars };
    iconVariable = iconVariable ? parseInt(iconVariable, 10) : 0;
    if (iconVariable && iconVariable > 0) {
      body[SIGNAL_ICON] = $gameVariables.value(iconVariable);
    }

    const data = JSON.stringify(body);
    if (window.RPGAtsumaru && window.RPGAtsumaru.signal && window.RPGAtsumaru.signal.sendSignalToGlobal) {
      login()
        .then(() => {
          window.RPGAtsumaru.signal
            .sendSignalToGlobal(data)
            .then(() => {
              Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.SignalCrawler.doFetch();
            })
            .catch((e) => {
              console.error(e);
              sendLocal(data);
            });
        })
        .catch(() => {
          sendLocal(data);
        });
    } else {
      sendLocal(data);
    }
  }

  function sendLocal(data) {
    const actor = $gameParty.members()[0];
    SignalTemporaryStorage.handleSignal({
      id: Date.now(),
      senderId: 0,
      senderName: actor ? actor.name() : '',
      createdAt: Math.floor(Date.now() / 1000),
      data,
      body: JSON.parse(data),
    });
  }

  PluginManager.registerCommand(Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.name, 'sendEvent', commandSendEvent);
})();
