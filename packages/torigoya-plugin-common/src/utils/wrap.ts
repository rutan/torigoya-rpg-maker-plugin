/**
 * 既存メンバー関数の置き換え
 * @param target 置き換える対象
 * @param methodName メソッド名
 * @param func
 */
export function wrap<T extends { [P in K]: (this: T, ...args: any[]) => any }, K extends keyof T>(
  target: T,
  methodName: K,
  func: (
    self: T,
    originalFunc: (...params: Parameters<T[K]>) => ReturnType<T[K]>,
    ...args: Parameters<T[K]>
  ) => ReturnType<T[K]>,
) {
  const originalFunc = Object.prototype.hasOwnProperty.call(target, methodName)
    ? target[methodName]
    : (() => {
        const proto = Object.getPrototypeOf(target);
        return function (this: any, ...args: Parameters<T[K]>) {
          return proto[methodName].apply(this, args);
        } as any;
      })();

  target[methodName] = function (this: any, ...args: Parameters<T[K]>) {
    return func.apply(this, [this, originalFunc.bind(this), ...args]);
  } as any;
}
