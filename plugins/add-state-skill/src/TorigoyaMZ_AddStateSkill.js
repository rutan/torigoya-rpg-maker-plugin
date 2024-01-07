import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_AddStateSkill_parameter';
import { applyPlugin } from './modules/applyPlugin';

Torigoya.AddStateSkill = {
  name: getPluginName(),
  parameter: readParameter(),
};

applyPlugin();
