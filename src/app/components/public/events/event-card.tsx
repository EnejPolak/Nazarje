import type { KeyboardEvent } from 'react';
import { Calendar, Clock, ChevronRight, Paperclip } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { categoryBadgeBgClass } from '../../../data/events';
import { formatCompactSlovenianDateRange } from '../../../utils/event-date';
import '../../../styles/components/event-card.css';

export interface Event {
  id: string;
  title: string;
  date: Date;
  dateEnd?: Date;
  time: string;
  description: string;
  category: string;
  secondaryFilter?: string;
  isImportant?: boolean;
  imageUrl?: string;
  attachments?: { name: string; url: string }[];
}

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  grayscale?: boolean;
  index?: number;
  /** Besedilo gumba (privzeto: Preberi več) */
  ctaLabel?: string;
  /** CRM: prikaži badge Objavljeno / Osnutek */
  showPublishStatus?: boolean;
  published?: boolean;
}

function truncateWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return `${words.slice(0, maxWords).join(' ')}...`;
}

export function EventCard({
  event,
  onClick,
  grayscale,
  index = 0,
  ctaLabel = 'Preberi več',
  showPublishStatus = false,
  published = true,
}: EventCardProps) {
  const dateLabel = formatCompactSlovenianDateRange(event.date, event.dateEnd);
  const cardLabel = `${event.title}. ${dateLabel}, ${event.time}. Kategorija: ${event.category}. ${ctaLabel}.`;

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="event-card group"
      role="button"
      tabIndex={0}
      aria-label={cardLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {event.imageUrl && (
        <div
          className="event-card__image-wrap"
          style={{ ['--card-image' as string]: `url("${event.imageUrl}")` }}
        >
          <div className="event-card__image-motion">
            <ImageWithFallback
              src={event.imageUrl}
              alt=""
              aria-hidden
              className={`event-card__image ${grayscale ? 'grayscale group-hover:grayscale-0' : ''}`}
            />
          </div>
        </div>
      )}
      <div className="event-card__body">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {showPublishStatus && (
            <span
              className={`event-card__badge ${
                published === false
                  ? 'bg-[#18201B]/10 text-[#18201B]/70'
                  : 'bg-[#EAF1EA] text-[#2F5D46]'
              }`}
            >
              {published === false ? 'Osnutek' : 'Objavljeno'}
            </span>
          )}
          <span
            className={`event-card__badge ${categoryBadgeBgClass(event.category)}`}
          >
            {event.category}
          </span>
        </div>

        <h3 className="event-card__title">{event.title}</h3>

        <ul className="event-card__meta" aria-label="Podatki o terminu">
          <li className="event-card__meta-item">
            <Calendar aria-hidden />
            <span>
              <span className="sr-only">Datum: </span>
              {dateLabel}
            </span>
          </li>
          <li className="event-card__meta-item">
            <Clock aria-hidden />
            <span>
              <span className="sr-only">Ura: </span>
              {event.time}
            </span>
          </li>
        </ul>

        <p className="event-card__description">{truncateWords(event.description, 5)}</p>

        {event.attachments && event.attachments.length > 0 && (
          <div className="event-card__attachments">
            <Paperclip aria-hidden />
            <span>
              {event.attachments.length}{' '}
              {event.attachments.length === 1 ? 'priponka' : 'priponki'}
            </span>
          </div>
        )}

        <span className="event-card__button" aria-hidden>
          {ctaLabel}
          <ChevronRight className="event-card__button-icon" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}
