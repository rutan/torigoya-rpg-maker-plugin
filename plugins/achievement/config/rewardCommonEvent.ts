import { dd, TorigoyaPluginConfigSchema } from '@rutan/torigoya-plugin-config';

const base: Partial<TorigoyaPluginConfigSchema> = {
  version: '1.0.0',
  title: {
    ja: '実績プラグインアドオン: ご褒美コモンイベント',
  },
  help: {
    ja: dd`
      このプラグインは「実績プラグイン」のアドオンです。
      実績プラグインより下に導入してください。

      獲得した実績を選択することで、
      コモンイベントを実行できるようにします。

      ------------------------------------------------------------
      ■ 注意
      ------------------------------------------------------------
      ・コモンイベントの実行はゲーム内での実績画面でのみ動作します
      　タイトル画面から呼び出される実績画面では動きません

      ・動作としては「アイテム」の効果に
      　「コモンイベント」を設定したときと同様の動作をします。
      　つまり、一度メニューを閉じてコモンイベントが動作します。

      ------------------------------------------------------------
      ■ 設定方法
      ------------------------------------------------------------
      設定はこのプラグイン内ではなく「実績プラグイン」側で行います。

      コモンイベントを設定した実績の「メモ」欄に
      以下のように記述してください。

      <コモンイベント: 1>

      もしくは

      <CommonEvent: 1>

      「1」の部分には呼び出したいコモンイベントのIDを指定してください。

      ------------------------------------------------------------
      ■ 上級者向けの使い方
      ------------------------------------------------------------
      このプラグインを導入すると、「スクリプト」内で以下の方法で
      「最後に選択（コモンイベントを呼び出した）した実績」を獲得できます。

      Torigoya.Achievement2.Addons.RewardEvent.lastItem

      この中には以下のようなフォーマットでデータが格納されます。

      {
        "key": "実績のID",
        "title": "実績の名前",
        "description": "実績の説明文",
        "hint": "実績のヒント",
        "icon": 123,        // アイコンのID
        "isSecret": false   // 実績が秘密であるか？
      }

      ▼ 例：最後に選択した実績の名前を取得する
      Torigoya.Achievement2.Addons.RewardEvent.lastItem.title
    `,
  },
  base: ['TorigoyaMZ_Achievement2'],
  orderAfter: ['TorigoyaMZ_Achievement2'],
};

export const Torigoya_Achievement2_AddonRewardEvent: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MV'],
  ...base,
};

export const TorigoyaMZ_Achievement2_AddonRewardEvent: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  ...base,
};
