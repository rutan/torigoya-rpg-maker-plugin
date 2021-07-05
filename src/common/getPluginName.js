export function getPluginName() {
  const cs = document.currentScript;
  return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : __entryFileName;
}
