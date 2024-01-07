export function isAtsumaru() {
  return typeof window === 'object' && !!(window as any).RPGAtsumaru;
}
