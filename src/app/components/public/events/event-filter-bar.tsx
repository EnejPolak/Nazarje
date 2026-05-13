import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { categoryColorHex } from '../../../data/events';
import type { EventSortOption } from '../../../hooks/use-event-listing';
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
  showImportantOnly = false,
  onImportantToggle,
  colorCategories = false,
}: EventFilterBarProps) {
  return (
    <div className="event-listing-filter">
      <div className="event-listing-filter__inner">
        <div className="event-listing-filter__search">
          <Search className="event-listing-filter__search-icon" />
          <input
            type="text"
            placeholder="Iščite po naslovu, lokaciji…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="event-listing-filter__input"
          />
        </div>

        <div className="event-listing-filter__categories">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const color = categoryColorHex(category);

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(isActive ? null : category)}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${
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
              onClick={onImportantToggle}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                showImportantOnly
                  ? 'bg-[#9B3A32] text-white border-[#9B3A32]'
                  : 'bg-[#FDF0EE] text-[#9B3A32] border-[#9B3A32]'
              }`}
            >
              ⚠ Nujni
            </button>
          )}
        </div>

        <div className="event-listing-filter__actions">
          <SlidersHorizontal className="w-4 h-4 text-[#18201B]/30" />
          <select
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
            <button
              onClick={onClearFilters}
              className="event-listing-filter__clear"
            >
              <X className="w-3.5 h-3.5" />
              Počisti
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
