/*---------------------------------------------------------------------------*
 * TorigoyaMZ_QuickSkill.js v.1.1.2
 *---------------------------------------------------------------------------*
 * Build Date: 2026/05/07 13:52:32 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc ターン消費なしスキルプラグイン (v.1.1.2)
 * @version 1.1.2
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_QuickSkill.js
 *
 * @help ターン消費なしスキルプラグイン (v.1.1.2)
 * https://torigoya-plugin.rutan.dev
 *
 * 選択するとターンを消費せずに即発動するスキルを追加します。
 * このプラグインは「ターン制」の戦闘システムでのみ動作します。
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 * スキルのメモ欄に以下のように記述してください。
 *
 * <QuickSkill>
 *
 * もしくは
 *
 * <ターン消費なし>
 *
 * ------------------------------------------------------------
 * ■ おやくそく
 * ------------------------------------------------------------
 * ・ターン消費なしスキルは味方専用です。敵は使えません
 * ・複雑なことをするとおかしくなる可能性があります（特にコモンイベント）
 *
 * @param advanced
 * @text ■ 上級者向け設定
 * @type string
 *
 * @param reCalcActionTime
 * @text 行動回数の再計算
 * @desc ターン消費なしスキル後に行動回数の再計算を行う対象。
 * 行動回数が増えるステートを扱う場合は設定してください。
 * @parent advanced
 * @type select
 * @option なし
 * @value none
 * @option 使用者のみ
 * @value self
 * @option パーティ全員
 * @value party
 * @default none
 */

(function () {
    'use strict';

    /**
     * 既存メンバー関数の置き換え
     * @param target 置き換える対象
     * @param methodName メソッド名
     * @param func
     */
    function wrap(target, methodName, func) {
        const originalFunc = Object.prototype.hasOwnProperty.call(target, methodName)
            ? target[methodName]
            : (() => {
                  const proto = Object.getPrototypeOf(target);
                  return function (...args) {
                      return proto[methodName].apply(this, args);
                  };
              })();
        target[methodName] = function (...args) {
            return func.apply(this, [this, originalFunc.bind(this), ...args]);
        };
    }

    /**
     * プラグインのファイル名を取得
     */
    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_QuickSkill';
    }

    function parseStringParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        return String(value);
    }

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function readParameter() {
        const parameters = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.2',
            advanced: parseStringParam(parameters['advanced'], ''),
            reCalcActionTime: parseStringParam(parameters['reCalcActionTime'], 'none'),
        };
    }

    Torigoya.QuickSkill = {
        name: getPluginName(),
        parameter: readParameter(),

        // 現在行動中のバトラー
        originalSubject: null,

        // ターン消費なし強制行動中フラグ
        isForcedActionInQuickSkill: false,

        // ターン消費なし強制行動用の行動バックアップ
        backupActions: new WeakMap(),
    };

    Torigoya.QuickSkill.isBattleEnd = function () {
        return $gameParty.isEmpty() || $gameParty.isAllDead() || $gameTroop.isAllDead();
    };

    const isQuickSkill = (item) => {
        return item && (item.meta['QuickSkill'] || item.meta['ターン消費なし'] || item.meta['ターン消費無し']);
    };

    (() => {
        // -------------------------------------------------------------------------
        // Game_Actor

        wrap(Game_Actor.prototype, 'forceAction', function (self, originalFunc, skillId, targetIndex) {
            if (BattleManager._phase === 'torigoya_quickSkill') {
                Torigoya.QuickSkill.backupActions.set(self, self._actions);
            }
            originalFunc(skillId, targetIndex);
        });

        wrap(Game_Actor.prototype, 'removeCurrentAction', function (self, originalFunc) {
            if (Torigoya.QuickSkill.originalSubject) {
                self.torigoyaQuickSkill_moveActionToLast(0);
            } else if (Torigoya.QuickSkill.isForcedActionInQuickSkill) {
                const actions = Torigoya.QuickSkill.backupActions.get(self);
                if (actions) self._actions = actions;
                Torigoya.QuickSkill.backupActions.delete(self);
            } else {
                originalFunc();
            }
        });

        Game_Actor.prototype.torigoyaQuickSkill_moveActionToFirst = function (index) {
            this._actions.unshift(this._actions.splice(index, 1)[0]);
        };

        Game_Actor.prototype.torigoyaQuickSkill_moveActionToLast = function (index) {
            this._actions.push(this._actions.splice(index, 1)[0]);
        };

        Game_Actor.prototype.torigoyaQuickSkill_removeQuickSkillAction = function () {
            this._actions.forEach((action) => {
                const item = action.item();
                if (!isQuickSkill(item)) return;
                action.clear();
            });
        };

        Game_Actor.prototype.torigoyaQuickSkill_reCalcActionTime = function () {
            const actionTimes = this.makeActionTimes();
            for (let i = this._actions.length; i < actionTimes; i++) {
                this._actions.push(new Game_Action(this));
            }
        };

        Game_Actor.prototype.torigoyaQuickSkill_searchEmptyActionIndex = function () {
            for (let i = 0; i < this._actions.length; i++) {
                const action = this._actions[i];
                if (action.item()) continue;
                this._actionInputIndex = i;
                return true;
            }
            return false;
        };

        // -------------------------------------------------------------------------
        // BattleManager

        const upstream_BattleManager_selectNextCommand = BattleManager.selectNextCommand;
        BattleManager.selectNextCommand = function () {
            if (this.torigoyaQuickSkill_checkHasQuickSkill(this._currentActor)) return;
            upstream_BattleManager_selectNextCommand.apply(this);
        };

        const upstream_BattleManager_setup = BattleManager.setup;
        BattleManager.setup = function (troopId, canEscape, canLose) {
            upstream_BattleManager_setup.apply(this, arguments);
            Torigoya.QuickSkill.originalSubject = null;
            Torigoya.QuickSkill.isForcedActionInQuickSkill = false;
            Torigoya.QuickSkill.backupActions = new WeakMap();
        };

        const upstream_BattleManager_updateEvent = BattleManager.updateEvent;
        BattleManager.updateEvent = function () {
            switch (this._phase) {
                case 'turn': {
                    if (Torigoya.QuickSkill.isForcedActionInQuickSkill) {
                        this._phase = 'torigoya_quickSkill';
                        Torigoya.QuickSkill.isForcedActionInQuickSkill = false;
                    }
                    break;
                }
                case 'torigoya_quickSkill': {
                    if (Torigoya.QuickSkill.isBattleEnd()) {
                        this._phase = 'turn';
                    } else {
                        // 強制行動が設定されていたら実行する
                        // ※コモンイベントより前に実行すること
                        if (this.isActionForced()) {
                            Torigoya.QuickSkill.isForcedActionInQuickSkill = true;
                            this.processForcedAction();
                            return true;
                        }

                        // ターン消費無しスキル中に積まれた
                        // コモンイベントが実行中であれば中断
                        if (this.updateEventMain()) return true;

                        const members = $gameParty.battleMembers();

                        // 行動回数の再計算
                        switch (Torigoya.QuickSkill.parameter.reCalcActionTime) {
                            case 'party':
                                members.forEach(function (member) {
                                    member.torigoyaQuickSkill_reCalcActionTime();
                                });
                                break;
                            case 'self':
                                if (this._currentActor) this._currentActor.torigoyaQuickSkill_reCalcActionTime();
                                break;
                        }

                        // 戦闘不能から生き返ったキャラ等は行動回数が0のままになっているため再計算する
                        members.forEach((member) => {
                            if (member.canInput() && member.numActions() === 0) {
                                member.torigoyaQuickSkill_reCalcActionTime();
                            }
                        });

                        // コモンイベント等でフェーズが切り替わっていなければ
                        // ターン消費なしスキルの終了処理を実行する
                        if (this._phase === 'torigoya_quickSkill') {
                            this._phase = 'input';

                            if (this.torigoyaQuickSkill_detectNextActor()) {
                                this.startActorInput();
                            } else {
                                // 次のアクターがいない場合は、直ちにターンを開始する
                                this.startTurn();
                            }
                        }
                    }

                    break;
                }
            }
            return upstream_BattleManager_updateEvent.apply(this);
        };

        const upstream_BattleManager_endAction = BattleManager.endAction;
        BattleManager.endAction = function () {
            upstream_BattleManager_endAction.apply(this);

            if (Torigoya.QuickSkill.originalSubject) {
                this._phase = 'torigoya_quickSkill';

                // action内のターン消費なしスキルを削除する
                if (this._subject) {
                    this._subject.torigoyaQuickSkill_removeQuickSkillAction();
                }

                Torigoya.QuickSkill.originalSubject = null;
                this._subject = null;
            }
        };

        // ターン消費なしスキルの開始処理
        BattleManager.torigoyaQuickSkill_checkHasQuickSkill = function (actor) {
            if (BattleManager.isTpb()) return false;
            if (!actor) return false;

            for (let i = 0; i < actor.numActions(); ++i) {
                const action = actor.action(i);
                const item = action.item();
                if (!item) continue;
                if (!isQuickSkill(item)) continue;

                this._inputting = false;
                actor.torigoyaQuickSkill_moveActionToFirst(i);
                Torigoya.QuickSkill.originalSubject = actor;
                BattleManager._subject = actor;
                BattleManager.processTurn();
                $gameTroop._interpreter.setupReservedCommonEvent();

                return true;
            }

            return false;
        };

        // パーティの先頭から行動に空きがあるアクターを探して設定する
        BattleManager.torigoyaQuickSkill_detectNextActor = function () {
            const members = $gameParty.battleMembers();
            let result = false;

            for (let i = 0; i < members.length; ++i) {
                const member = members[i];
                if (result) {
                    member.setActionState('undecided');
                } else if (member.canInput() && member.torigoyaQuickSkill_searchEmptyActionIndex()) {
                    if (member !== this._currentActor) {
                        this.finishActorInput();
                    }

                    result = true;
                    this._currentActor = member;
                } else {
                    member.setActionState('waiting');
                }
            }

            return result;
        };
    })();
})();
