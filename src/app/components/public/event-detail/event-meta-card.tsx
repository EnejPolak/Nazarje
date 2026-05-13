import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { EventData } from '../../../data/events';
import { formatEventTimeRange, formatSlovenianDateRange } from '../../../utils/event-date';

interface EventMetaCardProps {
  event: EventData;
}

export function EventMetaCard({ event }: EventMetaCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 p-5 bg-white rounded-2xl border border-[#1E3A2F]/8 shadow-sm">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-9 h-9 rounded-xl bg-[#EAF1EA] flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-[#2F5D46]" />
        </div>
        <div>
          <p className="text-xs text-[#18201B]/50 uppercase tracking-wider mb-0.5">
            {event.dateEnd ? 'Datum (od – do)' : 'Datum'}
          </p>
          <p className="text-[#18201B]">
            {formatSlovenianDateRange(event.date, event.dateEnd)}
          </p>
        </div>
      </div>
      <div className="hidden sm:block w-px bg-[#1E3A2F]/8 self-stretch" />
      <div className="flex items-start gap-3 flex-1">
        <div className="w-9 h-9 rounded-xl bg-[#EAF1EA] flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-[#2F5D46]" />
        </div>
        <div>
          <p className="text-xs text-[#18201B]/50 uppercase tracking-wider mb-0.5">
            {event.timeEnd ? 'Čas (od – do)' : 'Čas'}
          </p>
          <p className="text-[#18201B]">{formatEventTimeRange(event.time, event.timeEnd)}</p>
        </div>
      </div>
      <div className="hidden sm:block w-px bg-[#1E3A2F]/8 self-stretch" />
      <div className="flex items-start gap-3 flex-1">
        <div className="w-9 h-9 rounded-xl bg-[#EAF1EA] flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-[#2F5D46]" />
        </div>
        <div>
          <p className="text-xs text-[#18201B]/50 uppercase tracking-wider mb-0.5">Lokacija</p>
          <p className="text-[#18201B]">{event.location}</p>
        </div>
      </div>
    </div>
  );
}
