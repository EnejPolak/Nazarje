import { Link, useLocation, useParams } from 'react-router';
import { ExternalLink, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminFetchEvent } from '../api/admin';
import { ApiError } from '../api/client';
import type { EventData } from '../data/events';
import { EventsError, EventsLoading } from '../components/public/events/events-loading';
import { getLastListPath, type CrmBackState } from './crm-nav';

function formatDate(d: Date) {
  return d.toLocaleDateString('sl-SI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function CrmEventDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const backState = location.state as CrmBackState | null;
  const backPath = backState?.from ?? getLastListPath();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      setEvent(await adminFetchEvent(id));
    } catch (e) {
      setEvent(null);
      setError(
        e instanceof ApiError ? e.message : 'Dogodek ni bil najden.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!id) {
    return (
      <div className="rounded-xl bg-white border border-[#18201B]/10 p-8 text-center">
        <p className="text-[#18201B] mb-4">Neveljaven ID.</p>
        <Link to={backPath} className="crm-back-link">
          ← Nazaj
        </Link>
      </div>
    );
  }

  if (loading) {
    return <EventsLoading label="Nalagam dogodek…" />;
  }

  if (error || !event) {
    return (
      <div className="space-y-4">
        <EventsError message={error ?? 'Dogodek ni bil najden.'} onRetry={load} />
        <Link to={backPath} className="crm-back-link">
          ← Nazaj
        </Link>
      </div>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: 'Naslov', value: event.title },
    { label: 'Objavljeno', value: event.published === false ? 'Ne (osnutek)' : 'Da' },
    ...(event.slug ? [{ label: 'Slug', value: event.slug }] : []),
    { label: 'Datum', value: formatDate(event.date) },
    ...(event.dateEnd ? [{ label: 'Datum konca', value: formatDate(event.dateEnd) }] : []),
    { label: 'Čas', value: event.timeEnd ? `${event.time} – ${event.timeEnd}` : event.time },
    { label: 'Glavni filter (kategorija)', value: event.category },
    {
      label: 'Nujen dogodek',
      value: event.isImportant
        ? event.secondaryFilter
          ? `Da + drugi filter: ${event.secondaryFilter}`
          : 'Da (samo Nujno)'
        : 'Ne',
    },
    { label: 'Kratek opis', value: event.description },
    { label: 'Dolgi opis', value: event.longDescription },
    { label: 'Lokacija', value: event.location },
    { label: 'Zemljevid (URL)', value: event.locationMapUrl },
    ...(event.imageUrl ? [{ label: 'Slika (URL)', value: event.imageUrl }] : []),
  ];

  const attachments = event.attachments ?? [];

  return (
    <div className="crm-page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link to={backPath} state={backState ?? undefined} className="crm-back-link">
          ← Nazaj
        </Link>
        <div className="flex gap-2">
          <Link
            to={`/event/${event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#18201B]/15 bg-white px-3 py-2 text-sm text-[#18201B] hover:bg-[#F7F4EE]"
          >
            <ExternalLink className="size-4" />
            Javna stran
          </Link>
          <Link
            to={`/admin/dashboard/uredi/${event.id}`}
            state={{ from: backPath }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F5D46] px-3 py-2 text-sm text-white hover:bg-[#1E3A2F]"
          >
            <Pencil className="size-4" />
            Uredi
          </Link>
        </div>
      </div>

      <h1 className="crm-page__title mb-6">{event.title}</h1>

      <dl className="rounded-2xl border border-[#18201B]/10 bg-white divide-y divide-[#18201B]/8">
        {rows.map((row) => (
          <div key={row.label} className="px-5 py-4 sm:grid sm:grid-cols-[180px_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-[#18201B]/55 mb-1 sm:mb-0">{row.label}</dt>
            <dd className="text-sm text-[#18201B] whitespace-pre-wrap break-words">{row.value}</dd>
          </div>
        ))}
        {attachments.length > 0 && (
          <div className="px-5 py-4">
            <dt className="text-sm font-medium text-[#18201B]/55 mb-2">Priloge</dt>
            <dd className="space-y-1">
              {attachments.map((a) => (
                <a
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-[#2F5D46] hover:underline"
                >
                  {a.name}
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
