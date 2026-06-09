import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { categoryColorHex } from '../../../data/events';
import type { EventSortOption } from '../../../hooks/use-event-listing';
import { useScrollHideOnDown } from '../../../hooks/use-scroll-hide-on-down';
import { useIsMobile } from '../../ui/use-mobile';
import '../../../styles/components/event-listing.css';

export interface EventSortOptionItem {
  value: EventSortOption;
  label: string;
}

interface EventFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: EventSortOption;
  onSortChange: (value: EventSortOption) => void;
  sortOptions: EventSortOptionItem[];
  hasFilters: boolean;
  onClearFilters: () => void;
  monthFilter?: string | null;
  onMonthFilterChange?: (value: string | null) => void;
  showImportantOnly?: boolean;
  onImportantToggle?: () => void;
  colorCategories?: boolean;
}

export function EventFilterBar({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOptions,
  hasFilters,
  onClearFilters,
  monthFilter = null,
  onMonthFilterChange,
  showImportantOnly = false,
  onImportantToggle,
  colorCategories = false,
}: EventFilterBarProps) {
  const searchId = 'event-listing-search';
  const sortId = 'event-listing-sort';
  const isMobile = useIsMobile();
  const filterHidden = useScrollHideOnDown(isMobile);

  return (
    <div
      className={`event-listing-filter${filterHidden ? ' event-listing-filter--hidden' : ''}`}
      role="search"
      aria-label="Iskanje in filtri dogodkov"
      aria-hidden={filterHidden}
    >
      <div className="event-listing-filter__inner">
        <div className="event-listing-filter__search">
          <Search className="event-listing-filter__search-icon" aria-hidden />
          <label htmlFor={searchId} className="sr-only">
            Išči dogodke po naslovu ali lokaciji
          </label>
          <input
            id={searchId}
            type="search"
            placeholder="Iščite po naslovu, lokaciji…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="event-listing-filter__input"
            autoComplete="off"
          />
        </div>

        <fieldset className="event-listing-filter__categories border-0 m-0 p-0 min-w-0">
          <legend className="sr-only">Filtri po kategoriji</legend>
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const color = categoryColorHex(category);

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(isActive ? null : category)}
                aria-pressed={isActive}
                className={`event-filter-btn px-3 py-1 rounded-full text-xs border transition-all ${
                  colorCategories
                    ? ''
                    : isActive
                    ? 'bg-[#2F5D46] text-white border-[#2F5D46]'
                    : 'bg-[#F7F4EE] text-[#18201B]/60 border-[#1E3A2F]/15 hover:border-[#2F5D46]/40'
                }`}
                style={
                  colorCategories
                    ? {
                        backgroundColor: isActive ? color : '#F7F4EE',
                        color: isActive ? '#fff' : color,
                        borderColor: color,
                      }
                    : undefined
                }
              >
                {category}
              </button>
            );
          })}

          {onImportantToggle && (
            <button
              type="button"
              onClick={onImportantToggle}
              aria-pressed={showImportantOnly}
              className={`event-filter-btn px-3 py-1 rounded-full text-xs border transition-all ${
                showImportantOnly
                  ? 'bg-[#9B3A32] text-white border-[#9B3A32]'
                  : 'bg-[#FDF0EE] text-[#9B3A32] border-[#9B3A32]'
              }`}
            >
              <span aria-hidden>⚠ </span>
              Nujni
            </button>
          )}
        </fieldset>

        <div className="event-listing-filter__actions">
          {onMonthFilterChange && (
            <label className="event-listing-filter__month" htmlFor="event-listing-month">
              <span className="event-listing-filter__month-text">Mesec</span>
              <input
                id="event-listing-month"
                type="month"
                value={monthFilter ?? ''}
                onChange={(e) => onMonthFilterChange(e.target.value || null)}
                className="event-listing-filter__month-input"
              />
            </label>
          )}
          <SlidersHorizontal className="w-4 h-4 text-[#18201B]/30" aria-hidden />
          <label htmlFor={sortId} className="sr-only">
            Razvrsti dogodke
          </label>
          <select
            id={sortId}
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as EventSortOption)}
            className="event-listing-filter__select"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button type="button" onClick={onClearFilters} className="event-listing-filter__clear">
              <X className="w-3.5 h-3.5" aria-hidden />
              Počisti filtre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
