export function unescapeMetaString(string) {
  return `${string || ''}`.trim().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
