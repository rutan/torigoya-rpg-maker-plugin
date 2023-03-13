import { Torigoya } from '../../../../common/Torigoya';

export function convertItemForWindow(achievementItem) {
  if (!achievementItem || !achievementItem.achievement) return null;

  if (achievementItem.unlockInfo) {
    return {
      name: achievementItem.achievement.title,
      iconIndex: achievementItem.achievement.icon,
      description: achievementItem.achievement.description,
      note: '',
      meta: {},
    };
  } else {
    return {
      name: Torigoya.Achievement2.parameter.achievementMenuHiddenTitle,
      iconIndex: Torigoya.Achievement2.parameter.achievementMenuHiddenIcon,
      description: achievementItem.achievement.hint || achievementItem.achievement.description || '',
      note: '',
      meta: {},
    };
  }
}
