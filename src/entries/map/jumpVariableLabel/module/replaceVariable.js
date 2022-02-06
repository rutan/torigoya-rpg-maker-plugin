export function replaceVariable(text) {
  return text.replace(/\\(?:v|V)\[(\d+)]/g, (_, variableId) => {
    return $gameVariables.value(Number(variableId));
  });
}
