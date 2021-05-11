/*---------------------------------------------------------------------------*
 * TorigoyaMZ_ActorEnemy.js v.0.1.1
 *---------------------------------------------------------------------------*
 * 2021/05/12 01:00 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc アクター使用エネミープラグイン (v.0.1.1)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 0.1.1
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_ActorEnemy.js
 * @help
 * アクター使用エネミープラグイン (v.0.1.1)
 * https://torigoya-plugin.rutan.dev
 *
 * ※注意：このプラグインは性質上あらゆるプラグインと競合しやすいです
 * アクターを敵として出現させます。
 * サイドビューバトルでの使用を想定しています。
 *
 * ------------------------------------------------------------
 * ■ 設定方法
 * ------------------------------------------------------------
 * 以下の2つをデータベースで設定する必要があります。
 *
 * ・敵として出現させたい「アクター」
 * ・敵自体の設定をするための「敵キャラ」
 *
 * 敵キャラのメモ欄には以下のように記述してください。
 *
 * ■ 例：10番のアクターを敵キャラとして出現させる
 * <useActor: 10>
 *
 * または
 *
 * <アクターID: 10>
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param callRecoverAll
 * @text 戦闘開始前に敵アクターのHP/MPなどを回復するか？
 * @desc 戦闘開始時に自動的に敵アクターを全回復するか設定します。
 * HP残量などもイベントで操作したい場合はOFFにしてください。
 * @type boolean
 * @parent base
 * @on 回復する
 * @off 回復しない
 * @default true
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_ActorEnemy';
    }

    function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
        return ''.concat(parameter[key] || defaultValue) === 'true';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '0.1.1',
            callRecoverAll: pickBooleanValueFromParameter(parameter, 'callRecoverAll', true),
        };
    }

    Torigoya.ActorEnemy = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // --------------------------------------------------------------------------
        // Utils

        /**
         * 使用しているアクターIDの取得
         * @param battler
         * @returns {number}
         */
        function getActorId(battler) {
            if (battler instanceof Game_Actor) {
                return battler._actorId;
            } else if (battler instanceof Game_Enemy) {
                const useActor = battler.enemy().meta['useActor'] || battler.enemy().meta['アクターID'];
                const id = useActor ? parseInt(useActor, 10) : 0;
                return id && !isNaN(id) ? id : 0;
            } else {
                return 0;
            }
        }

        Torigoya.ActorEnemy.getActorId = getActorId;

        // --------------------------------------------------------------------------
        // Game_ActorEnemy

        class Game_ActorEnemy extends Game_Actor {
            constructor(gameEnemy) {
                super(Torigoya.ActorEnemy.getActorId(gameEnemy));
                this._gameEnemy = gameEnemy;
            }

            enemy() {
                return this._gameEnemy.enemy();
            }

            name() {
                return this.originalName() + (this._gameEnemy._plural ? this._gameEnemy._letter : '');
            }

            originalName() {
                return super.name();
            }

            // 強制オート戦闘
            isAutoBattle() {
                return true;
            }

            // 常に立ちモーションにするため、敵は常時行動未決定にする
            isUndecided() {
                return true;
            }
        }

        Game_ActorEnemy.prototype.isActor = Game_Enemy.prototype.isActor;
        Game_ActorEnemy.prototype.isEnemy = Game_Enemy.prototype.isEnemy;
        Game_ActorEnemy.prototype.friendsUnit = Game_Enemy.prototype.friendsUnit;
        Game_ActorEnemy.prototype.opponentsUnit = Game_Enemy.prototype.opponentsUnit;
        Game_ActorEnemy.prototype.index = Game_Enemy.prototype.index;
        Game_ActorEnemy.prototype.isBattleMember = Game_Enemy.prototype.isBattleMember;

        for (let key of Object.keys(Game_Enemy.prototype)) {
            if (Game_ActorEnemy.prototype[key]) continue;
            Game_ActorEnemy.prototype[key] = function () {
                return this._gameEnemy[key].apply(this._gameEnemy, arguments);
            };
        }

        // 既に生成済みのアクターのプロパティを取り込んだActorEnemyを生成する
        // イベントコマンドで装備変更などを想定
        Game_ActorEnemy.create = function (gameEnemy) {
            const actorEnemy = new Game_ActorEnemy(gameEnemy);

            const original = $gameActors.actor(Torigoya.ActorEnemy.getActorId(gameEnemy));
            const originalProperty = JsonEx.parse(JsonEx.stringify(original));
            Object.keys(originalProperty).forEach((key) => {
                actorEnemy[key] = originalProperty[key];
            });

            // 全回復
            if (Torigoya.ActorEnemy.parameter.callRecoverAll) actorEnemy.recoverAll();

            return actorEnemy;
        };

        Torigoya.ActorEnemy.Game_ActorEnemy = Game_ActorEnemy;

        // --------------------------------------------------------------------------
        // Game_Troop

        const upstream_Game_Troop_setup = Game_Troop.prototype.setup;
        Game_Troop.prototype.setup = function (troopId) {
            upstream_Game_Troop_setup.apply(this, arguments);

            this._enemies = this._enemies.map((enemy) => {
                const actorId = Torigoya.ActorEnemy.getActorId(enemy);
                const en = actorId ? Game_ActorEnemy.create(enemy) : enemy;
                en.setLetter('');
                en.setPlural(false);
                return en;
            });

            // 名前を再設定する
            this._namesCount = {};
            this.makeUniqueNames();
        };

        // --------------------------------------------------------------------------
        // Sprite_ActorEnemy

        class Sprite_ActorEnemy extends Sprite_Actor {
            constructor(gameActorEnemy) {
                super(gameActorEnemy);
                this.setActorHome(-1);
            }

            createMainSprite() {
                super.createMainSprite();
                this._mainSprite.scale.x = -1;
            }

            createWeaponSprite() {
                super.createWeaponSprite();
                this._weaponSprite.x *= -1;
                this._weaponSprite.scale.x = -1;
            }

            startMove(x, y, z) {
                super.startMove(-x, y, z);
            }

            // 敵は最初から画面内にいる
            moveToStartPosition() {
                this.startMove(0, 0, 0);
            }

            setActorHome(_index) {
                this.setHome(this._battler.screenX(), this._battler.screenY());
            }

            updateTargetPosition() {
                if (this.shouldStepForward()) {
                    this.stepForward();
                } else if (!this.inHomePosition()) {
                    this.stepBack();
                }
            }

            damageOffsetX() {
                return -super.damageOffsetX();
            }
        }

        Torigoya.ActorEnemy.Sprite_ActorEnemy = Sprite_ActorEnemy;

        // --------------------------------------------------------------------------
        // Spriteset_Battle

        const upstream_Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
        Spriteset_Battle.prototype.createEnemies = function () {
            upstream_Spriteset_Battle_createEnemies.apply(this);

            this._enemySprites = this._enemySprites
                .map((sprite) => {
                    const battler = sprite._battler;
                    if (battler && battler instanceof Game_ActorEnemy) {
                        this._battleField.removeChild(sprite);
                        return new Sprite_ActorEnemy(battler);
                    }
                    return sprite;
                })
                .sort(this.compareEnemySprite.bind(this))
                .map((sprite) => {
                    this._battleField.addChild(sprite);
                    return sprite;
                });
        };

        // --------------------------------------------------------------------------
        // Window_BattleLog

        // デフォルトでは敵の攻撃アニメーションが表示されないが
        // Game_ActorEnemy の場合はアクターの処理にしたい
        const upstream_Window_BattleLog_showEnemyAttackAnimation = Window_BattleLog.prototype.showEnemyAttackAnimation;
        Window_BattleLog.prototype.showEnemyAttackAnimation = function (subject, targets) {
            if (subject instanceof Game_ActorEnemy) {
                this.showActorAttackAnimation(subject, targets);
            } else {
                upstream_Window_BattleLog_showEnemyAttackAnimation.apply(this);
            }
        };
    })();
})();
