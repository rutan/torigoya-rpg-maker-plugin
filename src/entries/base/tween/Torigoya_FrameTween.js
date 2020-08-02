import { Tween, Group } from '@rutan/frame-tween';
import * as Easing from '@rutan/frame-tween/esm/Easing';
import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_FrameTween_parameter';

Torigoya.FrameTween = {
  name: getPluginName(),
  parameter: readParameter(),
  Tween,
  Group,
  Easing,
  group: Tween._globalGroup,
  create: Tween.create,
};

(() => {
  const upstream_updateScene = SceneManager.updateScene;
  SceneManager.updateScene = function () {
    upstream_updateScene.apply(this);
    if (this._scene) Torigoya.FrameTween.group.update();
  };

  // Torigoya_Tween.js簡易互換機能
  if (!Torigoya.Tween) {
    Torigoya.Tween = {
      create: Torigoya.FrameTween.create,
      Easing: Torigoya.FrameTween.Easing,
    };
  }
})();
