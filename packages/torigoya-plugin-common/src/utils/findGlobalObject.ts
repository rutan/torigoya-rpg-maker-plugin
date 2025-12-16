/**
 * 指定名のグローバルなオブジェクトを探索する
 * 例： findGlobalObject('Torigoya.Item') // => window.Torigoya.Item
 * @param objName
 */
// eslint-disable-next-line no-redundant-type-constituents
export function findGlobalObject(objName: any): any | null {
  if (!objName) return null;

  const arr = objName.split('.');
  let scope: any = window;

  for (const name of arr) {
    scope = scope[name];
    if (!scope) return null;
  }

  return scope;
}
