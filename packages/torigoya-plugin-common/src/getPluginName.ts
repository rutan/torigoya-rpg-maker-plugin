/**
 * プラグインのファイル名を取得
 */
export function getPluginName() {
  const cs = document.currentScript as any;
  return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : process.env.FILE_NAME || '';
}
