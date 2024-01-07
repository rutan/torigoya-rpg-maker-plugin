export function easingBounce(n) {
  const s = 1.70158;
  const t2 = n - 1;
  return t2 * t2 * ((s + 1) * t2 + s) + 1;
}
