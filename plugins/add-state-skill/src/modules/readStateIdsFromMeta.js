export function readStateIdsFromMeta(str) {
  if (!str) return [];
  return str
    .split(/\s*,\s*/)
    .filter(Boolean)
    .map((s) => parseInt(s, 10));
}
