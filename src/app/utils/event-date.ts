const slovenianDays = ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'];

const slovenianMonths = [
  'januarja',
  'februarja',
  'marca',
  'aprila',
  'maja',
  'junija',
  'julija',
  'avgusta',
  'septembra',
  'oktobra',
  'novembra',
  'decembra',
];

export function formatSlovenianDate(date: Date) {
  return `${slovenianDays[date.getDay()]}, ${date.getDate()}. ${slovenianMonths[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatSlovenianDateRange(date: Date, dateEnd?: Date) {
  if (!dateEnd) return formatSlovenianDate(date);

  const startDay = date.getDate();
  const endDay = dateEnd.getDate();
  const startMonth = date.getMonth();
  const endMonth = dateEnd.getMonth();
  const startYear = date.getFullYear();
  const endYear = dateEnd.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay}.–${endDay}. ${slovenianMonths[startMonth]} ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startDay}. ${slovenianMonths[startMonth]} – ${endDay}. ${slovenianMonths[endMonth]} ${startYear}`;
  }

  return `${startDay}. ${slovenianMonths[startMonth]} ${startYear} – ${endDay}. ${slovenianMonths[endMonth]} ${endYear}`;
}

export function formatCompactSlovenianDateRange(date: Date, dateEnd?: Date) {
  const startDay = date.getDate();
  const startMonth = date.toLocaleDateString('sl-SI', { month: 'long' });

  if (!dateEnd) {
    return `${startDay}. ${startMonth} ${date.getFullYear()}`;
  }

  const endDay = dateEnd.getDate();
  const endMonth = dateEnd.toLocaleDateString('sl-SI', { month: 'long' });

  if (date.getMonth() === dateEnd.getMonth()) {
    return `${startDay}.–${endDay}. ${startMonth} ${date.getFullYear()}`;
  }

  return `${startDay}. ${startMonth} – ${endDay}. ${endMonth}`;
}

export function formatEventTimeRange(time: string, timeEnd?: string) {
  return timeEnd ? `${time} – ${timeEnd}` : time;
}
