import { Calendar, Clock, MapPin, Paperclip, ChevronRight, ImageIcon, AlertTriangle } from 'lucide-react';
import { categoryBadgeBgClass } from '../data/events';

interface EventCardPreviewProps {
  title: string;
  date: Date | null;
  dateEnd: Date | null;
  time: string;
  timeEnd?: string;
  description: string;
  category: string;
  secondaryFilter?: string;
  isImportant: boolean;
  imageUrl?: string;
  location: string;
  hasAttachment: boolean;
}

function formatDateRange(date: Date | null, dateEnd: Date | null) {
  if (!date) return '—';
  const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  if (!dateEnd) return date.toLocaleDateString('sl-SI', opt);
  const sameMonth = date.getMonth() === dateEnd.getMonth() && date.getFullYear() === dateEnd.getFullYear();
  if (sameMonth) {
    return `${date.getDate()}.–${dateEnd.getDate()}. ${date.toLocaleDateString('sl-SI', { month: 'long', year: 'numeric' })}`;
  }
  return `${date.toLocaleDateString('sl-SI', opt)} – ${dateEnd.toLocaleDateString('sl-SI', opt)}`;
}

export function EventCardPreview(props: EventCardPreviewProps) {
  const {
    title,
    date,
    dateEnd,
    time,
    timeEnd,
    description,
    category,
    secondaryFilter,
    isImportant,
    imageUrl,
    location,
    hasAttachment,
  } = props;

  const timeText = timeEnd?.trim() ? `${time} – ${timeEnd}` : time;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#1E3A2F]/10 overflow-hidden">
      {imageUrl ? (
        <div className="w-full h-40 overflow-hidden bg-[#EAF1EA]">
          <img src={imageUrl} alt={title || 'Predogled'} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-[#EAF1EA] to-[#F7F4EE] text-[#18201B]/35">
          <div className="flex flex-col items-center gap-1 text-xs">
            <ImageIcon className="size-6" />
            <span>Brez slike</span>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg text-[#18201B] flex-1 min-w-0 pr-1 font-medium">
            {title || 'Naslov dogodka'}
          </h3>
          <div className="flex flex-wrap justify-end gap-1.5 shrink-0 max-w-[55%]">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] text-white whitespace-nowrap ${categoryBadgeBgClass(category)}`}
            >
              {category}
            </span>
            {isImportant && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] text-white whitespace-nowrap inline-flex items-center gap-1 ${
                  secondaryFilter ? categoryBadgeBgClass(secondaryFilter) : 'bg-[#9B3A32]'
                }`}
              >
                {!secondaryFilter && <AlertTriangle className="size-3" />}
                {secondaryFilter || 'Nujno'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-[13px] text-[#18201B]/70">
            <Calendar className="w-3.5 h-3.5 text-[#3D6F7A]" />
            <span>{formatDateRange(date, dateEnd)}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#18201B]/70">
            <Clock className="w-3.5 h-3.5 text-[#3D6F7A]" />
            <span>{timeText || '—'}</span>
          </div>
          {location.trim() && (
            <div className="flex items-center gap-2 text-[13px] text-[#18201B]/70">
              <MapPin className="w-3.5 h-3.5 text-[#3D6F7A]" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-[#18201B]/80 mb-4 leading-relaxed line-clamp-3">
          {description || 'Kratek opis bo prikazan tukaj. Vnesi ga v obrazcu na levi strani.'}
        </p>

        {hasAttachment && (
          <div className="flex items-center gap-1.5 mb-3 text-[11px] text-[#3D6F7A]">
            <Paperclip className="w-3 h-3" />
            <span>1 priponka</span>
          </div>
        )}

        <button
          type="button"
          disabled
          className="w-full bg-[#2F5D46] text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm opacity-80"
        >
          Preberi več
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
