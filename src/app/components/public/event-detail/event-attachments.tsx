import React from 'react';
import { Download, FileText } from 'lucide-react';
import type { EventData } from '../../../data/events';

interface EventAttachmentsProps {
  attachments: EventData['attachments'];
}

export function EventAttachments({ attachments }: EventAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="event-detail-panel p-6 md:p-8">
      <div className="event-detail-panel-head mb-5">
        <FileText className="event-detail-panel-icon" aria-hidden />
        <h2 className="event-detail-panel-heading">Priponke</h2>
        <span className="ml-auto text-xs text-white/70 bg-white/15 px-2 py-0.5 rounded-full">
          {attachments.length}
        </span>
      </div>
      <div className="space-y-3">
        {attachments.map((attachment, index) => {
          const isPdf =
            attachment.name.toLowerCase().includes('pdf') || attachment.url.endsWith('.pdf');

          return (
            <a
              key={index}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="event-detail-attachment group"
            >
              <div
                className={`event-detail-attachment__icon ${
                  isPdf ? 'event-detail-attachment__icon--pdf' : 'event-detail-attachment__icon--file'
                }`}
              >
                {isPdf ? (
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM9.3 15.4c-.2.3-.5.5-.9.6-.2.1-.4.1-.7.1H7v1.9H6v-5h1.8c.3 0 .5 0 .7.1.2.1.4.2.6.3.2.1.3.3.4.5.1.2.1.4.1.6 0 .3-.1.6-.3.9zm3.1 1.9c-.2.3-.4.5-.7.7-.3.2-.7.2-1.1.2H9.3v-5h1.3c.4 0 .8.1 1.1.2.3.2.6.4.7.7.2.3.3.6.3 1 .1.5 0 .9-.3 1.2zm3.5-3.5h-2v1.2h1.8v.8h-1.8V17h-1v-5h3v.8z" />
                  </svg>
                ) : (
                  <FileText className="w-5 h-5 text-white/80" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white group-hover:text-[#c8e6d0] transition-colors truncate">
                  {attachment.name}
                </p>
                {isPdf && <p className="event-detail-panel-muted text-xs mt-0.5">PDF dokument</p>}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white/80 transition-colors shrink-0">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Prenesi</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
