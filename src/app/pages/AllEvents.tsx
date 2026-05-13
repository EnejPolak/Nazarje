import React from 'react';
import { useNavigate } from 'react-router';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useMergedEvents } from '../data/event-store';
import { EventCard } from '../components/public/events/event-card';
import { EventFilterBar, EventSortOptionItem } from '../components/public/events/event-filter-bar';
import { EventResultsGrid } from '../components/public/events/event-results-grid';
import { Footer } from '../components/public/layout/footer';
import { Header } from '../components/public/layout/header';
import { useEventListing } from '../hooks/use-event-listing';

const sortOptions: EventSortOptionItem[] = [
  { value: 'date-asc',  label: 'Datum ↑' },
  { value: 'date-desc', label: 'Datum ↓' },
  { value: 'alpha',     label: 'A → Ž' },
];

export function AllEvents() {
  const navigate = useNavigate();
  const mergedEvents = useMergedEvents();
  const {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
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
      <Header />

      {/* Page hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="bg-[#1E3A2F] pt-24 pb-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl text-white mb-1">Vsi dogodki</h2>
          <p className="text-white/45 text-sm">
            {upcomingEvents.length} {upcomingEvents.length === 1 ? 'prihajajoči dogodek' : 'prihajajočih dogodkov'} · filtrirajte po kategoriji ali iščite po naslovu
          </p>
        </div>
      </motion.div>

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
            onClick={() => navigate(`/event/${event.id}`)}
          />
        )}
      />

      <Footer />
    </div>
  );
}