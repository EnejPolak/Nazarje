import React from 'react';
import { useNavigate } from 'react-router';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { usePublishedEvents } from '../hooks/use-published-events';
import { EventsError, EventsLoading } from '../components/public/events/events-loading';
import { EventCard } from '../components/public/events/event-card';
import { EventFilterBar, EventSortOptionItem } from '../components/public/events/event-filter-bar';
import { EventResultsGrid } from '../components/public/events/event-results-grid';
import { Footer } from '../components/public/layout/footer';
import { Header } from '../components/public/layout/header';
import { useEventListing } from '../hooks/use-event-listing';

const sortOptions: EventSortOptionItem[] = [
  { value: 'date-desc', label: 'Najnovejši' },
  { value: 'date-asc',  label: 'Najstarejši' },
  { value: 'alpha',     label: 'A → Ž' },
];

export function PastEvents() {
  const navigate = useNavigate();
  const { events: mergedEvents, loading, error, refetch } = usePublishedEvents();
  const {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    baseEvents: pastEvents,
    categories,
    filteredEvents,
    hasFilters,
    clearFilters,
  } = useEventListing({
    events: mergedEvents,
    mode: 'past',
    initialSort: 'date-desc',
  });

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col">
      <Header />

      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="bg-[#1E3A2F] pt-24 pb-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-1">
            <Clock className="w-4 h-4 text-white/40" />
            <span className="text-white/40 text-xs uppercase tracking-widest">Arhiv</span>
          </div>
          <h2 className="text-3xl text-white mb-1">Pretekli dogodki</h2>
          <p className="text-white/45 text-sm">
            {pastEvents.length} preteklih dogodkov · kronika dogajanja v Nazarjah
          </p>
        </div>
      </motion.div>

      {loading ? (
        <EventsLoading />
      ) : error ? (
        <div className="px-6 py-8">
          <EventsError message={error} onRetry={refetch} />
        </div>
      ) : (
        <>
      <EventFilterBar
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
      />

      <EventResultsGrid
        events={filteredEvents}
        activeCategory={activeCategory}
        emptyIcon={<Clock className="w-7 h-7 text-[#2F5D46]/30" />}
        emptyMessage="Ni preteklih dogodkov za izbrane kriterije"
        onClearFilters={clearFilters}
        renderEvent={(event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
            grayscale
            onClick={() => navigate(`/event/${event.id}`)}
          />
        )}
      />
        </>
      )}

      <Footer />
    </div>
  );
}