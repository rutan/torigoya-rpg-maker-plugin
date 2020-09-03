import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_AddStateSkill_parameter';
import { applyPlugin } from './modules/applyPlugin';

Torigoya.AddStateSkill = {
  name: getPluginName(),
  parameter: readParameter(),
};

applyPlugin();
