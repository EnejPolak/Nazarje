import { Mail, Phone, User } from 'lucide-react';
import type { EventData } from '../../../data/events';

interface EventOrganizerCardProps {
  event: EventData;
}

export function EventOrganizerCard({ event }: EventOrganizerCardProps) {
  const { organizerName, organizerEmail, organizerPhone } = event;
  if (!organizerName && !organizerEmail && !organizerPhone) {
    return null;
  }

  return (
    <div className="event-detail-panel event-detail-organizer p-5">
      <h2 className="event-detail-panel-heading text-base">Organizator</h2>
      <dl className="event-detail-organizer__list">
        {organizerName && (
          <div className="event-detail-organizer__row">
            <User className="event-detail-organizer__icon" aria-hidden />
            <div>
              <dt className="event-detail-organizer__label">Ime</dt>
              <dd className="event-detail-organizer__value">{organizerName}</dd>
            </div>
          </div>
        )}
        {organizerEmail && (
          <div className="event-detail-organizer__row">
            <Mail className="event-detail-organizer__icon" aria-hidden />
            <div>
              <dt className="event-detail-organizer__label">E-pošta</dt>
              <dd>
                <a href={`mailto:${organizerEmail}`} className="event-detail-organizer__link break-all">
                  {organizerEmail}
                </a>
              </dd>
            </div>
          </div>
        )}
        {organizerPhone && (
          <div className="event-detail-organizer__row">
            <Phone className="event-detail-organizer__icon" aria-hidden />
            <div>
              <dt className="event-detail-organizer__label">Telefon</dt>
              <dd>
                <a
                  href={`tel:${organizerPhone.replace(/\s/g, '')}`}
                  className="event-detail-organizer__link"
                >
                  {organizerPhone}
                </a>
              </dd>
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}
