export interface EventData {
  id: string;
  title: string;
  date: Date;
  dateEnd?: Date;
  time: string;
  timeEnd?: string;
  description: string;
  longDescription: string;
  category: string;
  /** Ob nujnosti: drugi filter (npr. Šport); če manjka, na kartici samo oznaka «Nujno». */
  secondaryFilter?: string;
  isImportant?: boolean;
  imageUrl?: string;
  location: string;
  locationMapUrl: string;
  attachments?: { name: string; url: string }[];
  /** false = osnutek, skrit na javni strani */
  published?: boolean;
  slug?: string;
}

/** Barva značke filtra / kategorije (kartica, podrobnosti). */
export const CATEGORY_COLOR_HEX: Record<string, string> = {
  Kultura: '#3D6F7A',
  Sejem: '#A97A24',
  Šport: '#2F5D46',
  Izobraževanje: '#6B5EA8',
  Delavnica: '#6B5EA8',
  Družabno: '#2F5D46',
};

export function categoryColorHex(category: string): string {
  return CATEGORY_COLOR_HEX[category] ?? '#A97A24';
}

export function categoryBadgeBgClass(category: string): string {
  const map: Record<string, string> = {
    Kultura: 'bg-[#3D6F7A]',
    Sejem: 'bg-[#A97A24]',
    Šport: 'bg-[#2F5D46]',
    Izobraževanje: 'bg-[#6B5EA8]',
    Delavnica: 'bg-[#6B5EA8]',
    Družabno: 'bg-[#2F5D46]',
  };
  return map[category] ?? 'bg-[#A97A24]';
}

