import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  ImageIcon,
  MapPin,
} from 'lucide-react';
import { categoryColorHex } from '../data/events';

interface EventDetailPreviewProps {
  title: string;
  date: Date | null;
  dateEnd: Date | null;
  time: string;
  timeEnd?: string;
  longDescription: string;
  cardFilter: string;
  imageUrl?: string;
  location: string;
  attachments?: { name: string; url?: string }[];
}

function formatDateRange(date: Date | null, dateEnd: Date | null) {
  if (!date) return '—';
  const opt: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  if (!dateEnd) return date.toLocaleDateString('sl-SI', opt);
  const sameMonth =
    date.getMonth() === dateEnd.getMonth() &&
    date.getFullYear() === dateEnd.getFullYear();
  if (sameMonth) {
    return `${date.getDate()}.–${dateEnd.getDate()}. ${date.toLocaleDateString('sl-SI', {
      month: 'long',
      year: 'numeric',
    })}`;
  }
  return `${date.toLocaleDateString('sl-SI', opt)} – ${dateEnd.toLocaleDateString('sl-SI', opt)}`;
}

export function EventDetailPreview(props: EventDetailPreviewProps) {
  const {
    title,
    date,
    dateEnd,
    time,
    timeEnd,
    longDescription,
    cardFilter,
    imageUrl,
    location,
    attachments = [],
  } = props;

  const timeText = timeEnd?.trim() ? `${time} – ${timeEnd}` : time;
  const visibleAttachments = attachments.filter((a) => a.name.trim());

  return (
    <div className="bg-[#F7F4EE] rounded-xl overflow-hidden text-[#18201B] text-[13px]">
      {/* Hero */}
      <div className="relative h-36 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover object-center" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EAF1EA] to-[#F7F4EE] text-[#18201B]/30">
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="size-7" />
              <span className="text-xs">Brez slike</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/80 via-[#1E3A2F]/20 to-transparent" />

        {/* Back button mock */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/15 border border-white/20 text-white px-3 py-1.5 rounded-full text-[11px]">
          <ArrowLeft className="size-3" />
          Nazaj
        </div>

        {/* Filters */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          <span
            className="px-2.5 py-0.5 rounded-full text-[11px] text-white"
            style={{ backgroundColor: categoryColorHex(cardFilter) }}
          >
            {cardFilter}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h2 className="text-base font-semibold text-[#18201B] leading-snug">
          {title || 'Naslov dogodka'}
        </h2>

        {/* Meta row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              icon: <Calendar className="size-3.5 text-[#2F5D46]" />,
              label: dateEnd ? 'Datum (od–do)' : 'Datum',
              value: formatDateRange(date, dateEnd),
            },
            {
              icon: <Clock className="size-3.5 text-[#2F5D46]" />,
              label: timeEnd?.trim() ? 'Čas (od–do)' : 'Čas',
              value: timeText || '—',
            },
            {
              icon: <MapPin className="size-3.5 text-[#2F5D46]" />,
              label: 'Lokacija',
              value: location || '—',
            },
          ].map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-1 bg-white rounded-xl p-2 border border-[#1E3A2F]/8"
            >
              <span className="inline-flex size-5 items-center justify-center rounded-md bg-[#EAF1EA]">
                {m.icon}
              </span>
              <span className="text-[10px] text-[#18201B]/50 leading-tight">{m.label}</span>
              <span className="text-[11px] font-medium leading-tight line-clamp-2">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Long description */}
        <div className="bg-white rounded-xl border border-[#1E3A2F]/8 p-3">
          <p className="text-[11px] text-[#18201B]/50 uppercase tracking-wider mb-2">O dogodku</p>
          {longDescription ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {longDescription.split('\n').map((line, i) => (
                <p key={i} className={`text-[12px] text-[#18201B]/80 leading-snug ${line.startsWith('•') ? 'pl-3' : ''}`}>
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[#18201B]/40 italic">
              Dolgi opis bo prikazan tukaj. Vnesi ga v obrazcu.
            </p>
          )}
        </div>

        {/* Attachments */}
        {visibleAttachments.length > 0 && (
          <div className="bg-white rounded-xl border border-[#1E3A2F]/8 p-3 space-y-2">
            <p className="text-[11px] text-[#18201B]/50 uppercase tracking-wider">
              Priponke ({visibleAttachments.length})
            </p>
            <ul className="space-y-2">
              {visibleAttachments.map((a, i) => (
                <li key={`${a.name}-${i}`} className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate">{a.name}</p>
                    <p className="text-[10px] text-[#18201B]/40">PDF</p>
                  </div>
                  <Download className="size-3.5 text-[#18201B]/35 shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Map placeholder */}
        <div className="bg-white rounded-xl border border-[#1E3A2F]/8 overflow-hidden">
          <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[#2F5D46]" />
            <span className="text-[11px] text-[#18201B]">Lokacija dogodka</span>
          </div>
          <p className="px-3 pb-2 text-[11px] text-[#18201B]/55">{location || '—'}</p>
          <div className="h-20 bg-[#EAF1EA] flex items-center justify-center text-[#18201B]/30 text-[11px]">
            Zemljevid (prikazan na pravi strani)
          </div>
        </div>
      </div>
    </div>
  );
}
