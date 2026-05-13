import { Link, useParams } from 'react-router';
import { ExternalLink, Pencil } from 'lucide-react';
import { useCrmEventsList } from '../data/event-store';

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
  const list = useCrmEventsList();
  const event = id ? list.find((e) => e.id === id) : undefined;

  if (!id || !event) {
    return (
      <div className="rounded-xl bg-white border border-[#18201B]/10 p-8 text-center">
        <p className="text-[#18201B] mb-4">Dogodek ni bil najden.</p>
        <Link to="/admin/crm" className="text-[#2F5D46] hover:underline">
          Nazaj na seznam
        </Link>
      </div>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: 'Naslov', value: event.title },
    { label: 'Datum', value: formatDate(event.date) },
    ...(event.dateEnd ? [{ label: 'Datum konca', value: formatDate(event.dateEnd) }] : []),
    { label: 'Čas', value: event.timeEnd ? `${event.time} – ${event.timeEnd}` : event.time },
    { label: 'Glavni filter (kategorija)', value: event.category },
    {
      label: 'Nujen dogodek',
      value: event.isImportant ? (event.secondaryFilter ? `Da + drugi filter: ${event.secondaryFilter}` : 'Da (samo Nujno)') : 'Ne',
    },
    { label: 'Kratek opis', value: event.description },
    { label: 'Dolgi opis', value: event.longDescription },
    { label: 'Lokacija', value: event.location },
    { label: 'Zemljevid (URL)', value: event.locationMapUrl },
    ...(event.imageUrl ? [{ label: 'Slika (URL)', value: event.imageUrl }] : []),
  ];

  const attachments = event.attachments ?? [];

  return (
    <div>
      <Link to="/admin/crm" className="text-sm text-[#2F5D46] hover:underline">
        ← Seznam
      </Link>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#18201B]">{event.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/crm/uredi/${event.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#18201B]/15 bg-white px-3 py-2 text-sm text-[#18201B] hover:bg-[#F7F4EE]"
          >
            <Pencil className="size-4" />
            Uredi
          </Link>
          <a
            href={`/event/${event.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F5D46] px-3 py-2 text-sm text-white hover:bg-[#1E3A2F]"
          >
            <ExternalLink className="size-4" />
            Javna stran
          </a>
        </div>
      </div>

      <p className="text-sm text-[#18201B]/55 mt-2 mb-6">
        Spodaj so vsa polja, ki jih stran uporabi za prikaz dogodka.
      </p>

      <dl className="rounded-xl border border-[#18201B]/10 bg-white divide-y divide-[#18201B]/8">
        {rows.map((row) => (
          <div key={row.label} className="px-4 py-3 sm:grid sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-[#18201B]/55">{row.label}</dt>
            <dd className="text-sm text-[#18201B] mt-1 sm:mt-0 whitespace-pre-wrap">{row.value}</dd>
          </div>
        ))}
        <div className="px-4 py-3 sm:grid sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:gap-4">
          <div className="text-sm font-medium text-[#18201B]/55">Priloge</div>
          <div className="text-sm text-[#18201B] mt-1 sm:mt-0">
            {attachments.length === 0 ? (
              '—'
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {attachments.map((a) => (
                  <li key={a.url + a.name}>
                    <span className="font-medium">{a.name}</span>
                    {' · '}
                    <span className="break-all text-[#2F5D46]">{a.url}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </dl>
    </div>
  );
}
