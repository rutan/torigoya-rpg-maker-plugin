export function evalCondition(a, code) {
  try {
    return !!eval(code);
  } catch (e) {
    if ($gameTemp.isPlaytest()) console.error(e);
    return false;
  }
}
