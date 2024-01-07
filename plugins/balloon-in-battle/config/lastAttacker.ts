import { dd, TorigoyaPluginConfigSchema } from '@rutan/torigoya-plugin-config';

export const TorigoyaMZ_BalloonInBattle2_AddonLastAttacker: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  version: '1.0.0',
  title: {
    ja: '戦闘中セリフ表示プラグインアドオン: 勝利セリフをトドメキャラに',
  },
  help: {
    ja: dd`
      このプラグインは「戦闘中セリフ表示プラグイン」のアドオンです。
      戦闘中セリフ表示プラグインより下に入れてください。

      勝利セリフをトドメを刺したキャラがしゃべるようにします。
      トドメを刺したキャラにセリフが設定されていない場合は
      通常通りランダムにキャラが選択されます。

      このアドオンプラグインには、設定項目はありません。
    `,
  },
  base: ['TorigoyaMZ_BalloonInBattle2'],
  orderAfter: ['TorigoyaMZ_BalloonInBattle2'],
};
