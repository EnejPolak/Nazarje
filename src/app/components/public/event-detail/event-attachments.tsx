import React from 'react';
import { Download, FileText } from 'lucide-react';
import type { EventData } from '../../../data/events';

interface EventAttachmentsProps {
  attachments: EventData['attachments'];
}

export function EventAttachments({ attachments }: EventAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-2xl border border-[#1E3A2F]/8 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-5 h-5 text-[#2F5D46]" />
        <h2 className="text-lg text-[#18201B]">Priponke</h2>
        <span className="ml-auto text-xs text-[#18201B]/35 bg-[#F7F4EE] px-2 py-0.5 rounded-full">
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
              className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F4EE] hover:bg-[#EAF1EA] border border-[#1E3A2F]/8 hover:border-[#2F5D46]/25 transition-all group"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isPdf
                    ? 'bg-red-50 border border-red-100'
                    : 'bg-white border border-[#1E3A2F]/8'
                }`}
              >
                {isPdf ? (
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM9.3 15.4c-.2.3-.5.5-.9.6-.2.1-.4.1-.7.1H7v1.9H6v-5h1.8c.3 0 .5 0 .7.1.2.1.4.2.6.3.2.1.3.3.4.5.1.2.1.4.1.6 0 .3-.1.6-.3.9zm3.1 1.9c-.2.3-.4.5-.7.7-.3.2-.7.2-1.1.2H9.3v-5h1.3c.4 0 .8.1 1.1.2.3.2.6.4.7.7.2.3.3.6.3 1 .1.5 0 .9-.3 1.2zm3.5-3.5h-2v1.2h1.8v.8h-1.8V17h-1v-5h3v.8z" />
                  </svg>
                ) : (
                  <FileText className="w-5 h-5 text-[#2F5D46]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#18201B] group-hover:text-[#2F5D46] transition-colors truncate">
                  {attachment.name}
                </p>
                {isPdf && <p className="text-xs text-[#18201B]/40 mt-0.5">PDF dokument</p>}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#18201B]/35 group-hover:text-[#2F5D46] transition-colors shrink-0">
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
