import { Torigoya } from '../../../../common/Torigoya';

export function createCutInContainer() {
  if (this._torigoyaSkillCutIn_cutInContainer) return;
  this._torigoyaSkillCutIn_cutInContainer = new Sprite();

  const layer = Torigoya.SkillCutIn.parameter.cutInLayer;

  if (this._windowLayer && layer !== 'foreground') {
    const windowIndex = this.getChildIndex(this._windowLayer);
    switch (Torigoya.SkillCutIn.parameter.cutInLayer) {
      case 'upperWindow':
        this.addChildAt(this._torigoyaSkillCutIn_cutInContainer, windowIndex + 1);
        break;
      case 'lowerWindow':
        this.addChildAt(this._torigoyaSkillCutIn_cutInContainer, windowIndex);
        break;
      default:
        this.addChild(this._torigoyaSkillCutIn_cutInContainer);
    }
  } else {
    this.addChild(this._torigoyaSkillCutIn_cutInContainer);
  }
}
