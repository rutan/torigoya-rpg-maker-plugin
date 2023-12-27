function parseVersion(version) {
  return version.split('.', 3).map((n) => parseInt(n || '0', 10));
}

export function isGreaterThanOrEqualVersion(a, b) {
  if (a === b) return true;

  const version1 = parseVersion(a);
  const version2 = parseVersion(b);

  if (version1[0] !== version2[0]) return version1[0] < version2[0];
  if (version1[1] !== version2[1]) return version1[1] < version2[1];
  return version1[2] < version2[2];
}
