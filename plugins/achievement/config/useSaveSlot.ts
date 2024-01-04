import { TorigoyaPluginConfigSchema } from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.0.0',
  title: {
    ja: '実績プラグインアドオン: セーブ別実績',
  },
  help: {
    ja: dedent`
      このプラグインは「実績プラグイン」のアドオンです。
      実績プラグインより下に導入してください。

      実績をセーブ別に保存するようにします。
      このプラグインに設定項目はありません。

      【注意】
      このアドオンを有効にすると、タイトル画面での実績表示は正常に動きません。
      実績プラグインの設定で、タイトル画面でのメニュー表示をOFFにしてください。
    `,
  },
  base: ['TorigoyaMZ_Achievement2'],
  orderAfter: ['TorigoyaMZ_Achievement2'],
};

export const Torigoya_Achievement2_AddonUseSaveSlot: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
};

export const TorigoyaMZ_Achievement2_AddonUseSaveSlot: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
};
