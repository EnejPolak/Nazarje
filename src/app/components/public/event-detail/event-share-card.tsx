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
    <div className="bg-white rounded-2xl border border-[#1E3A2F]/8 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-[#2F5D46]" />
        <h2 className="text-sm text-[#18201B]">Deli ta dogodek</h2>
      </div>
      <p className="text-xs text-[#18201B]/50 mb-4">
        Povabi prijatelje in znance na ta dogodek.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={onFacebookShare}
          className="flex items-center gap-3 w-full px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl transition-colors"
        >
          <Facebook className="w-5 h-5 shrink-0" />
          <span className="text-sm">Deli na Facebooku</span>
        </button>

        <button
          onClick={onInstagramShare}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors text-white"
          style={{
            background:
              'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        >
          <Instagram className="w-5 h-5 shrink-0" />
          <span className="text-sm">Kopiraj za Instagram</span>
        </button>

        <button
          onClick={onCopyLink}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-colors ${
            copied
              ? 'bg-[#EAF1EA] border-[#2F5D46] text-[#2F5D46]'
              : 'bg-[#F7F4EE] border-[#1E3A2F]/15 text-[#18201B] hover:bg-[#EAF1EA] hover:border-[#2F5D46]/30'
          }`}
        >
          {copied ? (
            <Check className="w-5 h-5 shrink-0 text-[#2F5D46]" />
          ) : (
            <Link className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm">{copied ? 'Kopirano!' : 'Kopiraj povezavo'}</span>
        </button>
      </div>
    </div>
  );
}
