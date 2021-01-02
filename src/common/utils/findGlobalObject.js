/**
 * 指定名のグローバルなオブジェクトを探索する
 * @param objName
 * @returns {null|any}
 */
export function findGlobalObject(objName) {
  if (!objName) return null;
  const arr = objName.split('.');
  let scope = window;
  for (const name of arr) {
    scope = scope[name];
    if (!scope) return null;
  }
  return scope;
}
