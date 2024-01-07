/**
 * ツクールのメモ欄のメタデータ文字列の `<` `>` をデコードする
 * @param string
 */
export function unescapeMetaString(string: string) {
  return `${string || ''}`.trim().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
