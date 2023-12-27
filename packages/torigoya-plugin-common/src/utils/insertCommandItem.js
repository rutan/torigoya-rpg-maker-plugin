export function insertCommandToBefore(commandWindow, targetSymbol, name, symbol, enabled = true, ext = null) {
  const item = { name: name, symbol: symbol, enabled: enabled, ext: ext };
  const index = commandWindow._list.findIndex(({ symbol }) => symbol === targetSymbol);
  if (index === -1) return;
  commandWindow._list.splice(index, 0, item);
}

export function insertCommandToAfter(commandWindow, targetSymbol, name, symbol, enabled = true, ext = null) {
  const item = { name: name, symbol: symbol, enabled: enabled, ext: ext };
  const index = commandWindow._list.findIndex(({ symbol }) => symbol === targetSymbol);
  if (index === -1) return;
  commandWindow._list.splice(index + 1, 0, item);
}
