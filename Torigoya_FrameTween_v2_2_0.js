/*---------------------------------------------------------------------------*
 * Torigoya_FrameTween.js v.2.2.0
 *---------------------------------------------------------------------------*
 * 2023/09/19 01:09 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc [Base] Tween-animation Engine (v.2.2.0)
 * @author Rutan(ru_shalm)
 * @license public domain
 * @version 2.2.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_FrameTween.js
 * @help
 * [Base] Tween-animation Engine (v.2.2.0)
 * https://torigoya-plugin.rutan.dev
 *
 * This plugin is a base-plugin for Torigoya plugins.
 */

/*:ja
 * @target MV
 * @plugindesc [鳥小屋.txt ベースプラグイン] Tweenアニメーション (v.2.2.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 2.2.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_FrameTween.js
 * @help
 * [鳥小屋.txt ベースプラグイン] Tweenアニメーション (v.2.2.0)
 * https://torigoya-plugin.rutan.dev
 *
 * このプラグインはベースプラグインです。
 * このプラグインを導入しただけでは特に何も起きません。
 * Tweenアニメーション用の処理を追加します。
 */

(function () {
    'use strict';

    // Bundled with Packemon: https://packemon.dev
    // Platform: browser, Support: stable, Format: esm

    const linear = (n) => n;
    const easeInSine = (n) => 1 - Math.cos((n * Math.PI) / 2);
    const easeOutSine = (n) => Math.sin((n * Math.PI) / 2);
    const easeInOutSine = (n) => (1 - Math.cos(n * Math.PI)) / 2;
    const easeInQuad = (n) => n * n;
    const easeOutQuad = (n) => n * (2 - n);
    const easeInOutQuad = (n) => {
        n *= 2;
        if (n < 1) {
            return (n * n) / 2;
        } else {
            --n;
            return (1 + n * (2 - n)) / 2;
        }
    };
    const easeInCubic = (n) => Math.pow(n, 3);
    const easeOutCubic = (n) => {
        --n;
        return Math.pow(n, 3) + 1;
    };
    const easeInOutCubic = (n) => {
        n *= 2;
        if (n < 1) {
            return Math.pow(n, 3) / 2;
        } else {
            n -= 2;
            return (Math.pow(n, 3) + 2) / 2;
        }
    };
    const easeInCircular = (n) => 1 - Math.sqrt(1 - n * n);
    const easeOutCircular = (n) => {
        n--;
        return Math.sqrt(1 - n * n);
    };
    const easeInOutCircular = (n) => {
        n *= 2;
        if (n < 1) {
            return -(Math.sqrt(1 - n * n) - 1) / 2;
        } else {
            n -= 2;
            return (Math.sqrt(1 - n * n) + 1) / 2;
        }
    };
    class Group {
        _items = [];
        get length() {
            return this._items.length;
        }
        clear() {
            this._items.forEach(([tween, _]) => tween.abort());
            this._items.length = 0;
        }
        add(tween) {
            const state = {
                startParams: {},
                finishParams: {},
                duration: 0,
                easingFunc: linear,
                timer: 0,
                isWaitingCallback: false,
            };
            if (!this._beginAnimation(tween, state)) return;
            this._items.push([tween, state]);
        }
        remove(tween) {
            this._items = this._items.filter(([t, _]) => t !== tween);
        }
        update() {
            const items = this._items.slice();
            this._items.length = 0;
            this._items = items
                .filter(([tween, state]) => {
                    if (tween.finished) return false;
                    if (state.isWaitingCallback) return true;
                    ++state.timer;
                    if (state.timer < state.duration) {
                        const n = state.easingFunc(state.timer / state.duration);
                        Object.keys(state.finishParams).forEach((key) => {
                            tween.target[key] =
                                state.startParams[key] + (state.finishParams[key] - state.startParams[key]) * n;
                        });
                    } else {
                        Object.keys(state.finishParams).forEach((key) => {
                            tween.target[key] = state.finishParams[key];
                        });
                    }
                    const result = state.timer < state.duration || this._beginAnimation(tween, state);
                    tween.callUpdateListeners();
                    if (!result) tween.abort();
                    return result;
                })
                .concat(this._items);
        }
        _beginAnimation(tween, state) {
            while (true) {
                const stack = tween.stacks.shift();
                if (!stack) return false;
                switch (stack.type) {
                    case 'call':
                        if (stack.func.length === 0) {
                            stack.func();
                        } else {
                            state.isWaitingCallback = true;
                            stack.func(() => (state.isWaitingCallback = false));
                        }
                        if (state.isWaitingCallback) {
                            return true;
                        } else {
                            break; // loop!
                        }

                    case 'move': {
                        const startParams = {};
                        Object.keys(stack.params).forEach((key) => {
                            startParams[key] = tween.target[key];
                        });
                        state.startParams = startParams;
                        state.finishParams = stack.params;
                        state.duration = stack.duration;
                        state.easingFunc = stack.easingFunc;
                        state.timer = 0;
                        return true;
                    }
                }
            }
        }
    }
    class Tween {
        _target;
        _stacks;
        _group;
        _onUpdateListeners;
        _finished;
        constructor(target, initialParams) {
            this._target = target;
            this._stacks = [];
            this._group = null;
            this._onUpdateListeners = [];
            this._finished = false;
            if (initialParams) {
                Object.keys(initialParams).forEach((key) => {
                    target[key] = initialParams[key];
                });
            }
        }
        get stacks() {
            return this._stacks;
        }
        get target() {
            return this._target;
        }
        get finished() {
            return this._finished;
        }
        group(group) {
            this._group = group;
            return this;
        }
        addUpdateListener(func) {
            this._onUpdateListeners.push(func);
            return this;
        }
        removeUpdateListener(func) {
            this._onUpdateListeners = this._onUpdateListeners.filter((f) => f !== func);
            return this;
        }
        callUpdateListeners() {
            this._onUpdateListeners.forEach((f) => f());
        }
        to(params, duration, easingFunc) {
            this._stacks.push({
                type: 'move',
                params,
                duration,
                easingFunc: easingFunc || linear,
            });
            return this;
        }
        wait(duration) {
            this._stacks.push({
                type: 'move',
                params: {},
                duration,
                easingFunc: linear,
            });
            return this;
        }
        call(func) {
            this._stacks.push({
                type: 'call',
                func,
            });
            return this;
        }
        start() {
            if (!this._group) throw new Error('not grouped');
            this._group.add(this);
            return this;
        }
        abort() {
            this._stacks.length = 0;
            this._finished = true;
            return this;
        }
    }

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_FrameTween';
    }

    function readParameter() {
        PluginManager.parameters(getPluginName());
        return {
            version: '2.2.0',
        };
    }

    const globalGroup = new Group();

    Torigoya.FrameTween = {
        name: getPluginName(),
        parameter: readParameter(),
        Tween,
        Group,
        Easing: {
            linear,
            easeInSine,
            easeOutSine,
            easeInOutSine,
            easeInQuad,
            easeOutQuad,
            easeInOutQuad,
            easeInCubic,
            easeOutCubic,
            easeInOutCubic,
            easeInCircular,
            easeOutCircular,
            easeInOutCircular,
        },
        group: globalGroup,
        create(obj, initParams = {}) {
            return new Tween(obj, initParams).group(globalGroup);
        },
    };

    (() => {
        const upstream_updateScene = SceneManager.updateScene;
        SceneManager.updateScene = function () {
            upstream_updateScene.apply(this);
            if (this._scene) Torigoya.FrameTween.group.update();
        };

        const upstream_terminate = Scene_Base.terminate;
        Scene_Base.prototype.terminate = function () {
            upstream_terminate.apply(this);
            Torigoya.FrameTween.group.clear();
        };

        // Torigoya_Tween.js簡易互換機能
        if (!Torigoya.Tween) {
            Torigoya.Tween = {
                create: Torigoya.FrameTween.create,
                Easing: Torigoya.FrameTween.Easing,
            };
        }
    })();
})();
