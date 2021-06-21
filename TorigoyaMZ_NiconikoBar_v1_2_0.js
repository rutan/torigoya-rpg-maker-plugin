/*---------------------------------------------------------------------------*
 * TorigoyaMZ_NiconikoBar.js v.1.2.0
 *---------------------------------------------------------------------------*
 * 2021/06/22 02:33 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc ニコニ広告通知バー風表示プラグイン (v.1.2.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.2.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_NiconikoBar.js
 * @help
 * ニコニ広告通知バー風表示プラグイン (v.1.2.0)
 * https://torigoya-plugin.rutan.dev
 *
 * ※このプラグインはRPGアツマール用の非公式プラグインです
 *
 * RPGアツマール上でゲームにニコニ広告された場合に、
 * 昔のニコ生っぽい広告バーを画面に表示をします。
 *
 * @param test
 * @text ■ テストプレイ設定
 *
 * @param testUseDebugMode
 * @text テストモード
 * @desc テストプレイ時にダミーの広告を表示するか？
 * テストプレイ以外では強制的にオフになります。
 * @type boolean
 * @parent test
 * @on 使用する
 * @off 使用しない
 * @default false
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param baseTitle
 * @text タイトル
 * @desc タイトル部分に表示する文字列
 * @type string
 * @parent base
 * @default ニコニ広告
 *
 * @param baseMessage
 * @text メッセージ
 * @desc メッセージの最後につける感謝の言葉
 * @type string
 * @parent base
 * @default 広告ありがとうございます！
 *
 * @param baseBackgroundColor
 * @text 背景色
 * @desc 背景の色
 * （※CSSと同様の指定方法です）
 * @type string
 * @parent base
 * @default rgba(255, 229, 0, .8)
 *
 * @param baseTextColor
 * @text 文字色
 * @desc 文字の色
 * （※CSSと同様の指定方法です）
 * @type string
 * @parent base
 * @default #000000
 *
 * @param baseScrollTime
 * @text 表示時間
 * @desc 文字が流れきるのにかかる時間（秒）
 * @type number
 * @parent base
 * @default 10
 *
 * @param advanced
 * @text ■ 上級者設定
 *
 * @param advancedAutoStart
 * @text 自動開始
 * @desc ゲーム開始と同時に表示を始めるか？
 * @type boolean
 * @parent advanced
 * @ON 始める
 * @OFF 始めない
 * @default true
 *
 * @param advancedExpiration
 * @text 対象時間
 * @desc 何秒前の広告までを対象にするか？
 * @type number
 * @parent advanced
 * @default 604800
 *
 * @param advancedFetchInterval
 * @text 自動取得間隔
 * @desc ニコニ広告情報の自動取得の間隔（分）
 * 0の場合は再取得しません
 * @type number
 * @parent advanced
 * @default 5
 *
 * @command start
 * @text ニコニ広告情報の取得開始
 * @desc ニコニ広告情報の取得を開始します。
 * 取得した場合自動的にバーを表示します。
 *
 * @command stop
 * @text ニコニ広告情報の取得停止
 * @desc ニコニ広告情報の取得を停止します。
 * 停止中はバーが表示されません。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        const match = cs && cs.src.match(/\/js\/plugins\/(.+)\.js$/);
        return match ? match[1] : 'TorigoyaMZ_NiconikoBar';
    }

    function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
        return ''.concat(parameter[key] || defaultValue) === 'true';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return ''.concat(parameter[key] || '');
    }

    function pickNumberValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseFloat(parameter[key]);
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.2.0',
            testUseDebugMode: pickBooleanValueFromParameter(parameter, 'testUseDebugMode', false),
            baseTitle: pickStringValueFromParameter(parameter, 'baseTitle', 'ニコニ広告'),
            baseMessage: pickStringValueFromParameter(parameter, 'baseMessage', '広告ありがとうございます！'),
            baseBackgroundColor: pickStringValueFromParameter(
                parameter,
                'baseBackgroundColor',
                'rgba(255, 229, 0, .8)'
            ),
            baseTextColor: pickStringValueFromParameter(parameter, 'baseTextColor', '#000000'),
            baseScrollTime: pickNumberValueFromParameter(parameter, 'baseScrollTime', 10),
            advancedAutoStart: pickBooleanValueFromParameter(parameter, 'advancedAutoStart', true),
            advancedExpiration: pickNumberValueFromParameter(parameter, 'advancedExpiration', 604800),
            advancedFetchInterval: pickNumberValueFromParameter(parameter, 'advancedFetchInterval', 5),
        };
    }

    function isThenable(obj) {
        return obj && typeof obj['then'] === 'function';
    }

    class Timer {
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
            this._time = setTimeout(this._call.bind(this), this._interval);
        }
    }

    function getAtsumaru() {
        return (typeof window === 'object' && window.RPGAtsumaru) || null;
    }

    /**
     * ニコニ広告APIのクライアント
     */

    class NiconikoApiClient {
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
                        .values()
                );

                if (newItems[0]) this._lastStartedTime = newItems[0].startedAt;

                return newItems;
            });
        }
    }

    class ViewBuilder {
        /**
         * 初期化
         * @param {{title: string, backgroundColor: string, textColor: string, scrollTime: number}} options
         */
        constructor(options = {}) {
            this._isShow = false;
            this._title = options.title;
            this._backgroundColor = options.backgroundColor;
            this._textColor = options.textColor;
            this._scrollTime = options.scrollTime || 0;
        }

        /**
         * 一番外側のHTML要素
         * @returns {HTMLDivElement}
         */
        get element() {
            return this._element;
        }

        /**
         * HTML要素の生成
         */
        createElement() {
            this._element = this._createLayerElement();
            document.body.appendChild(this._element);

            this._barElement = this._createBarElement();
            this._element.appendChild(this._barElement);
            this._titleElement = this._createTitleElement();
            this._barElement.appendChild(this._titleElement);
            this._messageElement = this._createMessageElement();
            this._barElement.appendChild(this._messageElement);
            this._messageTextElement = this._createMessageTextElement();
            this._messageElement.appendChild(this._messageTextElement);

            this.resetStyle();
            this.updateElement();
        }

        _createLayerElement() {
            const element = document.createElement('div');
            element.id = 'nicoko-layer';
            element.classList.add('nicoko-layer');
            element.style.position = 'absolute';
            element.style.top = '0';
            element.style.left = '0';
            element.style.right = '0';
            element.style.bottom = '0';
            element.style.margin = 'auto';
            element.style.zIndex = '10';
            element.style.overflow = 'hidden';
            element.style.pointerEvents = 'none';
            return element;
        }

        _createBarElement() {
            const element = document.createElement('div');
            element.classList.add('nicoko-bar');
            element.style.position = 'absolute';
            element.style.left = '0';
            element.style.width = '100%';
            element.style.height = '2em';
            element.style.overflow = 'hidden';
            element.style.background = this._backgroundColor;
            element.style.color = this._textColor;
            element.style.fontFamily = 'GameFont sans-serif';
            element.style.opacity = '0';
            element.style.transition = 'all ease-in-out .5s';
            return element;
        }

        _createTitleElement() {
            const element = document.createElement('div');
            element.classList.add('nicoko-title');
            element.style.position = 'absolute';
            element.style.top = '0';
            element.style.lineHeight = ''.concat(2 / 0.8, 'em');
            element.style.padding = '0 10px';
            element.style.fontSize = '0.8em';
            element.style.fontWeight = 'bold';
            element.style.transition = 'left ease-in-out .5s 1s, transform ease-in-out .5s 1s';
            element.innerText = this._title;
            return element;
        }

        _createMessageElement() {
            const element = document.createElement('div');
            element.classList.add('nicoko-message');
            element.style.position = 'absolute';
            element.style.top = '0';
            element.style.right = '0';
            element.style.height = '2em';
            element.style.overflow = 'hidden';
            return element;
        }

        _createMessageTextElement() {
            const element = document.createElement('div');
            element.classList.add('nicoko-message-text');
            element.style.whiteSpace = 'pre';
            element.style.position = 'absolute';
            element.style.top = '0';
            element.style.lineHeight = ''.concat(2 / 0.8, 'em');
            element.style.fontSize = '0.8em';
            element.style.padding = '0 10px';
            element.addEventListener('transitionend', this._onTextTransitionEnd.bind(this));
            return element;
        }

        /**
         * アニメーション開始前の位置に戻す
         */
        resetStyle() {
            this._barElement.style.bottom = '-2em';
            this._barElement.style.opacity = '0';

            this._titleElement.style.left = '50%';
            this._titleElement.style.transform = 'translateX(-50%)';

            this._messageElement.style.width = '0';

            this._messageTextElement.style.transition = 'initial';
            this._messageTextElement.style.left = '100%';
            this._messageTextElement.style.transform = 'translateX(0%)';
        }

        /**
         * 画面サイズに表示を合わせる
         */
        updateElement() {
            this._element.width = Graphics._width;
            this._element.height = Graphics._height;
            const size = Math.min(Math.max(Math.floor(20 * Graphics._realScale), 10), 20);
            this._element.style.fontSize = ''.concat(size, 'px');
            Graphics._centerElement(this._element);
        }

        /**
         * メッセージ表示の開始
         * @param message
         */
        showMessage(message) {
            if (this._isShow) return;
            this._isShow = true;

            this._barElement.style.bottom = '0';
            this._barElement.style.opacity = '1';

            this._titleElement.style.left = '0';
            this._titleElement.style.transform = 'translateX(0)';

            const rect = this._titleElement.getBoundingClientRect();
            this._messageElement.style.width = 'calc(100% - '.concat(rect.width, 'px)');

            this._messageTextElement.innerText = message;
            this._messageTextElement.style.left = '0';
            this._messageTextElement.style.transform = 'translateX(-100%)';
            this._messageTextElement.style.transition = 'left linear '
                .concat(this._scrollTime, 's 2s, transform linear ')
                .concat(this._scrollTime, 's 2s');
        }

        _onTextTransitionEnd() {
            this._isShow = false;
            this.resetStyle();
        }
    }

    function generateMessage(histories) {
        if (histories.length === 0) return '';

        return histories
            .slice(0)
            .sort((a, b) => b.adPoint - a.adPoint)
            .map((item) => ''.concat(item.advertiserName, '\u3055\u3093\uFF08').concat(item.adPoint, 'pt\uFF09'))
            .join(' / ');
    }

    Torigoya.NiconikoBar = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    Torigoya.NiconikoBar.client = new NiconikoApiClient({
        debug: Utils.isOptionValid('test') && Torigoya.NiconikoBar.parameter.testUseDebugMode,
        expiration: Torigoya.NiconikoBar.parameter.advancedExpiration,
    });

    Torigoya.NiconikoBar.viewBuilder = new ViewBuilder({
        title: Torigoya.NiconikoBar.parameter.baseTitle,
        backgroundColor: Torigoya.NiconikoBar.parameter.baseBackgroundColor,
        textColor: Torigoya.NiconikoBar.parameter.baseTextColor,
        scrollTime: Torigoya.NiconikoBar.parameter.baseScrollTime,
    });

    Torigoya.NiconikoBar.timer = new Timer(() => {
        return Torigoya.NiconikoBar.client.fetchNewHistories().then((histories) => {
            if (histories.length === 0) return;

            Torigoya.NiconikoBar.viewBuilder.showMessage(
                ''.concat(generateMessage(histories), ' ').concat(Torigoya.NiconikoBar.parameter.baseMessage)
            );
        });
    }, Torigoya.NiconikoBar.parameter.advancedFetchInterval * 60 * 1000);

    // -------------------------------------------------------------------------
    // hook

    (() => {
        const upstream_Graphics_createAllElements = Graphics._createAllElements;
        Graphics._createAllElements = function () {
            upstream_Graphics_createAllElements.apply(this);
            Torigoya.NiconikoBar.viewBuilder.createElement();
        };

        const upstream_Graphics_updateAllElements = Graphics._updateAllElements;
        Graphics._updateAllElements = function () {
            upstream_Graphics_updateAllElements.apply(this);
            Torigoya.NiconikoBar.viewBuilder.updateElement();
        };

        if (Torigoya.NiconikoBar.parameter.advancedAutoStart) {
            const upstream_Scene_Boot_start = Scene_Boot.prototype.start;
            Scene_Boot.prototype.start = function () {
                upstream_Scene_Boot_start.apply(this);

                Torigoya.NiconikoBar.timer.start();
            };
        }
    })();

    // -------------------------------------------------------------------------
    // プラグインコマンド

    function commandStart() {
        Torigoya.NiconikoBar.timer.start();
    }

    function commandStop() {
        Torigoya.NiconikoBar.timer.stop();
    }

    PluginManager.registerCommand(Torigoya.NiconikoBar.name, 'start', commandStart);
    PluginManager.registerCommand(Torigoya.NiconikoBar.name, 'stop', commandStop);
})();
