import type { ReactNode } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import type { EventData } from '../../../data/events';
import { categoryColorHex } from '../../../data/events';
import { formatEventTimeRange, formatSlovenianDateRange } from '../../../utils/event-date';

interface EventDetailHeroProps {
  event: EventData;
  onBack: () => void;
  children?: ReactNode;
}

export function EventDetailHero({ event, onBack, children }: EventDetailHeroProps) {
  return (
    <section className="event-detail-hero">
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className="event-detail-hero__bg" />
      ) : (
        <div className="event-detail-hero__bg event-detail-hero__bg--placeholder" aria-hidden />
      )}

      <div className="event-detail-hero__shade" aria-hidden />

      <button type="button" onClick={onBack} className="event-detail-hero__back">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        <span>Nazaj</span>
      </button>

      <div className="event-detail-hero__body">
        <div className="event-detail-hero__intro">
          <div className="event-detail-hero__badges">
            <span
              className="event-detail-hero__badge"
              style={{ backgroundColor: categoryColorHex(event.category) }}
            >
              {event.category}
            </span>
            {event.isImportant && (
              <span
                className="event-detail-hero__badge"
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

          <h1 className="event-detail-hero__title">{event.title}</h1>

          <dl className="event-detail-hero__meta">
            <div className="event-detail-hero__meta-item">
              <Calendar className="event-detail-hero__meta-icon" aria-hidden />
              <div>
                <dt className="event-detail-hero__meta-label">
                  {event.dateEnd ? 'Datum (od – do)' : 'Datum'}
                </dt>
                <dd className="event-detail-hero__meta-value">
                  {formatSlovenianDateRange(event.date, event.dateEnd)}
                </dd>
              </div>
            </div>

            <div className="event-detail-hero__meta-item">
              <Clock className="event-detail-hero__meta-icon" aria-hidden />
              <div>
                <dt className="event-detail-hero__meta-label">
                  {event.timeEnd ? 'Čas (od – do)' : 'Čas'}
                </dt>
                <dd className="event-detail-hero__meta-value">
                  {formatEventTimeRange(event.time, event.timeEnd)}
                </dd>
              </div>
            </div>

            <div className="event-detail-hero__meta-item">
              <MapPin className="event-detail-hero__meta-icon" aria-hidden />
              <div>
                <dt className="event-detail-hero__meta-label">Lokacija</dt>
                <dd className="event-detail-hero__meta-value">{event.location}</dd>
              </div>
            </div>
          </dl>
        </div>

        {children}
      </div>
    </section>
  );
}
