// eslint-disable-next-line no-redundant-type-constituents
export function getAtsumaru(): any | null {
  return (typeof window === 'object' && (window as any).RPGAtsumaru) || null;
}
