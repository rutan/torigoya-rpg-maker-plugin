export function getAtsumaru() {
  return (typeof window === 'object' && window.RPGAtsumaru) || null;
}
