import React from 'react';

interface EventDescriptionProps {
  description: string;
}

export function EventDescription({ description }: EventDescriptionProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#1E3A2F]/8 shadow-sm p-6 md:p-8">
      <h2 className="text-lg text-[#18201B] mb-4">O dogodku</h2>
      <div className="text-[#18201B]/80 leading-relaxed space-y-3">
        {description.split('\n').map((line, index) => (
          <p key={index} className={line.startsWith('•') ? 'pl-4' : ''}>
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  );
}
