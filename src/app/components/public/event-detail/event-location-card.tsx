import React from 'react';
import { MapPin } from 'lucide-react';
import type { EventData } from '../../../data/events';
import { googleMapsEmbedUrl, googleMapsSearchUrl } from '../../../utils/map-embed';

interface EventLocationCardProps {
  event: EventData;
}

export function EventLocationCard({ event }: EventLocationCardProps) {
  const embedSrc = googleMapsEmbedUrl(event.location, event.locationMapUrl);
  const mapsHref = googleMapsSearchUrl(event.location);

  return (
    <div className="event-detail-panel overflow-hidden">
      <div className="event-detail-panel-head px-5 pt-5 pb-3">
        <MapPin className="event-detail-panel-icon" aria-hidden />
        <h2 className="event-detail-panel-heading text-base">Lokacija dogodka</h2>
      </div>
      <p className="event-detail-panel-muted px-5 pb-3 text-sm">{event.location}</p>
      <div className="h-56 w-full">
        <iframe
          src={embedSrc}
          title={`Zemljevid: ${event.location}`}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="px-5 py-3">
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="event-detail-panel-link text-sm"
        >
          Odpri v Google Zemljevidih →
        </a>
      </div>
    </div>
  );
}
