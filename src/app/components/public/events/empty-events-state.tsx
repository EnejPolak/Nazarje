import React from 'react';
import { motion } from 'motion/react';

interface EmptyEventsStateProps {
  icon: React.ReactNode;
  message: string;
  onClearFilters: () => void;
}

export function EmptyEventsState({ icon, message, onClearFilters }: EmptyEventsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="event-listing-empty"
    >
      <div className="event-listing-empty__icon">
        {icon}
      </div>
      <p className="text-[#18201B]/50 mb-1">{message}</p>
      <button
        onClick={onClearFilters}
        className="mt-3 text-sm text-[#3D6F7A] hover:underline"
      >
        Počisti filtre
      </button>
    </motion.div>
  );
}
