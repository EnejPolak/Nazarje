export type LeafAnim = 'falling' | 'falling2' | 'falling3';

export type LeafConfig = {
  left: string;
  startX: string;
  driftX: string;
  duration: string;
  delay: string;
  anim: LeafAnim;
};

export function buildLeafConfigs(count: number): LeafConfig[] {
  return Array.from({ length: count }, () => ({
    left: `${3 + Math.random() * 92}%`,
    startX: `${-40 + Math.random() * 80}px`,
    driftX: `${-240 + Math.random() * 480}px`,
    duration: `${8 + Math.random() * 5}s`,
    delay: `${Math.random() * 9}s`,
    anim: (['falling', 'falling2', 'falling3'] as const)[Math.floor(Math.random() * 3)],
  }));
}
