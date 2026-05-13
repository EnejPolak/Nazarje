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

export const eventsData: EventData[] = [
  {
    id: '1',
    title: 'Poletni koncert ob Savinji',
    date: new Date(2026, 3, 15),
    time: '19:00',
    timeEnd: '22:00',
    description: 'Pridružite se nam na čudovitem poletnem večeru ob reki Savinji. Nastopili bodo lokalni glasbeniki in ansambli. Vstop prost.',
    longDescription: `Vabimo vas na tradicionalni poletni koncert ob reki Savinji, kjer se bodo zbrali najboljši lokalni glasbeniki in ansambli. Večer bo poln melodij, ki segajo od narodnozabavne glasbe do sodobnih popevk.\n\nNastopili bodo:\n• Ansambel Savinjska dolina\n• Pevski zbor Nazarje\n• Mladi talenti glasbene šole\n\nVečer se začne ob 19:00, zaključek je predviden ob 22:00. Prinesite s seboj dobro voljo, piknik odejo in morda kakšen prigrizek. Ob prizorišču bo delovala tudi gostinska ponudba.\n\nVstop je prost za vse obiskovalce. Parkirišče je na voljo pri vaški šoli.`,
    category: 'Kultura',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1761926826313-a1787661b7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBjb25jZXJ0JTIwb3V0ZG9vciUyMG11c2ljfGVufDF8fHx8MTc3NTc1ODkzMHww&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Ob reki Savinji, Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: '2',
    title: 'Sejmi tradicionalnih obrti',
    date: new Date(2026, 3, 18),
    dateEnd: new Date(2026, 3, 19),
    time: '10:00',
    timeEnd: '18:00',
    description: 'Odkrijte bogate tradicionalne obrti naše doline. Razstavljavci bodo predstavili svoje izdelke in spretnosti.',
    longDescription: `Na osrednjem trgu v Nazarjah bo potekal sejem tradicionalnih obrti Savinjske doline. Pridite in odkrijte edinstvene ročno izdelane predmete, ki ohranjajo dediščino naše regije.\n\nNa sejmu boste našli:\n• Lončarstvo in keramiko\n• Pletarstvo in tkanje\n• Lesene izdelke in rezbarstvo\n• Domačo kuhinjo in pridelke\n• Čebelarstvo in med\n\nSejem je odprt od 10:00 do 18:00. Za otroke bodo pripravljene brezplačne delavnice. Ob sejmu bo potekala tudi razstava starih kmečkih orodij.\n\nVstop je prost. Priporočamo prihod v dopoldanskem času, ko je izbira največja.`,
    category: 'Sejem',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1775403908156-6ddf40db912e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNyYWZ0cyUyMG1hcmtldCUyMGZhaXJ8ZW58MXx8fHwxNzc1NzU4OTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Osrednji trg, Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
    attachments: [
      { name: 'Program sejma (PDF)', url: '#' },
      { name: 'Seznam razstavljavcev', url: '#' },
    ],
  },
  {
    id: '3',
    title: 'Kolesarski maraton Nazarje',
    date: new Date(2026, 3, 22),
    time: '08:00',
    description: 'Že 15. tradicionalni kolesarski maraton skozi okoliške hribe. Več tras za vse starosti in nivoje pripravljenosti.',
    longDescription: `Jubilejna 15. izdaja kolesarskega maratona Nazarje prihaja! Letos vas čaka razširjena trasa z novimi razglednimi točkami in rekordno nagradnim skladom.\n\nRazpoložljive trase:\n• Kratka (25 km) — primerna za začetnike in družine z otroki\n• Srednja (55 km) — za rekreativne kolesarje\n• Dolga (90 km) — za izkušene kolesarje s čim boljšo kondicijo\n\nStarti potekajo postopoma med 8:00 in 10:00. Na trasi so postavljene osvežilne postaje. Vsak udeleženec prejme medaljo in prilogo za udeleženco.\n\nPrijave so obvezne in možne na spletni strani ali v občinski pisarni do 20. aprila. Kotizacija: 10 € (kratka), 15 € (srednja), 20 € (dolga).`,
    category: 'Šport',
    isImportant: true,
    imageUrl: 'https://images.unsplash.com/photo-1650823355520-1f4515538c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwbWFyYXRob24lMjByYWNlfGVufDF8fHx8MTc3NTc1ODkzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Start: Center Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: '4',
    title: 'Gledališka predstava: Pod Krivo jelko',
    date: new Date(2026, 3, 25),
    time: '20:00',
    description: 'Lokalno gledališko društvo predstavlja klasično slovensko igro. Vstopnice na voljo na vhodu.',
    longDescription: `Gledališko društvo Nazarje vas vabi na premiero klasične slovenske igre "Pod Krivo jelko". Igra je ena najljubših del slovenskega dramskega izročila in govori o ljubezni, zvestobi in pritiskih skupnosti.\n\nV igri nastopijo:\n• Marija Kovač kot Metka\n• Janez Potočnik kot Tomaž\n• Skupaj 12 članov društva\n\nPredstava traja približno 2 uri z enim odmorom. Po predstavi bo sledilo srečanje z igralci ob kozarcu vina.\n\nVstopnice so na voljo na vhodu od 19:00 naprej (20 minut pred začetkom). Cena: 8 € odrasli, 4 € otroci in upokojenci. Priporočamo zgodnjo prihod, saj je število sedežev omejeno na 120 mest.`,
    category: 'Kultura',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2UlMjBzdGFnZXxlbnwxfHx8fDE3NzU2NTE4OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Kulturni dom Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: '5',
    title: 'Čistilna akcija okolice',
    date: new Date(2026, 3, 28),
    time: '09:00',
    description: 'Skupaj za čistejše Nazarje! Vabimo vse prostovoljce k sodelovanju pri čistilni akciji okolice.',
    longDescription: `Pridružite se nam pri letni čistilni akciji, s katero skrbimo za lepše in čistejše Nazarje. Akcija je del nacionalne kampanje "Očistimo Slovenijo".\n\nLetos bomo čistili:\n• Brežine reke Savinje\n• Gozdne poti nad Nazarjami\n• Okolica pokopališča\n• Robovi cest skozi vas\n\nVsa potrebna orodja (rokavice, vreče za smeti, grablje) bodo zagotovljena na zbirnem mestu. Poskrbite za udobno obleko in obutev, primerno za hojo po naravi.\n\nZa vse udeležence bo po akciji (predviden zaključek ob 12:00) pripravljeno skupno kosilo v gasilskem domu. Otroci so dobrodošli v spremstvu odraslih.`,
    category: 'Družabno',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1758599668338-4c55a3bd0ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjbGVhbnVwJTIwdm9sdW50ZWVyc3xlbnwxfHx8fDE3NzU2NzkzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Zbirno mesto: Park Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: '6',
    title: 'Delavnica keramike za otroke',
    date: new Date(2026, 4, 5),
    time: '14:00',
    description: 'Otroci bodo spoznali osnove keramike in izdelali lastne keramične izdelke. Primerno za starost 6-12 let.',
    longDescription: `Zabavna popoldanska delavnica, kjer bodo otroci spoznali čarobni svet keramike. Pod vodstvom izkušene keramičarke Anice Novak bodo otroci z lastnimi rokami ustvarili edinstven keramičen predmet, ki ga bodo odnesli domov.\n\nDelavnica je primerna za otroke od 6 do 12 let. Starši so dobrodošli, da ostanejo in opazujejo.\n\nProgram:\n• Uvod v keramiko (15 min)\n• Oblikovanje iz gline (60 min)\n• Poslikava in glaziranje (30 min)\n\nVsi materiali so vključeni v ceno. Otroci naj pridejo v obleki, ki se je ne bojijo umazati.\n\nPrijave so obvezne do 3. maja na občini ali po telefonu. Cena: 8 € na otroka. Število mest je omejeno na 15 otrok.`,
    category: 'Delavnica',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1753164726974-24cf03de80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBvdHRlcnklMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzU3NTg5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Osnovna šola Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: '7',
    title: 'Praznovanje dneva mladosti',
    date: new Date(2026, 4, 10),
    time: '16:00',
    description: 'Praznik mladih s športnimi aktivnostmi, glasbo in zabavo. Program za mlade in družine. Brezplačen vstop.',
    longDescription: `Vsako leto praznujemo dan mladosti z velikim prireditivijo za vse generacije. Letos pripravljamo rekordno bogat program, ki bo zadovoljil tako mlade kot starejše.\n\nProgram prireditve:\n• 16:00 — Otvoritev in pozdrav župana\n• 16:30 — Nastop mladinskega orkestra\n• 17:00 — Športne igre in tekmovanja za mlade\n• 18:00 — DJ nastop in ples\n• 19:30 — Podelitev nagrad\n• 20:00 — Skupni zaključni ples\n\nNa voljo bo stojnica z brezplačnimi pijačami in prigrizki za otroke. Za odrasle bo delovala gostinska ponudba.\n\nVstop je brezplačen za vse. Prireditev bo potekala na prostem, ob dežju v telovadnici šole.`,
    category: 'Družabno',
    isImportant: true,
    imageUrl: 'https://images.unsplash.com/photo-1774438026136-9736ec28922a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGZlc3RpdmFsJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc1NzU4OTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Športni park Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: '8',
    title: 'Fotografska razstava: Lepote Savinjske doline',
    date: new Date(2026, 4, 12),
    time: '10:00 - 20:00',
    description: 'Odprtje fotografske razstave lokalnih fotografov. Razstava bo odprta cel mesec.',
    longDescription: `Z veseljem vabimo na odprtje fotografske razstave \"Lepote Savinjske doline\", ki jo je ustvarilo pet lokalnih fotografov. Razstava obsega 48 fotografij, ki skozi različne letne čase in perspektive prikazujejo naravne in kulturne zakladi naše doline.\\n\\nSodelujoči fotografi:\\n• Aleš Kramberger — Narava in divjad\\n• Mojca Ferk — Vasice in arhitektura\\n• Rok Oblak — Reka Savinja skozi letne čase\\n• Ana Žnidar — Lokalni dogodki in ljudje\\n• Boštjan Cerar — Aerofotografija\\n\\nOdprtje razstave bo v petek, 12. maja ob 18:00 z besedo župana in kratko predstavitvijo fotografov. Razstava bo nato odprta vsak dan od 10:00 do 20:00 do konca maja.\\n\\nVstop na razstavo je prost. Fotografije so na prodaj — vse informacije dobite pri organizatorjih.`,
    category: 'Kultura',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1742497359858-8e0a442c9c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGV4aGliaXRpb24lMjBnYWxsZXJ5fGVufDF8fHx8MTc3NTc1ODkzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Kulturni dom Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: '9',
    title: 'Savinjski poletni festival 2026',
    date: new Date(2026, 4, 22),
    dateEnd: new Date(2026, 4, 26),
    time: '14:00',
    timeEnd: '23:00',
    description: 'Pet dni glasbe, kulture, plesa in gastronomije ob reki Savinji. Največji lokalni festival leta z nastopi domačih in gostujočih umetnikov.',
    longDescription: `Savinjski poletni festival 2026 je petdnevna prireditev, ki vsako leto konec maja oživí bregove reke Savinje. Letos pričakujemo rekordnih 12 nastopov, 8 kulinaričnih stojnic in bogat otroški program vsak dan od 14:00 naprej.\n\nProgram po dnevih:\n• Petek, 22. 5. — Otvoritev, županov nagovor, nastop ansambla Savinjska dolina\n• Sobota, 23. 5. — Dan folklore: plesi in glasba iz Savinjske doline\n• Nedelja, 24. 5. — Otroški dan: ustvarjalne delavnice, gledališka skupina Palček\n• Ponedeljek, 25. 5. — Kulinarični večer: tekmovanje domačih kuharjev\n• Torek, 26. 5. — Zaključni večer: veliki koncert in ognjenet\n\nVsi nastopi in program so brezplačni. Na prizorišču bo vsak dan delovala gostinska ponudba z lokalnimi specialitetami. Parkirišče je urejeno pri osnovni šoli.\n\nPodroben urnik s časi vseh nastopov in lokacijami stojnic je na voljo v priloženem PDF dokumentu.`,
    category: 'Kultura',
    isImportant: true,
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBtdXNpYyUyMGZlc3RpdmFsJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NDQ2NDUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Bregovi Savinje, Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
    attachments: [
      {
        name: 'Program festivala 2026 (PDF)',
        url: '/festival-program-2026.pdf',
      },
      {
        name: 'Karta prizorišča (PDF)',
        url: '/festival-karta-2026.pdf',
      },
    ],
  },
  // --- Pretekli dogodki ---
  {
    id: 'p1',
    title: 'Martinovanje v Nazarjah',
    date: new Date(2025, 10, 11),
    time: '17:00',
    description: 'Tradicionalno martinovanje z degustacijo mladego vina, glasbo in kulinaričnimi dobrotami na osrednjem trgu.',
    longDescription: `Martinovo je eden najpomembnejših praznov vinogradnikov in ljubiteljev vina. Na osrednjem trgu smo gostili kmetije iz Savinjske doline s svojimi letošnjimi pridelki.\\n\\nProgram večera:\\n• 17:00 — Prihod sv. Martina na belem konju\\n• 17:30 — Slovesno krštenje mošta v vino\\n• 18:00 — Degustacija vin in kulinarika\\n• 20:00 — Glasbena skupina Savinjski kvintet\\n\\nNa prizorišču so bile razstavljene steklenice novih vin iz 12 lokalnih kmetij. Obiskovalci so izbrali najljubše vino glasovanjem.`,
    category: 'Kultura',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    location: 'Osrednji trg, Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: 'p2',
    title: 'Silvestrovanje na prostem',
    date: new Date(2025, 11, 31),
    time: '21:00',
    description: 'Skupno praznovaje novega leta z ognjemetom, glasbo in toplim punčem za vse generacije.',
    longDescription: `Zaključili smo leto 2025 skupaj na trgu v Nazarjah. Prireditev je privabila čez 400 obiskovalcev vseh starosti.\\n\\nProgram silvestrovega večera:\\n• 21:00 — Odprtje prizorišča, toplota punč in kuhano vino\\n• 22:00 — Nastop DJ-a Rok Mix\\n• 23:30 — Skupno štetje do polnoči\\n• 00:00 — Ognjemet nad Savinjsko dolino\\n• 00:30 — Nadaljevanje glasbe do 2:00\\n\\nZa otroke je bila med 21:00 in 23:00 pripravljena posebna kotičeka z aktivnostmi in toplimi napitki.`,
    category: 'Družabno',
    isImportant: true,
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    location: 'Osrednji trg, Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: 'p3',
    title: 'Zimski pohod na Menino planino',
    date: new Date(2026, 0, 18),
    time: '08:00',
    description: 'Organiziran zimski pohod z vodičem do planinske koče na Menini. Primerno za vse pohodnike.',
    longDescription: `Planinska sekcija Nazarje je organizirala zimski pohod na Menino planino (1508 m). Udeležilo se je 34 pohodnikov.\\n\\nPot:\\n• Start: Parkirišče Mozirje\\n• Pot: Čez Kališče, skozi smrekov gozd\\n• Cilj: Planinska koča Menina\\n• Skupna razdalja: 12 km, višinska razlika 900 m\\n\\nV koči smo se okrepčali s toplim čajem in domačim govejim juhom. Razgled na Savinjske Alpe je bil izjemen zahvaljujoč kristalno čistemu zimskemu dnevu.`,
    category: 'Šport',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    location: 'Start: Mozirje, cilj Menina planina',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: 'p4',
    title: 'Pustni karneval in parade',
    date: new Date(2026, 1, 28),
    time: '14:00',
    description: 'Vesela pustna povorka skozi vas z maskiranci vseh starosti, glasbo in razdelitvijo krofiov.',
    longDescription: `Pustna povorka je letos zbrala čez 150 maskirancev in privabila množico gledalcev vzdolž celotne vaške ulice.\\n\\nPovorka je potekala:\\n• 14:00 — Zbor maskirancev pri gasilskem domu\\n• 14:30 — Start povorke skozi vas\\n• 15:30 — Prihod na trg, razglasitev najboljših kostumov\\n• 16:00 — Razdelitev krofiov za otroke\\n• 16:30 — Pustni ples v kulturnem domu\\n\\nNagradnih kostumov je bilo podeljenih 10, najboljši pa je bil otroški kostum zmaja, ki ga je ustvarila mama skupaj s 6-letnim sinom.`,
    category: 'Kultura',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    location: 'Vaška ulica, Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
  {
    id: 'p5',
    title: 'Velikonočni sejem in razstava',
    date: new Date(2026, 2, 28),
    time: '09:00 - 16:00',
    description: 'Velikonočni sejem z ročno izdelanimi okraski, pisanicami in domačimi slaščicami.',
    longDescription: `Pred velikonočnimi prazniki smo organizirali sejem z 22 razstavljavci iz celotne Savinjske doline.\\n\\nNa sejmu je bilo mogoče:\\n• Kupiti ročno poslikane pisanice\\n• Naročiti cvetlične aranžmaje\\n• Pokusiti domače slaščice in potico\\n• Udeležiti se delavnice pisanja pisanic\\n\\nSejem je obiskalo čez 300 krajanov. Izkupiček od vstopnin (1 € symbolično) je šel v sklad za obnovo kulturnega doma.`,
    category: 'Sejem',
    isImportant: false,
    imageUrl: 'https://images.unsplash.com/photo-1585503418537-88331351ad99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    location: 'Osrednji trg, Nazarje',
    locationMapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367',
  },
];