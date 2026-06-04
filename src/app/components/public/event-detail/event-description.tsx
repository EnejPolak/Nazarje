import React from 'react';

interface EventDescriptionProps {
  description: string;
}

export function EventDescription({ description }: EventDescriptionProps) {
  return (
    <div className="event-detail-panel p-6 md:p-8">
      <h2 className="event-detail-panel-heading">O dogodku</h2>
      <div className="event-detail-panel-prose space-y-3">
        {description.split('\n').map((line, index) => (
          <p key={index} className={line.startsWith('•') ? 'pl-4' : ''}>
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  );
}
