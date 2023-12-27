import {
  Tween,
  Group,
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
} from '@rutan/frame-tween';
import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/Torigoya_FrameTween_parameter';

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

  const upstream_terminate = Scene_Base.prototype.terminate;
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
