import { CutInManager } from './CutInManager';

export function createAndPlayCutInSprite() {
  const klass = CutInManager.detectCutInClass();
  if (!klass) {
    console.error('カットイン用のSpriteクラスが見つかりません');
    CutInManager.clear();
    return;
  }

  this._torigoyaSkillCutIn_cutInSprite = new klass(CutInManager.getParameter());
  this._torigoyaSkillCutIn_cutInSprite.x = Graphics.width / 2;
  this._torigoyaSkillCutIn_cutInSprite.y = Graphics.height / 2;
  this.addChild(this._torigoyaSkillCutIn_cutInSprite);

  this._torigoyaSkillCutIn_cutInSprite.play().then(() => {
    CutInManager.clear();
    this.removeChild(this._torigoyaSkillCutIn_cutInSprite);
    this._torigoyaSkillCutIn_cutInSprite.destroy();
    this._torigoyaSkillCutIn_cutInSprite = null;
  });
}
