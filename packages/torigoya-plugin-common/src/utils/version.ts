type Version = [number, number, number];
type VersionString = `${number}.${number}.${number}`;

/**
 * プラグインが存在するかチェックする
 * @param pluginObject
 * @param errorMessage
 */
export function checkExistPlugin(pluginObject: any, errorMessage: string) {
  if (typeof pluginObject !== 'undefined') return;
  alert(errorMessage);
  throw new Error(errorMessage);
}

/**
 * プラグインのバージョンをチェックする
 * @param version
 * @param requireVersion
 * @param errorMessage
 */
export function checkPluginVersion(
  version: VersionString | undefined,
  requireVersion: VersionString,
  errorMessage: string,
) {
  if (isVersionString(version) && isGreaterThanOrEqualVersion(requireVersion, version)) return;
  alert(errorMessage);
  throw new Error(errorMessage);
}

/**
 * x.y.z 形式のバージョン文字列かどうか判定する
 * @param version
 */
export function isVersionString(version: unknown): version is VersionString {
  if (typeof version !== 'string') return false;
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * x.y.z 形式のバージョン文字列を分解する
 * @param version
 */
export function parseVersion(version: VersionString): Version {
  if (!isVersionString(version)) throw new Error(`invalid version: ${version}`);
  return version.split('.', 3).map((n) => parseInt(n || '0', 10)) as Version;
}

/**
 * b のバージョンが a 以上であるか判定する（a <= b）
 * @param a
 * @param b
 */
export function isGreaterThanOrEqualVersion(a: VersionString, b: VersionString) {
  if (a === b) return true;

  const version1 = parseVersion(a);
  const version2 = parseVersion(b);

  if (version1[0] !== version2[0]) return version1[0] < version2[0];
  if (version1[1] !== version2[1]) return version1[1] < version2[1];

  return version1[2] < version2[2];
}
