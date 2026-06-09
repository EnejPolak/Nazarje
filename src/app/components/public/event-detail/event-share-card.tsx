import React from 'react';
import { Check, Facebook, Instagram, Link, Share2 } from 'lucide-react';

interface EventShareCardProps {
  copied: boolean;
  onFacebookShare: () => void;
  onInstagramShare: () => void;
  onCopyLink: () => void;
}

export function EventShareCard({
  copied,
  onFacebookShare,
  onInstagramShare,
  onCopyLink,
}: EventShareCardProps) {
  return (
    <div className="event-detail-panel p-5">
      <div className="event-detail-panel-head mb-4">
        <Share2 className="event-detail-panel-icon" aria-hidden />
        <h2 className="event-detail-panel-heading text-base">Deli ta dogodek</h2>
      </div>
      <p className="event-detail-panel-muted text-xs mb-4">
        Povabi prijatelje in znance na ta dogodek.
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onFacebookShare}
          className="event-detail-action event-detail-action--facebook"
        >
          <Facebook className="w-5 h-5 shrink-0" />
          <span>Deli na Facebooku</span>
        </button>

        <button
          type="button"
          onClick={onInstagramShare}
          className="event-detail-action event-detail-action--instagram"
        >
          <Instagram className="w-5 h-5 shrink-0" />
          <span>Kopiraj za Instagram</span>
        </button>

        <button
          type="button"
          onClick={onCopyLink}
          className={`event-detail-action event-detail-action--copy ${copied ? 'is-copied' : ''}`}
        >
          {copied ? (
            <Check className="w-5 h-5 shrink-0" />
          ) : (
            <Link className="w-5 h-5 shrink-0" />
          )}
          <span>{copied ? 'Kopirano!' : 'Kopiraj povezavo'}</span>
        </button>
      </div>
    </div>
  );
}
