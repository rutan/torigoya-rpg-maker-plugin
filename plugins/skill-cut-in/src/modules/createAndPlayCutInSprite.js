import { CutInManager } from './CutInManager';

export function createAndPlayCutInSprite() {
  const klass = CutInManager.detectCutInClass();
  if (!klass) {
    console.error('カットイン用のSpriteクラスが見つかりません');
    CutInManager.clear();
    return;
  }

  const parent = this._torigoyaSkillCutIn_cutInContainer || this;

  this._torigoyaSkillCutIn_cutInSprite = new klass(CutInManager.getParameter());
  this._torigoyaSkillCutIn_cutInSprite.x = Graphics.width / 2;
  this._torigoyaSkillCutIn_cutInSprite.y = Graphics.height / 2;
  parent.addChild(this._torigoyaSkillCutIn_cutInSprite);

  this._torigoyaSkillCutIn_cutInSprite.play().then(() => {
    CutInManager.clear();
    parent.removeChild(this._torigoyaSkillCutIn_cutInSprite);
    this._torigoyaSkillCutIn_cutInSprite.destroy();
    this._torigoyaSkillCutIn_cutInSprite = null;
  });
}
