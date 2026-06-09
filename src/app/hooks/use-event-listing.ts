import { useMemo, useState } from 'react';
import type { EventData } from '../data/events';

export type EventListingMode = 'upcoming' | 'past';
export type EventSortOption = 'date-asc' | 'date-desc' | 'alpha';

interface UseEventListingOptions {
  events: EventData[];
  mode: EventListingMode;
  initialSort: EventSortOption;
  includeImportantFilter?: boolean;
}

function eventMatchesMonth(event: EventData, monthFilter: string): boolean {
  const [year, month] = monthFilter.split('-').map(Number);
  if (!year || !month) return true;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  const eventStart = new Date(event.date);
  const eventEnd = event.dateEnd ? new Date(event.dateEnd) : eventStart;
  return eventStart <= end && eventEnd >= start;
}

export function useEventListing({
  events,
  mode,
  initialSort,
  includeImportantFilter = false,
}: UseEventListingOptions) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<EventSortOption>(initialSort);
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  const baseEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const date = new Date(event.date);
      date.setHours(0, 0, 0, 0);
      return mode === 'upcoming' ? date >= today : date < today;
    });
  }, [events, mode]);

  const categories = useMemo(
    () => Array.from(new Set(baseEvents.map((event) => event.category))),
    [baseEvents]
  );

  const filteredEvents = useMemo(() => {
    let list = [...baseEvents];

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    if (activeCategory) {
      list = list.filter((event) => event.category === activeCategory);
    }

    if (monthFilter) {
      list = list.filter((event) => eventMatchesMonth(event, monthFilter));
    }

    if (includeImportantFilter && showImportantOnly) {
      list = list.filter((event) => event.isImportant);
    }

    list.sort((a, b) => {
      if (sortBy === 'date-asc') return a.date.getTime() - b.date.getTime();
      if (sortBy === 'date-desc') return b.date.getTime() - a.date.getTime();
      return a.title.localeCompare(b.title, 'sl');
    });

    return list;
  }, [activeCategory, baseEvents, includeImportantFilter, monthFilter, search, showImportantOnly, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setActiveCategory(null);
    setMonthFilter(null);
    setShowImportantOnly(false);
  };

  const hasFilters = Boolean(
    search || activeCategory || monthFilter || (includeImportantFilter && showImportantOnly)
  );

  return {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    monthFilter,
    setMonthFilter,
    sortBy,
    setSortBy,
    showImportantOnly,
    setShowImportantOnly,
    baseEvents,
    categories,
    filteredEvents,
    hasFilters,
    clearFilters,
  };
}
