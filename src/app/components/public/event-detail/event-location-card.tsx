import React from 'react';
import { MapPin } from 'lucide-react';
import type { EventData } from '../../../data/events';

interface EventLocationCardProps {
  event: EventData;
}

export function EventLocationCard({ event }: EventLocationCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#1E3A2F]/8 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#2F5D46]" />
        <h2 className="text-sm text-[#18201B]">Lokacija dogodka</h2>
      </div>
      <p className="px-5 pb-3 text-sm text-[#18201B]/60">{event.location}</p>
      <div className="h-56 w-full">
        <iframe
          src={event.locationMapUrl}
          title="Lokacija dogodka"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
      <div className="px-5 py-3">
        <a
          href="https://www.openstreetmap.org/?mlat=46.3284&mlon=14.9367&zoom=15"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#3D6F7A] hover:text-[#2F5D46] transition-colors"
        >
          Odpri v Google Zemljevidih →
        </a>
      </div>
    </div>
  );
}
