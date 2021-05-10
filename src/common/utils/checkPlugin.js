import { isGreaterThanOrEqualVersion } from './checkVersion';

export function checkExistPlugin(pluginObject, errorMessage) {
  if (typeof pluginObject !== 'undefined') return;
  alert(errorMessage);
  throw new Error(errorMessage);
}

export function checkPluginVersion(version, requireVersion, errorMessage) {
  if (typeof version === 'string' && isGreaterThanOrEqualVersion(requireVersion, version)) return;
  alert(errorMessage);
  throw new Error(errorMessage);
}
