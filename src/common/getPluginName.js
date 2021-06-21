export function getPluginName() {
  const cs = document.currentScript;
  const match = cs && cs.src.match(/\/js\/plugins\/(.+)\.js$/);
  return match ? match[1] : __entryFileName;
}
