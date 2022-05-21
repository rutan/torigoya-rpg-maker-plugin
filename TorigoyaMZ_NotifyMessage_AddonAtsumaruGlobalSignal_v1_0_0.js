/*---------------------------------------------------------------------------*
 * TorigoyaMZ_NotifyMessage_AddonAtsumaruGlobalSignal.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2022/05/21 14:12 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 通知メッセージアドオン: アツマールグローバルシグナル通知ログ (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_NotifyMessage_AddonAtsumaruGlobalSignal.js
 * @base TorigoyaMZ_NotifyMessage
 * @orderAfter TorigoyaMZ_NotifyMessage
 * @help
 * 通知メッセージアドオン: アツマールグローバルシグナル通知ログ (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * ※このプラグインはゲームアツマール用の非公式プラグインです
 *
 * ゲームアツマールのグローバルシグナルAPIを利用して
 * 全ユーザーで共有のイベントログを表示する機能を追加します。
 *
 * ------------------------------------------------------------
 * ■ 注意事項
 * ------------------------------------------------------------
 * ・非公式のプラグインです。突然動かなくなる場合があります。
 *
 * ・イベントログのデータサイズが大きい場合、
 * 　APIのサイズ上限に引っかかり正常に送信できない場合があります
 *
 * ・他のプラグインからグローバルシグナルAPIを使用している場合
 * 　競合する可能性があります。ご注意ください。
 *
 * ------------------------------------------------------------
 * ■ 使用方法：イベントログの設定
 * ------------------------------------------------------------
 * 事前に表示するイベントログの種類を登録する必要があります。
 *
 * 「イベントログ種別」に以下の情報を設定してください。
 *
 * ・種別キー
 * イベントログの種類を表す言葉です。
 * ここで設定した言葉をイベントコマンドで使用します。
 * データサイズが小さい、短い英語がおすすめ！
 *
 * ・ログ文章
 * イベントログの文章として表示するテンプレートを設定します。
 * ここで設定した文章が通知として表示されます。
 * ここには一部特殊な記法を利用することができます（後述）
 *
 * ・アイコンID
 * 通知に表示するアイコンを設定します
 *
 * ------------------------------------------------------------
 * ■ 使用方法：通知の発行
 * ------------------------------------------------------------
 * 通知を発行したいタイミングで
 * プラグインコマンドの「イベントログの送信」を実行してください。
 *
 * 種別キーには「イベントログ種別」で設定したものを指定してください。
 *
 * ------------------------------------------------------------
 * ■ ログ文章の記法について
 * ------------------------------------------------------------
 * ログ文章には文章の表示と同様の記法を利用できます。
 *
 * ＜通知を送った人の名前について＞
 * 文章中に \SIG_NAME と記述することで、
 * その通知を送った人のアツマール上での名前が表示されます。
 *
 * 使用例） \SIG_NAME さんがログインしました
 *
 * ＜変数などの表示について＞
 * \V[xx] などの変数表示は自分自身のものが表示されます。
 * そのため、他のプレイヤーが送ったイベント通知であっても、
 * 他のプレイヤーの変数ではなく自分の変数が表示されてしまいます。
 *
 * もし、他のプレイヤーの変数の中身が表示されてほしい場合は、
 * \V[xx] ではなく \SIG_V[xx] と指定してください。
 *
 * 使用例） \SIG_NAME が \SIG_V[1] ゴールド獲得！
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param baseEventLogs
 * @text イベントログ種別
 * @desc イベントログの種類を定義します。
 * @type struct<EventLog>[]
 * @parent base
 * @default []
 *
 * @param baseFirstFetchLimit
 * @text 起動時に過去ログを最大何件取得するか？
 * @desc 起動時に最大何件のログを取得するか指定します。
 * @type number
 * @parent base
 * @min 0
 * @default 5
 *
 * @param advanced
 * @text ■ 上級設定
 *
 * @param advancedForceMute
 * @text 効果音を強制無効化
 * @desc 通知の効果音を強制的に無効化するか選択できます。
 * うるさいので無効化がオススメ。
 * @type boolean
 * @parent advanced
 * @on 強制無効化する
 * @off 無効化しない
 * @default true
 *
 * @param advancedFetchInterval
 * @text グローバルシグナルの取得間隔(秒)
 * @desc グローバルシグナルを何秒おきに取得するか設定します。
 * 短くしすぎるとAPI上限に引っかかるため注意。
 * @type number
 * @parent advanced
 * @min 10
 * @default 60
 *
 * @command sendEvent
 * @text イベントログの送信
 * @desc 指定のイベントログを送信します
 *
 * @arg key
 * @text 種別キー
 * @desc 送信するイベント種別の識別名です。
 * プラグイン設定で指定したものを指定してください。
 * @type string
 *
 * @arg iconVariable
 * @text アイコンID（変数指定）
 * @desc 通知に表示するアイコンIDが設定された変数を指定します。
 * 「なし」の場合はデフォルトのアイコンを使用します。
 * @type variable
 * @default 0
 */

/*~struct~EventLog:
 * @param key
 * @text 種別キー
 * @desc イベント種別の識別名です。
 * ここで設定した文字列をログ送信時に指定します。
 * @type string
 *
 * @param message
 * @text ログ文章
 * @desc ログとして表示するメッセージを指定します。
 * 一部特殊な記法があります。説明を読んでね。
 * @type multiline_string
 *
 * @param icon
 * @text アイコンID
 * @desc 通知に表示するアイコンのIDを指定します。
 * 0の場合は表示しません。
 * @type number
 *
 * @param note
 * @text メモ欄
 * @desc メモ欄です。
 * ツクールのメモ欄と同様に利用できます。
 * @type note
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_NotifyMessage_AddonAtsumaruGlobalSignal';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return `${parameter[key] || ''}`;
    }

    function pickNumberValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseFloat(parameter[key]);
    }

    function pickNoteStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return (parameter[key].startsWith('"') ? JSON.parse(parameter[key]) : parameter[key]) || '';
    }

    function pickIntegerValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseInt(parameter[key], 10);
    }

    function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
        return `${parameter[key] || defaultValue}` === 'true';
    }

    function pickStructEventLog(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            key: pickStringValueFromParameter(parameter, 'key', undefined),
            message: pickStringValueFromParameter(parameter, 'message', undefined),
            icon: pickNumberValueFromParameter(parameter, 'icon', undefined),
            note: pickNoteStringValueFromParameter(parameter, 'note', undefined),
        };
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
            baseEventLogs: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructEventLog(parameter);
                });
            })(parameter.baseEventLogs),
            baseFirstFetchLimit: pickIntegerValueFromParameter(parameter, 'baseFirstFetchLimit', 5),
            advancedForceMute: pickBooleanValueFromParameter(parameter, 'advancedForceMute', true),
            advancedFetchInterval: pickIntegerValueFromParameter(parameter, 'advancedFetchInterval', 60),
        };
    }

    function checkExistPlugin(pluginObject, errorMessage) {
        if (typeof pluginObject !== 'undefined') return;
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    checkExistPlugin(
        Torigoya.NotifyMessage,
        '「通知メッセージアドオン: アツマールグローバルシグナル通知ログ」より上に「通知メッセージプラグイン」が導入されていません。'
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
                            result = result.slice(result.length - this.firstFetchLimit());
                        }

                        if (result.length === 0) return;

                        this._lastSignalCreatedAt = result[result.length - 1].createdAt;
                        result.forEach((s) => this.emit(s));
                    })
                    .catch(() => {
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
            SignalTemporaryStorage.handleSignal.bind(SignalTemporaryStorage)
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
            if (Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.parameter.advancedForceMute)
                item.meta.noSound = true;
            this.notify(item);
        };

        // -------------------------------------------------------------------------
        // functions

        function findEventTemplate(key) {
            return Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.parameter.baseEventLogs.find(
                (n) => n.key === key
            );
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
                login().then(() => {
                    window.RPGAtsumaru.signal
                        .sendSignalToGlobal(data)
                        .then(() => {
                            Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.SignalCrawler.doFetch();
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                });
            } else {
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
        }

        PluginManager.registerCommand(
            Torigoya.NotifyMessage.Addons.AtsumaruGlobalSignal.name,
            'sendEvent',
            commandSendEvent
        );
    })();
})();
