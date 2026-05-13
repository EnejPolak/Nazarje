import React from 'react';
import type { EventData } from '../../../data/events';
import { EmptyEventsState } from './empty-events-state';
import '../../../styles/components/event-listing.css';

interface EventResultsGridProps {
  events: EventData[];
  activeCategory: string | null;
  emptyIcon: React.ReactNode;
  emptyMessage: string;
  onClearFilters: () => void;
  renderEvent: (event: EventData, index: number) => React.ReactNode;
}

function eventCountLabel(count: number) {
  if (count === 0) return 'Ni zadetkov';
  if (count === 1) return '1 dogodek';
  if (count < 5) return `${count} dogodki`;
  return `${count} dogodkov`;
}

export function EventResultsGrid({
  events,
  activeCategory,
  emptyIcon,
  emptyMessage,
  onClearFilters,
  renderEvent,
}: EventResultsGridProps) {
  return (
    <main className="event-listing-results">
      <p className="event-listing-results__count">
        {eventCountLabel(events.length)}
        {activeCategory && <span className="ml-1 text-[#3D6F7A]">· {activeCategory}</span>}
      </p>

      {events.length === 0 ? (
        <EmptyEventsState
          icon={emptyIcon}
          message={emptyMessage}
          onClearFilters={onClearFilters}
        />
      ) : (
        <div className="event-listing-results__grid">
          {events.map(renderEvent)}
        </div>
      )}
    </main>
  );
}
