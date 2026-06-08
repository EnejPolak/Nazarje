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
    <div className="event-detail-panel p-5 bg-white border border-[#1E3A2F]/8 shadow-sm">
      <h2 className="text-sm font-medium text-[#18201B] mb-4">Organizator</h2>
      <dl className="space-y-3">
        {organizerName && (
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-[#2F5D46] mt-0.5 shrink-0" aria-hidden />
            <div>
              <dt className="text-xs text-[#18201B]/50 uppercase tracking-wider">Ime</dt>
              <dd className="text-[#18201B]">{organizerName}</dd>
            </div>
          </div>
        )}
        {organizerEmail && (
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#2F5D46] mt-0.5 shrink-0" aria-hidden />
            <div>
              <dt className="text-xs text-[#18201B]/50 uppercase tracking-wider">E-pošta</dt>
              <dd>
                <a
                  href={`mailto:${organizerEmail}`}
                  className="text-[#2F5D46] hover:underline break-all"
                >
                  {organizerEmail}
                </a>
              </dd>
            </div>
          </div>
        )}
        {organizerPhone && (
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#2F5D46] mt-0.5 shrink-0" aria-hidden />
            <div>
              <dt className="text-xs text-[#18201B]/50 uppercase tracking-wider">Telefon</dt>
              <dd>
                <a href={`tel:${organizerPhone.replace(/\s/g, '')}`} className="text-[#2F5D46] hover:underline">
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
