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
}

export function EventCard({ event, onClick, grayscale, index = 0 }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="event-card-ticket bg-white rounded-lg shadow-sm border border-[#1E3A2F]/10 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {event.imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={event.imageUrl}
              alt={event.title}
              className={`w-full h-full object-cover transition-all duration-500 ${grayscale ? 'grayscale group-hover:grayscale-0' : ''}`}
            />
          </motion.div>
        </div>
      )}
      <div className="relative p-6 pt-10">
        <span
          className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-xs text-white whitespace-nowrap shadow-sm ${categoryBadgeBgClass(event.category)}`}
        >
          {event.category}
        </span>

        <div className="mb-4">
          <h3 className="text-xl text-[#18201B]">
            {event.title}
          </h3>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[#18201B]/70">
            <Calendar className="w-4 h-4 text-[#3D6F7A]" />
            <span>{formatCompactSlovenianDateRange(event.date, event.dateEnd)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#18201B]/70">
            <Clock className="w-4 h-4 text-[#3D6F7A]" />
            <span>{event.time}</span>
          </div>
        </div>

        <p className="text-[#18201B]/80 mb-6 leading-relaxed">
          {event.description}
        </p>

        {event.attachments && event.attachments.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4 text-xs text-[#3D6F7A]">
            <Paperclip className="w-3.5 h-3.5" />
            <span>{event.attachments.length} {event.attachments.length === 1 ? 'priponka' : 'priponki'}</span>
          </div>
        )}

        <button className="w-full bg-[#2F5D46] group-hover:bg-[#1E3A2F] text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
          Preberi več
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}