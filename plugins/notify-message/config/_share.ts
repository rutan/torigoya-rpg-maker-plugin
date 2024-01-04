import { createFileParam, createNumberParam, createStruct, defineLabel } from '@rutan/torigoya-plugin-config';
import dedent from 'dedent';

export const structSound = createStruct('Sound', [
  createFileParam('name', {
    ...defineLabel({
      ja: {
        text: '効果音ファイル名',
        description: dedent`
          通知表示時に再生する効果音ファイル
          空っぽの場合は効果音なしになります
        `,
      },
    }),
    dir: 'audio/se',
  }),
  createNumberParam('volume', {
    ...defineLabel({
      ja: {
        text: '効果音の音量',
        description: dedent`
          通知表示時に再生する効果音の音量（%）
        `,
      },
    }),
    min: 0,
    max: 100,
    default: 90,
  }),
  createNumberParam('pitch', {
    ...defineLabel({
      ja: {
        text: '効果音のピッチ',
        description: dedent`
          通知表示時に再生する効果音のピッチ（%）
        `,
      },
    }),
    min: 0,
    max: 200,
    default: 100,
  }),
  createNumberParam('pan', {
    ...defineLabel({
      ja: {
        text: '効果音の位相',
        description: dedent`
          通知表示時に再生する効果音の位相
        `,
      },
    }),
    min: -100,
    max: 100,
    default: 0,
  }),
]);
