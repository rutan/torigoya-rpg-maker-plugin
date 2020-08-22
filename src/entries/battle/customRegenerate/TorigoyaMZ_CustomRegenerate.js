import { Torigoya } from '../../../common/Torigoya';
import { getPluginName } from '../../../common/getPluginName';
import { readParameter } from './_build/TorigoyaMZ_CustomRegenerate_parameter';
import {
  applyCustomRegenerateHp,
  applyCustomRegenerateMp,
  applyCustomRegenerateTp,
} from './modules/applyCustomRegenerate';

Torigoya.CustomRegenerate = {
  name: getPluginName(),
  parameter: readParameter(),
};

if (Torigoya.CustomRegenerate.parameter.advancedNoteTagHp) {
  applyCustomRegenerateHp(Torigoya.CustomRegenerate.parameter.advancedNoteTagHp);
}
if (Torigoya.CustomRegenerate.parameter.advancedNoteTagMp) {
  applyCustomRegenerateMp(Torigoya.CustomRegenerate.parameter.advancedNoteTagMp);
}
if (Torigoya.CustomRegenerate.parameter.advancedNoteTagTp) {
  applyCustomRegenerateTp(Torigoya.CustomRegenerate.parameter.advancedNoteTagTp);
}
