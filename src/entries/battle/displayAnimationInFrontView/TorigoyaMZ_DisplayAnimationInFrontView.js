import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_DisplayAnimationInFrontView_parameter';

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

    // コマンド欄の有無で位置が変化していたら合わせる
    if (x !== this._statusWindow.x) this.torigoyaSyncActorAndStatusWindowPosition();

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
    for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
      const sprite = this._spriteset._actorSprites[i];
      const rect = this._statusWindow.itemRect(i);
      sprite.setHome(
        this._statusWindow.x + this._statusWindow.padding + rect.x + rect.width / 2,
        this._statusWindow.y + rect.y + rect.height / 2
      );
    }
  };
})();
