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
import { readParameter } from './_build/TorigoyaMZ_FrameTween_parameter';

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
    const isStarted = this._scene && this._scene.isStarted() && this.isGameActive();
    upstream_updateScene.apply(this);

    if (isStarted) Torigoya.FrameTween.group.update();
  };

  const upstream_onSceneTerminate = SceneManager.onSceneTerminate;
  SceneManager.onSceneTerminate = function () {
    upstream_onSceneTerminate.apply(this);
    Torigoya.FrameTween.group.clear();
  };
})();
