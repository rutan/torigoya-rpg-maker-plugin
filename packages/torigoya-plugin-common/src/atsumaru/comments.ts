import { getAtsumaru } from './getAtsumaru.js';

export function pushCommentContextFactor(str: string) {
  const client = getAtsumaru();
  if (!client) return;
  try {
    client.comment.pushContextFactor(str);
  } catch (_) {}
}
