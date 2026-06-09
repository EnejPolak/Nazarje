import { Link, useLocation, useNavigate } from 'react-router';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlertTriangle,
  Archive,
  Globe,
} from 'lucide-react';
import { useAdminEvents, type AdminEventsMode } from '../hooks/use-admin-events';
import { categoryBadgeBgClass } from '../data/events';
import { EventCard } from '../components/public/events/event-card';
import { EventsError, EventsLoading } from '../components/public/events/events-loading';
import type { CrmListPath } from './crm-nav';
import '../styles/components/event-listing.css';

function formatDate(d: Date) {
  return d.toLocaleDateString('sl-SI', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const PAGE_COPY: Record<
  AdminEventsMode,
  { title: string; subtitle: string; emptyTitle: string; emptyText: string }
> = {
  past: {
    title: 'Stari dogodki',
    subtitle: 'Dogodki, katerih datum je že minil.',
    emptyTitle: 'Ni starih dogodkov',
    emptyText: 'Ko bo datum dogodka pretekel, se bo prikazal tukaj.',
  },
  published: {
    title: 'Prihajajoči dogodki',
    subtitle: 'Prihajajoči dogodki vključno z osnutki.',
    emptyTitle: 'Ni prihajajočih dogodkov',
    emptyText: 'Ustvari nov dogodek v obrazcu.',
  },
};

export function CrmEventList() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mode: AdminEventsMode = pathname.includes('objavljeni') ? 'published' : 'past';
  const copy = PAGE_COPY[mode];
  const listPath = pathname as CrmListPath;
  const { events, loading, error, refetch } = useAdminEvents(mode);
  const sorted = events.slice().sort((a, b) =>
    mode === 'published'
      ? a.date.getTime() - b.date.getTime()
      : b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="crm-page">
      <header className="crm-page__header">
        <p className="crm-page__eyebrow">CRM</p>
        <h1 className="crm-page__title">{copy.title}</h1>
        <p className="crm-page__subtitle">{copy.subtitle}</p>
      </header>

      {loading ? (
        <EventsLoading label="Nalagam dogodke…" />
      ) : error ? (
        <EventsError message={error} onRetry={refetch} />
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#18201B]/20 bg-white p-12 text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#EAF1EA] text-[#2F5D46] mb-4">
            {mode === 'past' ? (
              <Archive className="size-6" />
            ) : (
              <Globe className="size-6" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-[#18201B] mb-1">{copy.emptyTitle}</h2>
          <p className="text-sm text-[#18201B]/60 max-w-sm mx-auto">{copy.emptyText}</p>
        </div>
      ) : mode === 'published' ? (
        <div className="event-listing-results__grid">
          {sorted.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              ctaLabel="Uredi"
              showPublishStatus
              published={event.published !== false}
              onClick={() =>
                navigate(`/admin/dashboard/uredi/${event.id}`, {
                  state: { from: listPath },
                })
              }
            />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sorted.map((e) => (
            <li key={e.id}>
              <Link
                to={`/admin/dashboard/dogodek/${e.id}`}
                state={{ from: listPath }}
                className="block h-full rounded-2xl border border-[#18201B]/10 bg-white p-4 hover:border-[#2F5D46]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-medium text-[#18201B] flex-1 min-w-0 pr-1">
                    {e.title}
                  </h3>
                  <div className="flex flex-wrap justify-end gap-1.5 shrink-0 max-w-[55%]">
                    {e.published === false && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#18201B]/10 text-[#18201B]/70 whitespace-nowrap">
                        Osnutek
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] text-white whitespace-nowrap ${categoryBadgeBgClass(e.category)}`}
                    >
                      {e.category}
                    </span>
                    {e.isImportant && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] text-white whitespace-nowrap inline-flex items-center gap-1 ${
                          e.secondaryFilter ? categoryBadgeBgClass(e.secondaryFilter) : 'bg-[#9B3A32]'
                        }`}
                      >
                        <AlertTriangle className="size-3" />
                        Nujno
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#18201B]/55">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5 text-[#3D6F7A]" />
                    {formatDate(e.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[#3D6F7A]" />
                    {e.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <MapPin className="size-3.5 text-[#3D6F7A] shrink-0" />
                    <span className="truncate">{e.location}</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
