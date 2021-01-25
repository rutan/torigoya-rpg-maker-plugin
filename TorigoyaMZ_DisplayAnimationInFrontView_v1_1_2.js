/*---------------------------------------------------------------------------*
 * TorigoyaMZ_DisplayAnimationInFrontView.js v.1.1.2
 *---------------------------------------------------------------------------*
 * 2021/01/26 01:30 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc フロントビューで味方側にも戦闘アニメを表示プラグイン (v.1.1.2)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.1.2
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_DisplayAnimationInFrontView.js
 * @orderAfter TorigoyaMZ_BalloonInBattle2
 * @help
 * フロントビューで味方側にも戦闘アニメを表示プラグイン (v.1.1.2)
 * https://torigoya-plugin.rutan.dev
 *
 * RPGツクールMZのフロントビューにおいて、
 * 敵から味方への攻撃等では戦闘アニメが表示されません。
 * このプラグインはサイドビューの処理の一部を
 * フロントビューでも動作させることで、
 * 戦闘アニメが表示されるようにします。
 *
 * ------------------------------------------------------------
 * ■ このプラグインの制約
 * ------------------------------------------------------------
 * このプラグインは一部処理の関係上、以下の副作用があります。
 * ご了承ください。
 *
 * ・戦闘アニメ＆味方のダメージ数字が、ウィンドウより上に表示されるようになる
 *
 * ステータスウィンドウの上に戦闘アニメをかぶせるため、
 * 各種ウィンドウより手前に各種エフェクトが表示されるようになります。
 *
 * ・戦闘アニメが「画面の色調変更」の影響を受けなくなる
 *
 * 戦闘アニメの表示レイヤーを変更しているため、
 * イベントコマンド「画面の色調変更」の影響を受けません。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_DisplayAnimationInFrontView';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.2',
        };
    }

    Torigoya.DisplayAnimationInFrontView = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // Game_Actor

        // フロントビュー/サイドビュー問わず使用するようにする
        Game_Actor.prototype.isSpriteVisible = function () {
            return true;
        };

        // -------------------------------------------------------------------------
        // Sprite_Actor

        const upstream_Sprite_Actor_createWeaponSprite = Sprite_Actor.prototype.createWeaponSprite;
        Sprite_Actor.prototype.createWeaponSprite = function () {
            upstream_Sprite_Actor_createWeaponSprite.apply(this);

            if (!$gameSystem.isSideView()) {
                this._weaponSprite.visible = false;
            }
        };

        const upstream_Sprite_Actor_createStateSprite = Sprite_Actor.prototype.createStateSprite;
        Sprite_Actor.prototype.createStateSprite = function () {
            upstream_Sprite_Actor_createStateSprite.apply(this);
            if (!$gameSystem.isSideView()) {
                this._stateSprite.visible = false;
            }
        };

        const upstream_Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
        Sprite_Actor.prototype.updateFrame = function () {
            if ($gameSystem.isSideView()) {
                upstream_Sprite_Actor_updateFrame.apply(this);
            } else {
                this._mainSprite.visible = false;
            }
        };

        const upstream_Sprite_Actor_updateShadow = Sprite_Actor.prototype.updateShadow;
        Sprite_Actor.prototype.updateShadow = function () {
            if ($gameSystem.isSideView()) {
                upstream_Sprite_Actor_updateShadow.apply(this);
            } else {
                this._shadowSprite.visible = false;
            }
        };

        const upstream_Sprite_Actor_shouldStepForward = Sprite_Actor.prototype.shouldStepForward;
        Sprite_Actor.prototype.shouldStepForward = function () {
            // フロントビューの場合は前に踏み出さない
            if (!$gameSystem.isSideView()) return;

            return upstream_Sprite_Actor_shouldStepForward.apply(this);
        };

        const upstream_Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
        Sprite_Actor.prototype.setActorHome = function (index) {
            // フロントビューの場合はホーム位置を自動設定させない
            if (!$gameSystem.isSideView()) return;

            upstream_Sprite_Actor_setActorHome.apply(this, arguments);
        };

        const upstream_Sprite_Actor_damageOffsetX = Sprite_Actor.prototype.damageOffsetX;
        Sprite_Actor.prototype.damageOffsetX = function () {
            if ($gameSystem.isSideView()) {
                return upstream_Sprite_Actor_damageOffsetX.apply(this);
            } else {
                // サイドビュー用のダメージ位置は横に少しズラされているため
                // 敵と同様に位置がズレていない状態にする
                return Sprite_Battler.prototype.damageOffsetX.call(this);
            }
        };

        const upstream_Sprite_Actor_createDamageSprite = Sprite_Actor.prototype.createDamageSprite;
        Sprite_Actor.prototype.createDamageSprite = function () {
            upstream_Sprite_Actor_createDamageSprite.apply(this);
            const last = this._damages[this._damages.length - 1];
            if (last) last.visible = this.visible;
        };

        // -------------------------------------------------------------------------
        // Sprite_AnimationMV

        const upstream_Sprite_AnimationMV_updatePosition = Sprite_AnimationMV.prototype.updatePosition;
        Sprite_AnimationMV.prototype.updatePosition = function () {
            upstream_Sprite_AnimationMV_updatePosition.apply(this);

            if (!$gameSystem.isSideView()) {
                if (this._animation.position === 3) {
                    this.x = Graphics.width / 2;

                    const target = this._targets[0];
                    if (target && target instanceof Sprite_Actor) {
                        this.y = target.y;
                    } else {
                        this.y = Graphics.height / 2;
                    }
                }
            }
        };

        // -------------------------------------------------------------------------
        // Spriteset_Battle

        const upstream_Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;
        Spriteset_Battle.prototype.createActors = function () {
            upstream_Spriteset_Battle_createActors.apply(this);

            if (!$gameSystem.isSideView()) {
                this._actorSprites = [];
                for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
                    const sprite = new Sprite_Actor();
                    this._actorSprites.push(sprite);
                }
            }
        };

        const upstream_Spriteset_Battle_createBattleField = Spriteset_Battle.prototype.createBattleField;
        Spriteset_Battle.prototype.createBattleField = function () {
            upstream_Spriteset_Battle_createBattleField.apply(this);

            if (!$gameSystem.isSideView()) {
                // エフェクトレイヤーを最前面に変更するため
                // battleFieldから剥がす
                this._effectsContainer = new Sprite();
            }
        };

        // -------------------------------------------------------------------------
        // Window_BattleStatus

        const upstream_Window_BattleStatus_refresh = Window_BattleStatus.prototype.refresh;
        Window_BattleStatus.prototype.refresh = function () {
            this._torigoyaDisplayAnimationFrontView_requireSyncPosition = true;
            upstream_Window_BattleStatus_refresh.apply(this);
        };

        Window_BattleStatus.prototype.torigoyaDisplayAnimationFrontView_isRequireSyncPosition = function () {
            return !!this._torigoyaDisplayAnimationFrontView_requireSyncPosition;
        };

        Window_BattleStatus.prototype.torigoyaDisplayAnimationFrontView_clearRequireSyncPosition = function () {
            this._torigoyaDisplayAnimationFrontView_requireSyncPosition = false;
        };

        // -------------------------------------------------------------------------
        // Scene_Battle

        const upstream_Scene_Battle_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
        Scene_Battle.prototype.createStatusWindow = function () {
            upstream_Scene_Battle_createStatusWindow.apply(this);

            // アクターとエフェクトレイヤーを最前面へ
            if (!$gameSystem.isSideView()) {
                this._spriteset._actorSprites.forEach((sprite) => {
                    this.addChild(sprite);
                });
                this.addChild(this._spriteset._effectsContainer);

                // for TorigoyaMZ_BalloonInBattle2
                if (this._torigoyaBalloonInBattle_actorBalloonLayer) {
                    this.addChild(this._torigoyaBalloonInBattle_actorBalloonLayer);
                }
            }
        };

        const upstream_Scene_Battle_updateStatusWindowPosition = Scene_Battle.prototype.updateStatusWindowPosition;
        Scene_Battle.prototype.updateStatusWindowPosition = function () {
            const x = this._statusWindow.x;
            upstream_Scene_Battle_updateStatusWindowPosition.apply(this);

            if ($gameSystem.isSideView()) return;

            // ウィンドウが再描画されている or コマンド欄の有無でX座標が変化している場合、位置を合わせる
            if (
                this._statusWindow.torigoyaDisplayAnimationFrontView_isRequireSyncPosition() ||
                x !== this._statusWindow.x
            ) {
                this.torigoyaSyncActorAndStatusWindowPosition();
                this._statusWindow.torigoyaDisplayAnimationFrontView_clearRequireSyncPosition();
            }

            // タイムプログレス(アクティブ)の場合、
            // コマンド選択中にアクターの表示状態をあわせる
            this._spriteset._actorSprites.forEach((sprite) => (sprite.visible = this._statusWindow.visible));

            // for TorigoyaMZ_BalloonInBattle2
            if (this._torigoyaBalloonInBattle_actorBalloonLayer) {
                this._torigoyaBalloonInBattle_actorBalloonLayer.visible =
                    this._statusWindow.visible && !this._statusWindow.isClosed();
            }
        };

        // 独自処理
        Scene_Battle.prototype.torigoyaSyncActorAndStatusWindowPosition = function () {
            const baseX = (Graphics.width - Graphics.boxWidth) / 2;
            const baseY = (Graphics.height - Graphics.boxHeight) / 2;
            for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
                const sprite = this._spriteset._actorSprites[i];
                const rect = this._statusWindow.itemRect(i);
                sprite.setHome(
                    baseX + this._statusWindow.x + this._statusWindow.padding + rect.x + rect.width / 2,
                    baseY + this._statusWindow.y + rect.y + rect.height / 2
                );
            }
        };
    })();
})();
