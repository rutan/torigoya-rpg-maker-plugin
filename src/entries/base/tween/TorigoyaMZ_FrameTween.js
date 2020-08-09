import { Tween, Group } from '@rutan/frame-tween';
import * as Easing from '@rutan/frame-tween/esm/Easing';
import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_FrameTween_parameter';

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
    const isStarted = this._scene && this._scene.isStarted() && this.isGameActive();
    upstream_updateScene.apply(this);

    if (isStarted) Torigoya.FrameTween.group.update();
  };
})();
