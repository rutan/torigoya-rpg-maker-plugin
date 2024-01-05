import {
  createParamGroup,
  createStringParamArray,
  dd,
  TorigoyaPluginConfigSchema,
} from '@rutan/torigoya-plugin-config';

export const TorigoyaMZ_SmoothValueGauge: Partial<TorigoyaPluginConfigSchema> = {
  target: ['MZ'],
  version: '1.1.1',
  title: {
    ja: 'ゲージ数値アニメーションプラグイン',
  },
  help: {
    ja: dd`
      HPゲージなどの数字を一気に変更するのではなく
      ゲージ本体と同じように徐々に変わるようにします。
      ※それなりに重い処理なのでご注意ください

      -----------------------------
      ■ 上級者向け設定：設定先スプライト名 について
      普通にゲームを作る場合にはいじる必要はありません。
      デフォルトでは Sprite_Gauge が指定されています。

      もし、あなたがプラグインに詳しい人で、
      Sprite_Gauge はいじらずに
      特定の Sprite_Gauge を継承したゲージだけを
      対象にしたいんだ…！という場合は
      ここで設定先を変更することができます。
    `,
  },
  params: [
    ...createParamGroup('advanced', {
      text: {
        ja: '■ 上級者向け設定',
      },
      children: [
        createStringParamArray('advancedTargetClassList', {
          text: {
            ja: '設定先スプライト名',
          },
          description: {
            ja: dd`
              特定のスプライトにのみ適用したい場合に名称を指定してください
            `,
          },
          default: ['Sprite_Gauge'],
        }),
      ],
    }),
  ],
};
