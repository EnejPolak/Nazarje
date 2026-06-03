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
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="event-card group"
      onClick={onClick}
    >
      {event.imageUrl && (
        <div className="event-card__image-wrap">
          <div className="event-card__image-motion">
            <ImageWithFallback
              src={event.imageUrl}
              alt={event.title}
              className={`event-card__image ${grayscale ? 'grayscale group-hover:grayscale-0' : ''}`}
            />
          </div>
        </div>
      )}
      <div className="event-card__body">
        <span
          className={`event-card__badge ${categoryBadgeBgClass(event.category)}`}
        >
          {event.category}
        </span>

        <div>
          <h3 className="event-card__title">
            {event.title}
          </h3>
        </div>

        <div className="event-card__meta">
          <div className="event-card__meta-item">
            <Calendar />
            <span>{formatCompactSlovenianDateRange(event.date, event.dateEnd)}</span>
          </div>
          <div className="event-card__meta-item">
            <Clock />
            <span>{event.time}</span>
          </div>
        </div>

        <p className="event-card__description">
          {truncateWords(event.description, 5)}
        </p>

        {event.attachments && event.attachments.length > 0 && (
          <div className="event-card__attachments">
            <Paperclip />
            <span>{event.attachments.length} {event.attachments.length === 1 ? 'priponka' : 'priponki'}</span>
          </div>
        )}

        <button type="button" className="event-card__button">
          {ctaLabel}
          <ChevronRight className="event-card__button-icon" />
        </button>
      </div>
    </motion.div>
  );
}