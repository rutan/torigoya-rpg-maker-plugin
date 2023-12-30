import { CutInManager } from './CutInManager';

export function applyPluginToSpritesetBattle() {
  const upstream_Spriteset_Battle_isEffecting = Spriteset_Battle.prototype.isEffecting;
  Spriteset_Battle.prototype.isEffecting = function () {
    return upstream_Spriteset_Battle_isEffecting.apply(this) || CutInManager.isPlaying();
  };
}
