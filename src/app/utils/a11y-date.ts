const MONTHS_SL = [
  'januar',
  'februar',
  'marec',
  'april',
  'maj',
  'junij',
  'julij',
  'avgust',
  'september',
  'oktober',
  'november',
  'december',
] as const;

/** Berljiv datum za bralnike zaslona (npr. "3. junij 2026"). */
export function formatAriaDate(date: Date): string {
  return `${date.getDate()}. ${MONTHS_SL[date.getMonth()]} ${date.getFullYear()}`;
}
