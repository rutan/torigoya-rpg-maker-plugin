import { getAtsumaru } from './getAtsumaru';

export function pushCommentContextFactor(str) {
  const client = getAtsumaru();
  if (!client) return;
  try {
    client.comment.pushContextFactor(str);
  } catch (_) {}
}
