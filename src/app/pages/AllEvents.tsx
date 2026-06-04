import React from 'react';
import { useNavigate } from 'react-router';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { usePublishedEvents } from '../hooks/use-published-events';
import { EventsError, EventsLoading } from '../components/public/events/events-loading';
import { EventCard } from '../components/public/events/event-card';
import { EventFilterBar, EventSortOptionItem } from '../components/public/events/event-filter-bar';
import { EventResultsGrid } from '../components/public/events/event-results-grid';
import { Footer } from '../components/public/layout/footer';
import { Header } from '../components/public/layout/header';
import { SkipLink } from '../components/public/layout/skip-link';
import { useEventListing } from '../hooks/use-event-listing';
import { usePageMeta, PAGE_META_DEFAULTS } from '../hooks/use-page-meta';
import { eventDetailPath } from '../utils/event-path';

const sortOptions: EventSortOptionItem[] = [
  { value: 'date-asc',  label: 'Datum ↑' },
  { value: 'date-desc', label: 'Datum ↓' },
  { value: 'alpha',     label: 'A → Ž' },
];

export function AllEvents() {
  usePageMeta(PAGE_META_DEFAULTS.allEvents);
  const navigate = useNavigate();
  const { events: mergedEvents, loading, error, refetch } = usePublishedEvents();
  const {
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
    baseEvents: upcomingEvents,
    categories,
    filteredEvents,
    hasFilters,
    clearFilters,
  } = useEventListing({
    events: mergedEvents,
    mode: 'upcoming',
    initialSort: 'date-asc',
    includeImportantFilter: true,
  });

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col">
      <SkipLink />
      <Header />

      <main id="main-content" className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className="bg-[#1E3A2F] pt-24 pb-10"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-3xl text-white mb-1">Vsi dogodki</h1>
            <p className="text-white/45 text-sm">
              {upcomingEvents.length}{' '}
              {upcomingEvents.length === 1 ? 'prihajajoči dogodek' : 'prihajajočih dogodkov'} ·
              filtrirajte po kategoriji, mesecu ali iščite po naslovu
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
              monthFilter={monthFilter}
              onMonthFilterChange={setMonthFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={sortOptions}
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
              showImportantOnly={showImportantOnly}
              onImportantToggle={() => setShowImportantOnly((value) => !value)}
              colorCategories
            />

            <EventResultsGrid
              events={filteredEvents}
              activeCategory={activeCategory}
              emptyIcon={<Calendar className="w-7 h-7 text-[#2F5D46]/40" />}
              emptyMessage="Ni dogodkov za iskane kriterije"
              onClearFilters={clearFilters}
              renderEvent={(event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onClick={() => navigate(eventDetailPath(event))}
                />
              )}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
