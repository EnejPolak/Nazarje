import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { EventData } from '../../../data/events';
import { categoryColorHex } from '../../../data/events';

interface EventDetailHeroProps {
  event: EventData;
  onBack: () => void;
}

export function EventDetailHero({ event, onBack }: EventDetailHeroProps) {
  return (
    <div className="relative h-72 md:h-96 mt-16 overflow-hidden">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/80 via-[#1E3A2F]/30 to-transparent" />

      <button
        onClick={onBack}
        className="absolute top-5 left-5 flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Nazaj</span>
      </button>

      <div className="absolute bottom-5 left-5 md:left-8 flex flex-wrap gap-2">
        <span
          className="px-3 py-1 rounded-full text-sm text-white"
          style={{ backgroundColor: categoryColorHex(event.category) }}
        >
          {event.category}
        </span>
        {event.isImportant && (
          <span
            className="px-3 py-1 rounded-full text-sm text-white"
            style={{
              backgroundColor: event.secondaryFilter
                ? categoryColorHex(event.secondaryFilter)
                : '#9B3A32',
            }}
          >
            {event.secondaryFilter || 'Nujno'}
          </span>
        )}
      </div>
    </div>
  );
}
